/**
 * Amplitude smoothing and gating — spec §5.2 / §6.1.
 */
import {
  AMP_ATTACK,
  AMP_RELEASE,
  SILENCE_GATE,
  MOUTH_MIN_SCALE,
  MOUTH_MAX_SCALE,
} from '../config';

/**
 * Asymmetric lerp: fast open, slower close. That asymmetry is what makes the
 * overlay read as a mouth instead of a flickering shape.
 *
 * @param {number} current
 * @param {number} target
 * @returns {number}
 */
export function smoothAmplitude(current, target) {
  const factor = target > current ? AMP_ATTACK : AMP_RELEASE;
  return current + (target - current) * factor;
}

/**
 * RMS of a byte time-domain buffer, normalised against a running peak.
 * Returns 0 below the silence gate so the mouth fully closes between words.
 *
 * @param {Uint8Array} buffer  getByteTimeDomainData output (128 = silence)
 * @param {{ peak: number }} peakRef  mutated in place; carries the running peak
 * @returns {number} 0..1
 */
export function rmsFromTimeDomain(buffer, peakRef) {
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    const sample = (buffer[i] - 128) / 128; // -1..1
    sumSquares += sample * sample;
  }
  const rms = Math.sqrt(sumSquares / buffer.length);

  if (rms < SILENCE_GATE) return 0;

  // Track a decaying peak so quiet recordings still open the mouth fully and a
  // single loud transient doesn't flatten everything after it.
  peakRef.peak = Math.max(rms, peakRef.peak * 0.995);
  const normalised = peakRef.peak > 0 ? rms / peakRef.peak : 0;

  return Math.min(1, Math.max(0, normalised));
}

/**
 * Maps a 0..1 amplitude onto the mouth's scaleY range.
 * @param {number} level
 */
export function levelToMouthScale(level) {
  const clamped = Math.min(1, Math.max(0, level));
  return MOUTH_MIN_SCALE + (MOUTH_MAX_SCALE - MOUTH_MIN_SCALE) * clamped;
}

/**
 * Envelope generator for the speech-synthesis fallback (§5.3). No analyser is
 * possible there, so word boundaries drive a synthetic attack/decay that reads
 * convincingly as speech.
 */
export function createEnvelope({
  attackMs,
  peakBase,
  peakJitter,
  floor,
}) {
  let startedAt = 0;
  let peak = 0;
  let wordMs = 0;
  let active = false;

  return {
    /** Call on each word boundary. */
    trigger(estimatedWordMs) {
      startedAt = performance.now();
      peak = peakBase + Math.random() * peakJitter;
      wordMs = Math.max(attackMs + 40, estimatedWordMs);
      active = true;
    },
    /** Call per rAF. @returns {number} 0..1 */
    value() {
      if (!active) return 0;
      const elapsed = performance.now() - startedAt;

      if (elapsed < attackMs) {
        return (elapsed / attackMs) * peak;
      }

      const decayMs = wordMs - attackMs;
      const decayProgress = (elapsed - attackMs) / decayMs;
      if (decayProgress >= 1) {
        active = false;
        return 0;
      }
      return peak + (floor - peak) * decayProgress;
    },
    stop() {
      active = false;
    },
  };
}
