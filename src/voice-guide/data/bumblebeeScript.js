/**
 * Bumblebee (Autobot Scout // Radio-Synth Core) narration script.
 *
 * Covers the exact 8 canonical sections in document order (`hero`, `assistant`,
 * `roadmap`, `skills`, `github`, `projects`, `certifications`, `contact`).
 *
 * @typedef {import('./narrationScript').NarratedSection} NarratedSection
 */

/** @type {NarratedSection[]} */
export const BUMBLEBEE_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        text: "Bzt-chk—Autobot scout Bumblebee locked onto the frequency! Welcome to Ashwin Vignesh's high-voltage portfolio!",
        audio: '/audio/narration/bumblebee/hero-1.mp3',
        estimatedMs: 8278,
      },
      {
        text: "Hit the throttle and scroll down—I'll tune the radio to every AI engine and autonomous build on the track!",
        audio: '/audio/narration/bumblebee/hero-2.mp3',
        estimatedMs: 6698,
      },
    ],
    revisit: {
      text: "Back at the starting line! Engine's still purring!",
      audio: '/audio/narration/bumblebee/hero-revisit.mp3',
      estimatedMs: 3256,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: "Check out this co-pilot! It's a live AI assistant wired straight into Ashwin's neural memory banks.",
        audio: '/audio/narration/bumblebee/assistant-1.mp3',
        estimatedMs: 6279,
      },
      {
        text: 'Fire away with any question, or drop a job description in the slot to see how fast he locks onto your mission!',
        audio: '/audio/narration/bumblebee/assistant-2.mp3',
        estimatedMs: 6698,
      },
    ],
    revisit: {
      text: 'Co-pilot radio link is still loud and clear!',
      audio: '/audio/narration/bumblebee/assistant-revisit.mp3',
      estimatedMs: 3069,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: "Here's the route map: from mechanical gears, to enterprise networks, all the way to Master's-level AI engineering in Germany!",
        audio: '/audio/narration/bumblebee/roadmap-1.mp3',
        estimatedMs: 7999,
      },
      {
        text: 'Talk about a full Cybertronian upgrade—built for speed, precision, and real-world roads.',
        audio: '/audio/narration/bumblebee/roadmap-2.mp3',
        estimatedMs: 5954,
      },
    ],
    revisit: {
      text: 'Cruising past the career route map!',
      audio: '/audio/narration/bumblebee/roadmap-revisit.mp3',
      estimatedMs: 2372,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        text: 'Popping the hood on his tech stack: YOLO computer vision, PyTorch neural networks, and turbo-charged C++ for edge hardware!',
        audio: '/audio/narration/bumblebee/skills-1.mp3',
        estimatedMs: 8278,
      },
    ],
    revisit: {
      text: 'Under the hood: full capability specs!',
      audio: '/audio/narration/bumblebee/skills-revisit.mp3',
      estimatedMs: 2744,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        text: 'Look at that radar pulse! Live GitHub commits streaming straight from his workshop in real time.',
        audio: '/audio/narration/bumblebee/github-1.mp3',
        estimatedMs: 5767,
      },
    ],
    revisit: {
      text: 'Live GitHub telemetry radar is pinging!',
      audio: '/audio/narration/bumblebee/github-revisit.mp3',
      estimatedMs: 2907,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        text: 'Here are the heavy hitters: GymVision real-time pose tracking, the JARVIS voice agent, and a pure C++ neural engine built from scratch!',
        audio: '/audio/narration/bumblebee/projects-1.mp3',
        estimatedMs: 9743,
      },
      {
        text: 'Tap any build to pop the schematics and check out the source code!',
        audio: '/audio/narration/bumblebee/projects-2.mp3',
        estimatedMs: 4000,
      },
    ],
    revisit: {
      text: 'Back in the main project garage!',
      audio: '/audio/narration/bumblebee/projects-revisit.mp3',
      estimatedMs: 2349,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: 'Official Autobot-grade badges in deep learning, transformers, and AI agents—every single one verified!',
        audio: '/audio/narration/bumblebee/certifications-1.mp3',
        estimatedMs: 7348,
      },
    ],
    revisit: {
      text: 'Verified badge and credential rack!',
      audio: '/audio/narration/bumblebee/certifications-revisit.mp3',
      estimatedMs: 2721,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: "That's the whole circuit! Ashwin's systems are primed and ready to roll out on your next big mission.",
        audio: '/audio/narration/bumblebee/contact-1.mp3',
        estimatedMs: 6023,
      },
      {
        text: "Send a transmission through the beacon below—let's team up and build something legendary!",
        audio: '/audio/narration/bumblebee/contact-2.mp3',
        estimatedMs: 5371,
      },
    ],
    revisit: {
      text: 'Comms beacon is open—send the signal!',
      audio: '/audio/narration/bumblebee/contact-revisit.mp3',
      estimatedMs: 2930,
    },
  },
];
