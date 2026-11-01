/**
 * Batman (The Dark Knight // Batcomputer Tactical Armor) narration script.
 *
 * Covers the exact 8 canonical sections in document order (`hero`, `assistant`,
 * `roadmap`, `skills`, `github`, `projects`, `certifications`, `contact`).
 *
 * @typedef {import('./narrationScript').NarratedSection} NarratedSection
 */

/** @type {NarratedSection[]} */
export const BATMAN_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        text: "Batcomputer tactical link established. I've pulled the operational dossier on Ashwin Vignesh.",
        audio: '/audio/narration/batman/hero-1.mp3',
        estimatedMs: 6878,
      },
      {
        text: 'Advance through the file. Every subsystem ahead has been stress-tested for autonomous precision.',
        audio: '/audio/narration/batman/hero-2.mp3',
        estimatedMs: 6800,
      },
    ],
    revisit: {
      text: 'Returned to the primary command console.',
      audio: '/audio/narration/batman/hero-revisit.mp3',
      estimatedMs: 3603,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: 'Interactive intelligence terminal. Indexed against every project, metric, and deployment in his record.',
        audio: '/audio/narration/batman/assistant-1.mp3',
        estimatedMs: 7406,
      },
      {
        text: 'Interrogate the neural core directly, or feed it a mission profile to run a tactical fit analysis.',
        audio: '/audio/narration/batman/assistant-2.mp3',
        estimatedMs: 6933,
      },
    ],
    revisit: {
      text: 'Intelligence terminal standing by for interrogation.',
      audio: '/audio/narration/batman/assistant-revisit.mp3',
      estimatedMs: 4421,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: "Subject's operational history: forged in mechanical engineering, sharpened in enterprise systems, now advancing AI engineering in Germany.",
        audio: '/audio/narration/batman/roadmap-1.mp3',
        estimatedMs: 9626,
      },
      {
        text: 'Discipline across hardware and software. No wasted motion. Only systems that survive the field.',
        audio: '/audio/narration/batman/roadmap-2.mp3',
        estimatedMs: 7250,
      },
    ],
    revisit: {
      text: 'Operational timeline on display.',
      audio: '/audio/narration/batman/roadmap-revisit.mp3',
      estimatedMs: 3416,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        text: 'Tactical arsenal: real-time vision with YOLO and OpenCV, deep PyTorch architectures, and low-latency C++ built for the edge.',
        audio: '/audio/narration/batman/skills-1.mp3',
        estimatedMs: 9758,
      },
    ],
    revisit: {
      text: 'Tactical capability matrix.',
      audio: '/audio/narration/batman/skills-revisit.mp3',
      estimatedMs: 3050,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        text: 'Surveillance on his GitHub repository feed confirms consistent, disciplined execution day after day.',
        audio: '/audio/narration/batman/github-1.mp3',
        estimatedMs: 7723,
      },
    ],
    revisit: {
      text: 'Live repository surveillance active.',
      audio: '/audio/narration/batman/github-revisit.mp3',
      estimatedMs: 3603,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        text: 'Field prototypes: GymVision pose kinematics, a voice-driven terminal agent, and a pure C++ convolutional engine with zero external dependencies.',
        audio: '/audio/narration/batman/projects-1.mp3',
        estimatedMs: 10684,
      },
      {
        text: 'Inspect any case file to review the architecture and source code.',
        audio: '/audio/narration/batman/projects-2.mp3',
        estimatedMs: 4870,
      },
    ],
    revisit: {
      text: 'Field prototype archives.',
      audio: '/audio/narration/batman/projects-revisit.mp3',
      estimatedMs: 2678,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: 'Verified training records in deep learning, language models, and autonomous agents. Every credential authenticated.',
        audio: '/audio/narration/batman/certifications-1.mp3',
        estimatedMs: 7988,
      },
    ],
    revisit: {
      text: 'Authenticated training and credential records.',
      audio: '/audio/narration/batman/certifications-revisit.mp3',
      estimatedMs: 4026,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: 'Dossier complete. The evidence is clear—he builds technology that works when it matters.',
        audio: '/audio/narration/batman/contact-1.mp3',
        estimatedMs: 6458,
      },
      {
        text: "Transmit your signal through the encrypted channel below. I'll be watching.",
        audio: '/audio/narration/batman/contact-2.mp3',
        estimatedMs: 5292,
      },
    ],
    revisit: {
      text: 'Encrypted transmission channel open.',
      audio: '/audio/narration/batman/contact-revisit.mp3',
      estimatedMs: 3578,
    },
  },
];
