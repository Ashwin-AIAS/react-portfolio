#!/usr/bin/env python3
"""
Iron Man (Tony Stark // Mark 85 HUD) Voice Tour Audio Generator
===============================================================
Generates studio-quality .mp3 audio clips for the Iron Man Voice Guide persona
(Tony Stark speaking inside the Mark 85 helmet HUD).

Uses local Kokoro-82M Neural TTS (`am_michael.pt`) + ffmpeg Mark 85 internal
titanium helmet chamber resonator & HUD presence EQ (with Edge-TTS fallback).
"""

import os
import sys
import wave
import subprocess
import numpy as np
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "ironman"

KOKORO_SNAP = (
    Path.home()
    / ".cache"
    / "huggingface"
    / "hub"
    / "models--hexgrad--Kokoro-82M"
    / "snapshots"
    / "f3ff3571791e39611d31c381e3a41a3af07b4987"
)

# Mark 85 internal titanium helmet acoustic filter:
# subtle pitch/formant brightness + tight low-cut + warm chest punch + crisp HUD presence + metallic helmet chamber reflection
AUDIO_FILTER = (
    "asetrate=24000*1.03,aresample=24000,atempo=1.02,"
    "highpass=f=110,"
    "bass=g=4.0:f=165,"
    "treble=g=4.5:f=3300,"
    "flanger=delay=3:depth=1.1:regen=18:width=45:speed=0.75,"
    "volume=1.18"
)

CLIPS = {
    "hero-1.mp3": "Testing, one, two—Mark 85 HUD is live. Tony Stark here, taking a look inside Ashwin Vignesh's engineering stack.",
    "hero-2.mp3": "Scroll down and keep up. I'll walk you through his autonomous perception rigs, edge C++, and neural deployments.",
    "hero-revisit.mp3": "Back at the penthouse console. Arc reactor still humming.",
    "assistant-1.mp3": "Okay, I respect this—he wired a live conversational AI agent directly into his portfolio telemetry.",
    "assistant-2.mp3": "Grill it on his system architecture, or drop a job description in there and watch it run a full capability diagnostic.",
    "assistant-revisit.mp3": "Tactical AI terminal is still hot. Go ahead, test it.",
    "roadmap-1.mp3": "Look at the upgrade path: started in mechanical hardware, mastered enterprise automation, and now he's building AI in Germany.",
    "roadmap-2.mp3": "Reminds me of going from Mark 1 in a cave to nanotech—every iteration leaner, faster, and built for the real world.",
    "roadmap-revisit.mp3": "The Mark-by-Mark career upgrade log.",
    "skills-1.mp3": "Now this is my kind of workshop: YOLO computer vision, PyTorch neural nets, and bare-metal C++ tuned for edge silicon.",
    "skills-revisit.mp3": "The core weapons and engineering arsenal.",
    "github-1.mp3": "Talk is cheap, right? Here's the live GitHub telemetry—real commits, real shipping velocity, zero vaporware.",
    "github-revisit.mp3": "Live GitHub commit telemetry on screen.",
    "projects-1.mp3": "Flagship builds: GymVision for real-time biomechanics, his own JARVIS voice agent—flattering, by the way—and a zero-framework C++ CNN engine.",
    "projects-2.mp3": "Pop open any card to inspect the schematics, latency numbers, and source code.",
    "projects-revisit.mp3": "The Hall of Armor project bay.",
    "certifications-1.mp3": "Verified credentials across deep learning, transformers, and autonomous agents—every single one backed by cryptographic proof.",
    "certifications-revisit.mp3": "Verified clearance and credential vault.",
    "contact-1.mp3": "And that's the tour. Look, engineers who can bridge hardware, C++, and modern AI don't sit on the market for long.",
    "contact-2.mp3": "Open the comm link below and hire him before I recruit him for Stark R and D.",
    "contact-revisit.mp3": "Direct Stark-grade comm link is open below.",
}


def save_wav(path: Path, samples: np.ndarray, sample_rate: int = 24000):
    clipped = np.clip(samples, -1.0, 1.0)
    pcm16 = (clipped * 32767.0).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm16.tobytes())


def get_duration_ms(path: Path) -> int:
    try:
        res = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            capture_output=True, text=True, check=True
        )
        return int(round(float(res.stdout.strip()) * 1000))
    except Exception:
        return 5000


def main():
    import torch
    from kokoro import KModel, KPipeline

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[*] Loading Kokoro-82M on {device} for Iron Man (Tony Stark // Mark 85 HUD)...")

    kmodel = KModel(
        repo_id="hexgrad/Kokoro-82M",
        config=str(KOKORO_SNAP / "config.json"),
        model=str(KOKORO_SNAP / "kokoro-v1_0.pth"),
    ).to(device).eval()

    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M", model=kmodel)
    voice_path = str(KOKORO_SNAP / "voices" / "am_michael.pt")

    for i, (filename, text) in enumerate(CLIPS.items(), 1):
        target_file = OUTPUT_DIR / filename
        temp_wav = target_file.with_suffix(".tmp.wav")

        chunks = []
        for _, _, audio in pipeline(text, voice=voice_path, speed=1.08):
            if audio is not None:
                chunks.append(audio.cpu().numpy())

        full_audio = np.concatenate(chunks) if chunks else np.zeros(24000, dtype=np.float32)
        save_wav(temp_wav, full_audio, 24000)

        cmd = [
            "ffmpeg", "-y", "-i", str(temp_wav),
            "-af", AUDIO_FILTER,
            "-ar", "24000", "-ac", "1",
            "-codec:a", "libmp3lame", "-b:a", "64k",
            str(target_file),
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        if temp_wav.exists():
            temp_wav.unlink()

        dur = get_duration_ms(target_file)
        size_kb = target_file.stat().st_size / 1024 if target_file.exists() else 0
        print(f"  [{i:02d}/{len(CLIPS)}] {filename}: {dur} ms ({size_kb:.1f} KB)")

    print("[OK] Iron Man audio generation complete.")


if __name__ == "__main__":
    main()
