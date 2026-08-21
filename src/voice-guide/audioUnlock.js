/**
 * One shared AudioContext, unlocked from a real user gesture.
 *
 * Why this lives outside narrationEngine: the engine is in the lazy chunk (§8)
 * and has usually not mounted yet when the visitor clicks through the splash.
 * That click is the only user activation we are guaranteed to get before the
 * hero is on screen, so the context has to be created *there*, synchronously,
 * inside the handler — and handed to the engine whenever it does arrive.
 *
 * EAGER-SAFE, like ./store and ./config: App.jsx imports this before first
 * paint, so nothing here may reach the engine, the sources or the narration
 * scripts. It has no imports at all, and must keep having none.
 *
 * Browsers do keep a "sticky activation" flag once a document has seen any
 * gesture, so an AudioContext built later would usually resume anyway. This
 * module does not rely on that: Safari clears the flag more eagerly than the
 * spec suggests, and a context that is already running when the engine asks
 * for it is one less thing between the click and the first word.
 */

/** @type {AudioContext | null} */
let ctx = null;
let unlocked = false;

/** @returns {AudioContext | null} null until unlockAudio() has run. */
export function getSharedAudioContext() {
  return ctx;
}

/** @returns {boolean} true once the shared context is actually running. */
export function isAudioUnlocked() {
  return unlocked && ctx?.state === 'running';
}

/**
 * Creates and resumes the shared context.
 *
 * MUST be called synchronously from inside a user-gesture handler — a click, a
 * key, a touch. Calling it from a timeout or a promise callback is too late:
 * the activation is gone by then and the context stays suspended.
 *
 * Idempotent. Safe to call on every gesture; only the first does real work.
 *
 * @returns {AudioContext | null} null where Web Audio is unavailable, in which
 * case the speech-synthesis fallback carries the tour on its own.
 */
export function unlockAudio() {
  if (typeof window === 'undefined') return null;

  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;

  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null; // blocked or out of contexts — TTS path needs none of this
    }
  }

  // Playing a zero-length buffer on the gesture is what actually takes iOS
  // Safari off mute; resume() alone leaves it silent but "running" there.
  try {
    const source = ctx.createBufferSource();
    source.buffer = ctx.createBuffer(1, 1, 22050);
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    /* older engines: resume() below is the whole unlock */
  }

  if (ctx.state === 'suspended') {
    // Fire-and-forget: resume() resolves a tick later, and the caller is a
    // gesture handler that must not await anything.
    ctx.resume().then(
      () => {
        unlocked = true;
      },
      () => {
        /* stayed suspended; isAudioUnlocked() keeps reporting false */
      }
    );
  }

  unlocked = ctx.state === 'running';
  return ctx;
}

/**
 * Warms up speechSynthesis in the same gesture.
 *
 * The TTS fallback (sources/SpeechSynthesisSource.js) is what speaks whenever a
 * persona has no recorded clip for a section, and on several engines the first
 * speak() outside a gesture is dropped silently. Pushing one muted, empty
 * utterance through here means the real one later is never the first.
 *
 * Separate from unlockAudio() because they fail independently — a browser with
 * no Web Audio may still have speech, and vice versa.
 */
export function primeSpeechSynthesis() {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') return;

  try {
    const warmup = new window.SpeechSynthesisUtterance('');
    warmup.volume = 0;
    synth.speak(warmup);
    // Some engines leave the queue paused after a backgrounded tab.
    synth.resume();
  } catch {
    /* non-fatal: the fallback still works, it may just need one more gesture */
  }
}
