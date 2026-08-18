/**
 * Optimus Prime avatar — personas spec §3.1.
 *
 * A holographic Autobot crest that stands in for the memoji while the Optimus
 * persona is narrating. Everything that reacts to the voice reads --vg-level,
 * the 0..1 custom property the engine writes to <html> each frame (store.js),
 * so this component never re-renders while speaking.
 *
 * The reactive values are inline rather than in voice-guide.css on purpose:
 * AvatarGuide.jsx is eager but voice-guide.css only lands with the lazy chunk
 * (§8), so anything essential to the shape or colour has to travel with the
 * markup. Only the keyframed motion lives in the stylesheet, where arriving a
 * few hundred ms late costs nothing. Every var() therefore carries a fallback.
 */
import React from 'react';

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the crest while a clip plays
 */
export const OptimusAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-optimus${speaking ? ' vg-optimus-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Cybertronian energy aura. Scales with the voice. */}
    <div
      className="vg-optimus-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.4))' }}
    />
    {/* Matrix-of-Leadership ring. Amber is a literal, like the aura pair it
        replaces: it is the Autobot half of the palette and must not follow the
        accent the visitor picked in the theme switcher. The cyan half does. */}
    <div className="vg-optimus-ring" />

    <svg
      viewBox="0 0 100 100"
      className="vg-optimus-svg"
      fill="none"
      focusable="false"
      style={{ filter: 'drop-shadow(0 0 15px var(--accent-line, rgba(0,242,254,0.35)))' }}
    >
      {/* Outer armour plates */}
      <path
        d="M50 8 L85 24 L85 58 L72 88 L50 94 L28 88 L15 58 L15 24 Z"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="3"
        fill="var(--surface-2, #0f182a)"
        fillOpacity="0.85"
      />

      {/* Brow and forehead crest */}
      <path
        d="M32 24 L50 14 L68 24 L62 38 L38 38 Z"
        fill="var(--accent, #00f2fe)"
        fillOpacity="0.3"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="2"
      />

      {/* Central Matrix V-plates */}
      <path
        d="M50 38 L50 72 M40 46 L28 54 M60 46 L72 54 M36 68 L28 78 M64 68 L72 78"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Laser eyes. Bloom and opacity both track the amplitude. */}
      <polygon
        points="34,44 45,44 42,50 32,48"
        fill="var(--accent-strong, #38bdf8)"
        style={{
          filter:
            'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 10px) var(--accent-strong, #38bdf8))',
          opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)',
        }}
      />
      <polygon
        points="66,44 55,44 58,50 68,48"
        fill="var(--accent-strong, #38bdf8)"
        style={{
          filter:
            'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 10px) var(--accent-strong, #38bdf8))',
          opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)',
        }}
      />

      {/* Mouth guard. Opens with the voice, the way AvatarMouth does for the
          memoji — this is the Optimus persona's lip sync. */}
      <path
        d="M42 64 L58 64 M44 70 L56 70 M46 76 L54 76"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transform: 'scaleY(calc(1 + var(--vg-level, 0) * 0.8))',
          transformOrigin: '50% 70%',
          transformBox: 'view-box',
        }}
      />
    </svg>
  </div>
);
