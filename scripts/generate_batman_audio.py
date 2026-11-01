#!/usr/bin/env python3
"""
Batman (The Dark Knight // Batcomputer Tactical Armor) Voice Tour Audio Generator
=================================================================================
Generates studio-quality .mp3 audio clips for the Batman Voice Guide persona.

Uses local Kokoro-82M Neural TTS (`am_onyx.pt`) + ffmpeg Dark Knight armored
cowl sub-harmonic pitch/formant modulator & tactical resonator DSP.
"""

import os
import sys
import wave
import subprocess
import numpy as np
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "public" / "audio" / "narration" / "batman"

KOKORO_SNAP = (
    Path.home()
    / ".cache"
    / "huggingface"
    / "hub"
    / "models--hexgrad--Kokoro-82M"
    / "snapshots"
    / "f3ff3571791e39611d31c381e3a41a3af07b4987"
)

# Dark Knight armored cowl modulator:
# deep sub-harmonic formant shift (0.83x pitch compensated with atempo) + heavy chest rumble + dark cowl resonance
AUDIO_FILTER = (
    "asetrate=24000*0.83,aresample=24000,atempo=1.14,"
    "bass=g=13:f=85,"
    "treble=g=2.8:f=2400,"
    "lowpass=f=3600,"
    "flanger=delay=5:depth=1.9:regen=22:width=50:speed=0.35,"
    "volume=1.24"
)

CLIPS = {
    "hero-1.mp3": "Batcomputer tactical link established. I've pulled the operational dossier on Ashwin Vignesh.",
    "hero-2.mp3": "Advance through the file. Every subsystem ahead has been stress-tested for autonomous precision.",
    "hero-revisit.mp3": "Returned to the primary command console.",
    "assistant-1.mp3": "Interactive intelligence terminal. Indexed against every project, metric, and deployment in his record.",
    "assistant-2.mp3": "Interrogate the neural core directly, or feed it a mission profile to run a tactical fit analysis.",
    "assistant-revisit.mp3": "Intelligence terminal standing by for interrogation.",
    "roadmap-1.mp3": "Subject's operational history: forged in mechanical engineering, sharpened in enterprise systems, now advancing AI engineering in Germany.",
    "roadmap-2.mp3": "Discipline across hardware and software. No wasted motion. Only systems that survive the field.",
    "roadmap-revisit.mp3": "Operational timeline on display.",
    "skills-1.mp3": "Tactical arsenal: real-time vision with YOLO and OpenCV, deep PyTorch architectures, and low-latency C++ built for the edge.",
    "skills-revisit.mp3": "Tactical capability matrix.",
    "github-1.mp3": "Surveillance on his GitHub repository feed confirms consistent, disciplined execution day after day.",
    "github-revisit.mp3": "Live repository surveillance active.",
    "projects-1.mp3": "Field prototypes: GymVision pose kinematics, a voice-driven terminal agent, and a pure C++ convolutional engine with zero external dependencies.",
    "projects-2.mp3": "Inspect any case file to review the architecture and source code.",
    "projects-revisit.mp3": "Field prototype archives.",
    "certifications-1.mp3": "Verified training records in deep learning, language models, and autonomous agents. Every credential authenticated.",
    "certifications-revisit.mp3": "Authenticated training and credential records.",
    "contact-1.mp3": "Dossier complete. The evidence is clear—he builds technology that works when it matters.",
    "contact-2.mp3": "Transmit your signal through the encrypted channel below. I'll be watching.",
    "contact-revisit.mp3": "Encrypted transmission channel open.",
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
    print(f"[*] Loading Kokoro-82M on {device} for Batman (The Dark Knight)...")

    kmodel = KModel(
        repo_id="hexgrad/Kokoro-82M",
        config=str(KOKORO_SNAP / "config.json"),
        model=str(KOKORO_SNAP / "kokoro-v1_0.pth"),
    ).to(device).eval()

    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M", model=kmodel)
    voice_path = str(KOKORO_SNAP / "voices" / "am_onyx.pt")

    for i, (filename, text) in enumerate(CLIPS.items(), 1):
        target_file = OUTPUT_DIR / filename
        temp_wav = target_file.with_suffix(".tmp.wav")

        chunks = []
        for _, _, audio in pipeline(text, voice=voice_path, speed=0.96):
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

    print("[OK] Batman audio generation complete.")


if __name__ == "__main__":
    main()
