#!/usr/bin/env python3
"""
Bumblebee (Autobot Scout // Radio-Synth Core) Voice Tour Audio Generator
========================================================================
Generates studio-quality .mp3 audio clips for the Bumblebee Voice Guide persona.

Uses local Kokoro-82M Neural TTS (youthful scout blend) + ffmpeg Cybertronian
radio-vocoder pitch/chorus/flanger/phaser synth DSP chain.
"""

import os
import sys
import wave
import subprocess
import numpy as np
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "bumblebee"

KOKORO_SNAP = (
    Path.home()
    / ".cache"
    / "huggingface"
    / "hub"
    / "models--hexgrad--Kokoro-82M"
    / "snapshots"
    / "f3ff3571791e39611d31c381e3a41a3af07b4987"
)

# Cybertronian radio-synth vocoder filter:
# youthful scout pitch shift (1.12x) + radio bandpass warmth + bright metallic treble + dual flanger/phaser synth modulation
AUDIO_FILTER = (
    "asetrate=24000*1.12,aresample=24000,atempo=0.96,"
    "highpass=f=170,"
    "treble=g=5.2:f=3600,"
    "flanger=delay=4:depth=2.4:regen=28:width=68:speed=1.2,"
    "aphaser=in_gain=0.85:out_gain=0.95:delay=1.8:decay=0.36:speed=0.85,"
    "volume=1.20"
)

CLIPS = {
    "hero-1.mp3": "Bzt-chk—Autobot scout Bumblebee locked onto the frequency! Welcome to Ashwin Vignesh's high-voltage portfolio!",
    "hero-2.mp3": "Hit the throttle and scroll down—I'll tune the radio to every AI engine and autonomous build on the track!",
    "hero-revisit.mp3": "Back at the starting line! Engine's still purring!",
    "assistant-1.mp3": "Check out this co-pilot! It's a live AI assistant wired straight into Ashwin's neural memory banks.",
    "assistant-2.mp3": "Fire away with any question, or drop a job description in the slot to see how fast he locks onto your mission!",
    "assistant-revisit.mp3": "Co-pilot radio link is still loud and clear!",
    "roadmap-1.mp3": "Here's the route map: from mechanical gears, to enterprise networks, all the way to Master's-level AI engineering in Germany!",
    "roadmap-2.mp3": "Talk about a full Cybertronian upgrade—built for speed, precision, and real-world roads.",
    "roadmap-revisit.mp3": "Cruising past the career route map!",
    "skills-1.mp3": "Popping the hood on his tech stack: YOLO computer vision, PyTorch neural networks, and turbo-charged C++ for edge hardware!",
    "skills-revisit.mp3": "Under the hood: full capability specs!",
    "github-1.mp3": "Look at that radar pulse! Live GitHub commits streaming straight from his workshop in real time.",
    "github-revisit.mp3": "Live GitHub telemetry radar is pinging!",
    "projects-1.mp3": "Here are the heavy hitters: GymVision real-time pose tracking, the JARVIS voice agent, and a pure C++ neural engine built from scratch!",
    "projects-2.mp3": "Tap any build to pop the schematics and check out the source code!",
    "projects-revisit.mp3": "Back in the main project garage!",
    "certifications-1.mp3": "Official Autobot-grade badges in deep learning, transformers, and AI agents—every single one verified!",
    "certifications-revisit.mp3": "Verified badge and credential rack!",
    "contact-1.mp3": "That's the whole circuit! Ashwin's systems are primed and ready to roll out on your next big mission.",
    "contact-2.mp3": "Send a transmission through the beacon below—let's team up and build something legendary!",
    "contact-revisit.mp3": "Comms beacon is open—send the signal!",
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
    print(f"[*] Loading Kokoro-82M on {device} for Bumblebee (Autobot Scout)...")

    kmodel = KModel(
        repo_id="hexgrad/Kokoro-82M",
        config=str(KOKORO_SNAP / "config.json"),
        model=str(KOKORO_SNAP / "kokoro-v1_0.pth"),
    ).to(device).eval()

    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M", model=kmodel)
    # Blend am_michael (80%) + af_heart (20%) for a youthful, bright Autobot scout vocal timbre
    v_michael = torch.load(str(KOKORO_SNAP / "voices" / "am_michael.pt"), weights_only=True)
    v_heart = torch.load(str(KOKORO_SNAP / "voices" / "af_heart.pt"), weights_only=True)
    voice_blend = (0.82 * v_michael + 0.18 * v_heart).float()

    for i, (filename, text) in enumerate(CLIPS.items(), 1):
        target_file = OUTPUT_DIR / filename
        temp_wav = target_file.with_suffix(".tmp.wav")

        chunks = []
        for _, _, audio in pipeline(text, voice=voice_blend, speed=1.06):
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

    print("[OK] Bumblebee audio generation complete.")


if __name__ == "__main__":
    main()
