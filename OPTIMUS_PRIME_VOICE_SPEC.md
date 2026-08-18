# OPTIMUS PRIME VOICE TOUR SPECIFICATION & IMPLEMENTATION GUIDE

**Project:** Ashwin Vignesh M — Portfolio (`react-portfolio`)  
**Feature:** Optimus Prime / Transformers Voice Guide Persona & Theme  
**Status:** Ready for Implementation  

---

## 1. Concept & Persona Overview

Transform the portfolio's interactive Voice Guide into an epic **Optimus Prime (Autobots Commander)** experience. As recruiters and visitors scroll through the portfolio, Optimus Prime speaks with a deep, booming, authoritative voice with subtle Cybertronian robotic resonance, narrating Ashwin's autonomous systems, computer vision, and AI engineering accomplishments like a grand mission briefing.

---

## 2. Voice Personas System

Support selectable voice personas (persisted in `localStorage.getItem('vg:persona')`):

| Persona ID | Name | Voice Tone | Script Style |
| :--- | :--- | :--- | :--- |
| `optimus` *(New Default / Featured)* | **Optimus Prime** | Deep baritone, robotic resonance, heroic bass | Epic Transformers commander monologue |
| `ashwin` | **Ashwin (Creator)** | Natural, friendly, casual engineer | Direct 1st-person creator walkthrough |
| `jarvis` | **JARVIS Terminal** | Crisp, synthetic British AI | Tactical AI system diagnostics |

---

## 3. Optimus Prime Complete Narration Script

Create/integrate these scripts into `src/voice-guide/data/optimusScript.js`:

```javascript
export const OPTIMUS_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero Briefing',
    intro: [
      {
        text: "I am Optimus Prime. I send this transmission to all engineers and innovators across the galaxy.",
        audio: '/audio/narration/optimus/hero-1.mp3',
        estimatedMs: 6200,
      },
      {
        text: "Behold the works of Ashwin Vignesh — an ally in the frontier of Autonomous Systems and Artificial Intelligence. Scroll forward, and witness his deployments.",
        audio: '/audio/narration/optimus/hero-2.mp3',
        estimatedMs: 7800,
      },
    ],
    revisit: {
      text: "We stand once more at the command console. The mission continues.",
      audio: '/audio/narration/optimus/hero-revisit.mp3',
      estimatedMs: 3800,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: "Before you lies a neural core linked directly to Ashwin’s databanks.",
        audio: '/audio/narration/optimus/assistant-1.mp3',
        estimatedMs: 4200,
      },
      {
        text: "Query this sentinel regarding his technical capabilities, or test him with your job requirements. He stands ready for deployment.",
        audio: '/audio/narration/optimus/assistant-2.mp3',
        estimatedMs: 6500,
      },
    ],
    revisit: {
      text: "The neural sentinel remains active. Engage at your discretion.",
      audio: '/audio/narration/optimus/assistant-revisit.mp3',
      estimatedMs: 3200,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: "Every warrior's strength is forged over time. From mechanical hardware engineering, to enterprise automation, to a Master’s in AI Engineering in Germany.",
        audio: '/audio/narration/optimus/roadmap-1.mp3',
        estimatedMs: 8200,
      },
      {
        text: "Through every transformation, one prime directive remains: building robust systems that conquer real-world complexity.",
        audio: '/audio/narration/optimus/roadmap-2.mp3',
        estimatedMs: 6400,
      },
    ],
    revisit: {
      text: "The chronological trajectory of past victories and education.",
      audio: '/audio/narration/optimus/roadmap-revisit.mp3',
      estimatedMs: 3400,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills & Arsenal',
    intro: [
      {
        text: "A formidable arsenal: Computer Vision with YOLO and OpenCV, PyTorch neural architectures, and C++ inference engines optimized for edge hardware.",
        audio: '/audio/narration/optimus/skills-1.mp3',
        estimatedMs: 8500,
      },
    ],
    revisit: {
      text: "The weapon systems and neural tooling ready for deployment.",
      audio: '/audio/narration/optimus/skills-revisit.mp3',
      estimatedMs: 3200,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Telemetry',
    intro: [
      {
        text: "Discipline is proven through relentless execution. Observe his GitHub telemetry — constant optimization and code commits.",
        audio: '/audio/narration/optimus/github-1.mp3',
        estimatedMs: 6800,
      },
    ],
    revisit: {
      text: "The live telemetry grid of repository commits.",
      audio: '/audio/narration/optimus/github-revisit.mp3',
      estimatedMs: 2800,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Deployed Systems',
    intro: [
      {
        text: "Behold his primary deployments: GymVision — real-time pose biomechanics; JARVIS — an autonomous voice agent; and zero-framework C++ CNN engines.",
        audio: '/audio/narration/optimus/projects-1.mp3',
        estimatedMs: 8400,
      },
      {
        text: "Built not merely for simulation, but for physical impact in autonomous vehicles and robotics.",
        audio: '/audio/narration/optimus/projects-2.mp3',
        estimatedMs: 5600,
      },
    ],
    revisit: {
      text: "The flagship project battlements.",
      audio: '/audio/narration/optimus/projects-revisit.mp3',
      estimatedMs: 2500,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: "Validated credentials from Deep Learning to automotive Sensor Fusion. Proof of continuous technical evolution.",
        audio: '/audio/narration/optimus/certifications-1.mp3',
        estimatedMs: 6200,
      },
    ],
    revisit: {
      text: "Verified technical credentials.",
      audio: '/audio/narration/optimus/certifications-revisit.mp3',
      estimatedMs: 2200,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Transmission Channel',
    intro: [
      {
        text: "The battle for tomorrow requires bold allies. Send your transmission to Ashwin. Together, you will transform what is possible.",
        audio: '/audio/narration/optimus/contact-1.mp3',
        estimatedMs: 7200,
      },
      {
        text: "Autobots... roll out!",
        audio: '/audio/narration/optimus/contact-2.mp3',
        estimatedMs: 3200,
      },
    ],
    revisit: {
      text: "The communication frequencies are open.",
      audio: '/audio/narration/optimus/contact-revisit.mp3',
      estimatedMs: 2400,
    },
  },
];
```

---

## 4. Web Speech API & DSP Audio Tuning (Browser Fallback)

When pre-recorded audio files are not present, tune the browser's Web Speech API and Web Audio DSP filter chain to synthesize the Optimus Prime effect:

### 4.1 SpeechSynthesis Settings
In `src/voice-guide/sources/SpeechSynthesisSource.js` (or via persona parameters):
* **Pitch:** `0.65` *(Deep baritone bass)*
* **Rate:** `0.85` *(Deliberate, steady, commanding pace)*
* **Volume:** `1.0`
* **Voice Filter:** Prioritize deep male voices:
  ```javascript
  const OPTIMUS_PREFERRED_VOICES = [
    'Google UK English Male',
    'Microsoft David',
    'Microsoft George',
    'Daniel',
    'Arthur',
    'en-US-Neural2-D',
    'en-US-Neural2-J'
  ];
  ```

### 4.2 Web Audio DSP Chain (Cybertronian Bass & Resonance)
In `src/voice-guide/sources/AudioFileSource.js` / Web Audio graph:
```javascript
export function applyOptimusDSP(audioContext, sourceNode, destinationNode) {
  // 1. Heavy Low-End Sub Bass Boost (Chest Resonance)
  const bassBoost = audioContext.createBiquadFilter();
  bassBoost.type = 'lowshelf';
  bassBoost.frequency.value = 140; // Hz
  bassBoost.gain.value = 8.0; // +8dB bass rumble

  // 2. High-Mid Presence Filter (Metal articulation)
  const presence = audioContext.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 2800; // Hz
  presence.gain.value = 3.5; // +3.5dB
  presence.Q.value = 1.2;

  // 3. Subtle Metallic Comb / Flanger
  const delay = audioContext.createDelay();
  delay.delayTime.value = 0.015; // 15ms metallic slapback

  const feedback = audioContext.createGain();
  feedback.gain.value = 0.25;

  sourceNode.connect(bassBoost);
  bassBoost.connect(presence);
  presence.connect(destinationNode);

  // Parallel subtle comb circuit
  presence.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(destinationNode);
}
```

---

## 5. UI Integration: Persona Selector in Voice Controls

### 5.1 Update `src/voice-guide/components/VoiceToggle.jsx`
Add a persona selector button / modal next to the voice toggle so users can switch between:
1. 🤖 **Optimus Prime**
2. 🎙️ **Ashwin (Creator)**
3. ⚡ **JARVIS**

### 5.2 Optimus Visual Mode & Avatar Glow
When `persona === 'optimus'`:
- The avatar aura pulse emits a **Matrix of Leadership Cyan / Autobot Amber** energy pulse when speaking (`var(--accent)` or `#00f2fe`).
- The caption bubble is styled with tactical corner brackets: `[ TRANSMISSION // OPTIMUS PRIME ]`.

---

## 6. How to Generate High-Fidelity Audio Files (Optional Studio Quality)

To have Peter Cullen's authentic, pristine movie voice:
1. Use **ElevenLabs** or **Edge-TTS**:
   - Voice model: Search for `"Optimus Prime"` or `"Deep Authoritative Commander / Peter Cullen"`.
   - Stability: `0.70`, Clarity: `0.85`, Style Exaggeration: `0.20`.
2. Generate the MP3s matching the script keys (e.g. `hero-1.mp3`, `hero-2.mp3`, `contact-2.mp3`) and place them in:
   `/public/audio/narration/optimus/`
3. `AudioFileSource.js` will automatically detect the `.mp3` files via `HEAD` request and play them with the Web Audio FFT visualizer!

---

## 7. Claude Code Kickoff Prompt

Paste this into Claude Code to implement the Optimus Prime voice tour:

```markdown
Please implement the Optimus Prime voice guide feature detailed in OPTIMUS_PRIME_VOICE_SPEC.md:

1. Create `src/voice-guide/data/optimusScript.js` containing the complete Autobot commander narration script.
2. Update `src/voice-guide/data/narrationScript.js` and `narrationEngine.js` to support switching between personas ('optimus', 'ashwin', 'jarvis') with localStorage persistence ('vg:persona').
3. In `SpeechSynthesisSource.js`, add the Optimus Prime speech profile (pitch: 0.65, rate: 0.85, prioritizing deep male voices).
4. Update `VoiceToggle.jsx` and `CaptionBubble.jsx` to display the active persona badge (`[ OPTIMUS PRIME ]`) and allow switching personas.
5. Run `npm run build` to verify clean compilation without errors.
```
