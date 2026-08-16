/**
 * The narration source interface — spec §5.1.
 *
 * JSDoc rather than a TS interface because this repo has no TypeScript
 * toolchain (see docs/voice-guide/DISCOVERY.md §1). The shape is exactly the
 * one in the spec.
 *
 * @typedef {import('../data/narrationScript').NarrationClip} NarrationClip
 *
 * @typedef {Object} PlayCallbacks
 * @property {(level: number) => void} onAmplitude  0..1, called per rAF
 * @property {(charIndex: number) => void} [onWord] optional caption highlight
 * @property {(completed: boolean) => void} onEnd   completed=false when interrupted
 *
 * @typedef {Object} NarrationSource
 * @property {() => boolean} isAvailable
 * @property {(clip: NarrationClip) => Promise<void>} prepare
 * @property {(clip: NarrationClip, cb: PlayCallbacks) => Promise<void>} play
 * @property {(fadeMs: number) => Promise<void>} stop
 */

export const SOURCE_KIND = {
  audio: 'audio-file',
  speech: 'speech-synthesis',
  captions: 'captions-only',
};

/**
 * Caption-only source — the last resort (§5.1). Emits no sound and no
 * amplitude, holds the caption for the clip's estimated duration, then ends.
 * Guarantees the engine never crashes when neither audio nor TTS is available.
 *
 * @returns {NarrationSource & { kind: string }}
 */
export function createCaptionOnlySource() {
  let timer = null;
  let activeEnd = null;

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    kind: SOURCE_KIND.captions,
    isAvailable: () => true,
    prepare: async () => {},
    play(clip, cb) {
      return new Promise((resolve) => {
        clear();
        cb.onAmplitude(0);
        activeEnd = cb.onEnd;
        const holdMs = clip.estimatedMs ?? 3000;
        timer = setTimeout(() => {
          timer = null;
          activeEnd = null;
          cb.onEnd(true);
          resolve();
        }, holdMs);
      });
    },
    async stop() {
      clear();
      if (activeEnd) {
        const end = activeEnd;
        activeEnd = null;
        end(false);
      }
    },
  };
}
