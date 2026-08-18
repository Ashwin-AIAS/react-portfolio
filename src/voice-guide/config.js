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

// --- Personas (Optimus spec §2, §4.1, §5) ------------------------------------
/**
 * Persona *metadata* lives here rather than in data/narrationScript.js on
 * purpose. CaptionBubble.jsx is imported eagerly by AvatarGuide.jsx, so any
 * module it touches lands in the initial bundle. config.js is pure constants;
 * the narration scripts are not. Keeping the badge text and speech profiles
 * here lets the eager caption render a persona badge without dragging all
 * three scripts out of the lazy chunk (§8).
 */
export const PERSONA_IDS = ['optimus', 'ashwin', 'jarvis'];

/** Optimus spec §2 marks this as the new default. */
export const DEFAULT_PERSONA = 'optimus';

export const PERSONA_META = {
  optimus: {
    id: 'optimus',
    name: 'Optimus Prime',
    short: 'OPTIMUS PRIME',
    tagline: 'Autobot commander',
    icon: '🤖',
    badge: '[ TRANSMISSION // OPTIMUS PRIME ]',
  },
  ashwin: {
    id: 'ashwin',
    name: 'Ashwin',
    short: 'ASHWIN',
    tagline: 'The creator, first person',
    icon: '🎙️',
    badge: '[ TRANSMISSION // ASHWIN ]',
  },
  jarvis: {
    id: 'jarvis',
    name: 'JARVIS',
    short: 'JARVIS',
    tagline: 'Tactical system diagnostics',
    icon: '⚡',
    badge: '[ TRANSMISSION // JARVIS ]',
  },
};

/**
 * Per-persona speechSynthesis tuning (Optimus spec §4.1).
 *
 * `preferredVoices` is matched against voice.name before any lang fallback:
 * pitch alone does not make a baritone, so the underlying voice has to be a
 * deep male one to begin with. The names are the common Chrome/Edge/macOS
 * identifiers; whichever is present wins, and the lang preference catches
 * everything else.
 */
export const SPEECH_PROFILES = {
  optimus: {
    rate: 0.85,
    pitch: 0.65,
    volume: 1.0,
    preferredVoices: [
      'Google UK English Male',
      'Microsoft David',
      'Microsoft George',
      'Daniel',
      'Arthur',
      'en-US-Neural2-D',
      'en-US-Neural2-J',
    ],
    langPreference: ['en-GB', 'en-US', 'en'],
  },
  ashwin: {
    rate: SPEECH_RATE,
    pitch: SPEECH_PITCH,
    volume: 1.0,
    preferredVoices: [],
    langPreference: VOICE_PREFERENCE,
  },
  jarvis: {
    // Crisp and synthetic rather than deep — slightly quick, slightly bright.
    rate: 1.02,
    pitch: 1.1,
    volume: 1.0,
    preferredVoices: ['Google UK English Male', 'Microsoft George', 'Daniel', 'Arthur'],
    langPreference: ['en-GB', 'en'],
  },
};

/**
 * Web Audio DSP for the Optimus persona (Optimus spec §4.2).
 *
 * Only ever reaches recorded audio: speechSynthesis output cannot be routed
 * through Web Audio, so with no mp3s under /public/audio/narration/optimus/
 * this whole block is inert and the voice comes from SPEECH_PROFILES instead.
 *
 * `enabled` is the switch that matters. The chain assumes a NEUTRAL recording
 * — Edge-TTS, or any deep-but-plain male voice — and gives it the Cybertronian
 * weight. Studio audio that is already the character (an ElevenLabs "Optimus
 * Prime" render, per spec §6) arrives pre-processed, and stacking +8 dB of
 * shelf and a comb on top of it muddies the result. Generate that kind of
 * audio and set `enabled: false`.
 */
export const OPTIMUS_DSP = {
  enabled: true,
  /** Low-shelf chest rumble. */
  bassFrequency: 140, // Hz
  bassGain: 8.0, // dB
  /** Peaking presence for metal articulation. */
  presenceFrequency: 2800, // Hz
  presenceGain: 3.5, // dB
  presenceQ: 1.2,
  /** Metallic slapback. */
  combDelaySeconds: 0.015,
  combFeedback: 0.25,
  /** How much of the comb is summed back in. Spec ran it at unity, which
      buries the dry signal; this keeps it as a sheen. */
  combMix: 0.35,
  /** Headroom for the boosts above, so a normalised file cannot clip. */
  outputTrim: 0.72,
};

/** @returns {typeof SPEECH_PROFILES.optimus} never undefined */
export function getSpeechProfile(personaId) {
  return SPEECH_PROFILES[personaId] ?? SPEECH_PROFILES[DEFAULT_PERSONA];
}

/** @returns {typeof PERSONA_META.optimus} never undefined */
export function getPersonaMeta(personaId) {
  return PERSONA_META[personaId] ?? PERSONA_META[DEFAULT_PERSONA];
}

// --- Storage keys (§7) -------------------------------------------------------
export const STORAGE_KEYS = {
  enabled: 'vg:enabled', // localStorage
  pulseSeen: 'vg:pulse-seen', // localStorage
  visits: 'vg:visits', // sessionStorage
  persona: 'vg:persona', // localStorage (Optimus spec §2)
};

// --- Debug -------------------------------------------------------------------
export const DEBUG_QUERY_PARAM = 'vgdebug';
