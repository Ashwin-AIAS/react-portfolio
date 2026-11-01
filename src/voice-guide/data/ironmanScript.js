/**
 * Iron Man (Tony Stark // Mark 85 HUD) narration script.
 *
 * Covers the exact 8 canonical sections in document order (`hero`, `assistant`,
 * `roadmap`, `skills`, `github`, `projects`, `certifications`, `contact`).
 *
 * @typedef {import('./narrationScript').NarratedSection} NarratedSection
 */

/** @type {NarratedSection[]} */
export const IRONMAN_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        text: "Testing, one, two—Mark 85 HUD is live. Tony Stark here, taking a look inside Ashwin Vignesh's engineering stack.",
        audio: '/audio/narration/ironman/hero-1.mp3',
        estimatedMs: 8118,
      },
      {
        text: "Scroll down and keep up. I'll walk you through his autonomous perception rigs, edge C++, and neural deployments.",
        audio: '/audio/narration/ironman/hero-2.mp3',
        estimatedMs: 7641,
      },
    ],
    revisit: {
      text: 'Back at the penthouse console. Arc reactor still humming.',
      audio: '/audio/narration/ironman/hero-revisit.mp3',
      estimatedMs: 3882,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: 'Okay, I respect this—he wired a live conversational AI agent directly into his portfolio telemetry.',
        audio: '/audio/narration/ironman/assistant-1.mp3',
        estimatedMs: 7427,
      },
      {
        text: 'Grill it on his system architecture, or drop a job description in there and watch it run a full capability diagnostic.',
        audio: '/audio/narration/ironman/assistant-2.mp3',
        estimatedMs: 7999,
      },
    ],
    revisit: {
      text: 'Tactical AI terminal is still hot. Go ahead, test it.',
      audio: '/audio/narration/ironman/assistant-revisit.mp3',
      estimatedMs: 4072,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: "Look at the upgrade path: started in mechanical hardware, mastered enterprise automation, and now he's building AI in Germany.",
        audio: '/audio/narration/ironman/roadmap-1.mp3',
        estimatedMs: 8784,
      },
      {
        text: 'Reminds me of going from Mark 1 in a cave to nanotech—every iteration leaner, faster, and built for the real world.',
        audio: '/audio/narration/ironman/roadmap-2.mp3',
        estimatedMs: 8022,
      },
    ],
    revisit: {
      text: 'The Mark-by-Mark career upgrade log.',
      audio: '/audio/narration/ironman/roadmap-revisit.mp3',
      estimatedMs: 2858,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        text: 'Now this is my kind of workshop: YOLO computer vision, PyTorch neural nets, and bare-metal C++ tuned for edge silicon.',
        audio: '/audio/narration/ironman/skills-1.mp3',
        estimatedMs: 8714,
      },
    ],
    revisit: {
      text: 'The core weapons and engineering arsenal.',
      audio: '/audio/narration/ironman/skills-revisit.mp3',
      estimatedMs: 3098,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        text: "Talk is cheap, right? Here's the live GitHub telemetry—real commits, real shipping velocity, zero vaporware.",
        audio: '/audio/narration/ironman/github-1.mp3',
        estimatedMs: 7499,
      },
    ],
    revisit: {
      text: 'Live GitHub commit telemetry on screen.',
      audio: '/audio/narration/ironman/github-revisit.mp3',
      estimatedMs: 3122,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        text: 'Flagship builds: GymVision for real-time biomechanics, his own JARVIS voice agent—flattering, by the way—and a zero-framework C++ CNN engine.',
        audio: '/audio/narration/ironman/projects-1.mp3',
        estimatedMs: 11711,
      },
      {
        text: 'Pop open any card to inspect the schematics, latency numbers, and source code.',
        audio: '/audio/narration/ironman/projects-2.mp3',
        estimatedMs: 5310,
      },
    ],
    revisit: {
      text: 'The Hall of Armor project bay.',
      audio: '/audio/narration/ironman/projects-revisit.mp3',
      estimatedMs: 2573,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: 'Verified credentials across deep learning, transformers, and autonomous agents—every single one backed by cryptographic proof.',
        audio: '/audio/narration/ironman/certifications-1.mp3',
        estimatedMs: 8642,
      },
    ],
    revisit: {
      text: 'Verified clearance and credential vault.',
      audio: '/audio/narration/ironman/certifications-revisit.mp3',
      estimatedMs: 2954,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: "And that's the tour. Look, engineers who can bridge hardware, C++, and modern AI don't sit on the market for long.",
        audio: '/audio/narration/ironman/contact-1.mp3',
        estimatedMs: 8094,
      },
      {
        text: 'Open the comm link below and hire him before I recruit him for Stark R and D.',
        audio: '/audio/narration/ironman/contact-2.mp3',
        estimatedMs: 5429,
      },
    ],
    revisit: {
      text: 'Direct Stark-grade comm link is open below.',
      audio: '/audio/narration/ironman/contact-revisit.mp3',
      estimatedMs: 3122,
    },
  },
];
