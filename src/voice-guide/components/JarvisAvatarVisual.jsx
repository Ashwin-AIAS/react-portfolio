/**
 * JARVIS avatar — personas spec §3.2.
 *
 * A Stark arc-reactor HUD: two counter-rotating tech rings, a hexagonal core
 * and six radial nodes that brighten with the voice.
 *
 * Same split as OptimusAvatarVisual: shape and colour are inline so the eager
 * AvatarGuide renders correctly before voice-guide.css lands with the lazy
 * chunk (§8); the ring rotation lives in the stylesheet.
 *
 * The blues are literals, not --accent. The arc reactor is Stark's, not the
 * visitor's palette — same reasoning as the Autobot amber next door. The glow
 * intensity still comes from --vg-level, so it belongs to the same system.
 */
import React from 'react';

const HUD_CYAN = '#38bdf8';
const HUD_INDIGO = '#818cf8';

/** Six arc-reactor spokes, every 60°. */
const NODE_ANGLES = [0, 60, 120, 180, 240, 300];

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the reactor while a clip plays
 */
export const JarvisAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-jarvis${speaking ? ' vg-jarvis-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Ambient arc glow */}
    <div
      className="vg-jarvis-aura"
      style={{ transform: 'scale(calc(0.9 + var(--vg-level, 0) * 0.5))' }}
    />

    <svg viewBox="0 0 100 100" className="vg-jarvis-svg" fill="none" focusable="false">
      {/* Outer tech ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={HUD_CYAN}
        strokeWidth="1.5"
        strokeDasharray="6 3 2 3"
        opacity="0.6"
        className="vg-jarvis-spin"
      />

      {/* Counter-rotating segment ring */}
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke={HUD_INDIGO}
        strokeWidth="2"
        strokeDasharray="14 10"
        opacity="0.8"
        className="vg-jarvis-spin-rev"
      />

      {/* Hexagonal core housing */}
      <polygon
        points="50,22 74,36 74,64 50,78 26,64 26,36"
        stroke={HUD_CYAN}
        strokeWidth="2"
        fill="#0a101d"
        fillOpacity="0.8"
      />

      {/* Radial reactor nodes */}
      {NODE_ANGLES.map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="50"
          x2={(50 + 20 * Math.cos((deg * Math.PI) / 180)).toFixed(2)}
          y2={(50 + 20 * Math.sin((deg * Math.PI) / 180)).toFixed(2)}
          stroke={HUD_CYAN}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 'calc(0.5 + var(--vg-level, 0) * 0.5)' }}
        />
      ))}

      {/* Core. Bloom and scale are the equaliser — this is JARVIS's "mouth". */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill={HUD_CYAN}
        style={{
          filter: `drop-shadow(0 0 calc(6px + var(--vg-level, 0) * 14px) ${HUD_CYAN})`,
          transform: 'scale(calc(0.85 + var(--vg-level, 0) * 0.6))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
        }}
      />
    </svg>
  </div>
);
