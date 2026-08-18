/**
 * Caption text — spec §6.2.
 *
 * This is deliberately NOT a bubble. The existing bubble in AvatarGuide.jsx
 * keeps its own chrome, dot pagination and × dismiss (§12: don't replace it
 * wholesale). This component only owns the *text*: the 150ms crossfade on clip
 * change and the aria-live announcement.
 *
 * It renders in every state, including `disabled` — captions are the primary
 * channel, voice is the enhancement (§1.4).
 */
import React, { useEffect, useRef, useState } from 'react';
import { CAPTION_CROSSFADE_MS, getPersonaMeta } from '../config';
import { useVoiceGuide } from '../useVoiceGuide';

/**
 * Tactical transmission header — Optimus spec §5.2, e.g.
 * `[ TRANSMISSION // OPTIMUS PRIME ]`.
 *
 * Reads the persona straight off the store rather than taking it as a prop, so
 * AvatarGuide.jsx (the eager consumer) needs no changes. It comes from
 * ../config, which holds no script imports — importing the persona metadata
 * from data/narrationScript.js here would drag all three narration scripts
 * into the initial bundle and undo the lazy split (§8).
 *
 * Hidden until the provider is ready: before that the bubble is still showing
 * AvatarGuide's own tour copy, which nobody is narrating.
 */
export const PersonaBadge = ({ style }) => {
  const { ready, persona } = useVoiceGuide();
  if (!ready) return null;

  return (
    <span className="vg-caption-badge" style={style}>
      {getPersonaMeta(persona).badge}
    </span>
  );
};

/**
 * @param {Object} props
 * @param {string} props.text        current caption text
 * @param {string} [props.fallback]  shown when the guide has nothing to say yet
 * @param {boolean} [props.showBadge] render the persona transmission header
 * @param {React.CSSProperties} [props.style]
 */
export const CaptionText = ({ text, fallback = '', showBadge = true, style }) => {
  const value = text || fallback;
  const [shown, setShown] = useState(value);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (value === shown) return undefined;

    // Fade out, swap, fade back in.
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
