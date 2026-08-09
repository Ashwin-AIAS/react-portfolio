/**
 * Recorded-audio narration with a real analyser — spec §5.2.
 *
 * HTMLAudioElement -> MediaElementSource -> Analyser -> Gain -> destination.
 * The gain node exists so stop(fadeMs) can ramp instead of cutting.
 */
import {
  FFT_SIZE,
  SMOOTHING_TIME_CONSTANT,
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
            node.connect(analyser);
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
