#!/usr/bin/env python3
"""
Optimus Prime & Voice Tour Audio Generator
=========================================
Generates studio-quality .mp3 audio clips for the Voice Guide.

Supports:
1. Microsoft Edge-TTS (100% FREE, no API key needed) with robotic / bass DSP filters.
2. ElevenLabs API (Authentic Peter Cullen / Optimus Prime clone) if ELEVENLABS_API_KEY is set.

Usage:
  python scripts/generate_optimus_audio.py
  python scripts/generate_optimus_audio.py --provider edge-tts
  python scripts/generate_optimus_audio.py --provider elevenlabs --voice-id <VOICE_ID>
"""

import os
import sys
import argparse
import asyncio
import subprocess
from pathlib import Path

# Target output directory
ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "optimus"

# Complete Optimus Prime Narration Clips
CLIPS = {
    "hero-1.mp3": "I am Optimus Prime. I send this transmission to all engineers and innovators across the galaxy.",
    "hero-2.mp3": "Behold the works of Ashwin Vignesh — an ally in the frontier of Autonomous Systems and Artificial Intelligence. Scroll forward, and witness his deployments.",
    "hero-revisit.mp3": "We stand once more at the command console. The mission continues.",
    "assistant-1.mp3": "Before you lies a neural core linked directly to Ashwin’s databanks.",
    "assistant-2.mp3": "Query this sentinel regarding his technical capabilities, or test him with your job requirements. He stands ready for deployment.",
    "assistant-revisit.mp3": "The neural sentinel remains active. Engage at your discretion.",
    "roadmap-1.mp3": "Every warrior's strength is forged over time. From mechanical hardware engineering, to enterprise automation, to a Master’s in AI Engineering in Germany.",
    "roadmap-2.mp3": "Through every transformation, one prime directive remains: building robust systems that conquer real-world complexity.",
    "roadmap-revisit.mp3": "The chronological trajectory of past victories and education.",
    "skills-1.mp3": "A formidable arsenal: Computer Vision with YOLO and OpenCV, PyTorch neural architectures, and C++ inference engines optimized for edge hardware.",
    "skills-revisit.mp3": "The weapon systems and neural tooling ready for deployment.",
    "github-1.mp3": "Discipline is proven through relentless execution. Observe his GitHub telemetry — constant optimization and code commits.",
    "github-revisit.mp3": "The live telemetry grid of repository commits.",
    "projects-1.mp3": "Behold his primary deployments: GymVision — real-time pose biomechanics; JARVIS — an autonomous voice agent; and zero-framework C++ CNN engines.",
    "projects-2.mp3": "Built not merely for simulation, but for physical impact in autonomous vehicles and robotics.",
    "projects-revisit.mp3": "The flagship project battlements.",
    "certifications-1.mp3": "Validated credentials spanning deep learning, transformer language models, and agent engineering. Proof of continuous technical evolution.",
    "certifications-revisit.mp3": "Verified technical credentials.",
    "contact-1.mp3": "The battle for tomorrow requires bold allies. Send your transmission to Ashwin. Together, you will transform what is possible.",
    "contact-2.mp3": "Autobots... roll out!",
    "contact-revisit.mp3": "The communication frequencies are open."
}


async def generate_with_edge_tts(filename: str, text: str, output_path: Path):
    """Generate audio using Edge-TTS with deep robotic tuning."""
    try:
        import edge_tts
    except ImportError:
        print("[!] Installing edge-tts...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts"])
        import edge_tts

    # Deep authoritative voice tuning
    # en-US-ChristopherNeural or en-US-GuyNeural with -25Hz pitch and -10% rate
    voice = "en-US-ChristopherNeural"
    pitch = "-25Hz"
    rate = "-10%"

    temp_raw = output_path.with_suffix(".tmp.mp3")

    communicate = edge_tts.Communicate(text, voice, pitch=pitch, rate=rate)
    await communicate.save(str(temp_raw))

    # Apply audio DSP with ffmpeg if available (low-end bass boost + metal resonance)
    has_ffmpeg = False
    try:
        res = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        has_ffmpeg = res.returncode == 0
    except Exception:
        has_ffmpeg = False

    if has_ffmpeg:
        # Audio filter: Sub-bass boost + slight high-mid presence + mild metallic flanger
        # 64k, not 192k: edge-tts hands us a 24 kHz mono 48 kbps render, so
        # anything above that re-encodes noise. 192k tripled the file size for
        # no quality gain and made the repo push time out.
        audio_filter = "bass=g=9:f=120,treble=g=3:f=3000,flanger=delay=12:depth=1.8:regen=18:width=60:speed=0.4"
        cmd = [
            "ffmpeg", "-y", "-i", str(temp_raw),
            "-af", audio_filter,
            "-codec:a", "libmp3lame", "-b:a", "64k",
            str(output_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if temp_raw.exists():
            temp_raw.unlink()
    else:
        # Move raw mp3 if ffmpeg is not present
        if output_path.exists():
            output_path.unlink()
        temp_raw.rename(output_path)


def generate_with_elevenlabs(filename: str, text: str, output_path: Path, api_key: str, voice_id: str):
    """Generate audio using ElevenLabs API (authentic Peter Cullen / Optimus clone)."""
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
            "stability": 0.72,
            "similarity_boost": 0.88,
            "style": 0.25,
            "use_speaker_boost": True
        }
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()
        with open(output_path, "wb") as f:
            f.write(audio_data)


async def main():
    parser = argparse.ArgumentParser(description="Generate Optimus Prime Voice Guide Audio Clips")
    parser.add_argument("--provider", choices=["edge-tts", "elevenlabs"], default="edge-tts",
                        help="Audio generation provider (default: edge-tts)")
    parser.add_argument("--voice-id", default=os.getenv("ELEVENLABS_VOICE_ID", "TxGEqnHWrfWFTfGW9XjX"),
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
    print(f"[*] Generating {len(CLIPS)} Optimus Prime voice clips using '{args.provider}'...\n")

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
            await generate_with_edge_tts(filename, text, target_file)

        size_kb = target_file.stat().st_size / 1024 if target_file.exists() else 0
        print(f"     -> Saved ({size_kb:.1f} KB)\n")

    print("[OK] All Optimus Prime voice clips generated successfully!")
    print(f"[OK] Files are ready in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
