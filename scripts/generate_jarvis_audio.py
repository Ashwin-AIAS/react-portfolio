#!/usr/bin/env python3
"""
JARVIS Voice Tour Audio Generator
================================
Generates studio-quality .mp3 audio clips for the JARVIS Voice Guide persona
(Paul Bettany / British AI Terminal Agent).

Supports:
1. Microsoft Edge-TTS (100% FREE, no API key needed) using British Neural Voice (en-GB-RyanNeural).
2. ElevenLabs API (Authentic Paul Bettany / JARVIS clone) if ELEVENLABS_API_KEY is set.

Usage:
  python scripts/generate_jarvis_audio.py
  python scripts/generate_jarvis_audio.py --provider edge-tts
  python scripts/generate_jarvis_audio.py --provider elevenlabs --voice-id <VOICE_ID>
  python scripts/generate_jarvis_audio.py --only hero-1.mp3,hero-2.mp3
"""

import os
import sys
import argparse
import asyncio
import subprocess
from pathlib import Path

# Target output directory
ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "jarvis"

# Complete JARVIS Narration Clips
CLIPS = {
    "hero-1.mp3": "Systems online. I am JARVIS, running on Ashwin Vignesh’s portfolio stack.",
    "hero-2.mp3": "Scroll to advance. I will brief each subsystem as it comes into view.",
    "hero-revisit.mp3": "Returned to origin. Standing by.",
    "assistant-1.mp3": "Subsystem: conversational assistant. Retrieval is bound to his portfolio data.",
    "assistant-2.mp3": "You may interrogate it directly, or supply a job description and request a match assessment.",
    "assistant-revisit.mp3": "Assistant subsystem still responsive.",
    "roadmap-1.mp3": "Trajectory log: mechanical engineering, then enterprise ERP analysis, now a Master’s in AI Engineering in Germany.",
    "roadmap-2.mp3": "Three domains, one consistent vector — systems that hold up outside the lab.",
    "roadmap-revisit.mp3": "Trajectory log.",
    "skills-1.mp3": "Capability matrix: computer vision with YOLO and OpenCV, PyTorch model work, and C++ inference tuned for edge hardware.",
    "skills-revisit.mp3": "Capability matrix on screen.",
    "github-1.mp3": "Telemetry feed: live commit activity, pulled straight from his GitHub account.",
    "github-revisit.mp3": "Telemetry feed active.",
    "projects-1.mp3": "Deployment manifest: GymVision, real-time pose analysis. My own build, a voice-controlled terminal agent. And a CNN inference engine written in C++ with no frameworks at all.",
    "projects-2.mp3": "Each entry expands with its stack and its source repository.",
    "projects-revisit.mp3": "Deployment manifest.",
    "certifications-1.mp3": "Credential registry: deep learning, transformer language models, and agent engineering. Every entry links to its verification record.",
    "certifications-revisit.mp3": "Credential registry.",
    "contact-1.mp3": "End of walkthrough. All subsystems reported.",
    "contact-2.mp3": "Transmission channel is open below — the form, and his direct address.",
    "contact-revisit.mp3": "Transmission channel open."
}


async def generate_with_edge_tts(filename: str, text: str, output_path: Path):
    """Generate audio using Edge-TTS with British JARVIS neural tuning."""
    try:
        import edge_tts
    except ImportError:
        print("[!] Installing edge-tts...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts"])
        import edge_tts

    # Crisp, polite, sophisticated British AI
    # en-GB-RyanNeural or en-GB-ThomasNeural
    voice = "en-GB-RyanNeural"
    pitch = "-2Hz"
    rate = "+3%"

    temp_raw = output_path.with_suffix(".tmp.mp3")

    communicate = edge_tts.Communicate(text, voice, pitch=pitch, rate=rate)
    await communicate.save(str(temp_raw))

    # Apply audio DSP with ffmpeg if available (crisp high-frequency clarity + slight compression)
    has_ffmpeg = False
    try:
        res = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        has_ffmpeg = res.returncode == 0
    except Exception:
        has_ffmpeg = False

    if has_ffmpeg:
        # Audio filter: subtle presence boost + soft high-pass for clean British synthetic AI delivery
        audio_filter = "highpass=f=80,treble=g=2.5:f=3500,volume=1.05"
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
    """Generate audio using ElevenLabs API (authentic Paul Bettany / JARVIS clone)."""
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
            "stability": 0.78,
            "similarity_boost": 0.85,
            "style": 0.15,
            "use_speaker_boost": True
        }
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()
        with open(output_path, "wb") as f:
            f.write(audio_data)


async def main():
    parser = argparse.ArgumentParser(description="Generate JARVIS Voice Guide Audio Clips")
    parser.add_argument("--provider", choices=["edge-tts", "elevenlabs"], default="edge-tts",
                        help="Audio generation provider (default: edge-tts)")
    parser.add_argument("--voice-id", default=os.getenv("ELEVENLABS_JARVIS_VOICE_ID", "pNInz6obpgDQGcFmaJgB"),
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
    print(f"[*] Generating {len(CLIPS)} JARVIS voice clips using '{args.provider}'...\n")

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

    print("[OK] All JARVIS voice clips generated successfully!")
    print(f"[OK] Files are ready in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
