/**
 * Megatron avatar — Dark Energon Gladiator Overlord & Fusion Cannon Reticle.
 *
 * A multi-layered Decepticon battle crest featuring:
 * - Multi-faceted obsidian & gunmetal armor chassis with metallic violet bevels
 * - Rotating outer Fusion Cannon targeting reticle ring with plasma charge nodes
 * - Piercing crimson glowing laser optics with sinister brow glare
 * - Forehead Dark Energon Spark Core
 * - Segmented mechanical vocoder grille with glowing Dark Energon exhaust vents (lip sync)
 *
 * Everything reactive reads --vg-level (0..1) written to <html> by store.js,
 * so this component never re-renders while speaking.
 *
 * COLOUR RULE (theme-adaptive, MULTI_THEME_SPEC): the crest has no palette
 * literals left. The Decepticon violets and the crimson optics both collapse
 * onto the theme's accent trio, so the same crest reads correctly in all nine
 * palettes and in both light and dark.
 *
 * Losing the violet/crimson split costs the optics their separate hue, so the
 * menace is carried by VALUE instead: the optics and the vocoder bars take the
 * hottest tier (--accent) against a chassis built from --accent-dim and the
 * surfaces, which keeps them the brightest thing on the crest in every theme.
 * The amplitude-driven glow on both is unchanged, so they still spike on speech.
 *
 * Every token keeps its original literal as the fallback, so an engine that
 * cannot resolve a custom property inside an SVG presentation attribute still
 * renders the crest it always did.
 */
import React from 'react';

/** Hottest tier — optics, spark core, vocoder bars, targeting markers. */
const DECEPTICON_HOT = 'var(--accent, #ff0033)';
/** Mid tier — bevels, brow spire, lens flares. */
const DECEPTICON_EDGE = 'var(--accent-strong, #c084fc)';
/** Falloff tier — reticle dial, sockets, mouthguard frame. */
const DECEPTICON_DEEP = 'var(--accent-dim, #3b0764)';
/** Ambient halo. Pre-multiplied alpha, so it is safe inside drop-shadow(). */
const DECEPTICON_LINE = 'var(--accent-line, rgba(168, 85, 247, 0.53))';
/** Obsidian chassis fill. */
const DECEPTICON_CHASSIS = 'var(--surface-1, #030014)';

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

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the crest while a clip plays
 */
export const MegatronAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-megatron${speaking ? ' vg-megatron-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Dark-Energon vortex aura. Scales with voice amplitude. */}
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
      /* Was `${DECEPTICON_VIOLET}88` — appending an alpha pair to a
         var() would produce garbage, so the halo takes the theme's
         pre-multiplied line colour instead. */
      style={{ filter: `drop-shadow(0 0 18px ${DECEPTICON_LINE})` }}
    >
      <defs>
        {/* Obsidian chassis — the theme's own surfaces. */}
        <linearGradient id="meg-armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--surface-2, #1e1b4b)" />
          <stop offset="50%" stopColor="var(--surface-1, #0f0e1a)" />
          <stop offset="100%" stopColor="var(--surface-1, #030014)" />
        </linearGradient>

        {/* Edge bevel — hottest accent falling to dim across the crown. */}
        <linearGradient id="meg-violet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={DECEPTICON_HOT} />
          <stop offset="50%" stopColor={DECEPTICON_EDGE} />
          <stop offset="100%" stopColor={DECEPTICON_DEEP} />
        </linearGradient>

        {/* Dark Energon Spark Core Glow */}
        <radialGradient id="meg-spark-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={DECEPTICON_HOT} />
          <stop offset="35%" stopColor={DECEPTICON_EDGE} />
          <stop offset="75%" stopColor={DECEPTICON_DEEP} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* --- LAYER 1: Rotating Fusion Cannon Targeting Reticle --- */}
      <g className="vg-megatron-reticle">
        {/* Segmented targeting dial */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={DECEPTICON_DEEP}
          strokeWidth="1.2"
          strokeDasharray="6 14 18 14"
          opacity="0.6"
        />
        {/* Crosshair plasma markers at 45 degree diagonals */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 50 + 45 * Math.cos(rad);
          const cy = 50 + 45 * Math.sin(rad);
          return (
            <circle
              key={deg}
              cx={cx.toFixed(2)}
              cy={cy.toFixed(2)}
              r="2"
              fill={DECEPTICON_HOT}
              style={{
                filter: `drop-shadow(0 0 4px ${DECEPTICON_HOT})`,
                opacity: 'calc(0.65 + var(--vg-level, 0) * 0.35)',
              }}
            />
          );
        })}
      </g>

      {/* --- LAYER 2: Main Decepticon Crown & Spiked Armor Chassis --- */}
      {/* Outer Spiked Crown & Cheek Guards */}
      <polygon
        points="6,18 28,32 50,14 72,32 94,18 82,46 90,56 60,76 50,94 40,76 10,56 18,46"
        fill="url(#meg-armor)"
        stroke="url(#meg-violet)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      {/* Inner chamfered armor contours */}
      <polygon
        points="12,24 30,35 50,20 70,35 88,24 78,46 84,54 58,72 50,88 42,72 16,54 22,46"
        fill="none"
        stroke={DECEPTICON_EDGE}
        strokeWidth="0.8"
        strokeDasharray="4 3"
        opacity="0.45"
      />

      {/* --- LAYER 3: Dark Energon Forehead Spark Core & Brow Spire --- */}
      {/* Sinister Brow Bar */}
      <path
        d="M24 38 L50 28 L76 38"
        stroke={DECEPTICON_EDGE}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Dark Energon Spark Diamond */}
      <polygon
        points="50,22 55,28 50,34 45,28"
        fill="url(#meg-spark-glow)"
        style={{
          filter: `drop-shadow(0 0 calc(3px + var(--vg-level, 0) * 10px) ${DECEPTICON_EDGE})`,
          opacity: 'calc(0.75 + var(--vg-level, 0) * 0.25)',
        }}
      />

      {/* --- LAYER 4: Piercing Crimson Glowing Laser Optics --- */}
      {/* Eye Socket Shadow Plates */}
      <polygon
        points="28,42 47,40 45,52 30,51"
        fill={DECEPTICON_CHASSIS}
        stroke={DECEPTICON_DEEP}
        strokeWidth="1"
      />
      <polygon
        points="72,42 53,40 55,52 70,51"
        fill={DECEPTICON_CHASSIS}
        stroke={DECEPTICON_DEEP}
        strokeWidth="1"
      />

      {/* Left Glowing Crimson Optic */}
      <polygon
        points="30,44 45,42 43,50 31,49"
        fill={DECEPTICON_HOT}
        style={{
          filter: `drop-shadow(0 0 calc(5px + var(--vg-level, 0) * 14px) ${DECEPTICON_HOT})`,
          opacity: 'calc(0.8 + var(--vg-level, 0) * 0.2)',
        }}
      />
      {/* Left Pupil Lens Flare */}
      <line x1="31" y1="46" x2="44" y2="45" stroke={DECEPTICON_EDGE} strokeWidth="1.2" opacity="0.9" />

      {/* Right Glowing Crimson Optic */}
      <polygon
        points="70,44 55,42 57,50 69,49"
        fill={DECEPTICON_HOT}
        style={{
          filter: `drop-shadow(0 0 calc(5px + var(--vg-level, 0) * 14px) ${DECEPTICON_HOT})`,
          opacity: 'calc(0.8 + var(--vg-level, 0) * 0.2)',
        }}
      />
      {/* Right Pupil Lens Flare */}
      <line x1="69" y1="46" x2="56" y2="45" stroke={DECEPTICON_EDGE} strokeWidth="1.2" opacity="0.9" />

      {/* --- LAYER 5: Segmented Mechanical Vocoder Grille (Lip-Sync) --- */}
      {/* Mouth Guard Housing Frame */}
      <path
        d="M30 56 L70 56 L58 76 L50 82 L42 76 Z"
        fill={DECEPTICON_CHASSIS}
        stroke={DECEPTICON_DEEP}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Dark Energon Plasma Exhaust Vents that scale vertically with speech amplitude */}
      <g className="vg-megatron-mouth">
        {MOUTH_BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={BAR_TOP}
            width={BAR_WIDTH}
            height={BAR_HEIGHT}
            rx="1.5"
            fill={DECEPTICON_HOT}
            style={{
              transform: `scaleY(calc(0.18 + var(--vg-level, 0) * ${bar.f * 0.82}))`,
              transformOrigin: '50% 0%',
              transformBox: 'fill-box',
              opacity: `calc(0.65 + var(--vg-level, 0) * ${bar.f * 0.35})`,
              filter: `drop-shadow(0 0 calc(2px + var(--vg-level, 0) * 6px) ${DECEPTICON_EDGE})`,
            }}
          />
        ))}
      </g>
    </svg>
  </div>
);
