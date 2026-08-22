/**
 * Mobile dynamic island — personas spec §3.4.
 *
 * Under 768px the desktop avatar is hidden and AvatarGuide.jsx steps aside
 * entirely, so this pill is the whole voice guide on a phone: persona chip,
 * live equaliser, one line of caption, and tap-to-mute. It is ~38px tall and
 * pinned to the bottom gutter so it never covers page content.
 *
 * Mounted from VoiceGuideMount (the lazy half), so unlike PersonaAvatar it can
 * rely on voice-guide.css already being present and style itself from there.
 *
 * The click handler is the ONLY place audio is ever unlocked — a real user
 * gesture, never scroll (§1.3).
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceGuide } from '../useVoiceGuide';
import { getPulseSeen, setPulseSeen } from '../utils/storage';
import { PERSONA_IDS, getPersonaMeta } from '../config';
import { CaptionText } from './CaptionBubble';

/** Four bars; the heights are pure CSS off --vg-level, so no re-render. */
const EQ_BARS = [0, 1, 2, 3];

export const MobileVoicePill = () => {
  const { ready, enabled, persona, caption, isSpeaking, toggle, setPersona } = useVoiceGuide();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    // Don't pulse at a visitor who has already interacted with this, ever.
    setShouldPulse(!getPulseSeen());
  }, []);

  // Click-away and Escape. Escape is also the global mute (§7), so this stops
  // propagation — closing the sheet should not also kill the narration.
  useEffect(() => {
    if (!sheetOpen) return undefined;

    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSheetOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setSheetOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    // Capture phase, so this runs before the provider's window-level Esc mute.
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [sheetOpen]);

  if (!ready) return null;

  const handleToggle = () => {
    if (shouldPulse) {
      setPulseSeen();
      setShouldPulse(false);
    }
    toggle();
  };

  const handlePersona = (id) => {
    setSheetOpen(false);
    if (id !== persona) setPersona(id);
  };

  const active = getPersonaMeta(persona);

  return (
    <div className="vg-pill-wrap" ref={wrapRef}>
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="vg-pill-sheet"
            role="radiogroup"
            aria-label="Narration voice"
          >
            {PERSONA_IDS.map((id) => {
              const meta = getPersonaMeta(id);
              const isActive = id === persona;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`vg-pill-sheet-item ${isActive ? 'vg-pill-sheet-item-active' : ''}`}
                  onClick={() => handlePersona(id)}
                >
                  <span aria-hidden="true">{meta.icon}</span>
                  {meta.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className={`vg-pill${enabled ? ' vg-pill-on' : ''}`}
      >
        {/* Perimeter beam: a light running the rim of the island. It is one
            element with two pseudo-layers (the sweep, and the mask that leaves
            only the rim showing), so it costs no DOM and no re-render — the
            brightness rides --vg-level like everything else. */}
        <span className="vg-pill-beam" aria-hidden="true" />

        {/* Persona chip — also the sheet trigger. */}
        <button
          type="button"
          className="vg-pill-persona"
          onClick={() => setSheetOpen((o) => !o)}
          aria-expanded={sheetOpen}
          aria-label={`Narration voice: ${active.name}. Change voice.`}
        >
          <span className="vg-pill-icon" aria-hidden="true">
            {active.icon}
          </span>
        </button>

        {/* Live equaliser. Idle when armed and silent, flat when muted. */}
        <div
          className={`vg-pill-eq${isSpeaking ? ' vg-pill-eq-live' : ''}`}
          aria-hidden="true"
        >
          {EQ_BARS.map((i) => (
            <span key={i} className="vg-pill-bar" />
          ))}
        </div>

        {/* One line: persona name over the current caption. Tapping it is the
            same unlock as the button, because that is what a visitor reaching
            for "Tap to enable" will actually hit. */}
        <button type="button" className="vg-pill-body" onClick={handleToggle}>
          <span className="vg-pill-name">{active.short}</span>
          <span className="vg-pill-caption">
            <CaptionText
              text={enabled ? caption?.text : ''}
              fallback={enabled ? 'Scroll to explore sections…' : 'Tap to enable audio tour'}
              showBadge={false}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={handleToggle}
          className={`vg-pill-btn${enabled ? ' vg-pill-btn-on' : ''}${
            shouldPulse && !enabled ? ' vg-pill-btn-pulse' : ''
          }`}
          aria-pressed={enabled}
          aria-label={enabled ? 'Mute voice tour' : 'Play voice tour'}
        >
          {enabled ? 'Mute' : 'Unmute'}
        </button>
      </motion.div>
    </div>
  );
};
