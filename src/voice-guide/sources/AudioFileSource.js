/**
 * Recorded-audio narration with a real analyser — spec §5.2.
 *
 * HTMLAudioElement -> MediaElementSource -> Analyser -> Gain -> destination.
 * The gain node exists so stop(fadeMs) can ramp instead of cutting.
 */
import {
  FFT_SIZE,
  SMOOTHING_TIME_CONSTANT,
  DEFAULT_PERSONA,
  OPTIMUS_DSP,
} from '../config';
import { rmsFromTimeDomain } from '../utils/amplitude';
import { SOURCE_KIND } from './NarrationSource';

/**
 * Resolves whether an audio file actually exists, without downloading it.
 * Used by the engine to decide between this source and the TTS fallback (§5.1).
 * @param {string} url
 * @param {number} timeoutMs
 */
export async function audioFileExists(url, timeoutMs = 2500) {
  if (typeof fetch === 'undefined') return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return false;
    // A dev server that rewrites unknown paths to index.html will 200 with
    // text/html. Treat anything non-audio as missing.
    const type = res.headers.get('content-type') || '';
    return !type.includes('text/html');
  } catch {
    return false;
  }
}

/**
 * Cybertronian bass and resonance — Optimus spec §4.2.
 *
 * Low-shelf chest rumble -> high-mid presence for metal articulation -> a short
 * feedback comb for the metallic slapback, summed back in parallel.
 *
 * TWO DELIBERATE DEPARTURES FROM THE SPEC LISTING:
 *
 *  1. `destinationNode` is the analyser, not ctx.destination. Wiring straight
 *     to the destination would bypass the gain node, and the gain node is what
 *     stop(fadeMs) ramps — the voice would keep playing through every fade,
 *     mute and section interrupt. It also keeps the mouth reading the signal
 *     that is actually audible.
 *
 *  2. A trim gain sits at the end. +8 dB of shelf plus a parallel comb branch
 *     is enough to clip a normalised recording, and clipping on a voice reads
 *     as buzz, not as bass.
 *
 * Applies only to recorded audio. speechSynthesis output cannot be routed
 * through Web Audio in any current browser, so the TTS fallback gets its
 * character from the voice/rate/pitch profile instead (config.SPEECH_PROFILES).
 *
 * @param {AudioContext} audioContext
 * @param {AudioNode} sourceNode
 * @param {AudioNode} destinationNode
 * @returns {AudioNode[]} the created nodes, so the caller can disconnect them
 */
export function applyOptimusDSP(audioContext, sourceNode, destinationNode) {
  // 1. Heavy low-end sub bass boost (chest resonance).
  const bassBoost = audioContext.createBiquadFilter();
  bassBoost.type = 'lowshelf';
  bassBoost.frequency.value = OPTIMUS_DSP.bassFrequency;
  bassBoost.gain.value = OPTIMUS_DSP.bassGain;

  // 2. High-mid presence filter (metal articulation).
  const presence = audioContext.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = OPTIMUS_DSP.presenceFrequency;
  presence.gain.value = OPTIMUS_DSP.presenceGain;
  presence.Q.value = OPTIMUS_DSP.presenceQ;

  // 3. Subtle metallic comb.
  const delay = audioContext.createDelay(1);
  delay.delayTime.value = OPTIMUS_DSP.combDelaySeconds;

  const feedback = audioContext.createGain();
  feedback.gain.value = OPTIMUS_DSP.combFeedback;

  const combMix = audioContext.createGain();
  combMix.gain.value = OPTIMUS_DSP.combMix;

  const trim = audioContext.createGain();
  trim.gain.value = OPTIMUS_DSP.outputTrim;

  sourceNode.connect(bassBoost);
  bassBoost.connect(presence);
  presence.connect(trim);

  // Parallel comb circuit. feedback -> delay is the loop; combFeedback below 1
  // is what makes it decay instead of ringing forever.
  presence.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(combMix);
  combMix.connect(trim);

  trim.connect(destinationNode);

  return [bassBoost, presence, delay, feedback, combMix, trim];
}

/**
 * @param {() => AudioContext | null} getAudioContext
 * @returns {import('./NarrationSource').NarrationSource & { kind: string }}
 */
export function createAudioFileSource(getAudioContext) {
  /** @type {Map<string, HTMLAudioElement>} */
  const elements = new Map();
  /** @type {Map<HTMLAudioElement, MediaElementAudioSourceNode>} */
  const nodes = new Map();

  let analyser = null;
  let gain = null;
  let personaId = DEFAULT_PERSONA;
  let current = null;
  let rafId = 0;
  let endCallback = null;
  let finished = false;
  const peakRef = { peak: 0.15 };

  const ensureGraph = () => {
    const ctx = getAudioContext();
    if (!ctx) return null;
    if (!analyser) {
      analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
      gain = ctx.createGain();
      gain.gain.value = 1;
      analyser.connect(gain);
      gain.connect(ctx.destination);
    }
    return ctx;
  };

  const getElement = (url) => {
    let el = elements.get(url);
    if (!el) {
      el = new Audio();
      el.src = url;
      el.preload = 'none'; // §5.2 — nothing fetched until we ask
      el.crossOrigin = 'anonymous';
      elements.set(url, el);
    }
    return el;
  };

  const stopLoop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  return {
    kind: SOURCE_KIND.audio,

    /**
     * Selects the DSP routing for clips played from here on (Optimus §4.2).
     * Elements already wired keep their chain — see the routing comment in
     * play() for why that is safe.
     * @param {string} nextPersonaId
     */
    setPersona(nextPersonaId) {
      personaId = nextPersonaId;
    },

    isAvailable() {
      return (
        typeof window !== 'undefined' &&
        typeof window.Audio !== 'undefined' &&
        getAudioContext() !== null
      );
    },

    /** §5.2 preload strategy: only ever called for the *next* section. */
    async prepare(clip) {
      if (!clip?.audio) return;
      const el = getElement(clip.audio);
      if (el.preload !== 'auto') {
        el.preload = 'auto';
        try {
          el.load();
        } catch {
          /* browser will fetch on play instead */
        }
      }
    },

    play(clip, cb) {
      return new Promise((resolve) => {
        const ctx = ensureGraph();
        if (!ctx || !clip.audio) {
          cb.onEnd(false);
          return resolve();
        }

        const el = getElement(clip.audio);
        el.preload = 'auto';
        current = el;
        finished = false;
        endCallback = cb.onEnd;
        peakRef.peak = 0.15;

        // A MediaElementSource can only be created once per element, ever.
        let node = nodes.get(el);
        if (!node) {
          try {
            node = ctx.createMediaElementSource(el);
            // Optimus spec §4.2. Routed once, at creation: the element is
            // cached per URL and the URLs are per-persona, so an element never
            // outlives the persona that owns it and never needs rewiring.
            if (personaId === 'optimus' && OPTIMUS_DSP.enabled) {
              applyOptimusDSP(ctx, node, analyser);
            } else {
              node.connect(analyser);
            }
            nodes.set(el, node);
          } catch {
            cb.onEnd(false);
            return resolve();
          }
        }

        if (gain) {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(1, ctx.currentTime);
        }

        const buffer = new Uint8Array(analyser.frequencyBinCount);

        const settle = (completed) => {
          if (finished) return;
          finished = true;
          stopLoop();
          cb.onAmplitude(0);
          el.onended = null;
          el.onerror = null;
          const end = endCallback;
          endCallback = null;
          end?.(completed);
          resolve();
        };

        el.onended = () => settle(true);
        el.onerror = () => settle(false);

        const loop = () => {
          if (finished) return;
          analyser.getByteTimeDomainData(buffer);
          cb.onAmplitude(rmsFromTimeDomain(buffer, peakRef));
          rafId = requestAnimationFrame(loop);
        };

        // §3.3 / §4.4: always from the beginning, never mid-word.
        el.currentTime = 0;
        const started = el.play();
        if (started && typeof started.catch === 'function') {
          started.catch(() => settle(false));
        }
        rafId = requestAnimationFrame(loop);
      });
    },

    async stop(fadeMs = 0) {
      const ctx = getAudioContext();
      const el = current;
      if (!el) return;

      if (ctx && gain && fadeMs > 0) {
        const now = ctx.currentTime;
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(0.0001, now + fadeMs / 1000);
        } catch {
          /* ramp unavailable — fall through to the pause below */
        }
        await new Promise((r) => setTimeout(r, fadeMs));
      }

      stopLoop();
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        /* element already torn down */
      }

      if (gain && ctx) {
        try {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(1, ctx.currentTime);
        } catch {
          /* restored on next play anyway */
        }
      }

      current = null;
      const end = endCallback;
      endCallback = null;
      finished = true;
      end?.(false);
    },
  };
}
