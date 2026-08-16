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
        setState({ machine, enabled: machine !== STATE.disabled });
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
    });
    engineRef.current = engine;

    setActions({
      enable: () => engine.enable(),
      disable: () => engine.disable(),
      toggle: () =>
        engine.state === STATE.disabled ? engine.enable() : engine.disable(),
    });
    setState({ ready: true });

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

  // --- remembered preference (§7) --------------------------------------------
  // vg:enabled is remembered across visits, but audio still may not start
  // without a real user gesture (§1.3). So a returning visitor who had it on
  // gets armed on their first interaction of any kind, not on load.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!getEnabled() || isSaveData()) return undefined;

    let done = false;
    const arm = () => {
      if (done) return;
      done = true;
      cleanup();
      engineRef.current?.enable();
    };
    const cleanup = () => {
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
      window.removeEventListener('touchstart', arm);
    };

    window.addEventListener('pointerdown', arm, { once: true });
    window.addEventListener('keydown', arm, { once: true });
    window.addEventListener('touchstart', arm, { once: true });
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
