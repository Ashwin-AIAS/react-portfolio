/**
 * JARVIS avatar — Authentic Movie Stark Industries Mark 85 Arc Reactor & Holographic HUD.
 *
 * True movie-accurate Stark aesthetics:
 * - Stark Arc Cyan & Electric Blue Vibranium Core with hyper-white iris
 * - Stark Titanium Gold segmented electromagnetic flux coils & cardinal telemetry
 * - 3-Tier gyroscopic telemetry cage tumbling in depth
 * - 36-point nano-grid dial with cardinal markers (0°, 90°, 180°, 270°) and micro-HUD labels
 * - 12 Radial laser containment pylons with amplitude-responsive nodes
 * - Concentric sonic shockwaves and audio pulse rings radiating on speech
 * - Hexagonal Vibranium carbon chassis with chamfered golden borders
 *
 * All animations & dynamic transforms read --vg-level (0..1) directly for 60fps performance.
 */
import React from 'react';

/** 12 arc-reactor spokes every 30° */
const PYLON_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/** Cardinal tick markers for the outer HUD dial */
const CARDINAL_TICKS = [
  { deg: 0, label: '0°' },
  { deg: 90, label: '90°' },
  { deg: 180, label: '180°' },
  { deg: 270, label: '270°' },
];

/** Nano-grid: a tick every 10°, so the dial reads as a precision instrument. */
const NANO_TICKS = Array.from({ length: 36 }, (_, i) => i * 10);

/** Staggered sonic shockwave rings emitted on speech. */
const SHOCKWAVES = ['', ' vg-jarvis-shock-2', ' vg-jarvis-shock-3'];

/** 3D Gyroscopic telemetry rings tumbling on independent axes. */
const GYRO_RINGS = [
  { deg: 0, r: 41, cls: '' },
  { deg: 60, r: 36, cls: ' vg-jarvis-gyro-2' },
  { deg: 120, r: 44, cls: ' vg-jarvis-gyro-3' },
];

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the reactor while speaking
 */
export const JarvisAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-jarvis${speaking ? ' vg-jarvis-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Stark Arc Reactor Holographic Field */}
    <div
      className="vg-jarvis-aura"
      style={{ transform: 'scale(calc(0.95 + var(--vg-level, 0) * 0.55))' }}
    />

    <svg
      viewBox="0 0 100 100"
      className="vg-jarvis-svg"
      fill="none"
      focusable="false"
      style={{ filter: 'drop-shadow(0 0 18px rgba(0, 242, 254, 0.75)) drop-shadow(0 0 8px rgba(245, 158, 11, 0.45))' }}
    >
      <defs>
        {/* Stark Core Hyper-Glow (White to Cyan to Electric Blue) */}
        <radialGradient id="jarvis-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#00f2fe" />
          <stop offset="55%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Stark Titanium Gold Gradient */}
        <linearGradient id="jarvis-stark-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Stark Arc Cyan Gradient */}
        <linearGradient id="jarvis-arc-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Vibranium Carbon Chassis Fill */}
        <linearGradient id="jarvis-carbon-chassis" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#070d19" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* --- LAYER 1: Outer Telemetry Compass Ring (Slow CW Spin) --- */}
      <g className="vg-jarvis-spin">
        {/* Outer dotted tracking circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#00f2fe"
          strokeWidth="0.9"
          strokeDasharray="2 6"
          opacity="0.6"
        />

        {/* 4 Cardinal HUD tick brackets (Stark Gold) */}
        {CARDINAL_TICKS.map(({ deg }) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 50 + 43 * Math.cos(rad);
          const y1 = 50 + 43 * Math.sin(rad);
          const x2 = 50 + 48 * Math.cos(rad);
          const y2 = 50 + 48 * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Cardinal degree tags (0°, 90°, 180°, 270°) */}
        {CARDINAL_TICKS.map(({ deg, label }) => {
          const rad = (deg * Math.PI) / 180;
          const x = 50 + 39 * Math.cos(rad);
          const y = 50 + 39 * Math.sin(rad);
          return (
            <text
              key={label}
              x={x.toFixed(2)}
              y={(y + 1.1).toFixed(2)}
              fill="#00f2fe"
              fontSize="3.2"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              opacity="0.9"
            >
              {label}
            </text>
          );
        })}

        {/* Nano-grid ticks every 10° */}
        {NANO_TICKS.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const isMajor = deg % 30 === 0;
          const r1 = isMajor ? 43 : 44.5;
          const x1 = 50 + r1 * Math.cos(rad);
          const y1 = 50 + r1 * Math.sin(rad);
          const x2 = 50 + 47 * Math.cos(rad);
          const y2 = 50 + 47 * Math.sin(rad);
          return (
            <line
              key={`nano-${deg}`}
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke={isMajor ? '#fbbf24' : '#38bdf8'}
              strokeWidth={isMajor ? '0.85' : '0.5'}
              opacity={isMajor ? '0.85' : '0.45'}
            />
          );
        })}

        {/* Micro Telemetry HUD Labels */}
        <text
          x="50"
          y="7.5"
          fill="#fbbf24"
          fontSize="2.9"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
          opacity="0.9"
          letterSpacing="0.6"
        >
          STARK.IND // MK-85
        </text>
        <text
          x="50"
          y="96.5"
          fill="#00f2fe"
          fontSize="2.7"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
          opacity="0.85"
        >
          ARC.PWR: 100%
        </text>
      </g>

      {/* --- LAYER 2: Counter-Rotating Magnetic Flux Coils (CCW Spin) --- */}
      <g className="vg-jarvis-spin-rev">
        {/* Stark Gold Segmented Magnetic Ring */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="url(#jarvis-stark-gold)"
          strokeWidth="2.4"
          strokeDasharray="18 12"
          opacity="0.9"
          style={{ filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.6))' }}
        />
        {/* Secondary inner cyan ring with dense tick marks */}
        <circle
          cx="50"
          cy="50"
          r="33"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="4 3 8 3"
          opacity="0.75"
        />
      </g>

      {/* --- LAYER 2b: 3D Gyroscopic Telemetry Cage --- */}
      <g style={{ opacity: 'calc(0.45 + var(--vg-level, 0) * 0.55)' }}>
        {GYRO_RINGS.map(({ deg, r, cls }) => (
          <g key={deg} transform={`rotate(${deg} 50 50)`}>
            <circle
              cx="50"
              cy="50"
              r={r}
              className={`vg-jarvis-gyro${cls}`}
              stroke="#00f2fe"
              strokeWidth="0.85"
              strokeDasharray="14 4 2 4"
            />
          </g>
        ))}
      </g>

      {/* --- LAYER 3: Hexagonal Vibranium Containment Chassis --- */}
      <polygon
        points="50,19 76,34 76,66 50,81 24,66 24,34"
        stroke="#00f2fe"
        strokeWidth="2"
        fill="url(#jarvis-carbon-chassis)"
        fillOpacity="0.92"
      />
      {/* Inner chamfered hexagon border in Stark Gold */}
      <polygon
        points="50,23 72,36 72,64 50,77 28,64 28,36"
        stroke="url(#jarvis-stark-gold)"
        strokeWidth="1.1"
        strokeDasharray="6 3"
        opacity="0.8"
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
              stroke={isMajor ? '#00f2fe' : '#fbbf24'}
              strokeWidth={isMajor ? '1.8' : '1.1'}
              strokeLinecap="round"
              style={{ opacity: `calc(${isMajor ? 0.7 : 0.5} + var(--vg-level, 0) * 0.35)` }}
            />
            {isMajor && (
              <circle
                cx={x2.toFixed(2)}
                cy={y2.toFixed(2)}
                r="1.6"
                fill="#00f2fe"
                style={{
                  filter: 'drop-shadow(0 0 calc(3px + var(--vg-level, 0) * 6px) #00f2fe)',
                  opacity: 'calc(0.75 + var(--vg-level, 0) * 0.25)',
                }}
              />
            )}
          </g>
        );
      })}

      {/* --- LAYER 5: Radiating Polar Sonic Shockwaves (Audio Reactive) --- */}
      <g style={{ opacity: 'calc(var(--vg-level, 0) * 0.85)' }}>
        {SHOCKWAVES.map((cls) => (
          <circle
            key={cls || 'base'}
            cx="50"
            cy="50"
            r="16"
            className={`vg-jarvis-shock${cls}`}
            stroke="#00f2fe"
            strokeWidth="1"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0, 242, 254, 0.8))' }}
          />
        ))}
      </g>

      {/* Outer audio pulse shockwave */}
      <circle
        cx="50"
        cy="50"
        r="14"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="2 4"
        style={{
          transform: 'scale(calc(0.9 + var(--vg-level, 0) * 0.7))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
          opacity: 'calc(var(--vg-level, 0) * 0.95)',
          filter: 'drop-shadow(0 0 8px #00f2fe)',
        }}
      />

      {/* Mid Stark Gold pulse ring */}
      <circle
        cx="50"
        cy="50"
        r="11"
        stroke="#fbbf24"
        strokeWidth="1.5"
        style={{
          transform: 'scale(calc(0.85 + var(--vg-level, 0) * 0.5))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
          opacity: 'calc(0.6 + var(--vg-level, 0) * 0.4)',
        }}
      />

      {/* --- LAYER 6: Hyper-White Vibranium Core (Energy Epicentre) --- */}
      <circle
        cx="50"
        cy="50"
        r="7.5"
        fill="url(#jarvis-core-glow)"
        style={{
          filter: 'drop-shadow(0 0 calc(8px + var(--vg-level, 0) * 18px) #00f2fe) drop-shadow(0 0 3px #ffffff)',
          transform: 'scale(calc(0.8 + var(--vg-level, 0) * 0.65))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
        }}
      />

      {/* Center White-Hot Iris */}
      <circle
        cx="50"
        cy="50"
        r="3.2"
        fill="#ffffff"
        style={{
          filter: 'drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 10px #00f2fe)',
          opacity: 'calc(0.9 + var(--vg-level, 0) * 0.1)',
        }}
      />
    </svg>
  </div>
);
