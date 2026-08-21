/**
 * Tiny external store shared between the (lazy) engine and the (eager) UI bits.
 *
 * Why this exists: §8 requires the whole voice-guide bundle to be lazy-loaded
 * after first paint, but the caption has to render inside the *existing* avatar
 * bubble, which is eager. A React context can't cross that boundary without
 * pulling the engine eagerly. This module is a few hundred bytes, holds no
 * engine imports, and lets the lazy provider push state to eager consumers.
 *
 * The amplitude level deliberately does NOT live in the React snapshot — it
 * changes every frame and would re-render the tree at 60fps. It is written
 * straight to a CSS custom property (--vg-level) instead, which is also what
 * §6.1 asks for.
 */
import { DEFAULT_PERSONA } from './config';

/**
 * @typedef {Object} VoiceGuideSnapshot
 * @property {boolean} ready     provider mounted; controls are safe to show
 * @property {boolean} enabled   user has unlocked audio
 * @property {string}  machine   narrationEngine STATE value
 * @property {{sectionId: string, text: string, clipIndex: number, total: number} | null} caption
 * @property {string | null} sourceKind
 * @property {string}  persona   active narration persona id
 */

/**
 * Seeded with the compile-time default (DEFAULT_PERSONA, 'ashwin') rather than
 * a localStorage read: this module is eager (the avatar bubble imports it), and
 * reading storage at module scope would run before the provider has decided
 * anything. So the first crest painted is always the creator's, and the
 * provider pushes the persisted value the moment the engine exists.
 *
 * @type {VoiceGuideSnapshot}
 */
let snapshot = {
  ready: false,
  enabled: false,
  machine: 'disabled',
  caption: null,
  sourceKind: null,
  persona: DEFAULT_PERSONA,
};

const listeners = new Set();

/** Actions are installed by the provider once the engine exists. */
let actions = {
  enable: async () => {},
  disable: async () => {},
  toggle: async () => {},
  // No-op until the engine installs the real one — the persona control renders
  // from the eager side and may be clicked before the lazy chunk has landed.
  setPersona: async () => {},
};

function emit() {
  for (const l of listeners) l();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return snapshot;
}

/** SSR: same frozen object every call, so React doesn't loop. */
const serverSnapshot = { ...snapshot };
export function getServerSnapshot() {
  return serverSnapshot;
}

/** @param {Partial<VoiceGuideSnapshot>} patch */
export function setState(patch) {
  let changed = false;
  for (const key of Object.keys(patch)) {
    if (snapshot[key] !== patch[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  snapshot = { ...snapshot, ...patch };
  emit();
}

export function setActions(next) {
  actions = { ...actions, ...next };
}

export function getActions() {
  return actions;
}

// --- amplitude, outside React ------------------------------------------------

let lastLevel = -1;

/**
 * Publishes the current mouth amplitude as a CSS custom property on <html>.
 * Everything visual (mouth scaleY, glow, head bob) reads var(--vg-level).
 * @param {number} level 0..1
 */
export function setLevel(level) {
  if (typeof document === 'undefined') return;
  const rounded = Math.round(Math.min(1, Math.max(0, level)) * 100) / 100;
  if (rounded === lastLevel) return;
  lastLevel = rounded;
  document.documentElement.style.setProperty('--vg-level', String(rounded));
}

export function getLevel() {
  return lastLevel < 0 ? 0 : lastLevel;
}
