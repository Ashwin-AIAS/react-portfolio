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
import React, { useEffect, useState } from 'react';
import { useVoiceGuide } from '../useVoiceGuide';
import { getPulseSeen, setPulseSeen } from '../utils/storage';

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

export const VoiceToggle = () => {
  const { ready, enabled, machine, toggle } = useVoiceGuide();
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    // Don't pulse at a visitor who has already interacted with this, ever.
    setShouldPulse(!getPulseSeen());
  }, []);

  if (!ready) return null;

  const handleToggle = () => {
    if (shouldPulse) {
      setPulseSeen();
      setShouldPulse(false);
    }
    toggle();
  };

  const speaking = machine === 'speaking';

  return (
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
      <span className="vg-toggle-label">
        {enabled ? 'Mute' : 'Play voice tour'}
      </span>
    </button>
  );
};
