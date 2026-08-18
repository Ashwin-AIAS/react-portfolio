/**
 * Zero-asset narration via the Web Speech API — spec §5.3.
 *
 * Built before AudioFileSource on purpose: it makes the whole feature testable
 * today, with no mp3s in the repo.
 *
 * There is no analyser for speechSynthesis output, so amplitude is *synthesised*
 * from `onboundary` word events driving an attack/decay envelope.
 */
import {
  VOICE_PREFERENCE,
  ENVELOPE_ATTACK_MS,
  ENVELOPE_PEAK_BASE,
  ENVELOPE_PEAK_JITTER,
  ENVELOPE_FLOOR,
  ESTIMATED_WORD_MS,
  DEFAULT_PERSONA,
  getSpeechProfile,
} from '../config';
import { createEnvelope } from '../utils/amplitude';
import { SOURCE_KIND } from './NarrationSource';

const hasSpeech = () =>
  typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  typeof window.SpeechSynthesisUtterance !== 'undefined';

/**
 * Voice list loads asynchronously in Chrome. Resolves with whatever is
 * available, giving up quickly rather than delaying speech.
 */
function loadVoices(timeoutMs = 1000) {
  return new Promise((resolve) => {
    if (!hasSpeech()) return resolve([]);

    const existing = window.speechSynthesis.getVoices();
    if (existing.length) return resolve(existing);

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = done;
    setTimeout(done, timeoutMs);
  });
}

/**
 * Picks a voice for a persona.
 *
 * Named voices come first (Optimus spec §4.1): pitch 0.65 applied to a female
 * or a thin synthetic voice does not read as a baritone, it reads as a slowed
 * tape. Matching 'Microsoft David' or 'Google UK English Male' by name is what
 * actually gets the timbre; the lang preference is only the fallback for
 * machines that have none of them.
 *
 * Name matching is loose and case-insensitive because platforms decorate the
 * strings differently — Chrome reports 'Google UK English Male', Edge reports
 * 'Microsoft David - English (United States)'.
 *
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} [personaId]
 */
export function pickVoice(voices, personaId = DEFAULT_PERSONA) {
  if (!voices || !voices.length) return null;

  const profile = getSpeechProfile(personaId);

  for (const wanted of profile.preferredVoices ?? []) {
    const needle = wanted.toLowerCase();
    const hit = voices.find((v) => v.name?.toLowerCase().includes(needle));
    if (hit) return hit;
  }

  const langs = profile.langPreference ?? VOICE_PREFERENCE;
  for (const pref of langs) {
    const exact = voices.find((v) => v.lang?.replace('_', '-') === pref);
    if (exact) return exact;
  }
  for (const pref of langs) {
    const loose = voices.find((v) => v.lang?.replace('_', '-').startsWith(pref));
    if (loose) return loose;
  }
  return voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ?? null;
}

/**
 * @returns {import('./NarrationSource').NarrationSource & { kind: string }}
 */
export function createSpeechSynthesisSource() {
  let voice = null;
  let voicesLoaded = false;
  /** Cached so a persona switch can re-pick without re-awaiting the voice list. */
  let availableVoices = [];
  let personaId = DEFAULT_PERSONA;
  let utterance = null;
  let rafId = 0;
  let envelope = null;
  let endCallback = null;
  let finished = false;

  const stopLoop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const cleanup = () => {
    stopLoop();
    if (utterance) {
      utterance.onend = null;
      utterance.onerror = null;
      utterance.onboundary = null;
      utterance = null;
    }
    envelope = null;
  };

  return {
    kind: SOURCE_KIND.speech,

    isAvailable() {
      if (!hasSpeech()) return false;
      // Some hardened browsers expose the object but no voices at all; treat
      // "loaded and empty" as unavailable so the engine falls through to
      // captions-only instead of playing silence.
      if (voicesLoaded) return voice !== null;
      return true;
    },

    /**
     * Switches the speech profile (Optimus spec §4.1). Re-picks from the
     * already-loaded voice list, because the preferred *name* differs per
     * persona, not just the pitch.
     * @param {string} nextPersonaId
     */
    setPersona(nextPersonaId) {
      if (nextPersonaId === personaId) return;
      personaId = nextPersonaId;
      if (voicesLoaded) voice = pickVoice(availableVoices, personaId);
    },

    async prepare() {
      if (!hasSpeech()) return;
      if (!voicesLoaded) {
        availableVoices = await loadVoices();
        voice = pickVoice(availableVoices, personaId);
        voicesLoaded = true;
      }
    },

    play(clip, cb) {
      return new Promise((resolve) => {
        if (!hasSpeech()) {
          cb.onEnd(false);
          return resolve();
        }

        // Clear anything the browser still has queued. speechSynthesis has a
        // real internal queue and we must never use it (§4.3).
        window.speechSynthesis.cancel();

        finished = false;
        endCallback = cb.onEnd;

        utterance = new window.SpeechSynthesisUtterance(clip.text);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }
        // Optimus spec §4.1 — rate 0.85 / pitch 0.65 for the commander, the
        // original 0.95 / 1.0 for Ashwin, brighter and quicker for JARVIS.
        const profile = getSpeechProfile(personaId);
        utterance.rate = profile.rate;
        utterance.pitch = profile.pitch;
        utterance.volume = profile.volume ?? 1;

        envelope = createEnvelope({
          attackMs: ENVELOPE_ATTACK_MS,
          peakBase: ENVELOPE_PEAK_BASE,
          peakJitter: ENVELOPE_PEAK_JITTER,
          floor: ENVELOPE_FLOOR,
        });

        // Estimate per-word duration from the clip's own length so the envelope
        // roughly tracks the real cadence.
        const wordCount = Math.max(1, clip.text.trim().split(/\s+/).length);
        const perWordMs = clip.estimatedMs
          ? Math.max(120, clip.estimatedMs / wordCount)
          : ESTIMATED_WORD_MS;

        utterance.onboundary = (event) => {
          if (event.name === 'word' || event.name === undefined) {
            envelope?.trigger(perWordMs);
            cb.onWord?.(event.charIndex ?? 0);
          }
        };

        const settle = (completed) => {
          if (finished) return;
          finished = true;
          stopLoop();
          cb.onAmplitude(0);
          const end = endCallback;
          endCallback = null;
          cleanup();
          end?.(completed);
          resolve();
        };

        utterance.onend = () => settle(true);
        utterance.onerror = (e) => {
          // 'interrupted'/'canceled' are our own stop() calls, not failures.
          const interrupted = e?.error === 'interrupted' || e?.error === 'canceled';
          settle(interrupted ? false : true);
        };

        const loop = () => {
          if (finished) return;
          cb.onAmplitude(envelope ? envelope.value() : 0);
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        window.speechSynthesis.speak(utterance);
      });
    },

    async stop() {
      if (!hasSpeech()) return;
      // There is no gain node to ramp, so the "fade" is simply an immediate
      // cancel plus a zeroed amplitude. Kept async to match the interface and
      // so callers can await it before starting the next clip (§5.4).
      stopLoop();
      envelope?.stop();
      const end = endCallback;
      endCallback = null;
      finished = true;
      window.speechSynthesis.cancel();
      cleanup();
      end?.(false);
    },
  };
}

/** §5.3: cancel on unmount and beforeunload, or Chrome keeps talking. */
export function installSpeechCleanup() {
  if (!hasSpeech()) return () => {};
  const cancel = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* nothing useful to do */
    }
  };
  window.addEventListener('beforeunload', cancel);
  window.addEventListener('pagehide', cancel);
  return () => {
    cancel();
    window.removeEventListener('beforeunload', cancel);
    window.removeEventListener('pagehide', cancel);
  };
}
