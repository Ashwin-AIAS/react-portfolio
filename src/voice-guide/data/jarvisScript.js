/**
 * JARVIS narration — tactical system diagnostics.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  NOT FROM THE SPEC. OPTIMUS_PRIME_VOICE_SPEC.md §2 lists `jarvis` in the
 *  persona table ("Crisp, synthetic British AI / Tactical AI system
 *  diagnostics") but §3 only supplies the Optimus script. This file was written
 *  to fill that gap so the third persona is selectable rather than a dead entry.
 *
 *  It is therefore AUTHORED COPY, not reviewed copy — same standing as the
 *  placeholder lines in narrationScript.js, and it needs Ashwin's read before
 *  anything is recorded against it.
 *
 *  Facts checked against src/data/portfolioData.js, same as optimusScript.js.
 *  No employer, metric, or outcome claims are invented. The certifications
 *  line names capability areas, not credentials that do not exist.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The name is deliberate: "JARVIS — Voice-Controlled AI Terminal Agent" is one
 * of Ashwin's own projects, so the persona reads as his build narrating his
 * work rather than as an unrelated character.
 *
 * @typedef {import('./narrationScript').NarratedSection} NarratedSection
 */

/** @type {NarratedSection[]} */
export const JARVIS_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        text: 'Systems online. I am JARVIS, running on Ashwin Vignesh’s portfolio stack.',
        audio: '/audio/narration/jarvis/hero-1.mp3',
        estimatedMs: 5200,
      },
      {
        text: 'Scroll to advance. I will brief each subsystem as it comes into view.',
        audio: '/audio/narration/jarvis/hero-2.mp3',
        estimatedMs: 4600,
      },
    ],
    revisit: {
      text: 'Returned to origin. Standing by.',
      audio: '/audio/narration/jarvis/hero-revisit.mp3',
      estimatedMs: 2400,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: 'Subsystem: conversational assistant. Retrieval is bound to his portfolio data.',
        audio: '/audio/narration/jarvis/assistant-1.mp3',
        estimatedMs: 5000,
      },
      {
        text: 'You may interrogate it directly, or supply a job description and request a match assessment.',
        audio: '/audio/narration/jarvis/assistant-2.mp3',
        estimatedMs: 5600,
      },
    ],
    revisit: {
      text: 'Assistant subsystem still responsive.',
      audio: '/audio/narration/jarvis/assistant-revisit.mp3',
      estimatedMs: 2600,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: 'Trajectory log: mechanical engineering, then enterprise ERP analysis, now a Master’s in AI Engineering in Germany.',
        audio: '/audio/narration/jarvis/roadmap-1.mp3',
        estimatedMs: 7000,
      },
      {
        text: 'Three domains, one consistent vector — systems that hold up outside the lab.',
        audio: '/audio/narration/jarvis/roadmap-2.mp3',
        estimatedMs: 4400,
      },
    ],
    revisit: {
      text: 'Trajectory log.',
      audio: '/audio/narration/jarvis/roadmap-revisit.mp3',
      estimatedMs: 1600,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        text: 'Capability matrix: computer vision with YOLO and OpenCV, PyTorch model work, and C++ inference tuned for edge hardware.',
        audio: '/audio/narration/jarvis/skills-1.mp3',
        estimatedMs: 7400,
      },
    ],
    revisit: {
      text: 'Capability matrix on screen.',
      audio: '/audio/narration/jarvis/skills-revisit.mp3',
      estimatedMs: 2000,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        text: 'Telemetry feed: live commit activity, pulled straight from his GitHub account.',
        audio: '/audio/narration/jarvis/github-1.mp3',
        estimatedMs: 5200,
      },
    ],
    revisit: {
      text: 'Telemetry feed active.',
      audio: '/audio/narration/jarvis/github-revisit.mp3',
      estimatedMs: 1800,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        text: 'Deployment manifest: GymVision, real-time pose analysis. My own build, a voice-controlled terminal agent. And a CNN inference engine written in C++ with no frameworks at all.',
        audio: '/audio/narration/jarvis/projects-1.mp3',
        estimatedMs: 9200,
      },
      {
        text: 'Each entry expands with its stack and its source repository.',
        audio: '/audio/narration/jarvis/projects-2.mp3',
        estimatedMs: 4000,
      },
    ],
    revisit: {
      text: 'Deployment manifest.',
      audio: '/audio/narration/jarvis/projects-revisit.mp3',
      estimatedMs: 1600,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: 'Credential registry: deep learning, transformer language models, and agent engineering. Every entry links to its verification record.',
        audio: '/audio/narration/jarvis/certifications-1.mp3',
        estimatedMs: 7000,
      },
    ],
    revisit: {
      text: 'Credential registry.',
      audio: '/audio/narration/jarvis/certifications-revisit.mp3',
      estimatedMs: 1700,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: 'End of walkthrough. All subsystems reported.',
        audio: '/audio/narration/jarvis/contact-1.mp3',
        estimatedMs: 3600,
      },
      {
        text: 'Transmission channel is open below — the form, and his direct address.',
        audio: '/audio/narration/jarvis/contact-2.mp3',
        estimatedMs: 4400,
      },
    ],
    revisit: {
      text: 'Transmission channel open.',
      audio: '/audio/narration/jarvis/contact-revisit.mp3',
      estimatedMs: 1800,
    },
  },
];
