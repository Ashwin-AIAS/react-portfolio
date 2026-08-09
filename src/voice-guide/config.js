/**
 * Voice guide tuning constants — spec §8.
 * Every magic number the feature depends on lives here so it can be tuned in one place.
 * The ?vgdebug=1 overlay shows the live values these produce.
 */

// --- Section commit (§4.3) ---------------------------------------------------
/** A candidate must hold continuously for this long before it commits. */
export const SETTLE_MS = 350;
/** Above this scroll speed (px/s) nothing commits and nothing speaks. */
export const FAST_SCROLL = 900;
/** Below this speed (px/s) the page counts as "settled". */
export const SETTLED_VELOCITY = 60;
/** Quiet gap after a clip finishes naturally before the engine will speak again. */
export const COOLDOWN_MS = 600;

// --- Scroll tracking (§4.1) --------------------------------------------------
/** EMA smoothing factor for velocity. Higher = twitchier. */
export const VELOCITY_SMOOTHING = 0.2;
/** Direction won't flip until the scroll moves more than this many px. */
export const DIRECTION_DEADZONE_PX = 4;
/** No movement for this long => direction 'idle'. */
export const IDLE_AFTER_MS = 120;

// --- IntersectionObserver (§4.2) ---------------------------------------------
export const OBSERVER_THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1];
/** Biases toward the section in the upper-middle of the viewport. */
export const OBSERVER_ROOT_MARGIN = '-15% 0px -40% 0px';

// --- Fades (§3.3, §5.4) ------------------------------------------------------
/** Fade when one section interrupts another. */
export const FADE_INTERRUPT_MS = 250;
/** Fade when the user mutes. */
export const FADE_MUTE_MS = 200;
/** Caption crossfade (§6.2). */
export const CAPTION_CROSSFADE_MS = 150;

// --- Amplitude / mouth (§6.1) ------------------------------------------------
/** Fast open. */
export const AMP_ATTACK = 0.5;
/** Slower close — this is what makes it read as a mouth. */
export const AMP_RELEASE = 0.18;
/** RMS below this emits 0 so the mouth fully closes between words. */
export const SILENCE_GATE = 0.02;
/** Mouth openness at amplitude 0 and 1. */
export const MOUTH_MIN_SCALE = 0.12;
export const MOUTH_MAX_SCALE = 1.0;
/** Sprite-frame thresholds, unused with the current static-PNG avatar. */
export const MOUTH_FRAME_THRESHOLDS = { half: 0.15, open: 0.45 };

// --- Audio analysis (§5.2) ---------------------------------------------------
export const FFT_SIZE = 256;
export const SMOOTHING_TIME_CONSTANT = 0.6;

// --- Speech synthesis (§5.3) -------------------------------------------------
export const SPEECH_RATE = 0.95;
export const SPEECH_PITCH = 1.0;
export const VOICE_PREFERENCE = ['en-IN', 'en-GB', 'en'];
/** Chrome kills utterances around 15s; keep clips under this. */
export const MAX_CLIP_MS = 12000;
/** Synthesised envelope for the speech fallback. */
export const ENVELOPE_ATTACK_MS = 60;
export const ENVELOPE_PEAK_BASE = 0.7;
export const ENVELOPE_PEAK_JITTER = 0.3;
export const ENVELOPE_FLOOR = 0.1;
/** Fallback word duration when onboundary gives us nothing to go on. */
export const ESTIMATED_WORD_MS = 320;

// --- Storage keys (§7) -------------------------------------------------------
export const STORAGE_KEYS = {
  enabled: 'vg:enabled', // localStorage
  pulseSeen: 'vg:pulse-seen', // localStorage
  visits: 'vg:visits', // sessionStorage
};

// --- Debug -------------------------------------------------------------------
export const DEBUG_QUERY_PARAM = 'vgdebug';
