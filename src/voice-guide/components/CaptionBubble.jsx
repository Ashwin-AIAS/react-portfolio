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
import { CAPTION_CROSSFADE_MS } from '../config';

/**
 * @param {Object} props
 * @param {string} props.text        current caption text
 * @param {string} [props.fallback]  shown when the guide has nothing to say yet
 * @param {React.CSSProperties} [props.style]
 */
export const CaptionText = ({ text, fallback = '', style }) => {
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
  );
};
