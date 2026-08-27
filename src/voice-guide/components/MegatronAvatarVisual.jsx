/**
 * Megatron avatar — Authentic Movie Transformers Decepticon Overlord & Fusion Cannon Matrix.
 *
 * True movie-accurate Decepticon aesthetics:
 * - Sinister Obsidian Gunmetal Titanium armored chassis with sharp razor bevels
 * - Forehead Dark Energon Spark Diamond crackling with purple plasma lightning arcs
 * - Piercing Blood-Red & Cybertronian Crimson glowing laser optics with sinister brow glare
 * - Rotating Fusion Cannon targeting reticle and counter-rotating crosshair with plasma charge points
 * - Segmented Crimson vocoder exhaust vents articulating to voice amplitude (lip sync)
 *
 * All animations & dynamic transforms read --vg-level (0..1) directly for 60fps performance.
 */
import React from 'react';

/**
 * Segmented vocoder mouthguard, 5 bars across the jaw.
 * `f` scales travel: center moves widest, outer pair stays subtle.
 */
const MOUTH_BARS = [
  { x: 34, f: 0.55 },
  { x: 41, f: 0.8 },
  { x: 48, f: 1.0 },
  { x: 55, f: 0.8 },
  { x: 62, f: 0.55 },
];

const BAR_WIDTH = 4.5;
const BAR_TOP = 58;
const BAR_HEIGHT = 14;

/** Fusion-cannon crosshair arms, on the cardinals so they read as a reticle. */
const CROSSHAIRS = [0, 90, 180, 270];

/** Dark Energon flare spikes off the forehead spark, in degrees. */
const SPARK_FLARES = [0, 45, 90, 135];

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the crest while speaking
 */
export const MegatronAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-megatron${speaking ? ' vg-megatron-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Dark Energon vortex plasma aura */}
    <div
      className="vg-megatron-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.5))' }}
    />
    {/* Decepticon containment ring */}
    <div className="vg-megatron-ring" />

    <svg
      viewBox="0 0 100 100"
      className="vg-megatron-svg"
      fill="none"
      focusable="false"
      style={{ filter: 'drop-shadow(0 0 18px rgba(168, 85, 247, 0.7)) drop-shadow(0 0 8px rgba(255, 0, 60, 0.5))' }}
    >
      <defs>
        {/* Sinister Gunmetal Obsidian Armor Chassis */}
        <linearGradient id="meg-gunmetal-chassis" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#332940" />
          <stop offset="40%" stopColor="#1e162a" />
          <stop offset="80%" stopColor="#0d0914" />
          <stop offset="100%" stopColor="#030108" />
        </linearGradient>

        {/* Dark Energon Violet Metallic Bevels */}
        <linearGradient id="meg-energon-violet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="35%" stopColor="#c084fc" />
          <stop offset="70%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>

        {/* Dark Energon Spark Core Radial Glow */}
        <radialGradient id="meg-spark-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f0abfc" />
          <stop offset="55%" stopColor="#c084fc" />
          <stop offset="85%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Piercing Crimson Laser Optics Glow */}
        <radialGradient id="meg-optic-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ff003c" />
          <stop offset="70%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>
      </defs>

      {/* --- LAYER 1: Rotating Fusion Cannon Targeting Reticle --- */}
      <g className="vg-megatron-reticle">
        {/* Segmented targeting dial in Dark Energon violet */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#7e22ce"
          strokeWidth="1.3"
          strokeDasharray="6 14 18 14"
          opacity="0.75"
        />
        {/* Crosshair plasma markers at 45 degree diagonals (Blood-Red) */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 50 + 45 * Math.cos(rad);
          const cy = 50 + 45 * Math.sin(rad);
          return (
            <circle
              key={deg}
              cx={cx.toFixed(2)}
              cy={cy.toFixed(2)}
              r="2.2"
              fill="#ff003c"
              style={{
                filter: 'drop-shadow(0 0 5px #ff003c)',
                opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)',
              }}
            />
          );
        })}
      </g>

      {/* --- LAYER 1b: Counter-Rotating Fusion Cannon Crosshair --- */}
      <g className="vg-megatron-crosshair">
        {CROSSHAIRS.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const inner = { x: 50 + 34 * cos, y: 50 + 34 * sin };
          const outer = { x: 50 + 48 * cos, y: 50 + 48 * sin };
          const node = { x: 50 + 41 * cos, y: 50 + 41 * sin };
          return (
            <g key={deg}>
              <line
                x1={inner.x.toFixed(2)}
                y1={inner.y.toFixed(2)}
                x2={outer.x.toFixed(2)}
                y2={outer.y.toFixed(2)}
                stroke="#c084fc"
                strokeWidth="1.1"
                strokeLinecap="round"
                style={{ opacity: 'calc(0.5 + var(--vg-level, 0) * 0.5)' }}
              />
              {/* Plasma charge diamond riding the arm (Dark Energon Violet) */}
              <rect
                x={(node.x - 1.4).toFixed(2)}
                y={(node.y - 1.4).toFixed(2)}
                width="2.8"
                height="2.8"
                fill="#c084fc"
                transform={`rotate(45 ${node.x.toFixed(2)} ${node.y.toFixed(2)})`}
                style={{
                  filter: 'drop-shadow(0 0 calc(2px + var(--vg-level, 0) * 8px) #c084fc)',
                  opacity: 'calc(0.65 + var(--vg-level, 0) * 0.35)',
                }}
              />
            </g>
          );
        })}
      </g>

      {/* --- LAYER 2: Main Decepticon Crown & Spiked Armor Chassis --- */}
      {/* Outer Spiked Crown & Cheek Guards in Gunmetal Obsidian */}
      <polygon
        points="6,18 28,32 50,14 72,32 94,18 82,46 90,56 60,76 50,94 40,76 10,56 18,46"
        fill="url(#meg-gunmetal-chassis)"
        stroke="url(#meg-energon-violet)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Inner chamfered armor contours in Razor Violet */}
      <polygon
        points="12,24 30,35 50,20 70,35 88,24 78,46 84,54 58,72 50,88 42,72 16,54 22,46"
        fill="none"
        stroke="#a855f7"
        strokeWidth="0.9"
        strokeDasharray="4 3"
        opacity="0.55"
      />

      {/* --- LAYER 3: Dark Energon Forehead Spark Core & Brow Spire --- */}
      {/* Sinister Brow Spire */}
      <path
        d="M24 38 L50 28 L76 38"
        stroke="#c084fc"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dark Energon Spark Lightning Flares */}
      <g
        className="vg-megatron-flare"
        style={{ opacity: 'calc(var(--vg-level, 0) * 0.95)' }}
      >
        {SPARK_FLARES.map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="14"
            x2="50"
            y2="42"
            stroke={deg % 90 === 0 ? '#ff003c' : '#c084fc'}
            strokeWidth={deg % 90 === 0 ? '1.1' : '0.75'}
            strokeLinecap="round"
            transform={`rotate(${deg} 50 28)`}
            style={{ filter: 'drop-shadow(0 0 calc(3px + var(--vg-level, 0) * 9px) #c084fc)' }}
          />
        ))}
      </g>

      {/* Central Dark Energon Spark Diamond */}
      <polygon
        points="50,21 56,28 50,35 44,28"
        fill="url(#meg-spark-glow)"
        style={{
          filter: 'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 12px) #c084fc)',
          opacity: 'calc(0.85 + var(--vg-level, 0) * 0.15)',
        }}
      />

      {/* --- LAYER 4: Piercing Crimson Glowing Laser Optics --- */}
      {/* Eye Socket Shadow Sockets */}
      <polygon
        points="27,42 47,39 45,52 29,51"
        fill="#020108"
        stroke="#3b0764"
        strokeWidth="1"
      />
      <polygon
        points="73,42 53,39 55,52 71,51"
        fill="#020108"
        stroke="#3b0764"
        strokeWidth="1"
      />

      {/* Left Glowing Blood-Red Laser Optic */}
      <polygon
        points="29,43.5 45,41.5 43,50 30,49"
        fill="#ff003c"
        style={{
          filter: 'drop-shadow(0 0 calc(6px + var(--vg-level, 0) * 16px) #ff003c) drop-shadow(0 0 3px #ffffff)',
          opacity: 'calc(0.9 + var(--vg-level, 0) * 0.1)',
        }}
      />
      {/* Left Pupil Highlight */}
      <line x1="30" y1="45.5" x2="44" y2="44.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

      {/* Right Glowing Blood-Red Laser Optic */}
      <polygon
        points="71,43.5 55,41.5 57,50 70,49"
        fill="#ff003c"
        style={{
          filter: 'drop-shadow(0 0 calc(6px + var(--vg-level, 0) * 16px) #ff003c) drop-shadow(0 0 3px #ffffff)',
          opacity: 'calc(0.9 + var(--vg-level, 0) * 0.1)',
        }}
      />
      {/* Right Pupil Highlight */}
      <line x1="70" y1="45.5" x2="56" y2="44.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

      {/* --- LAYER 5: Segmented Mechanical Vocoder Grille (Lip-Sync) --- */}
      {/* Mouth Guard Housing Frame in Gunmetal Obsidian */}
      <path
        d="M29 55 L71 55 L58 76 L50 82 L42 76 Z"
        fill="url(#meg-gunmetal-chassis)"
        stroke="#581c87"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Crimson Dark Energon Plasma Exhaust Vents that scale with speech amplitude */}
      <g className="vg-megatron-mouth">
        {MOUTH_BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={BAR_TOP}
            width={BAR_WIDTH}
            height={BAR_HEIGHT}
            rx="1.5"
            fill="#ff003c"
            style={{
              transform: `scaleY(calc(0.2 + var(--vg-level, 0) * ${bar.f * 0.8}))`,
              transformOrigin: '50% 0%',
              transformBox: 'fill-box',
              opacity: `calc(0.7 + var(--vg-level, 0) * ${bar.f * 0.3})`,
              filter: 'drop-shadow(0 0 calc(3px + var(--vg-level, 0) * 8px) #ff003c)',
            }}
          />
        ))}
      </g>
    </svg>
  </div>
);
