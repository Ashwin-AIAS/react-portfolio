/**
 * The unmute pill — spec §7.
 *
 * Fixed bottom-left. ScrollToTop already owns bottom-right (bottom-6 right-6,
 * z-40), and the desktop avatar drifts around the viewport on a spring, so
 * anchoring the pill to the avatar would make it a moving target. Fixed also
 * means it stays reachable on mobile, where the avatar image is display:none.
 *
 * The click handler is the ONLY place audio is ever unlocked — a real user
 * gesture, never scroll (§1.3).
 */
import React, { useEffect, useRef, useState } from 'react';
import { useVoiceGuide } from '../useVoiceGuide';
import { getPulseSeen, setPulseSeen } from '../utils/storage';
import { PERSONA_IDS, getPersonaMeta } from '../config';

const SpeakerMuted = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const SpeakerOn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path className="vg-wave vg-wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path className="vg-wave vg-wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const ChevronUp = ({ open }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform 180ms ease',
    }}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const VoiceToggle = () => {
  const { ready, enabled, machine, persona, toggle, setPersona } = useVoiceGuide();
  const [shouldPulse, setShouldPulse] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    // Don't pulse at a visitor who has already interacted with this, ever.
    setShouldPulse(!getPulseSeen());
  }, []);

  // Click-away and Escape. Escape is also the global mute (§7), so this stops
  // propagation — closing an open menu should not also kill the narration.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    // Capture phase, so this runs before the provider's window-level Esc mute.
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [menuOpen]);

  if (!ready) return null;

  const handleToggle = () => {
    if (shouldPulse) {
      setPulseSeen();
      setShouldPulse(false);
    }
    toggle();
  };

  const handlePersona = (id) => {
    setMenuOpen(false);
    if (id !== persona) setPersona(id);
  };

  const speaking = machine === 'speaking';
  const active = getPersonaMeta(persona);

  return (
    <div className="vg-controls" ref={wrapRef}>
      {menuOpen && (
        <div className="vg-persona-menu" role="menu" aria-label="Narration voice">
          <div className="vg-persona-menu-head">Narrator</div>
          {PERSONA_IDS.map((id) => {
            const meta = getPersonaMeta(id);
            const isActive = id === persona;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`vg-persona-item ${isActive ? 'vg-persona-item-active' : ''}`}
                onClick={() => handlePersona(id)}
              >
                <span className="vg-persona-icon" aria-hidden="true">
                  {meta.icon}
                </span>
                <span className="vg-persona-text">
                  <span className="vg-persona-name">{meta.name}</span>
                  <span className="vg-persona-tag">{meta.tagline}</span>
                </span>
                {isActive && <span className="vg-persona-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}

      <div className="vg-toggle-group">
        <button
          type="button"
          onClick={handleToggle}
          className={`vg-toggle ${enabled ? 'vg-toggle-on' : ''} ${
            shouldPulse && !enabled ? 'vg-toggle-pulse' : ''
          }`}
          aria-pressed={enabled}
          aria-label={enabled ? 'Mute voice tour' : 'Play voice tour'}
          title={enabled ? 'Mute voice tour (Esc)' : 'Play voice tour'}
        >
          <span className={`vg-toggle-icon ${speaking ? 'vg-toggle-speaking' : ''}`}>
            {enabled ? <SpeakerOn /> : <SpeakerMuted />}
          </span>
          <span className="vg-toggle-label">{enabled ? 'Mute' : 'Play voice tour'}</span>
        </button>

        <button
          type="button"
          className="vg-persona-trigger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={`Narration voice: ${active.name}. Change voice.`}
          title={`Narrator: ${active.name}`}
        >
          <span className="vg-persona-trigger-icon" aria-hidden="true">
            {active.icon}
          </span>
          <ChevronUp open={menuOpen} />
        </button>
      </div>
    </div>
  );
};
