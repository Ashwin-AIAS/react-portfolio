import React from 'react';

/**
 * Bumblebee (Autobot Scout // Cybertronian Radio-Synth Core) Helmet Avatar.
 *
 * Audio reactivity:
 * - `.vg-bumblebee-aura`: expands with `var(--vg-level, 0)`.
 * - `.vg-bumblebee-vocoder`: Circular Cybertronian stinger/radio-synth
 *   pacifier core that expands and ripples with `var(--vg-level, 0)`.
 * - `.vg-bumblebee-optics`: Bright Autobot cyan-blue optics.
 */
export const BumblebeeAvatarVisual = ({
  size = 130,
  speaking = false,
  phase = 'stay',
  mode = 'guide',
}) => (
  <div
    className={`vg-bumblebee ${mode === 'stage' ? 'vg-mode-stage' : `vg-phase-${phase}`}${
      speaking ? ' vg-bumblebee-live' : ''
    }`}
    style={{ position: 'relative', width: size, height: size }}
    aria-hidden="true"
  >
    <div
      className="vg-bumblebee-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.45))' }}
    />
    <div className="vg-bumblebee-ring-outer" />

    <svg
      className="vg-bumblebee-svg"
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
          'drop-shadow(0 0 16px rgba(250, 204, 21, 0.65)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.55))',
      }}
    >
      <defs>
        {/* Cybertronian Gold-Yellow Armor Gradient */}
        <linearGradient id="vg-bb-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="85%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        {/* Gunmetal Mechanical Inner Frame */}
        <linearGradient id="vg-bb-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Autobot Cyan Optic & Vocoder Glow */}
        <radialGradient id="vg-bb-cyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>

        {/* Ambient Yellow/Cyan Scout Aura */}
        <radialGradient id="vg-bb-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.32" />
          <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#07060e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Honeycomb & Radio Frequency Ring */}
      <circle cx="48" cy="48" r="45" fill="url(#vg-bb-aura)" />
      <g className="vg-bumblebee-ring">
        <circle
          cx="48"
          cy="48"
          r="43"
          fill="none"
          stroke="#facc15"
          strokeWidth="1.1"
          strokeOpacity="0.55"
          strokeDasharray="12 5 3 5"
        />
        <circle
          cx="48"
          cy="48"
          r="39"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="18 10"
        />
      </g>

      <g className="vg-bumblebee-head">
        {/* Articulated Scout Antennae Horns */}
        <g className="vg-bumblebee-horns">
          <polygon
            points="27,23 19,10 24,8 34,20"
            fill="url(#vg-bb-yellow)"
            stroke="#854d0e"
            strokeWidth="1"
          />
          <polygon
            points="69,23 77,10 72,8 62,20"
            fill="url(#vg-bb-yellow)"
            stroke="#854d0e"
            strokeWidth="1"
          />
        </g>

        {/* Rounded Cybertronian Yellow Helmet Dome */}
        <path
          d="M 48 13
             C 30 13, 19 25, 19 42
             L 21 60
             L 31 76
             L 41 82
             L 55 82
             L 65 76
             L 75 60
             L 77 42
             C 77 25, 66 13, 48 13 Z"
          fill="url(#vg-bb-yellow)"
          stroke="#fef08a"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Iconic Black Racing Stripes on Helmet Crown */}
        <polygon points="37,15 42,14 44,31 39,31" fill="#0f172a" />
        <polygon points="59,15 54,14 52,31 57,31" fill="#0f172a" />

        {/* Central Forehead Crest & Autobot Scout Sensor */}
        <polygon
          points="45,16 51,16 53,33 48,36 43,33"
          fill="url(#vg-bb-metal)"
          stroke="#facc15"
          strokeWidth="0.8"
        />
        <polygon points="46.5,22 49.5,22 50.5,28 48,30 45.5,28" fill="#ef4444" />

        {/* Side Audio-Transceiver Ear Pods */}
        <rect
          x="15"
          y="39"
          width="5"
          height="16"
          rx="2"
          fill="url(#vg-bb-metal)"
          stroke="#facc15"
          strokeWidth="0.8"
        />
        <rect
          x="76"
          y="39"
          width="5"
          height="16"
          rx="2"
          fill="url(#vg-bb-metal)"
          stroke="#facc15"
          strokeWidth="0.8"
        />

        {/* Metallic Gunmetal Inner Faceplate */}
        <path
          d="M 25 36
             L 48 39
             L 71 36
             L 70 59
             L 59 75
             L 37 75
             L 26 59 Z"
          fill="url(#vg-bb-metal)"
          stroke="#1e293b"
          strokeWidth="1.1"
        />

        {/* Yellow Cheek Armor Guards */}
        <polygon
          points="22,48 33,52 36,70 25,63"
          fill="url(#vg-bb-yellow)"
          stroke="#854d0e"
          strokeWidth="0.9"
        />
        <polygon
          points="74,48 63,52 60,70 71,63"
          fill="url(#vg-bb-yellow)"
          stroke="#854d0e"
          strokeWidth="0.9"
        />

        {/* Bright Round/Hexagonal Autobot Blue Optics */}
        <g className="vg-bumblebee-optics">
          <circle cx="36" cy="45" r="5.6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <circle cx="60" cy="45" r="5.6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <circle cx="36" cy="45" r="4.2" fill="url(#vg-bb-cyan)" />
          <circle cx="60" cy="45" r="4.2" fill="url(#vg-bb-cyan)" />
          <circle cx="34.8" cy="43.8" r="1.2" fill="#ffffff" />
          <circle cx="58.8" cy="43.8" r="1.2" fill="#ffffff" />
        </g>

        {/* Nose Ridge */}
        <polygon
          points="46,43 50,43 51,52 48,54 45,52"
          fill="#64748b"
          stroke="#0f172a"
          strokeWidth="0.7"
        />

        {/* Audio-Reactive Circular Radio-Vocoder Core */}
        <g className="vg-bumblebee-vocoder-wrap" transform="translate(48, 64)">
          <g
            className="vg-bumblebee-vocoder"
            style={{
              transform: 'scale(calc(1 + var(--vg-level, 0) * 0.42))',
              transformOrigin: '0px 0px',
            }}
          >
            <circle cx="0" cy="0" r="8.5" fill="#0f172a" stroke="#facc15" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="6.2" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.9" />
            <circle className="vg-bumblebee-vocoder-core" cx="0" cy="0" r="4.2" fill="url(#vg-bb-cyan)" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#0f172a" strokeWidth="1" />
            <line x1="0" y1="-6" x2="0" y2="6" stroke="#0f172a" strokeWidth="1" />
          </g>
        </g>

        {/* Chin Strap */}
        <polygon
          points="40,75 56,75 53,82 43,82"
          fill="url(#vg-bb-yellow)"
          stroke="#854d0e"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  </div>
);

export default BumblebeeAvatarVisual;
