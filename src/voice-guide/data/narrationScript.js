/**
 * The section registry — single source of truth for the voice guide (spec §3.2, §9).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER COPY — NEEDS ASHWIN'S REVIEW BEFORE ANYTHING IS RECORDED.
 *
 *  Every line below is either lifted from copy already on the page or written to
 *  be deliberately vague. No claims about employers, results, metrics, or project
 *  outcomes have been invented. Lines marked `// TODO: review` are the ones where
 *  wording was guessed and should be rewritten in Ashwin's own voice.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Keep every clip under ~12 s of speech (config.MAX_CLIP_MS) — Chrome silently
 * cancels longer speechSynthesis utterances. Split into multiple clips instead.
 *
 * @typedef {Object} NarrationClip
 * @property {string}  text          Caption text. Always shown, in every state.
 * @property {string} [audio]        /audio/narration/<file>.mp3 — optional.
 * @property {number} [estimatedMs]  Hint for the SpeechSynthesis fallback only.
 *
 * @typedef {Object} NarratedSection
 * @property {string} id             Must match the DOM element id.
 * @property {number} order          Document order, 0-based.
 * @property {string} label          Human name, for the debug overlay.
 * @property {NarrationClip[]} intro Played on first meaningful entry.
 * @property {NarrationClip} [revisit] Short line played on EVERY return to the
 *   section, not just the second — this is what carries a visitor scrolling
 *   back up the page. Omit it and the section replays its full intro instead.
 */

import { PERSONA_IDS, DEFAULT_PERSONA } from '../config';
import {
  getPersona as readStoredPersona,
  setPersona as writeStoredPersona,
} from '../utils/storage';
import { OPTIMUS_NARRATION } from './optimusScript';
import { JARVIS_NARRATION } from './jarvisScript';
import { MEGATRON_NARRATION } from './megatronScript';

/** @type {NarratedSection[]} */
export const NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        text: "Hey, I'm Ashwin — welcome! Let me show you around.",
        audio: '/audio/narration/ashwin/hero-1.mp3',
        estimatedMs: 4488,
      },
      {
        text: "Just scroll, and I'll walk you through my autonomous systems and AI engineering deployments.",
        audio: '/audio/narration/ashwin/hero-2.mp3',
        estimatedMs: 5304,
      },
    ],
    revisit: {
      text: 'Back at the top console.',
      audio: '/audio/narration/ashwin/hero-revisit.mp3',
      estimatedMs: 1824,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        text: "This is one of my favorite builds. It's a live, portfolio-aware conversational AI assistant.",
        audio: '/audio/narration/ashwin/assistant-1.mp3',
        estimatedMs: 6048,
      },
      {
        text: 'Ask it anything about my architecture, or paste in a job description and test my skill match assessment.',
        audio: '/audio/narration/ashwin/assistant-2.mp3',
        estimatedMs: 6336,
      },
    ],
    revisit: {
      text: 'The portfolio assistant is still live and ready.',
      audio: '/audio/narration/ashwin/assistant-revisit.mp3',
      estimatedMs: 3168,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        text: "Here's the trajectory of how I got here: mechanical engineering first, then enterprise automation, and now a Master's in AI Engineering in Germany.",
        audio: '/audio/narration/ashwin/roadmap-1.mp3',
        estimatedMs: 8568,
      },
      {
        text: 'Across all three fields, one constant drive: building high-performance systems that thrive outside the lab.',
        audio: '/audio/narration/ashwin/roadmap-2.mp3',
        estimatedMs: 6744,
      },
    ],
    revisit: {
      text: 'The career trajectory roadmap.',
      audio: '/audio/narration/ashwin/roadmap-revisit.mp3',
      estimatedMs: 2280,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        text: 'Here is my core technical stack: real-time computer vision with YOLO and OpenCV, PyTorch neural architectures, and C++ inference optimized for edge hardware.',
        audio: '/audio/narration/ashwin/skills-1.mp3',
        estimatedMs: 10536,
      },
    ],
    revisit: {
      text: 'The technical capability stack.',
      audio: '/audio/narration/ashwin/skills-revisit.mp3',
      estimatedMs: 2304,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        text: 'And here is what relentless execution looks like day-to-day, pulled live from my GitHub telemetry.',
        audio: '/audio/narration/ashwin/github-1.mp3',
        estimatedMs: 6168,
      },
    ],
    revisit: {
      text: 'The live GitHub commit activity feed.',
      audio: '/audio/narration/ashwin/github-revisit.mp3',
      estimatedMs: 2808,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        text: 'Here are my flagship deployments: GymVision for real-time biomechanics; JARVIS, an autonomous voice agent; and zero-framework C++ CNN inference engines.',
        audio: '/audio/narration/ashwin/projects-1.mp3',
        estimatedMs: 11304,
      },
      {
        text: 'Each project expands to show the architecture, tech stack, and source repository.',
        audio: '/audio/narration/ashwin/projects-2.mp3',
        estimatedMs: 5376,
      },
    ],
    revisit: {
      text: 'The project deployment gallery.',
      audio: '/audio/narration/ashwin/projects-revisit.mp3',
      estimatedMs: 2232,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        text: 'Verified credentials across deep learning, transformer models, and autonomous AI agents. Every entry links out to its official verification.',
        audio: '/audio/narration/ashwin/certifications-1.mp3',
        estimatedMs: 9168,
      },
    ],
    revisit: {
      text: 'The verified certifications registry.',
      audio: '/audio/narration/ashwin/certifications-revisit.mp3',
      estimatedMs: 2880,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: 'That wraps up the walkthrough! Thanks for exploring my portfolio.',
        audio: '/audio/narration/ashwin/contact-1.mp3',
        estimatedMs: 4464,
      },
      {
        text: "If you'd like to collaborate or have an exciting role, drop a message in the form or email me directly below. Let's connect!",
        audio: '/audio/narration/ashwin/contact-2.mp3',
        estimatedMs: 7392,
      },
    ],
    revisit: {
      text: 'The communication channels are open.',
      audio: '/audio/narration/ashwin/contact-revisit.mp3',
      estimatedMs: 2352,
    },
  },
];

/* ===========================================================================
   PERSONAS — OPTIMUS_PRIME_VOICE_SPEC.md §2
   ===========================================================================
   The script above is the `ashwin` persona. Three more sit alongside it, each in
   its own module, each covering the SAME section ids in the SAME order. That
   invariant is what lets the engine, useActiveSection and the debug overlay
   stay persona-agnostic — switching voice swaps the copy, never the structure.

   Display metadata (names, badges, speech profiles) deliberately lives in
   ../config.js instead of here: CaptionBubble.jsx is imported eagerly by
   AvatarGuide.jsx, and anything it reaches gets pulled out of the lazy chunk
   (§8). config.js is pure constants; this module imports the other scripts.
   =========================================================================== */
/** @type {Record<string, NarratedSection[]>} */
export const PERSONA_SCRIPTS = {
  optimus: OPTIMUS_NARRATION,
  ashwin: NARRATION,
  jarvis: JARVIS_NARRATION,
  megatron: MEGATRON_NARRATION,
};

/**
 * Canonical document order. Taken from the `ashwin` script because it is the
 * one that shipped first; every persona is asserted against it below.
 */
export const SECTION_IDS = NARRATION.map((s) => s.id);

// Structural guard. A persona whose ids drift out of sync would fail silently
// at runtime — sections would simply never speak — so surface it at import
// time in dev instead. Stripped from production builds by the bundler.
if (import.meta.env.DEV) {
  for (const id of PERSONA_IDS) {
    const script = PERSONA_SCRIPTS[id];
    if (!script) {
      console.error(`[voice-guide] persona "${id}" has no script registered`);
      continue;
    }
    const ids = script.map((s) => s.id).join(',');
    if (ids !== SECTION_IDS.join(',')) {
      console.error(
        `[voice-guide] persona "${id}" section ids do not match the canonical order.\n` +
          `  expected: ${SECTION_IDS.join(',')}\n` +
          `  actual:   ${ids}`
      );
    }
  }
}

/**
 * Active persona, mirrored in memory so every getSection() call is not a
 * localStorage read. Seeded from storage on first use.
 * @type {string | null}
 */
let activePersona = null;

/** @returns {string} the active persona id, always one of PERSONA_IDS. */
export function getActivePersona() {
  if (activePersona === null) activePersona = readStoredPersona();
  return activePersona;
}

/**
 * Switches persona and persists it. Callers are responsible for stopping any
 * in-flight speech first — narrationEngine.setPersona() does that.
 * @param {string} personaId
 * @returns {boolean} false if the id is unknown, in which case nothing changed
 */
export function setActivePersona(personaId) {
  if (!PERSONA_IDS.includes(personaId)) return false;
  activePersona = personaId;
  writeStoredPersona(personaId);
  return true;
}

/** @returns {NarratedSection[]} the active persona's script. */
export function getActiveScript() {
  return PERSONA_SCRIPTS[getActivePersona()] ?? PERSONA_SCRIPTS[DEFAULT_PERSONA];
}

/**
 * Fast lookup by id, for the `ashwin` script only.
 * @deprecated Prefer getSection(), which follows the active persona. Kept
 * because it is part of the module's published surface.
 */
export const NARRATION_BY_ID = NARRATION.reduce((acc, section) => {
  acc[section.id] = section;
  return acc;
}, /** @type {Record<string, NarratedSection>} */ ({}));

/** The section the intro fires from on audio unlock (§4.5). */
export const HERO_SECTION_ID = 'hero';

/**
 * Resolves against the ACTIVE persona, so the engine needs no persona
 * awareness of its own beyond telling us when it changes.
 * @returns {NarratedSection | undefined}
 */
export function getSection(id) {
  return getActiveScript().find((s) => s.id === id);
}

/** @returns {string | undefined} the next section in document order */
export function getNextSectionId(id) {
  const i = SECTION_IDS.indexOf(id);
  return i === -1 ? undefined : SECTION_IDS[i + 1];
}
