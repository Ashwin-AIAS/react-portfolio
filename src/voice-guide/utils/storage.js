/**
 * SSR-safe, throw-safe persistence (spec §7).
 * Safari private mode throws on any Storage access, so every call is wrapped.
 */
import { STORAGE_KEYS, PERSONA_IDS, DEFAULT_PERSONA } from '../config';

const hasWindow = () => typeof window !== 'undefined';

function safeGet(store, key) {
  if (!hasWindow()) return null;
  try {
    return window[store]?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(store, key, value) {
  if (!hasWindow()) return false;
  try {
    window[store]?.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

// --- vg:enabled (localStorage) ----------------------------------------------

/**
 * @returns {boolean} — default TRUE. The tour is opt-out rather than opt-in:
 * a visitor who has never touched the control gets narration, and only an
 * explicit mute — which is the one thing that writes '0' — keeps them silent
 * on the way back. So anything that is not a stored '0' counts as enabled,
 * including the absent value a first-time visitor has.
 *
 * This is a *preference*, not permission to make noise. No audio starts until
 * VoiceGuideProvider sees a real interaction: browsers require a user gesture
 * before an AudioContext will run (§1.3), and this flag never bypasses that.
 */
export function getEnabled() {
  return safeGet('localStorage', STORAGE_KEYS.enabled) !== '0';
}

export function setEnabled(enabled) {
  safeSet('localStorage', STORAGE_KEYS.enabled, enabled ? '1' : '0');
}

// --- vg:persona (localStorage) ----------------------------------------------

/**
 * @returns {string} a persona id that definitely exists. An unknown or absent
 * value falls back to DEFAULT_PERSONA ('ashwin') rather than leaving the engine
 * with a script it cannot resolve — so a first-time visitor, who has nothing
 * stored under vg:persona, previews the creator's own voice.
 */
export function getPersona() {
  const raw = safeGet('localStorage', STORAGE_KEYS.persona);
  return PERSONA_IDS.includes(raw) ? raw : DEFAULT_PERSONA;
}

/** @param {string} personaId ignored unless it is a known persona. */
export function setPersona(personaId) {
  if (!PERSONA_IDS.includes(personaId)) return false;
  return safeSet('localStorage', STORAGE_KEYS.persona, personaId);
}

// --- vg:pulse-seen (localStorage) -------------------------------------------

export function getPulseSeen() {
  return safeGet('localStorage', STORAGE_KEYS.pulseSeen) === '1';
}

export function setPulseSeen() {
  safeSet('localStorage', STORAGE_KEYS.pulseSeen, '1');
}

// --- vg:visits (sessionStorage) ---------------------------------------------
/**
 * @typedef {{ count: number, status: 'partial' | 'completed' }} VisitRecord
 * @typedef {Record<string, VisitRecord>} VisitMap
 */

/** @returns {VisitMap} */
export function getVisits() {
  const raw = safeGet('sessionStorage', STORAGE_KEYS.visits);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** @param {VisitMap} visits */
export function setVisits(visits) {
  try {
    safeSet('sessionStorage', STORAGE_KEYS.visits, JSON.stringify(visits));
  } catch {
    /* quota or serialisation — non-fatal, policy just falls back to "never visited" */
  }
}

/**
 * Bumps the visit counter for a section and records how the visit ended.
 * @param {string} sectionId
 * @param {'partial' | 'completed'} status
 * @returns {VisitMap} the updated map
 */
export function recordVisit(sectionId, status) {
  const visits = getVisits();
  const prev = visits[sectionId];
  visits[sectionId] = {
    count: (prev?.count ?? 0) + 1,
    status,
  };
  setVisits(visits);
  return visits;
}

/**
 * Updates only the status of the most recent visit, without bumping the count.
 * Used when a clip that already counted as a visit finishes or is cut short.
 * @param {string} sectionId
 * @param {'partial' | 'completed'} status
 */
export function updateVisitStatus(sectionId, status) {
  const visits = getVisits();
  if (!visits[sectionId]) {
    visits[sectionId] = { count: 1, status };
  } else {
    visits[sectionId] = { ...visits[sectionId], status };
  }
  setVisits(visits);
  return visits;
}

// --- environment probes ------------------------------------------------------

/** §7: respect Save-Data by starting disabled and never preloading. */
export function isSaveData() {
  if (!hasWindow()) return false;
  try {
    return navigator?.connection?.saveData === true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion() {
  if (!hasWindow() || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** §8: debug overlay is opt-in via ?vgdebug=1 and never on by default. */
export function isDebugEnabled() {
  if (!hasWindow()) return false;
  try {
    return new URLSearchParams(window.location.search).get('vgdebug') === '1';
  } catch {
    return false;
  }
}
