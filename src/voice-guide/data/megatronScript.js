/**
 * Megatron narration — Decepticon Command.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  NOT FROM THE SPEC. OPTIMUS_PRIME_VOICE_SPEC.md §2 names three personas;
 *  this is a fourth, added as the antagonist counterpart to `optimus`. Same
 *  standing as jarvisScript.js: AUTHORED COPY, not reviewed copy, and it needs
 *  Ashwin's read before it is treated as final.
 *
 *  FACTUAL DISCIPLINE — carried over from optimusScript.js. The menace is in
 *  the delivery, never in the claims. Every fact below is one already verified
 *  against src/data/portfolioData.js for the other three scripts:
 *    · GymVision, real-time human motion tracking ................ verified
 *    · Voice-controlled terminal agent ........................... verified
 *    · Mini-CNN, pure C/C++, zero frameworks, edge ............... verified
 *    · YOLO, OpenCV, PyTorch, C++ inference ...................... verified
 *    · Mechanical B.Tech -> ERP analyst -> MSc AI Engineering ..... verified
 *    · Certification areas, each linking to its verification ...... verified
 *
 *  Nothing here asserts an employer, a metric or an outcome that the other
 *  scripts do not already assert.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Same shape as every other persona: identical section ids in identical order,
 * which is the invariant narrationScript.js asserts at import time in dev.
 *
 * All 21 clips exist under /public/audio/narration/megatron/, rendered by
 * scripts/generate_megatron_audio.py (Edge-TTS en-US-ChristopherNeural at
 * -30Hz / -10%, then a baked bass+treble+flanger chain). AudioFileSource
 * HEAD-probes and plays them; speechSynthesis with the `megatron` profile is
 * only the offline/404 fallback.
 *
 * estimatedMs is MEASURED from those files with ffprobe, not guessed. The
 * audio path ignores it — playback ends on the element's `ended` event — but
 * the caption-only source holds each line for exactly this long, so a stale
 * value makes captions race a voice that is still talking.
 *
 * NOTE on clip length: `projects-1` (16.8 s) and `certifications-1` (14.1 s)
 * run past config.MAX_CLIP_MS. That ceiling exists because Chrome silently
 * cancels long speechSynthesis utterances, so it binds the FALLBACK only — the
 * recorded audio plays in full. Megatron is rendered at rate -10%, which is
 * what pushes these two over where the JARVIS equivalents sat just under. If
 * the fallback ever becomes the primary path, split these two lines rather
 * than speeding the render up.
 *
 * @typedef {import('./narrationScript').NarratedSection} NarratedSection
 */

/** @type {NarratedSection[]} */
export const MEGATRON_NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        text: 'I am Megatron, leader of the Decepticons. You have entered the domain of Ashwin Vignesh.',
        audio: '/audio/narration/megatron/hero-1.mp3',
        estimatedMs: 7608,
      },
      {
        text: 'Do not mistake this for a courtesy. Scroll onward, and I will show you the machines he has built.',
        audio: '/audio/narration/megatron/hero-2.mp3',
        estimatedMs: 7848,
      },
    ],
    revisit: {
      text: 'You return to the beginning. Predictable.',
      audio: '/audio/narration/megatron/hero-revisit.mp3',
      estimatedMs: 4392,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: 'Here stands a conversational intelligence, bound to his portfolio data and compelled to answer.',
        audio: '/audio/narration/megatron/assistant-1.mp3',
        estimatedMs: 6912,
      },
      {
        text: 'Interrogate it. Or feed it a job description, and command it to measure him against your requirements.',
        audio: '/audio/narration/megatron/assistant-2.mp3',
        estimatedMs: 8016,
      },
    ],
    revisit: {
      text: 'The interrogation channel remains open.',
      audio: '/audio/narration/megatron/assistant-revisit.mp3',
      estimatedMs: 3624,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: 'Study his ascent. Mechanical engineering, then enterprise ERP analysis, and now a Master’s in AI Engineering in Germany.',
        audio: '/audio/narration/megatron/roadmap-1.mp3',
        estimatedMs: 10992,
      },
      {
        text: 'Three domains conquered, one purpose behind them — systems that survive outside the laboratory.',
        audio: '/audio/narration/megatron/roadmap-2.mp3',
        estimatedMs: 7248,
      },
    ],
    revisit: {
      text: 'The record of his conquests.',
      audio: '/audio/narration/megatron/roadmap-revisit.mp3',
      estimatedMs: 2904,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        text: 'His arsenal: computer vision with YOLO and OpenCV, PyTorch architectures, and C++ inference engines forged for edge hardware.',
        audio: '/audio/narration/megatron/skills-1.mp3',
        estimatedMs: 11040,
      },
    ],
    revisit: {
      text: 'The arsenal, laid bare.',
      audio: '/audio/narration/megatron/skills-revisit.mp3',
      estimatedMs: 2904,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        text: 'Raw evidence. Commit activity pulled live from his GitHub account, with nothing concealed.',
        audio: '/audio/narration/megatron/github-1.mp3',
        estimatedMs: 7728,
      },
    ],
    revisit: {
      text: 'The evidence stands.',
      audio: '/audio/narration/megatron/github-revisit.mp3',
      estimatedMs: 2544,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        text: 'Behold his war machines. GymVision, tracking human motion in real time. A voice-controlled terminal agent. And a convolutional inference engine written in pure C++, with no frameworks at all.',
        audio: '/audio/narration/megatron/projects-1.mp3',
        estimatedMs: 16752,
      },
      {
        text: 'Each one opens to reveal its stack and its source. Inspect them, if you dare.',
        audio: '/audio/narration/megatron/projects-2.mp3',
        estimatedMs: 6984,
      },
    ],
    revisit: {
      text: 'The war machines await.',
      audio: '/audio/narration/megatron/projects-revisit.mp3',
      estimatedMs: 2616,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: 'Credentials, verified: deep learning, transformer language models, and agent engineering. Every entry links to its proof. I permit no unverified boasts.',
        audio: '/audio/narration/megatron/certifications-1.mp3',
        estimatedMs: 14088,
      },
    ],
    revisit: {
      text: 'Proof, on demand.',
      audio: '/audio/narration/megatron/certifications-revisit.mp3',
      estimatedMs: 2664,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: 'The tour is complete. You have seen what he commands.',
        audio: '/audio/narration/megatron/contact-1.mp3',
        estimatedMs: 5304,
      },
      {
        text: 'The channel below is open — his form, and his direct address. Use it, or be forgotten.',
        audio: '/audio/narration/megatron/contact-2.mp3',
        estimatedMs: 8184,
      },
    ],
    revisit: {
      text: 'The channel remains open.',
      audio: '/audio/narration/megatron/contact-revisit.mp3',
      estimatedMs: 2760,
    },
  },
];
