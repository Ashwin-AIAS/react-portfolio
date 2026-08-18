/**
 * Narration state machine and policy — spec §3.3, §4.4, §5.1, §5.4.
 *
 * Framework-agnostic on purpose: the provider owns React state, this owns the
 * decisions. States: disabled -> armed -> speaking -> settling -> armed,
 * plus suspended for hidden tabs.
 *
 * THERE IS NO QUEUE IN THIS FILE (§4.3, §12). The engine only ever looks at the
 * section that is committed *right now*. When it becomes free it re-evaluates
 * the present, it never replays a backlog.
 */
import {
  COOLDOWN_MS,
  FADE_INTERRUPT_MS,
  FADE_MUTE_MS,
  FAST_SCROLL,
} from './config';
import {
  getSection,
  getNextSectionId,
  HERO_SECTION_ID,
  getActivePersona,
  setActivePersona,
} from './data/narrationScript';
import {
  getVisits,
  recordVisit,
  updateVisitStatus,
  setEnabled,
  isSaveData,
} from './utils/storage';
import { createSpeechSynthesisSource } from './sources/SpeechSynthesisSource';
import { createAudioFileSource, audioFileExists } from './sources/AudioFileSource';
import { createCaptionOnlySource } from './sources/NarrationSource';

export const STATE = {
  disabled: 'disabled',
  armed: 'armed',
  speaking: 'speaking',
  settling: 'settling',
  suspended: 'suspended',
};

/**
 * Decides what a section should say, given its visit history (§4.4).
 * Pure — exported so the behaviour is inspectable and testable.
 *
 * @param {string} sectionId
 * @param {Record<string, {count:number,status:string}>} visits
 * @param {number} velocity
 * @returns {{ action: 'intro'|'revisit'|'silent'|'suppressed', clips: any[] }}
 */
export function decideNarration(sectionId, visits, velocity) {
  if (velocity >= FAST_SCROLL) return { action: 'suppressed', clips: [] };

  const section = getSection(sectionId);
  if (!section) return { action: 'silent', clips: [] };

  const record = visits[sectionId];

  // Never visited, or they scrolled away mid-clip last time: full intro.
  if (!record || record.status === 'partial') {
    return { action: 'intro', clips: section.intro ?? [] };
  }

  // Heard it through once: short revisit line if there is one.
  if (record.status === 'completed' && record.count === 1) {
    return section.revisit
      ? { action: 'revisit', clips: [section.revisit] }
      : { action: 'silent', clips: [] };
  }

  // Third time onward: captions only.
  return { action: 'silent', clips: [] };
}

/**
 * @param {Object} handlers
 * @param {(state: string) => void} handlers.onState
 * @param {(level: number) => void} handlers.onAmplitude
 * @param {(caption: {sectionId: string, text: string, clipIndex: number, total: number} | null) => void} handlers.onCaption
 * @param {(kind: string | null) => void} [handlers.onSourceKind]
 * @param {(persona: string) => void} [handlers.onPersona]
 */
export function createNarrationEngine(handlers) {
  const { onState, onAmplitude, onCaption, onSourceKind, onPersona } = handlers;

  let state = STATE.disabled;
  let audioContext = null;

  // Monotonic guard (§5.4). Any callback carrying a stale token is discarded,
  // which is what stops two voices talking over each other.
  let playToken = 0;

  let committedSectionId = null;
  let speakingSectionId = null;
  /**
   * Whether we have already acted on the *current* commit of
   * committedSectionId — spoken it, or decided it should be silent.
   *
   * A section acts once per commit. Without this, finishing a clip and
   * dropping back to `armed` re-evaluates the section that is still committed,
   * finds it now marked completed/count:1, and immediately plays its revisit
   * line — so every section would speak twice in a row with the visitor
   * standing still. Reset only when a *different* section commits.
   */
  let sectionHandled = false;
  let currentClips = [];
  let currentClipIndex = 0;
  let settleTimer = null;
  let suspendedResume = null;
  let destroyed = false;

  // Sources are created lazily and reused.
  const speechSource = createSpeechSynthesisSource();
  const captionSource = createCaptionOnlySource();
  const audioSource = createAudioFileSource(() => audioContext);
  /** url -> boolean; avoids re-HEADing the same file. */
  const audioAvailability = new Map();
  let activeSource = null;

  // Seed both profiles from the persisted persona before anything speaks —
  // the speech voice (§4.1) and the recorded-audio DSP routing (§4.2).
  speechSource.setPersona(getActivePersona());
  audioSource.setPersona(getActivePersona());

  const setState = (next) => {
    if (state === next) return;
    state = next;
    onState(next);
  };

  const getAudioContext = () => audioContext;

  // --- source selection (§5.1) ----------------------------------------------
  async function resolveSource(clip) {
    if (clip.audio && audioSource.isAvailable()) {
      let exists = audioAvailability.get(clip.audio);
      if (exists === undefined) {
        exists = await audioFileExists(clip.audio);
        audioAvailability.set(clip.audio, exists);
      }
      if (exists) return audioSource;
    }
    await speechSource.prepare(clip);
    if (speechSource.isAvailable()) return speechSource;
    return captionSource;
  }

  // --- playback -------------------------------------------------------------

  /** Stops whatever is speaking and waits for it, so the next play is clean. */
  async function stopActive(fadeMs) {
    if (!activeSource) return;
    const src = activeSource;
    activeSource = null;
    try {
      await src.stop(fadeMs);
    } catch {
      /* a source that fails to stop must not wedge the machine */
    }
    onAmplitude(0);
  }

  /**
   * Plays a clip list start to finish. A clip list is ONE narration unit for
   * ONE section — this is not a cross-section queue.
   */
  async function playClips(sectionId, clips, token) {
    if (!clips.length) return;

    speakingSectionId = sectionId;
    currentClips = clips;
    setState(STATE.speaking);

    for (let i = 0; i < clips.length; i++) {
      if (token !== playToken || destroyed) return;

      currentClipIndex = i;
      const clip = clips[i];

      onCaption({
        sectionId,
        text: clip.text,
        clipIndex: i,
        total: clips.length,
      });

      const source = await resolveSource(clip);
      if (token !== playToken || destroyed) return;

      activeSource = source;
      onSourceKind?.(source.kind);

      let completed = false;
      await source.play(clip, {
        onAmplitude: (level) => {
          if (token === playToken) onAmplitude(level);
        },
        onEnd: (didComplete) => {
          completed = didComplete;
        },
      });

      if (token !== playToken || destroyed) return;
      if (!completed) {
        // Interrupted mid-clip: leave the record 'partial' so the next visit
        // replays from the beginning (§4.4, acceptance test 6).
        return;
      }
    }

    if (token !== playToken || destroyed) return;

    // Whole list finished naturally.
    updateVisitStatus(sectionId, 'completed');
    activeSource = null;
    speakingSectionId = null;
    onAmplitude(0);

    setState(STATE.settling);
    settleTimer = setTimeout(() => {
      settleTimer = null;
      if (destroyed || state !== STATE.settling) return;
      setState(STATE.armed);
      // Re-evaluate the present, not a backlog.
      evaluate();
    }, COOLDOWN_MS);
  }

  /**
   * Looks at the currently committed section and decides whether to speak.
   * Called on commit, and when the machine becomes free again.
   */
  async function evaluate(velocityOverride = 0) {
    if (destroyed) return;
    if (state !== STATE.armed && state !== STATE.speaking) return;
    if (!committedSectionId) return;

    // Already saying this exact section: leave it alone.
    if (state === STATE.speaking && speakingSectionId === committedSectionId) return;

    // Already acted on this commit. Re-entering `armed` after a clip must not
    // start the section over.
    if (sectionHandled) return;

    const decision = decideNarration(committedSectionId, getVisits(), velocityOverride);
    if (decision.action === 'suppressed') return;

    const token = ++playToken;

    // A different section has taken over. Stop the old clip regardless of what
    // the new one turns out to say — the visitor has moved on, so the previous
    // section must not keep talking over where they now are.
    if (state === STATE.speaking && speakingSectionId && speakingSectionId !== committedSectionId) {
      const interrupted = speakingSectionId;
      speakingSectionId = null;
      await stopActive(FADE_INTERRUPT_MS);
      updateVisitStatus(interrupted, 'partial');
      if (token !== playToken || destroyed) return;
      setState(STATE.armed);
    }

    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }

    sectionHandled = true;

    if (decision.action === 'silent') {
      // Captions still update in every state (§3.3).
      const section = getSection(committedSectionId);
      const clip = section?.revisit ?? section?.intro?.[0];
      if (clip) {
        onCaption({
          sectionId: committedSectionId,
          text: clip.text,
          clipIndex: 0,
          total: 1,
        });
      }
      if (state !== STATE.speaking) setState(STATE.armed);
      return;
    }

    // Count the visit up front, marked partial until it finishes.
    recordVisit(committedSectionId, 'partial');

    // §5.2 preload strategy: warm only the next section, and never under Save-Data.
    if (!isSaveData()) {
      const nextId = getNextSectionId(committedSectionId);
      const nextClip = nextId ? getSection(nextId)?.intro?.[0] : null;
      if (nextClip?.audio) audioSource.prepare(nextClip);
    }

    await playClips(committedSectionId, decision.clips, token);
  }

  // --- public API -----------------------------------------------------------

  return {
    get state() {
      return state;
    },
    get audioContext() {
      return audioContext;
    },
    getDebugInfo() {
      return {
        state,
        committedSectionId,
        speakingSectionId,
        clipIndex: currentClipIndex,
        clipCount: currentClips.length,
        sourceKind: activeSource?.kind ?? null,
        persona: getActivePersona(),
        visits: getVisits(),
      };
    },

    /**
     * §3.3 disabled -> armed. MUST be called from a real user gesture
     * (pointerdown/keydown/touchstart) — scroll is not a user activation in
     * Chrome (§1.3).
     */
    async enable() {
      if (destroyed) return;
      if (typeof window !== 'undefined') {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (Ctor && !audioContext) {
          try {
            audioContext = new Ctor();
          } catch {
            audioContext = null; // TTS path doesn't need it
          }
        }
        if (audioContext?.state === 'suspended') {
          try {
            await audioContext.resume();
          } catch {
            /* stays suspended; TTS still works */
          }
        }
      }

      setEnabled(true);
      setState(STATE.armed);
      // Unlocking is an explicit request to hear the current section, even if
      // it was already handled while muted (§4.5).
      sectionHandled = false;

      // §4.5: the hero clip fires on unlock, not on scroll — but only if the
      // visitor is still at the hero. If they've already scrolled past, speak
      // where they actually are instead of dragging them backwards.
      await evaluate();
    },

    get persona() {
      return getActivePersona();
    },

    /**
     * Switches narration persona (Optimus spec §2).
     *
     * Order matters here. The current clip has to be cancelled *before* the
     * script swaps, otherwise the old voice keeps talking over the new one —
     * speechSynthesis holds its own utterance and does not care that we changed
     * our minds. Bumping playToken first also invalidates the in-flight
     * playClips loop so it cannot resume into the new script mid-list.
     *
     * The section is then re-armed rather than left handled: switching voice is
     * an explicit request to hear *this* persona, so the section the visitor is
     * actually looking at speaks again in the new voice.
     *
     * @param {string} nextPersona
     * @returns {Promise<boolean>} false if the id was unknown
     */
    async setPersona(nextPersona) {
      if (destroyed) return false;
      if (nextPersona === getActivePersona()) return true;

      playToken++;
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }

      // Whatever was mid-sentence never finished, so it must not count as heard.
      if (speakingSectionId) {
        updateVisitStatus(speakingSectionId, 'partial');
        speakingSectionId = null;
      }
      await stopActive(FADE_INTERRUPT_MS);

      if (!setActivePersona(nextPersona)) return false;
      speechSource.setPersona(nextPersona);
      audioSource.setPersona(nextPersona);
      onPersona?.(nextPersona);

      // Audio availability is keyed by url and the urls differ per persona, so
      // the map stays valid — but the caption must refresh to the new copy.
      if (committedSectionId) {
        const section = getSection(committedSectionId);
        const clip = section?.intro?.[0] ?? section?.revisit;
        if (clip) {
          onCaption({ sectionId: committedSectionId, text: clip.text, clipIndex: 0, total: 1 });
        }
      }

      if (state === STATE.disabled || state === STATE.suspended) return true;

      sectionHandled = false;
      setState(STATE.armed);
      await evaluate();
      return true;
    },

    /** §3.3 speaking -> disabled (mute / Esc). */
    async disable() {
      if (destroyed) return;
      playToken++;
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }
      if (speakingSectionId) {
        updateVisitStatus(speakingSectionId, 'partial');
        speakingSectionId = null;
      }
      await stopActive(FADE_MUTE_MS);
      setEnabled(false);
      setState(STATE.disabled);
    },

    /** Called whenever the commit logic promotes a new section. */
    onSectionCommitted(sectionId, velocity = 0) {
      if (sectionId !== committedSectionId) {
        committedSectionId = sectionId;
        sectionHandled = false; // a new commit gets one chance to act
      }

      // Captions are driven by the active section and render in ALL states,
      // including disabled (§3.3) — so update them before any state gate.
      const section = getSection(sectionId);
      if (section) {
        const visits = getVisits();
        const record = visits[sectionId];
        const useRevisit =
          record && record.status === 'completed' && record.count >= 1 && section.revisit;
        const clip = useRevisit ? section.revisit : section.intro?.[0];
        if (clip) {
          onCaption({ sectionId, text: clip.text, clipIndex: 0, total: 1 });
        }
      }

      if (state === STATE.disabled || state === STATE.suspended) return;
      evaluate(velocity);
    },

    /** §3.3 speaking -> suspended on hidden; -> armed on visible. */
    handleVisibilityChange(hidden) {
      if (destroyed) return;

      if (hidden) {
        if (state !== STATE.speaking) return;
        // Remember which clip so we can restart *that clip* from its start.
        suspendedResume = {
          sectionId: speakingSectionId,
          clipIndex: currentClipIndex,
          clips: currentClips,
        };
        playToken++;
        stopActive(0);
        speakingSectionId = null;
        setState(STATE.suspended);
        return;
      }

      if (state !== STATE.suspended) return;
      setState(STATE.armed);

      const resume = suspendedResume;
      suspendedResume = null;
      if (!resume) {
        evaluate();
        return;
      }

      // Restart the interrupted clip from its beginning, never mid-word.
      const token = ++playToken;
      playClips(resume.sectionId, resume.clips.slice(resume.clipIndex), token);
    },

    destroy() {
      destroyed = true;
      playToken++;
      if (settleTimer) clearTimeout(settleTimer);
      stopActive(0);
      if (audioContext) {
        try {
          audioContext.close();
        } catch {
          /* already closed */
        }
        audioContext = null;
      }
    },

    _getAudioContext: getAudioContext,
  };
}
