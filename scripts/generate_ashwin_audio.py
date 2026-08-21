#!/usr/bin/env python3
"""
Ashwin (Creator) Voice Tour Audio Generator
==========================================
Generates studio-quality .mp3 audio clips for the Ashwin Voice Guide persona
(The Creator — bold, articulate, confident, charismatic AI Engineer).

Supports:
1. Microsoft Edge-TTS (100% FREE, no API key needed) using a rich, warm neural
   voice (en-US-BrianMultilingualNeural with studio presence DSP).
2. ElevenLabs API (custom Ashwin voice clone) if ELEVENLABS_API_KEY is set.

Usage:
  python scripts/generate_ashwin_audio.py
  python scripts/generate_ashwin_audio.py --provider edge-tts
  python scripts/generate_ashwin_audio.py --provider elevenlabs --voice-id <VOICE_ID>
  python scripts/generate_ashwin_audio.py --only hero-1.mp3,hero-2.mp3
"""

import os
import sys
import argparse
import asyncio
import subprocess
from pathlib import Path

# Target output directory
ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "ashwin"

# Edge-TTS tuning: Bold, articulate, warm, and confident
EDGE_VOICE = "en-US-BrianMultilingualNeural"  # alt: en-US-AndrewMultilingualNeural
EDGE_PITCH = "-8Hz"
EDGE_RATE = "+2%"

# Professional Studio Vocal Chain:
# Low-end warmth + crisp high-mid vocal air and presence + volume normalization
AUDIO_FILTER = (
    "bass=g=6:f=130,"
    "treble=g=3.5:f=3800,"
    "volume=1.08"
)

# Complete Ashwin Narration Clips — 21 across the 8 canonical sections
CLIPS = {
    "hero-1.mp3": "Hey, I'm Ashwin — welcome! Let me show you around.",
    "hero-2.mp3": "Just scroll, and I'll walk you through my autonomous systems and AI engineering deployments.",
    "hero-revisit.mp3": "Back at the top console.",
    "assistant-1.mp3": "This is one of my favorite builds. It's a live, portfolio-aware conversational AI assistant.",
    "assistant-2.mp3": "Ask it anything about my architecture, or paste in a job description and test my skill match assessment.",
    "assistant-revisit.mp3": "The portfolio assistant is still live and ready.",
    "roadmap-1.mp3": "Here's the trajectory of how I got here: mechanical engineering first, then enterprise automation, and now a Master's in AI Engineering in Germany.",
    "roadmap-2.mp3": "Across all three fields, one constant drive: building high-performance systems that thrive outside the lab.",
    "roadmap-revisit.mp3": "The career trajectory roadmap.",
    "skills-1.mp3": "Here is my core technical stack: real-time computer vision with YOLO and OpenCV, PyTorch neural architectures, and C++ inference optimized for edge hardware.",
    "skills-revisit.mp3": "The technical capability stack.",
    "github-1.mp3": "And here is what relentless execution looks like day-to-day, pulled live from my GitHub telemetry.",
    "github-revisit.mp3": "The live GitHub commit activity feed.",
    "projects-1.mp3": "Here are my flagship deployments: GymVision for real-time biomechanics; JARVIS, an autonomous voice agent; and zero-framework C++ CNN inference engines.",
    "projects-2.mp3": "Each project expands to show the architecture, tech stack, and source repository.",
    "projects-revisit.mp3": "The project deployment gallery.",
    "certifications-1.mp3": "Verified credentials across deep learning, transformer models, and autonomous AI agents. Every entry links out to its official verification.",
    "certifications-revisit.mp3": "The verified certifications registry.",
    "contact-1.mp3": "That wraps up the walkthrough! Thanks for exploring my portfolio.",
    "contact-2.mp3": "If you'd like to collaborate or have an exciting role, drop a message in the form or email me directly below. Let's connect!",
    "contact-revisit.mp3": "The communication channels are open."
}


def _has_ffmpeg() -> bool:
    try:
        res = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return res.returncode == 0
    except Exception:
        return False


async def generate_with_edge_tts(filename: str, text: str, output_path: Path, voice: str):
    """Generate audio using Edge-TTS, then bake the studio vocal DSP chain in."""
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
        print("     [!] ffmpeg not found — writing raw TTS without the DSP chain.")
        if output_path.exists():
            output_path.unlink()
        temp_raw.rename(output_path)


def generate_with_elevenlabs(filename: str, text: str, output_path: Path, api_key: str, voice_id: str):
    """Generate audio using ElevenLabs API (authentic Ashwin voice clone)."""
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
            "stability": 0.75,
            "similarity_boost": 0.85,
            "style": 0.2,
            "use_speaker_boost": True
        }
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()
        with open(output_path, "wb") as f:
            f.write(audio_data)


async def main():
    parser = argparse.ArgumentParser(description="Generate Ashwin (Creator) Voice Guide Audio Clips")
    parser.add_argument("--provider", choices=["edge-tts", "elevenlabs"], default="edge-tts",
                        help="Audio generation provider (default: edge-tts)")
    parser.add_argument("--voice", default=EDGE_VOICE,
                        help=f"Edge-TTS voice short name (default: {EDGE_VOICE})")
    parser.add_argument("--voice-id", default=os.getenv("ELEVENLABS_ASHWIN_VOICE_ID", "TxGEqnHWrfWFTfGW9XjX"),
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
    print(f"[*] Voice: {args.voice} | pitch {EDGE_PITCH} | rate {EDGE_RATE}")
    print(f"[*] DSP:   {AUDIO_FILTER}")
    print(f"[*] Generating {len(CLIPS)} Ashwin voice clips using '{args.provider}'...\n")

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

    print("[OK] All Ashwin voice clips generated successfully!")
    print(f"[OK] Files are ready in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
