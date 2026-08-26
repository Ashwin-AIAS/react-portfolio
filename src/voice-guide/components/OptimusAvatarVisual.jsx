/**
 * Optimus Prime avatar — Authentic Movie Transformers Battle Armor & Cybertronian Matrix.
 *
 * True movie-accurate multi-tone aesthetics:
 * - Peterbilt Cobalt Royal Blue crown, antenna fins & forehead battle crest
 * - Flaming Autobot Crimson Red temple accents & shoulder bevel armor
 * - Polished Titanium & Chrome Silver articulated battle mask (with audio-reactive intake flutes)
 * - Piercing Energon / AllSpark Cyan glowing laser optics with anamorphic lens flares
 * - Golden Brass Collar Housing holding the glowing Matrix of Leadership crystal
 *
 * All animations & dynamic transforms read --vg-level (0..1) directly for 60fps performance.
 */
import React from 'react';

/** Laser optic centres — anchors for the glowing eyes and anamorphic flares. */
const OPTICS = [
  { cx: 38.5, cy: 48 },
  { cx: 61.5, cy: 48 },
];

/** Cybertronian scanline interference across the battle chassis. */
const SCANLINES = [16, 24, 32, 40, 48, 56, 64, 72, 80, 88];

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the crest while speaking
 */
export const OptimusAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-optimus${speaking ? ' vg-optimus-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Energon / Cybertronian energy aura */}
    <div
      className="vg-optimus-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.45))' }}
    />
    {/* Matrix of Leadership resonance ring */}
    <div className="vg-optimus-ring" />

    <svg
      viewBox="0 0 100 100"
      className="vg-optimus-svg"
      fill="none"
      focusable="false"
      style={{ filter: 'drop-shadow(0 0 18px rgba(0, 242, 254, 0.65)) drop-shadow(0 0 8px rgba(29, 78, 216, 0.7))' }}
    >
      <defs>
        {/* Deep Cybertronian Cobalt Blue Armor */}
        <linearGradient id="opt-cobalt-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="25%" stopColor="#2563eb" />
          <stop offset="65%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0c1e4a" />
        </linearGradient>

        {/* Autobot Flame Crimson Red Armor */}
        <linearGradient id="opt-crimson-flame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>

        {/* Polished Chrome & Titanium Silver Bevels */}
        <linearGradient id="opt-chrome-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="75%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Dark Gunmetal Chassis Base */}
        <linearGradient id="opt-dark-chassis" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Matrix of Leadership Golden Housing */}
        <linearGradient id="opt-matrix-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        {/* Energon / AllSpark Core Radial Glow */}
        <radialGradient id="opt-energon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#67e8f9" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Silhouette clip for holographic scanlines */}
        <clipPath id="opt-helmet-clip">
          <polygon points="50,6 84,20 84,56 72,86 50,95 28,86 16,56 16,20" />
        </clipPath>
      </defs>

      {/* --- LAYER 1: Titanium Ear Antenna Fins (Cobalt + Chrome bevels) --- */}
      {/* Left Antenna */}
      <path
        d="M18 42 L10 18 L20 27 L23 48 Z"
        fill="url(#opt-cobalt-metal)"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 24 L11 19 L19 28 Z"
        fill="url(#opt-chrome-silver)"
        opacity="0.9"
      />

      {/* Right Antenna */}
      <path
        d="M82 42 L90 18 L80 27 L77 48 Z"
        fill="url(#opt-cobalt-metal)"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M86 24 L89 19 L81 28 Z"
        fill="url(#opt-chrome-silver)"
        opacity="0.9"
      />

      {/* --- LAYER 2: Main Helmet Base & Outer Armor (Dark Chassis + Cobalt Edge) --- */}
      <polygon
        points="50,6 84,20 84,56 72,86 50,95 28,86 16,56 16,20"
        fill="url(#opt-dark-chassis)"
        stroke="#2563eb"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Outer Autobot Red Flame Accent Trim */}
      <polygon
        points="50,9 81,22 81,54 70,83 50,92 30,83 19,54 19,22"
        fill="none"
        stroke="url(#opt-crimson-flame)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Inner contour telemetry line */}
      <polygon
        points="50,13 77,25 77,52 67,79 50,87 33,79 23,52 23,25"
        fill="none"
        stroke="#00f2fe"
        strokeWidth="0.75"
        strokeDasharray="4 2"
        opacity="0.6"
      />

      {/* --- LAYER 3: Forehead Command Crown & Central Ridge (Cobalt + Chrome Ridge) --- */}
      <path
        d="M34 22 L50 9 L66 22 L61 36 L39 36 Z"
        fill="url(#opt-cobalt-metal)"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Central crest chrome ridge */}
      <polygon
        points="48,10 52,10 51,36 49,36"
        fill="url(#opt-chrome-silver)"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
      <circle cx="50" cy="17" r="2.2" fill="#00f2fe" style={{ filter: 'drop-shadow(0 0 3px #00f2fe)' }} />

      {/* --- LAYER 4: Cheek Flutes & Temple Shielding (Crimson Flame + Gunmetal) --- */}
      <path
        d="M22 37 L36 41 L34 56 L19 51 Z"
        fill="url(#opt-crimson-flame)"
        stroke="#ef4444"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M78 37 L64 41 L66 56 L81 51 Z"
        fill="url(#opt-crimson-flame)"
        stroke="#ef4444"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Titanium Flute Lines */}
      <line x1="23" y1="44" x2="33" y2="47" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
      <line x1="77" y1="44" x2="67" y2="47" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

      {/* --- LAYER 5: Glowing Energon Laser Optics with Anamorphic Flares --- */}
      {/* Eye brow shadow visor */}
      <path
        d="M31 40 L50 43 L69 40 L67 45 L50 47 L33 45 Z"
        fill="#020617"
        stroke="#1d4ed8"
        strokeWidth="1"
      />

      {/* Left Laser Optic */}
      <polygon
        points="34,45 45,45 42,51 32,49"
        fill="#00f2fe"
        style={{
          filter: 'drop-shadow(0 0 calc(5px + var(--vg-level, 0) * 14px) #00f2fe) drop-shadow(0 0 2px #ffffff)',
          opacity: 'calc(0.85 + var(--vg-level, 0) * 0.15)',
        }}
      />
      <line x1="33" y1="47.5" x2="44" y2="47.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

      {/* Right Laser Optic */}
      <polygon
        points="66,45 55,45 58,51 68,49"
        fill="#00f2fe"
        style={{
          filter: 'drop-shadow(0 0 calc(5px + var(--vg-level, 0) * 14px) #00f2fe) drop-shadow(0 0 2px #ffffff)',
          opacity: 'calc(0.85 + var(--vg-level, 0) * 0.15)',
        }}
      />
      <line x1="67" y1="47.5" x2="56" y2="47.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

      {/* Anamorphic Laser Diffraction Flares */}
      {OPTICS.map(({ cx, cy }) => (
        <g
          key={cx}
          className="vg-optimus-flare"
          style={{
            opacity: 'calc(0.25 + var(--vg-level, 0) * 0.75)',
            filter: 'drop-shadow(0 0 calc(3px + var(--vg-level, 0) * 10px) #00f2fe)',
          }}
        >
          <line x1={cx - 28} y1={cy} x2={cx + 28} y2={cy} stroke="#00f2fe" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
          <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke="#67e8f9" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />
          <line x1={cx - 9} y1={cy - 9} x2={cx + 9} y2={cy + 9} stroke="#38bdf8" strokeWidth="0.45" strokeLinecap="round" opacity="0.5" />
          <line x1={cx - 9} y1={cy + 9} x2={cx + 9} y2={cy - 9} stroke="#38bdf8" strokeWidth="0.45" strokeLinecap="round" opacity="0.5" />
          <circle cx={cx} cy={cy} r="1.3" fill="#ffffff" style={{ opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)' }} />
        </g>
      ))}

      {/* --- LAYER 6: Hydraulic Articulated Chrome Battle Mask (Lip Sync) --- */}
      {/* Nose bridge mount */}
      <polygon points="50,46 44,55 56,55" fill="url(#opt-dark-chassis)" stroke="#2563eb" strokeWidth="1" />

      {/* Articulating Faceplate / Grille that scales with voice amplitude */}
      <g
        className="vg-optimus-mask"
        style={{
          transform: 'scaleY(calc(1 + var(--vg-level, 0) * 0.75))',
          transformOrigin: '50% 68%',
          transformBox: 'view-box',
        }}
      >
        {/* Main mask plate in Polished Chrome Silver */}
        <path
          d="M37 57 L63 57 L58 77 L50 82 L42 77 Z"
          fill="url(#opt-chrome-silver)"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Titanium intake flutes */}
        <line x1="41" y1="62" x2="59" y2="62" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="43" y1="67" x2="57" y2="67" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="45" y1="72" x2="55" y2="72" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Center metallic highlight */}
        <line x1="50" y1="58" x2="50" y2="80" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
      </g>

      {/* --- LAYER 7: Matrix of Leadership Collar Core --- */}
      {/* Golden Collar V-mount */}
      <path
        d="M33 83 L50 77 L67 83 L50 94 Z"
        fill="url(#opt-matrix-gold)"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Matrix resonance rings (Audio Reactive) */}
      <g style={{ opacity: 'calc(var(--vg-level, 0) * 0.9)' }}>
        <circle cx="50" cy="85" r="6.5" className="vg-optimus-matrix" stroke="#00f2fe" strokeWidth="1" />
        <circle cx="50" cy="85" r="6.5" className="vg-optimus-matrix vg-optimus-matrix-2" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 2" />
      </g>

      {/* Glowing Matrix Crystal at the base */}
      <polygon
        points="50,79 55,85 50,91 45,85"
        fill="url(#opt-energon-glow)"
        style={{
          filter: 'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 10px) #00f2fe)',
          opacity: 'calc(0.8 + var(--vg-level, 0) * 0.2)',
        }}
      />

      {/* --- LAYER 8: Holographic Scanlines --- */}
      <g clipPath="url(#opt-helmet-clip)" style={{ opacity: 'calc(0.35 + var(--vg-level, 0) * 0.3)' }}>
        <g className="vg-optimus-scan">
          {SCANLINES.map((y) => (
            <line
              key={y}
              x1="12"
              y1={y}
              x2="88"
              y2={y}
              stroke="#38bdf8"
              strokeWidth="0.6"
              strokeDasharray="1 3"
              opacity="0.4"
            />
          ))}
        </g>
      </g>
    </svg>
  </div>
);
