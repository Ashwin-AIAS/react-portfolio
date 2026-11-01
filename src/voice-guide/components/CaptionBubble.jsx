/**
 * Caption text and the docked agent controls — spec §6.2, personas spec §3.5.
 *
 * This is deliberately NOT a bubble. The existing bubble in AvatarGuide.jsx
 * keeps its own chrome, dot pagination and × dismiss (§12: don't replace it
 * wholesale). This module owns the *contents*: the crossfading caption line,
 * the aria-live announcement, and — since the personas spec folded the
 * detached bottom-left pill into the agent — the unmute prompt, the mute
 * toggle and the persona selector.
 *
 * It renders in every state, including `disabled` — captions are the primary
 * channel, voice is the enhancement (§1.4).
 */
import React, { useEffect, useRef, useState } from 'react';
import { CAPTION_CROSSFADE_MS, PERSONA_IDS, getPersonaMeta } from '../config';
import { useVoiceGuide } from '../useVoiceGuide';
import { getPulseSeen, setPulseSeen } from '../utils/storage';

/**
 * On-air callsigns — holo spec §2.2.2, movie-persona pass.
 */
const LIVE_LABEL = {
  optimus: 'AUTOBOT COMMAND // OPTIMUS PRIME',
  jarvis: 'STARK INDUSTRIES // J.A.R.V.I.S.',
  megatron: 'DECEPTICON WAR MATRIX // LORD MEGATRON',
  ironman: 'STARK MARK LXXXV // TONY STARK',
  batman: 'WAYNETECH BATCOMPUTER // BATMAN',
  bumblebee: 'AUTOBOT SCOUT // BUMBLEBEE',
  ashwin: 'LIVE TRANSMISSION // ASHWIN',
};

/**
 * The same slot before the visitor unlocks audio (personas spec §3.5).
 */
const READY_LABEL = {
  optimus: '[ AUTOBOT BRIEFING READY ]',
  jarvis: '[ STARK PROTOCOL READY ]',
  megatron: '[ DECEPTICON MATRIX READY ]',
  ironman: '[ MARK LXXXV HUD READY ]',
  batman: '[ BATCOMPUTER LINK READY ]',
  bumblebee: '[ SCOUT RADIO LINK READY ]',
  ashwin: '[ AUDIO BRIEFING READY ]',
};

/** Five spectrum bars in the transmission header; heights are pure CSS. */
const SPECTRUM_BARS = [0, 1, 2, 3, 4];

const SpeakerMuted = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const SpeakerOn = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path className="vg-wave vg-wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path className="vg-wave vg-wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const PersonaBadge = ({ style }) => {
  const { ready, enabled, persona } = useVoiceGuide();
  if (!ready) return null;

  const name = LIVE_LABEL[persona] || getPersonaMeta(persona).badge;
  const readyText = READY_LABEL[persona] || '[ AUDIO BRIEFING READY ]';

  return (
    <span className="vg-caption-head" data-vg-persona={persona} style={style}>
      <span className={`vg-caption-badge${enabled ? ' vg-caption-badge-live' : ''}`}>
        {enabled ? (
          <>
            {'[ '}
            <i className="vg-live-dot" aria-hidden="true" />
            {` ${name} ]`}
          </>
        ) : (
          readyText
        )}
      </span>

      {enabled && (
        <span className="vg-caption-spectrum" aria-hidden="true">
          {SPECTRUM_BARS.map((i) => (
            <i key={i} className="vg-spectrum-bar" />
          ))}
        </span>
      )}
    </span>
  );
};

export const CaptionText = ({ text, fallback = '', showBadge = true, style }) => {
  const value = text || fallback;
  const [shown, setShown] = useState(value);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (value === shown) return undefined;

    setVisible(false);
    timerRef.current = setTimeout(() => {
      setShown(value);
      setVisible(true);
    }, CAPTION_CROSSFADE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, shown]);

  return (
    <>
      {showBadge && <PersonaBadge />}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          display: 'block',
          opacity: visible ? 1 : 0,
          transition: `opacity ${CAPTION_CROSSFADE_MS}ms ease`,
          ...style,
        }}
      >
        {shown}
      </span>
    </>
  );
};

export const AgentControls = () => {
  const { ready, enabled, persona, caption, toggle, setPersona } = useVoiceGuide();
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
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

  const handlePersona = (id) => {
    if (id !== persona) setPersona(id);
  };

  const total = caption?.total ?? 0;
  const progress = total > 1 ? ((caption.clipIndex + 1) / total) * 100 : null;

  return (
    <div className="vg-agent-controls" data-vg-persona={persona}>
      {enabled ? (
        progress !== null && (
          <div className="vg-agent-progress" aria-hidden="true">
            <div className="vg-agent-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )
      ) : (
        <p className="vg-agent-prompt">Select your guide and start the audio tour.</p>
      )}

      <div className="vg-persona-pills" role="radiogroup" aria-label="Narration voice">
        {PERSONA_IDS.map((id) => {
          const meta = getPersonaMeta(id);
          const isActive = id === persona;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              data-persona={id}
              aria-checked={isActive}
              className={`vg-persona-pill ${isActive ? 'vg-persona-pill-active' : ''}${
                isActive && enabled ? ' vg-persona-pill-live' : ''
              }`}
              onClick={() => handlePersona(id)}
              title={meta.tagline}
            >
              <span aria-hidden="true">{meta.icon}</span>
              {meta.name}
              {isActive && enabled && (
                <span className="vg-pill-sound" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`vg-agent-cta${enabled ? ' vg-agent-cta-on' : ''}${
          shouldPulse && !enabled ? ' vg-agent-cta-pulse' : ''
        }`}
        aria-pressed={enabled}
        title={enabled ? 'Mute voice tour (Esc)' : 'Play voice tour'}
      >
        {!enabled && <span className="vg-cta-ripple" aria-hidden="true" />}
        {enabled ? <SpeakerOn /> : <SpeakerMuted />}
        {enabled ? 'Mute tour' : 'Unmute tour'}
      </button>
    </div>
  );
};
