# JARVIS VOICE TOUR SPECIFICATION & IMPLEMENTATION GUIDE

**Project:** Ashwin Vignesh M — Portfolio (`react-portfolio`)  
**Feature:** JARVIS / British AI Terminal Agent Voice Guide Persona  
**Status:** Ready / Audio Generated  

---

## 1. Persona & Tone Overview

The **JARVIS Persona** presents Ashwin’s portfolio through the lens of a sophisticated, tactical British AI system assistant (inspired by Paul Bettany's iconic portrayal). As visitors scroll through the portfolio, JARVIS delivers calm, analytical system telemetry, capability matrix readings, and deployment manifests.

### Why this fits Ashwin's portfolio:
Ashwin built **"JARVIS — Voice-Controlled AI Terminal Agent"** (featured in his Projects section). The voice guide acts as his own project come to life as the interactive tour guide.

---

## 2. Generated Audio Manifest

All 21 clips have been generated into:
📁 **[`public/audio/narration/jarvis/`](file:///c:/Users/mashw/OneDrive/Desktop/CollegeMaterials/protfolio/react-portfolio/public/audio/narration/jarvis/)**

| File | Script Text |
| :--- | :--- |
| **`hero-1.mp3`** | *"Systems online. I am JARVIS, running on Ashwin Vignesh’s portfolio stack."* |
| **`hero-2.mp3`** | *"Scroll to advance. I will brief each subsystem as it comes into view."* |
| **`hero-revisit.mp3`** | *"Returned to origin. Standing by."* |
| **`assistant-1.mp3`** | *"Subsystem: conversational assistant. Retrieval is bound to his portfolio data."* |
| **`assistant-2.mp3`** | *"You may interrogate it directly, or supply a job description and request a match assessment."* |
| **`assistant-revisit.mp3`** | *"Assistant subsystem still responsive."* |
| **`roadmap-1.mp3`** | *"Trajectory log: mechanical engineering, then enterprise ERP analysis, now a Master’s in AI Engineering in Germany."* |
| **`roadmap-2.mp3`** | *"Three domains, one consistent vector — systems that hold up outside the lab."* |
| **`roadmap-revisit.mp3`** | *"Trajectory log."* |
| **`skills-1.mp3`** | *"Capability matrix: computer vision with YOLO and OpenCV, PyTorch model work, and C++ inference tuned for edge hardware."* |
| **`skills-revisit.mp3`** | *"Capability matrix on screen."* |
| **`github-1.mp3`** | *"Telemetry feed: live commit activity, pulled straight from his GitHub account."* |
| **`github-revisit.mp3`** | *"Telemetry feed active."* |
| **`projects-1.mp3`** | *"Deployment manifest: GymVision, real-time pose analysis. My own build, a voice-controlled terminal agent. And a CNN inference engine written in C++ with no frameworks at all."* |
| **`projects-2.mp3`** | *"Each entry expands with its stack and its source repository."* |
| **`projects-revisit.mp3`** | *"Deployment manifest."* |
| **`certifications-1.mp3`** | *"Credential registry: deep learning, transformer language models, and agent engineering. Every entry links to its verification record."* |
| **`certifications-revisit.mp3`** | *"Credential registry."* |
| **`contact-1.mp3`** | *"End of walkthrough. All subsystems reported."* |
| **`contact-2.mp3`** | *"Transmission channel is open below — the form, and his direct address."* |
| **`contact-revisit.mp3`** | *"Transmission channel open."* |

---

## 3. Audio Generator Script

The dedicated script for generating/regenerating JARVIS audio is located at:
📄 **[`scripts/generate_jarvis_audio.py`](file:///c:/Users/mashw/OneDrive/Desktop/CollegeMaterials/protfolio/react-portfolio/scripts/generate_jarvis_audio.py)**

- **Free British Neural Voice (Edge-TTS)**:
  `python scripts/generate_jarvis_audio.py`
- **Authentic ElevenLabs Paul Bettany Clone**:
  `python scripts/generate_jarvis_audio.py --provider elevenlabs --api-key <KEY> --voice-id <JARVIS_VOICE_ID>`

---

## 4. Integration Details for Claude Code

1. **Script Registry**: `src/voice-guide/data/jarvisScript.js` is imported by `src/voice-guide/data/narrationScript.js` under `PERSONAS.jarvis`.
2. **Audio File Probe**: `AudioFileSource.js` automatically probes `/audio/narration/jarvis/<file>.mp3` and plays the generated files.
3. **Fallback TTS Voice**: In `src/voice-guide/config.js` and `SpeechSynthesisSource.js`, the fallback TTS prioritizes British voices (`en-GB-RyanNeural`, `Daniel`, `Arthur`, `en-GB`).

---

## 5. Claude Code Prompt

```markdown
Please ensure the JARVIS voice persona is fully active and tested:

1. Verify that `src/voice-guide/data/jarvisScript.js` points to `/audio/narration/jarvis/*.mp3`.
2. Confirm that switching personas to 'jarvis' via the Voice Guide UI or localStorage ('vg:persona': 'jarvis') correctly streams the 21 generated MP3s from `public/audio/narration/jarvis/`.
3. Check that caption bubble styling displays `[ JARVIS // TACTICAL TELEMETRY ]` when active.
4. Run `npm run build` to verify clean build output.
```
