import React from 'react';

/**
 * Armored Dark Knight (Batman // WayneTech Batcomputer) Tactical Cowl Avatar.
 *
 * Audio reactivity:
 * - `.vg-batman-aura`: expands with `var(--vg-level, 0)`.
 * - `.vg-batman-vocoder`: WayneTech ultrasonic gold/amber vocoder bars in the
 *   armored jaw guard that oscillate with `var(--vg-level, 0)`.
 * - `.vg-batman-optics`: Glowing detective-mode sonar lenses.
 */
export const BatmanAvatarVisual = ({
  size = 130,
  speaking = false,
  phase = 'stay',
  mode = 'guide',
}) => (
  <div
    className={`vg-batman ${mode === 'stage' ? 'vg-mode-stage' : `vg-phase-${phase}`}${
      speaking ? ' vg-batman-live' : ''
    }`}
    style={{ position: 'relative', width: size, height: size }}
    aria-hidden="true"
  >
    <div
      className="vg-batman-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.45))' }}
    />
    <div className="vg-batman-ring-outer" />

    <svg
      className="vg-batman-svg"
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
          'drop-shadow(0 0 16px rgba(234, 179, 8, 0.55)) drop-shadow(0 0 8px rgba(148, 163, 184, 0.45))',
      }}
    >
      <defs>
        {/* Matte carbon-stealth armor gradient */}
        <linearGradient id="vg-bm-carbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="45%" stopColor="#1e2430" />
          <stop offset="100%" stopColor="#090b10" />
        </linearGradient>

        {/* Dark gunmetal facet plates */}
        <linearGradient id="vg-bm-gunmetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* WayneTech Bat-Signal Gold */}
        <linearGradient id="vg-bm-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Sonar ambient aura */}
        <radialGradient id="vg-bm-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
          <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#060708" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bat-Signal & Ultrasonic Sonar Outer HUD Ring */}
      <circle cx="48" cy="48" r="45" fill="url(#vg-bm-aura)" />
      <g className="vg-batman-sonar">
        <circle
          cx="48"
          cy="48"
          r="43"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.1"
          strokeOpacity="0.55"
          strokeDasharray="16 8 3 8"
        />
        <circle
          cx="48"
          cy="48"
          r="39"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="0.9"
          strokeOpacity="0.4"
          strokeDasharray="6 6"
        />
      </g>

      <g className="vg-batman-head">
        {/* Armored Cape & Collar Shoulders */}
        <path
          d="M 18 84 L 29 70 L 67 70 L 78 84 L 68 90 L 28 90 Z"
          fill="#090b10"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Tall Pointed Bat-Ears */}
        <g className="vg-batman-ears">
          <polygon
            points="23,36 25,7 36,24"
            fill="url(#vg-bm-carbon)"
            stroke="#64748b"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <line x1="25" y1="9" x2="29" y2="30" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.6" />

          <polygon
            points="73,36 71,7 60,24"
            fill="url(#vg-bm-carbon)"
            stroke="#64748b"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <line x1="71" y1="9" x2="67" y2="30" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.6" />
        </g>

        {/* Main Armored Cowl Skull & Brow */}
        <path
          d="M 36 22
             L 48 20
             L 60 22
             L 73 34
             L 73 56
             L 64 72
             L 55 79
             L 41 79
             L 32 72
             L 23 56
             L 23 34 Z"
          fill="url(#vg-bm-carbon)"
          stroke="#475569"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Faceted Forehead Armor Plates */}
        <polygon
          points="36,24 48,21 60,24 56,37 48,39 40,37"
          fill="url(#vg-bm-gunmetal)"
          stroke="#475569"
          strokeWidth="0.8"
        />
        <line x1="48" y1="21" x2="48" y2="54" stroke="#64748b" strokeWidth="1.1" />

        {/* Furrowed Brow & Sharp Nose Bridge Armor */}
        <path
          d="M 25 39 L 41 44 L 48 42 L 55 44 L 71 39"
          fill="none"
          stroke="#090b10"
          strokeWidth="2"
        />
        <polygon
          points="44,43 52,43 54,55 48,58 42,55"
          fill="#0f172a"
          stroke="#64748b"
          strokeWidth="0.9"
        />

        {/* Detective-Mode Glowing Sonar Eyes */}
        <g className="vg-batman-optics">
          <polygon points="27,41 42,45 39,49 26,45" fill="#facc15" opacity="0.4" />
          <polygon points="69,41 54,45 57,49 70,45" fill="#facc15" opacity="0.4" />
          <polygon
            points="28.5,42 41,45.2 38.5,48 27.5,44.8"
            fill="#fef9c3"
            stroke="#eab308"
            strokeWidth="0.9"
          />
          <polygon
            points="67.5,42 55,45.2 57.5,48 68.5,44.8"
            fill="#fef9c3"
            stroke="#eab308"
            strokeWidth="0.9"
          />
        </g>

        {/* Armored Tactical Jawplate */}
        <polygon
          points="29,56 41,56 44,61 52,61 55,56 67,56 62,73 54,78 42,78 34,73"
          fill="#111827"
          stroke="#475569"
          strokeWidth="1"
        />

        {/* WayneTech Gold Ultrasonic Vocoder Grille (Lip-Sync Reactive) */}
        <g className="vg-batman-vocoder-wrap" transform="translate(48, 66)">
          <g
            className="vg-batman-vocoder"
            style={{
              transform: 'scaleY(calc(1 + var(--vg-level, 0) * 1.65))',
              transformOrigin: '0px 0px',
            }}
          >
            <rect
              x="-12"
              y="-3.5"
              width="24"
              height="7"
              rx="1.5"
              fill="#060708"
              stroke="#eab308"
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />
            <line x1="-8" y1="-2.2" x2="-8" y2="2.2" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="-4" y1="-2.8" x2="-4" y2="2.8" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="0" y1="-3.2" x2="0" y2="3.2" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="4" y1="-2.8" x2="4" y2="2.8" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="8" y1="-2.2" x2="8" y2="2.2" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>

        {/* Iconic Gold Bat-Symbol Collar Emblem */}
        <path
          className="vg-batman-emblem"
          d="M 32 82
             L 41 80
             L 45 82
             L 46.5 79.5
             L 48 81
             L 49.5 79.5
             L 51 82
             L 55 80
             L 64 82
             L 58 86
             L 48 88.5
             L 38 86 Z"
          fill="url(#vg-bm-gold)"
          stroke="#060708"
          strokeWidth="0.7"
        />
      </g>
    </svg>
  </div>
);

export default BatmanAvatarVisual;
