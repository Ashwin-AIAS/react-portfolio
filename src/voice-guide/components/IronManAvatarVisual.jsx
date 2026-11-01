import React from 'react';

/**
 * Mark 85 Iron Man Armored Helmet & Repulsor HUD Avatar.
 *
 * Audio reactivity:
 * - `.vg-ironman-aura`: expands with `var(--vg-level, 0)`.
 * - `.vg-ironman-mouth`: precision faceplate jaw slit that opens & flares
 *   with `var(--vg-level, 0)`.
 * - `.vg-ironman-reactor`: triangular collar Nano-Arc Reactor that pulses
 *   with `var(--vg-level, 0)`.
 */
export const IronManAvatarVisual = ({
  size = 130,
  speaking = false,
  phase = 'stay',
  mode = 'guide',
}) => (
  <div
    className={`vg-ironman ${mode === 'stage' ? 'vg-mode-stage' : `vg-phase-${phase}`}${
      speaking ? ' vg-ironman-live' : ''
    }`}
    style={{ position: 'relative', width: size, height: size }}
    aria-hidden="true"
  >
    <div
      className="vg-ironman-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.45))' }}
    />
    <div className="vg-ironman-ring-outer" />

    <svg
      className="vg-ironman-svg"
      viewBox="0 0 96 96"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        filter:
          'drop-shadow(0 0 16px rgba(230, 57, 70, 0.65)) drop-shadow(0 0 8px rgba(251, 191, 36, 0.55))',
      }}
    >
      <defs>
        {/* Hot-rod crimson titanium armor gradient */}
        <linearGradient id="vg-im-crimson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5964" />
          <stop offset="45%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>

        {/* Brushed gold-titanium faceplate gradient */}
        <linearGradient id="vg-im-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Ambient crimson/gold backplate aura */}
        <radialGradient id="vg-im-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e63946" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#080406" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Holographic HUD targeting ring */}
      <circle cx="48" cy="48" r="45" fill="url(#vg-im-aura)" />
      <g className="vg-ironman-ring">
        <circle
          cx="48"
          cy="48"
          r="43"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeDasharray="10 6 2 6"
        />
        <circle
          cx="48"
          cy="48"
          r="39"
          fill="none"
          stroke="#e63946"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          strokeDasharray="22 12"
        />
      </g>

      <g className="vg-ironman-head">
        {/* Collar / Neck Nano-Armor */}
        <path
          d="M 28 74 L 35 88 L 61 88 L 68 74 Z"
          fill="#450a0a"
          stroke="#991b1b"
          strokeWidth="1"
        />
        <path
          d="M 33 77 L 39 87 L 57 87 L 63 77 Z"
          fill="url(#vg-im-crimson)"
          stroke="#fbbf24"
          strokeWidth="0.7"
          strokeOpacity="0.6"
        />

        {/* Outer Crimson Titanium Helmet Dome & Cheek Shells */}
        <path
          d="M 48 11
             C 31 11, 20 22, 20 39
             L 22 59
             L 30 74
             L 40 80
             L 56 80
             L 66 74
             L 74 59
             L 76 39
             C 76 22, 65 11, 48 11 Z"
          fill="url(#vg-im-crimson)"
          stroke="#fca5a5"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Helmet Side Ear / Comms Pods */}
        <polygon
          points="17,38 21,34 22,54 18,57"
          fill="#991b1b"
          stroke="#fbbf24"
          strokeWidth="0.8"
        />
        <polygon
          points="79,38 75,34 74,54 78,57"
          fill="#991b1b"
          stroke="#fbbf24"
          strokeWidth="0.8"
        />

        {/* Crown Center Seam & Forehead Armor Groove */}
        <line x1="48" y1="11" x2="48" y2="27" stroke="#450a0a" strokeWidth="1.4" />
        <path
          d="M 37 15 L 42 27 L 54 27 L 59 15"
          fill="none"
          stroke="#fca5a5"
          strokeWidth="0.8"
          strokeOpacity="0.55"
        />

        {/* Iconic Gold-Titanium Alloy Faceplate (Mark 85 contour) */}
        <path
          className="vg-ironman-faceplate"
          d="M 34 22
             L 42 27
             L 54 27
             L 62 22
             L 70 34
             L 69 54
             L 59 69
             L 55 75
             L 41 75
             L 37 69
             L 27 54
             L 26 34 Z"
          fill="url(#vg-im-gold)"
          stroke="#78350f"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Crimson Chin Guard Insert */}
        <polygon
          points="41,71 55,71 53,79 43,79"
          fill="url(#vg-im-crimson)"
          stroke="#fbbf24"
          strokeWidth="0.8"
        />

        {/* Cheek Intake Bevel Lines */}
        <path
          d="M 28 46 L 36 53 L 39 67"
          fill="none"
          stroke="#451a03"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M 68 46 L 60 53 L 57 67"
          fill="none"
          stroke="#451a03"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* Brow Armor Ridge */}
        <path
          d="M 28 38 L 41 42 L 48 41 L 55 42 L 68 38"
          fill="none"
          stroke="#78350f"
          strokeWidth="1.4"
        />

        {/* Glowing Arc-Blue / White HUD Eye Slits */}
        <g className="vg-ironman-optics">
          <polygon points="29,40 43,43 41,47 28,44" fill="#38bdf8" opacity="0.45" />
          <polygon points="67,40 53,43 55,47 68,44" fill="#38bdf8" opacity="0.45" />
          <polygon
            points="30,41 42,43.5 40.5,46 29.5,43.5"
            fill="#e0f2fe"
            stroke="#38bdf8"
            strokeWidth="0.9"
          />
          <polygon
            points="66,41 54,43.5 55.5,46 66.5,43.5"
            fill="#e0f2fe"
            stroke="#38bdf8"
            strokeWidth="0.9"
          />
          <line x1="32" y1="42.5" x2="39" y2="44" stroke="#ffffff" strokeWidth="1" />
          <line x1="64" y1="42.5" x2="57" y2="44" stroke="#ffffff" strokeWidth="1" />
        </g>

        {/* Audio-Reactive Faceplate Jaw Slit (Lip-Sync Vocoder) */}
        <g className="vg-ironman-mouth-wrap" transform="translate(48, 64)">
          <g
            className="vg-ironman-mouth"
            style={{
              transform: 'scaleY(calc(1 + var(--vg-level, 0) * 2.2))',
              transformOrigin: '0px 0px',
            }}
          >
            <polygon
              points="-11,0 -7,-2 7,-2 11,0 8,2.5 -8,2.5"
              fill="#1c0d13"
              stroke="#78350f"
              strokeWidth="0.9"
            />
            <polygon
              className="vg-ironman-mouth-glow"
              points="-9,0 -6,-1.2 6,-1.2 9,0 6,1.4 -6,1.4"
              fill="#38bdf8"
              style={{ opacity: 'calc(0.45 + var(--vg-level, 0) * 0.55)' }}
            />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffffff" strokeWidth="0.9" />
          </g>
        </g>

        {/* Collar Mini Triangular Mark 85 Nano-Arc Reactor */}
        <g
          className="vg-ironman-reactor"
          transform="translate(48, 83)"
          style={{
            transform: 'translate(48px, 83px) scale(calc(1 + var(--vg-level, 0) * 0.35))',
          }}
        >
          <polygon
            points="-6,-3.5 6,-3.5 0,5.5"
            fill="#0284c7"
            stroke="#bae6fd"
            strokeWidth="0.9"
          />
          <polygon points="-3.5,-2 3.5,-2 0,3" fill="#ffffff" />
        </g>
      </g>
    </svg>
  </div>
);

export default IronManAvatarVisual;
