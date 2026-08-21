/**
 * JARVIS avatar — Stark Holographic Arc Reactor (Mark 85).
 *
 * A multi-tiered Stark Industries tactical HUD featuring:
 * - 3-Tier gyroscopic telemetry rings with cardinal degree markers & micro-HUD tags
 * - Counter-rotating segmented gold & titanium-blue magnetic flux coils
 * - 12 Radial laser containment pylons with amplitude-responsive nodes
 * - Vibranium prism core with radiating concentric audio equalizer wave rings
 *
 * Everything reactive reads --vg-level (0..1) written to <html> by store.js,
 * so this component never re-renders while speaking.
 */
import React from 'react';

const HUD_CYAN = '#38bdf8';
const HUD_ELECTRIC = '#00f2fe';
const HUD_INDIGO = '#818cf8';
const HUD_GOLD = '#f59e0b';

/** 12 arc-reactor spokes every 30° */
const PYLON_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/** Cardinal tick markers for the outer HUD dial */
const CARDINAL_TICKS = [
  { deg: 0, label: '0°' },
  { deg: 90, label: '90°' },
  { deg: 180, label: '180°' },
  { deg: 270, label: '270°' },
];

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
    {/* Ambient arc reactor holographic field */}
    <div
      className="vg-jarvis-aura"
      style={{ transform: 'scale(calc(0.95 + var(--vg-level, 0) * 0.55))' }}
    />

    <svg
      viewBox="0 0 100 100"
      className="vg-jarvis-svg"
      fill="none"
      focusable="false"
      style={{ filter: `drop-shadow(0 0 18px ${HUD_ELECTRIC}55)` }}
    >
      <defs>
        {/* Stark Core Hyper-Glow Gradient */}
        <radialGradient id="jarvis-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor={HUD_ELECTRIC} />
          <stop offset="70%" stopColor={HUD_CYAN} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Gold Magnetic Flux Coil Gradient */}
        <linearGradient id="jarvis-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor={HUD_GOLD} />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* --- LAYER 1: Outer Telemetry Compass Ring (Slow CW Spin) --- */}
      <g className="vg-jarvis-spin">
        {/* Outer dotted tracking circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={HUD_CYAN}
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.5"
        />

        {/* 4 Cardinal HUD tick brackets */}
        {CARDINAL_TICKS.map(({ deg }) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 50 + 44 * Math.cos(rad);
          const y1 = 50 + 44 * Math.sin(rad);
          const x2 = 50 + 48 * Math.cos(rad);
          const y2 = 50 + 48 * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke={HUD_ELECTRIC}
              strokeWidth="2"
            />
          );
        })}

        {/* Micro Telemetry HUD Labels */}
        <text
          x="50"
          y="7"
          fill={HUD_CYAN}
          fontSize="3"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
          opacity="0.85"
          letterSpacing="0.5"
        >
          AI.CORE // M85
        </text>
        <text
          x="50"
          y="97"
          fill={HUD_GOLD}
          fontSize="2.8"
          fontFamily="monospace"
          textAnchor="middle"
          opacity="0.75"
        >
          PWR:100%
        </text>
      </g>

      {/* --- LAYER 2: Counter-Rotating Magnetic Flux Coils (CCW Spin) --- */}
      <g className="vg-jarvis-spin-rev">
        {/* Gold segmented magnetic ring */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="url(#jarvis-gold)"
          strokeWidth="2.2"
          strokeDasharray="18 12"
          opacity="0.85"
        />
        {/* Secondary inner cyan ring with dense tick marks */}
        <circle
          cx="50"
          cy="50"
          r="33"
          stroke={HUD_INDIGO}
          strokeWidth="1.2"
          strokeDasharray="4 3 8 3"
          opacity="0.7"
        />
      </g>

      {/* --- LAYER 3: Hexagonal Vibranium Containment Chassis --- */}
      <polygon
        points="50,19 76,34 76,66 50,81 24,66 24,34"
        stroke={HUD_CYAN}
        strokeWidth="1.8"
        fill="#070d19"
        fillOpacity="0.88"
      />
      {/* Inner chamfered hexagon border */}
      <polygon
        points="50,23 72,36 72,64 50,77 28,64 28,36"
        stroke={HUD_INDIGO}
        strokeWidth="1"
        strokeDasharray="5 3"
        opacity="0.65"
      />

      {/* --- LAYER 4: 12 Radial Laser Containment Pylons & Nodes --- */}
      {PYLON_ANGLES.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 50 + 13 * Math.cos(rad);
        const y1 = 50 + 13 * Math.sin(rad);
        const x2 = 50 + 23 * Math.cos(rad);
        const y2 = 50 + 23 * Math.sin(rad);
        const isMajor = i % 2 === 0;
        return (
          <g key={deg}>
            <line
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke={isMajor ? HUD_ELECTRIC : HUD_CYAN}
              strokeWidth={isMajor ? '1.8' : '1'}
              strokeLinecap="round"
              style={{ opacity: `calc(${isMajor ? 0.6 : 0.4} + var(--vg-level, 0) * 0.4)` }}
            />
            {isMajor && (
              <circle
                cx={x2.toFixed(2)}
                cy={y2.toFixed(2)}
                r="1.5"
                fill={HUD_GOLD}
                style={{
                  filter: `drop-shadow(0 0 calc(2px + var(--vg-level, 0) * 4px) ${HUD_GOLD})`,
                  opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)',
                }}
              />
            )}
          </g>
        );
      })}

      {/* --- LAYER 5: Radiating Polar Equalizer Wave Rings (Audio Reactive) --- */}
      {/* Outer audio pulse shockwave */}
      <circle
        cx="50"
        cy="50"
        r="14"
        stroke={HUD_ELECTRIC}
        strokeWidth="1"
        strokeDasharray="2 4"
        style={{
          transform: 'scale(calc(0.9 + var(--vg-level, 0) * 0.7))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
          opacity: 'calc(var(--vg-level, 0) * 0.9)',
          filter: `drop-shadow(0 0 6px ${HUD_ELECTRIC})`,
        }}
      />

      {/* Mid audio pulse ring */}
      <circle
        cx="50"
        cy="50"
        r="11"
        stroke={HUD_CYAN}
        strokeWidth="1.5"
        style={{
          transform: 'scale(calc(0.85 + var(--vg-level, 0) * 0.5))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
          opacity: 'calc(0.5 + var(--vg-level, 0) * 0.5)',
        }}
      />

      {/* --- LAYER 6: Hyper-White Vibranium Core (Mouth & Energy Epicentre) --- */}
      <circle
        cx="50"
        cy="50"
        r="7.5"
        fill="url(#jarvis-core-glow)"
        style={{
          filter: `drop-shadow(0 0 calc(6px + var(--vg-level, 0) * 16px) ${HUD_ELECTRIC})`,
          transform: 'scale(calc(0.8 + var(--vg-level, 0) * 0.65))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
        }}
      />
      {/* Center pinpoint hyper-white spark */}
      <circle
        cx="50"
        cy="50"
        r="3"
        fill="#ffffff"
        style={{
          filter: 'drop-shadow(0 0 4px #ffffff)',
          opacity: 'calc(0.85 + var(--vg-level, 0) * 0.15)',
        }}
      />
    </svg>
  </div>
);
