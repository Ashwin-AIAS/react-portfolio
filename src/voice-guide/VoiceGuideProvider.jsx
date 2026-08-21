/**
 * Context + state machine host — spec §3.1.
 *
 * This is the lazy half of the feature: it pulls in the engine, the sources and
 * the narration script. Nothing here is imported eagerly by the app (§8).
 * State is pushed out through ./store so the eager UI (the existing avatar
 * bubble) can read it without importing any of this.
 */
import React, { useEffect, useRef } from 'react';
import { VoiceGuideContext } from './context';
import { useScrollTracker } from './useScrollTracker';
import { useActiveNarrationSection } from './useActiveSection';
import { createNarrationEngine, STATE } from './narrationEngine';
import { installSpeechCleanup } from './sources/SpeechSynthesisSource';
import { setState, setActions, setLevel } from './store';
import { getEnabled, isSaveData, isDebugEnabled } from './utils/storage';
import { smoothAmplitude } from './utils/amplitude';
import { DebugOverlay } from './components/DebugOverlay';

export const VoiceGuideProvider = ({ children }) => {
  const scrollRef = useScrollTracker();
  const { committedId, candidateId, ratiosRef, suppressedRef } =
    useActiveNarrationSection(scrollRef);

  const engineRef = useRef(null);
  const rawLevelRef = useRef(0);
  const smoothLevelRef = useRef(0);

  // --- engine lifecycle ------------------------------------------------------
  useEffect(() => {
    const engine = createNarrationEngine({
      onState: (machine) => {
        // `enabled` is the visitor's preference, NOT the machine state. With
        // the tour on by default the two disagree for the whole window between
        // load and the first gesture: the machine is still `disabled` while
        // the tour is already on and merely waiting to be unlocked. Deriving
        // the flag from the machine there would label the live mute button
        // "Unmute tour". engine.enable()/disable() both write vg:enabled
        // before they change state, so re-reading it here is always current.
        setState({ machine, enabled: getEnabled() });
      },
      onAmplitude: (level) => {
        rawLevelRef.current = level;
      },
      onCaption: (caption) => {
        setState({ caption });
      },
      onSourceKind: (sourceKind) => {
        setState({ sourceKind });
      },
      onPersona: (persona) => {
        setState({ persona });
      },
    });
    engineRef.current = engine;

    // Each action pushes `enabled` itself. The engine's internal setState is a
    // no-op when the machine is already in the requested state, so onState does
    // not fire for a mute issued before the first gesture — but vg:enabled is
    // written regardless, and the button has to follow it.
    setActions({
      enable: async () => {
        await engine.enable();
        setState({ enabled: true });
      },
      disable: async () => {
        await engine.disable();
        setState({ enabled: false });
      },
      // Branches on the preference rather than engine.state so the control
      // does what its own label says, including on a first click that lands
      // before anything has unlocked audio.
      toggle: async () => {
        if (getEnabled()) {
          await engine.disable();
          setState({ enabled: false });
        } else {
          await engine.enable();
          setState({ enabled: true });
        }
      },
      setPersona: (id) => engine.setPersona(id),
    });
    // Publish the persisted persona and mute preference now the engine has
    // resolved them — the store was holding compile-time defaults until this
    // point, and a returning visitor who muted must not see "Mute tour".
    setState({ ready: true, persona: engine.persona, enabled: getEnabled() });

    const removeSpeechCleanup = installSpeechCleanup();

    return () => {
      removeSpeechCleanup();
      engine.destroy();
      engineRef.current = null;
      setState({ ready: false, machine: STATE.disabled, enabled: false });
      setLevel(0);
    };
  }, []);

  // --- amplitude smoothing, outside React (§6.1) -----------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let rafId = 0;
    const tick = () => {
      const next = smoothAmplitude(smoothLevelRef.current, rawLevelRef.current);
      smoothLevelRef.current = next;
      setLevel(next);
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // --- committed section -> engine -------------------------------------------
  useEffect(() => {
    if (!committedId || !engineRef.current) return;
    engineRef.current.onSectionCommitted(committedId, scrollRef.current.velocity);
  }, [committedId, scrollRef]);

  // --- automatic gesture unlock (§1.3, §7) -----------------------------------
  // The tour is on by default (getEnabled() is opt-out) but no browser will let
  // it make a sound on load: an AudioContext starts suspended until a user
  // activation resumes it. So the provider watches for the first sign of life
  // and unlocks there, which makes the tour feel automatic without ever
  // fighting autoplay policy.
  //
  // `scroll` is in the set on purpose even though it does NOT grant activation
  // in Chrome. Where the visitor already has an activation for the origin it
  // starts the tour the instant the page moves; where it is not enough,
  // enable() leaves the context suspended and we deliberately keep listening,
  // so the next real pointer/key/touch does the unlock. `once: true` would
  // have burned the listeners on that first useless scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    // Save-Data is an explicit "don't spend my bytes" — never auto-start there.
    if (isSaveData()) return undefined;

    const EVENTS = ['pointerdown', 'touchstart', 'scroll', 'keydown'];
    let done = false;
    let arming = false;

    const cleanup = () => {
      for (const type of EVENTS) window.removeEventListener(type, arm);
    };

    async function arm() {
      // `arming` guards re-entry: a tap fires pointerdown AND touchstart, and
      // enable() is async, so without it evaluate() can run twice and the hero
      // clip starts over on top of itself.
      if (done || arming) return;

      // Re-read rather than trusting a mount-time check. The visitor's very
      // first interaction may BE the mute button, whose click reaches window
      // only after React has already handled it and written vg:enabled=0.
      if (!getEnabled()) {
        done = true;
        cleanup();
        return;
      }

      const engine = engineRef.current;
      if (!engine) return; // engine not built yet — try again on the next event

      arming = true;
      try {
        await engine.enable();
      } finally {
        arming = false;
      }

      // Retire the listeners only once audio is genuinely unlocked.
      const ctx = engine._getAudioContext?.();
      if (ctx && ctx.state === 'suspended') return;
      done = true;
      cleanup();
    }

    for (const type of EVENTS) {
      window.addEventListener(type, arm, { passive: true });
    }
    return cleanup;
  }, []);

  // --- Esc anywhere mutes (§7) -----------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const engine = engineRef.current;
      if (engine && engine.state !== STATE.disabled) engine.disable();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // --- tab visibility (§3.3) --------------------------------------------------
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const onVisibility = () => {
      engineRef.current?.handleVisibilityChange(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <VoiceGuideContext.Provider value={engineRef}>
      {children}
      {isDebugEnabled() && (
        <DebugOverlay
          engineRef={engineRef}
          scrollRef={scrollRef}
          ratiosRef={ratiosRef}
          suppressedRef={suppressedRef}
          candidateId={candidateId}
          committedId={committedId}
        />
      )}
    </VoiceGuideContext.Provider>
  );
};
