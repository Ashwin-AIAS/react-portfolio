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
 * @property {NarrationClip} [revisit] Short line on 2nd entry. 3rd+ is silent.
 */

import { PERSONA_IDS, DEFAULT_PERSONA } from '../config';
import {
  getPersona as readStoredPersona,
  setPersona as writeStoredPersona,
} from '../utils/storage';
import { OPTIMUS_NARRATION } from './optimusScript';
import { JARVIS_NARRATION } from './jarvisScript';

/** @type {NarratedSection[]} */
export const NARRATION = [
  {
    id: 'hero',
    order: 0,
    label: 'Hero',
    intro: [
      {
        // Matches the existing welcome bubble copy in AvatarGuide.jsx.
        text: "Hey, I'm Ashwin — welcome. Let me show you around.",
        audio: '/audio/narration/hero-1.mp3',
        estimatedMs: 3200,
      },
      {
        text: "Just scroll, and I'll walk you through it.",
        audio: '/audio/narration/hero-2.mp3',
        estimatedMs: 2600,
      },
    ],
    revisit: {
      text: 'Back at the top.',
      audio: '/audio/narration/hero-revisit.mp3',
      estimatedMs: 1400,
    },
  },
  {
    id: 'assistant',
    order: 1,
    label: 'AI Assistant',
    intro: [
      {
        // "Talk to my Portfolio" + its subtitle, both already on the page.
        text: "This one's my favourite. It's a live AI assistant that knows my portfolio.",
        audio: '/audio/narration/assistant-1.mp3',
        estimatedMs: 4200,
      },
      {
        text: 'Ask it anything about me, or paste a job description and see how I match. Go ahead, try it.',
        audio: '/audio/narration/assistant-2.mp3',
        estimatedMs: 5600,
      },
    ],
    revisit: {
      text: "The assistant's still live if you want to try it.",
      audio: '/audio/narration/assistant-revisit.mp3',
      estimatedMs: 2600,
    },
  },
  {
    id: 'roadmap',
    order: 2,
    label: 'Career Roadmap',
    intro: [
      {
        // Facts here come from portfolioData.personalInfo.bio + careerRoadmap entries.
        text: 'Quick version of how I got here. Mechanical engineering first, then ERP work, now a master’s in AI Engineering in Germany.',
        audio: '/audio/narration/roadmap-1.mp3',
        estimatedMs: 6800,
      },
      {
        // TODO: review — "the same thread" is an interpretation, not a stated fact.
        text: 'Different fields, same thread: building things that actually run.',
        audio: '/audio/narration/roadmap-2.mp3',
        estimatedMs: 3400,
      },
    ],
    revisit: {
      text: 'The roadmap.',
      audio: '/audio/narration/roadmap-revisit.mp3',
      estimatedMs: 1200,
    },
  },
  {
    id: 'skills',
    order: 3,
    label: 'Skills',
    intro: [
      {
        // Deliberately points at the chart rather than listing tools — the radar
        // chart is already on screen and lists them properly.
        text: "The stack I actually work in. Hover the chart if you want the detail.",
        audio: '/audio/narration/skills-1.mp3',
        estimatedMs: 3800,
      },
    ],
    revisit: {
      text: 'Skills again.',
      audio: '/audio/narration/skills-revisit.mp3',
      estimatedMs: 1200,
    },
  },
  {
    id: 'github',
    order: 4,
    label: 'GitHub Activity',
    intro: [
      {
        // TODO: review — placeholder. Section subtitle is "Open source
        // contributions & coding consistency"; no claim made about volume.
        text: "And here's what that looks like day to day, straight from GitHub.",
        audio: '/audio/narration/github-1.mp3',
        estimatedMs: 3600,
      },
    ],
    revisit: {
      text: 'The commit history.',
      audio: '/audio/narration/github-revisit.mp3',
      estimatedMs: 1300,
    },
  },
  {
    id: 'projects',
    order: 5,
    label: 'Projects',
    intro: [
      {
        // TODO: review — "start with the first one" assumes the featured project
        // stays first. Name it explicitly once Ashwin picks the hero project.
        text: 'This is the part I’d look at first. Start with the featured one at the top.',
        audio: '/audio/narration/projects-1.mp3',
        estimatedMs: 4200,
      },
      {
        text: 'Each one opens up with what it does and what I built it with.',
        audio: '/audio/narration/projects-2.mp3',
        estimatedMs: 3800,
      },
    ],
    revisit: {
      text: 'More projects here.',
      audio: '/audio/narration/projects-revisit.mp3',
      estimatedMs: 1400,
    },
  },
  {
    id: 'certifications',
    order: 6,
    label: 'Certifications',
    intro: [
      {
        // TODO: review — placeholder. No issuers named on purpose; the cards
        // below already list them and they change.
        text: 'Courses and certificates I’ve picked up along the way. Every one links out if you want to check it.',
        audio: '/audio/narration/certifications-1.mp3',
        estimatedMs: 5200,
      },
    ],
    revisit: {
      text: 'The certificates.',
      audio: '/audio/narration/certifications-revisit.mp3',
      estimatedMs: 1300,
    },
  },
  {
    id: 'contact',
    order: 7,
    label: 'Contact',
    intro: [
      {
        text: "That's the tour. Thanks for scrolling all the way down.",
        audio: '/audio/narration/contact-1.mp3',
        estimatedMs: 3400,
      },
      {
        // TODO: review — "I'll get back to you" is a commitment; Ashwin's call.
        text: "If you think there's a fit, the form's right here and my email's below. I'll get back to you.",
        audio: '/audio/narration/contact-2.mp3',
        estimatedMs: 5400,
      },
    ],
    revisit: {
      text: 'Get in touch here.',
      audio: '/audio/narration/contact-revisit.mp3',
      estimatedMs: 1400,
    },
  },
];

/* ===========================================================================
   PERSONAS — OPTIMUS_PRIME_VOICE_SPEC.md §2
   ===========================================================================
   The script above is the `ashwin` persona. Two more sit alongside it, each in
   its own module, each covering the SAME section ids in the SAME order. That
   invariant is what lets the engine, useActiveSection and the debug overlay
   stay persona-agnostic — switching voice swaps the copy, never the structure.

   Display metadata (names, badges, speech profiles) deliberately lives in
   ../config.js instead of here: CaptionBubble.jsx is imported eagerly by
   AvatarGuide.jsx, and anything it reaches gets pulled out of the lazy chunk
   (§8). config.js is pure constants; this module imports three scripts.
   =========================================================================== */
/** @type {Record<string, NarratedSection[]>} */
export const PERSONA_SCRIPTS = {
  optimus: OPTIMUS_NARRATION,
  ashwin: NARRATION,
  jarvis: JARVIS_NARRATION,
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
