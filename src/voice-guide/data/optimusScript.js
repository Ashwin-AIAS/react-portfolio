/**
 * Optimus Prime narration — OPTIMUS_PRIME_VOICE_SPEC.md §3.
 *
 * Same shape as the `ashwin` script in ./narrationScript.js: identical section
 * ids in identical order, so the engine, the commit logic and the debug overlay
 * all work unchanged whichever persona is active.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  FACTUAL DISCIPLINE — carried over from narrationScript.js.
 *
 *  Every claim below was checked against src/data/portfolioData.js:
 *    · GymVision / YOLO26-Pose, rep counting, form scoring ....... verified
 *    · JARVIS, voice-controlled terminal agent ................... verified
 *    · Mini-CNN, "zero frameworks", pure C/C++, Int8 for edge ..... verified
 *    · YOLO, OpenCV, PyTorch, C++ inference ...................... verified
 *    · Mechanical B.Tech -> ERP analyst -> MSc AI Engineering ..... verified
 *
 *  ONE LINE IN THE SPEC DID NOT CHECK OUT and was rewritten — see the
 *  `certifications` section below. Do not restore the spec's wording.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * All 21 clips exist under /public/audio/narration/optimus/, so AudioFileSource
 * HEAD-probes, hits, and plays them through the analyser — speechSynthesis with
 * the `optimus` profile is now only the offline/404 fallback.
 *
 * estimatedMs is MEASURED from the files (ffprobe), not guessed. The audio path
 * ignores it — playback ends on the element's `ended` event — but the
 * caption-only source holds each line for exactly this long, so a stale value
 * makes captions race ahead of a voice that is still talking.
 *
 * @typedef {import('./narrationScript').NarratedSection} NarratedSection
 */

/** @type {NarratedSection[]} */
export const OPTIMUS_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero Briefing',
    intro: [
      {
        text: 'I am Optimus Prime. I send this transmission to all engineers and innovators across the galaxy.',
        audio: '/audio/narration/optimus/hero-1.mp3',
        estimatedMs: 8112,
      },
      {
        text: 'Behold the works of Ashwin Vignesh — an ally in the frontier of Autonomous Systems and Artificial Intelligence. Scroll forward, and witness his deployments.',
        audio: '/audio/narration/optimus/hero-2.mp3',
        estimatedMs: 12120,
      },
    ],
    revisit: {
      text: 'We stand once more at the command console. The mission continues.',
      audio: '/audio/narration/optimus/hero-revisit.mp3',
        estimatedMs: 6144,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: 'Before you lies a neural core linked directly to Ashwin’s databanks.',
        audio: '/audio/narration/optimus/assistant-1.mp3',
        estimatedMs: 5448,
      },
      {
        text: 'Query this sentinel regarding his technical capabilities, or test him with your job requirements. He stands ready for deployment.',
        audio: '/audio/narration/optimus/assistant-2.mp3',
        estimatedMs: 9840,
      },
    ],
    revisit: {
      text: 'The neural sentinel remains active. Engage at your discretion.',
      audio: '/audio/narration/optimus/assistant-revisit.mp3',
        estimatedMs: 5928,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: 'Every warrior’s strength is forged over time. From mechanical hardware engineering, to enterprise automation, to a Master’s in AI Engineering in Germany.',
        audio: '/audio/narration/optimus/roadmap-1.mp3',
        estimatedMs: 12072,
      },
      {
        text: 'Through every transformation, one prime directive remains: building robust systems that conquer real-world complexity.',
        audio: '/audio/narration/optimus/roadmap-2.mp3',
        estimatedMs: 8664,
      },
    ],
    revisit: {
      text: 'The chronological trajectory of past victories and education.',
      audio: '/audio/narration/optimus/roadmap-revisit.mp3',
        estimatedMs: 4920,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills & Arsenal',
    intro: [
      {
        text: 'A formidable arsenal: Computer Vision with YOLO and OpenCV, PyTorch neural architectures, and C++ inference engines optimized for edge hardware.',
        audio: '/audio/narration/optimus/skills-1.mp3',
        estimatedMs: 12144,
      },
    ],
    revisit: {
      text: 'The weapon systems and neural tooling ready for deployment.',
      audio: '/audio/narration/optimus/skills-revisit.mp3',
        estimatedMs: 4488,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Telemetry',
    intro: [
      {
        text: 'Discipline is proven through relentless execution. Observe his GitHub telemetry — constant optimization and code commits.',
        audio: '/audio/narration/optimus/github-1.mp3',
        estimatedMs: 9984,
      },
    ],
    revisit: {
      text: 'The live telemetry grid of repository commits.',
      audio: '/audio/narration/optimus/github-revisit.mp3',
        estimatedMs: 4224,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Deployed Systems',
    intro: [
      {
        text: 'Behold his primary deployments: GymVision — real-time pose biomechanics; JARVIS — an autonomous voice agent; and zero-framework C++ CNN engines.',
        audio: '/audio/narration/optimus/projects-1.mp3',
        estimatedMs: 12696,
      },
      {
        text: 'Built not merely for simulation, but for physical impact in autonomous vehicles and robotics.',
        audio: '/audio/narration/optimus/projects-2.mp3',
        estimatedMs: 7152,
      },
    ],
    revisit: {
      text: 'The flagship project battlements.',
      audio: '/audio/narration/optimus/projects-revisit.mp3',
        estimatedMs: 3264,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        // CHANGED FROM SPEC. The spec line was:
        //   "Validated credentials from Deep Learning to automotive Sensor
        //    Fusion. Proof of continuous technical evolution."
        // portfolioData.certifications holds five entries — Anthropic, Hugging
        // Face, Kaggle, NVIDIA, Great Learning — and none of them is a sensor
        // fusion credential. Camera-LiDAR fusion appears only as project work.
        // Spoken aloud on a portfolio recruiters read, that would be a false
        // credential claim, so the line now names the ground it actually covers.
        text: 'Validated credentials spanning deep learning, transformer language models, and agent engineering. Proof of continuous technical evolution.',
        audio: '/audio/narration/optimus/certifications-1.mp3',
        estimatedMs: 10776,
      },
    ],
    revisit: {
      text: 'Verified technical credentials.',
      audio: '/audio/narration/optimus/certifications-revisit.mp3',
        estimatedMs: 3216,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Transmission Channel',
    intro: [
      {
        text: 'The battle for tomorrow requires bold allies. Send your transmission to Ashwin. Together, you will transform what is possible.',
        audio: '/audio/narration/optimus/contact-1.mp3',
        estimatedMs: 10728,
      },
      {
        text: 'Autobots... roll out!',
        audio: '/audio/narration/optimus/contact-2.mp3',
        estimatedMs: 2832,
      },
    ],
    revisit: {
      text: 'The communication frequencies are open.',
      audio: '/audio/narration/optimus/contact-revisit.mp3',
        estimatedMs: 3528,
    },
  },
];
