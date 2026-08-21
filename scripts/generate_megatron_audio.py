#!/usr/bin/env python3
"""
Megatron Voice Tour Audio Generator
===================================
Generates studio-quality .mp3 audio clips for the Megatron Voice Guide persona
(Decepticon Command — heavy, metallic, imperious).

Supports:
1. Microsoft Edge-TTS (100% FREE, no API key needed) using a deep US neural
   voice pitched down hard (en-US-ChristopherNeural, or en-US-GuyNeural via
   --voice).
2. ElevenLabs API (authentic Frank Welker / Megatron clone) if
   ELEVENLABS_API_KEY is set.

The DSP chain is deliberately heavier than the Optimus one next door: more low
shelf (g=11, at a lower corner), a brighter presence shelf for the metal edge,
and a wider, slower flanger so the voice reads as a tyrant speaking through a
war machine rather than a commander on a comm link.

Usage:
  python scripts/generate_megatron_audio.py
  python scripts/generate_megatron_audio.py --provider edge-tts
  python scripts/generate_megatron_audio.py --provider edge-tts --voice en-US-GuyNeural
  python scripts/generate_megatron_audio.py --provider elevenlabs --voice-id <VOICE_ID>
  python scripts/generate_megatron_audio.py --only hero-1.mp3,hero-2.mp3
"""

import os
import sys
import argparse
import asyncio
import subprocess
from pathlib import Path

# Target output directory
ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "megatron"

# Edge-TTS tuning. -30Hz sits 5Hz below the Optimus render: Megatron speaks
# lower and colder, and the flanger below supplies the rest of the metal.
EDGE_VOICE = "en-US-ChristopherNeural"  # alt: en-US-GuyNeural
EDGE_PITCH = "-30Hz"
EDGE_RATE = "-10%"

# Baked at render time, exactly like the Optimus generator. See OPTIMUS_DSP in
# src/voice-guide/config.js for why nothing may stack a second chain on top of
# these files at playback time.
AUDIO_FILTER = (
    "bass=g=11:f=110,"
    "treble=g=3:f=3200,"
    "flanger=delay=14:depth=2.2:regen=22:width=70:speed=0.35"
)

# Complete Megatron Narration Clips — 21 across the 8 canonical sections.
# Facts checked against src/data/portfolioData.js, same discipline as the
# Optimus and JARVIS scripts: the menace lives in the delivery, never in an
# invented claim.
CLIPS = {
    "hero-1.mp3": "I am Megatron, leader of the Decepticons. You have entered the domain of Ashwin Vignesh.",
    "hero-2.mp3": "Do not mistake this for a courtesy. Scroll onward, and I will show you the machines he has built.",
    "hero-revisit.mp3": "You return to the beginning. Predictable.",
    "assistant-1.mp3": "Here stands a conversational intelligence, bound to his portfolio data and compelled to answer.",
    "assistant-2.mp3": "Interrogate it. Or feed it a job description, and command it to measure him against your requirements.",
    "assistant-revisit.mp3": "The interrogation channel remains open.",
    "roadmap-1.mp3": "Study his ascent. Mechanical engineering, then enterprise ERP analysis, and now a Master's in AI Engineering in Germany.",
    "roadmap-2.mp3": "Three domains conquered, one purpose behind them — systems that survive outside the laboratory.",
    "roadmap-revisit.mp3": "The record of his conquests.",
    "skills-1.mp3": "His arsenal: computer vision with YOLO and OpenCV, PyTorch architectures, and C++ inference engines forged for edge hardware.",
    "skills-revisit.mp3": "The arsenal, laid bare.",
    "github-1.mp3": "Raw evidence. Commit activity pulled live from his GitHub account, with nothing concealed.",
    "github-revisit.mp3": "The evidence stands.",
    "projects-1.mp3": "Behold his war machines. GymVision, tracking human motion in real time. A voice-controlled terminal agent. And a convolutional inference engine written in pure C++, with no frameworks at all.",
    "projects-2.mp3": "Each one opens to reveal its stack and its source. Inspect them, if you dare.",
    "projects-revisit.mp3": "The war machines await.",
    "certifications-1.mp3": "Credentials, verified: deep learning, transformer language models, and agent engineering. Every entry links to its proof. I permit no unverified boasts.",
    "certifications-revisit.mp3": "Proof, on demand.",
    "contact-1.mp3": "The tour is complete. You have seen what he commands.",
    "contact-2.mp3": "The channel below is open — his form, and his direct address. Use it, or be forgotten.",
    "contact-revisit.mp3": "The channel remains open.",
}


def _has_ffmpeg() -> bool:
    try:
        res = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return res.returncode == 0
    except Exception:
        return False


async def generate_with_edge_tts(filename: str, text: str, output_path: Path, voice: str):
    """Generate audio using Edge-TTS, then bake the Decepticon DSP chain in."""
    try:
        import edge_tts
    except ImportError:
        print("[!] Installing edge-tts...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts"])
        import edge_tts

    temp_raw = output_path.with_suffix(".tmp.mp3")

    communicate = edge_tts.Communicate(text, voice, pitch=EDGE_PITCH, rate=EDGE_RATE)
    await communicate.save(str(temp_raw))

    if _has_ffmpeg():
        cmd = [
            "ffmpeg", "-y", "-i", str(temp_raw),
            "-af", AUDIO_FILTER,
            "-codec:a", "libmp3lame", "-b:a", "64k",
            str(output_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if temp_raw.exists():
            temp_raw.unlink()
    else:
        # No ffmpeg: ship the un-processed render rather than nothing. It will
        # sound like plain low-pitched TTS, not like Megatron.
        print("     [!] ffmpeg not found — writing raw TTS without the DSP chain.")
        if output_path.exists():
            output_path.unlink()
        temp_raw.rename(output_path)


def generate_with_elevenlabs(filename: str, text: str, output_path: Path, api_key: str, voice_id: str):
    """Generate audio using ElevenLabs API (authentic Megatron clone)."""
    import urllib.request
    import json

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            # Flatter and colder than the JARVIS settings: a high style value
            # makes the clone chew the scenery, which is the wrong Megatron.
            "stability": 0.62,
            "similarity_boost": 0.88,
            "style": 0.35,
            "use_speaker_boost": True
        }
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()
        with open(output_path, "wb") as f:
            f.write(audio_data)


async def main():
    parser = argparse.ArgumentParser(description="Generate Megatron Voice Guide Audio Clips")
    parser.add_argument("--provider", choices=["edge-tts", "elevenlabs"], default="edge-tts",
                        help="Audio generation provider (default: edge-tts)")
    parser.add_argument("--voice", default=EDGE_VOICE,
                        help=f"Edge-TTS neural voice (default: {EDGE_VOICE})")
    parser.add_argument("--voice-id", default=os.getenv("ELEVENLABS_MEGATRON_VOICE_ID", "pNInz6obpgDQGcFmaJgB"),
                        help="ElevenLabs Voice ID (if using elevenlabs)")
    parser.add_argument("--api-key", default=os.getenv("ELEVENLABS_API_KEY", ""),
                        help="ElevenLabs API Key")
    parser.add_argument("--only", default="",
                        help="Comma-separated filenames to regenerate (default: all)")

    args = parser.parse_args()

    only = {n.strip() for n in args.only.split(",") if n.strip()}
    if only:
        unknown = only - set(CLIPS)
        if unknown:
            print("[!] Unknown clip(s): %s" % ", ".join(sorted(unknown)))
            sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[*] Output directory: {OUTPUT_DIR}")
    if args.provider == "edge-tts":
        print(f"[*] Voice: {args.voice} | pitch {EDGE_PITCH} | rate {EDGE_RATE}")
        print(f"[*] DSP:   {AUDIO_FILTER}")
    print(f"[*] Generating {len(CLIPS)} Megatron voice clips using '{args.provider}'...\n")

    for i, (filename, text) in enumerate(CLIPS.items(), 1):
        if only and filename not in only:
            continue
        target_file = OUTPUT_DIR / filename
        print(f"[{i}/{len(CLIPS)}] Generating {filename}...")
        print(f"     \"{text}\"")

        if args.provider == "elevenlabs":
            if not args.api_key:
                print("\n[!] Error: ELEVENLABS_API_KEY is required for elevenlabs provider.")
                print("    Set it via --api-key <KEY> or export ELEVENLABS_API_KEY=<KEY>")
                sys.exit(1)
            generate_with_elevenlabs(filename, text, target_file, args.api_key, args.voice_id)
        else:
            await generate_with_edge_tts(filename, text, target_file, args.voice)

        size_kb = target_file.stat().st_size / 1024 if target_file.exists() else 0
        print(f"     -> Saved ({size_kb:.1f} KB)\n")

    print("[OK] All Megatron voice clips generated successfully!")
    print(f"[OK] Files are ready in: {OUTPUT_DIR}")
    print("[i] estimatedMs in src/voice-guide/data/megatronScript.js is MEASURED")
    print("    from these files with ffprobe. Re-measure after regenerating.")


if __name__ == "__main__":
    asyncio.run(main())
