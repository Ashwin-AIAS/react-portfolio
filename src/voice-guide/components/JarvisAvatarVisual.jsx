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
 *
 * COLOUR RULE (theme-adaptive, MULTI_THEME_SPEC): the reactor has no palette
 * literals left. The four hardcoded HUD hues (cyan / electric / indigo / gold)
 * collapse onto the theme's accent trio, which is what lets the same reactor
 * read correctly in all nine palettes and in both light and dark. The depth
 * that used to come from four unrelated hues now comes from three tiers of one
 * hue plus the ring geometry — the dash patterns and stroke widths were already
 * distinct, so the layers stay separable without borrowing a second colour.
 *
 * Structure (the containment chassis) comes from --surface-1 instead, so the
 * hexagon reads as a cut-out in the page rather than a black hole on top of it.
 *
 * Every token keeps its original literal as the fallback, so an engine that
 * cannot resolve a custom property inside an SVG presentation attribute still
 * renders the reactor it always did.
 */
import React from 'react';

/** Hottest tier — cardinal ticks, core, shockwave. Was HUD_ELECTRIC. */
const HUD_ACCENT = 'var(--accent, #00f2fe)';
/** Mid tier — outer dial, flux coil, pylon nodes. Was HUD_CYAN / HUD_GOLD. */
const HUD_SOFT = 'var(--accent-strong, #38bdf8)';
/** Falloff tier — the inner tick ring and the chamfered border. Was HUD_INDIGO. */
const HUD_DEEP = 'var(--accent-dim, #818cf8)';
/** Ambient halo. Pre-multiplied alpha, so it is safe inside drop-shadow(). */
const HUD_LINE = 'var(--accent-line, rgba(0, 242, 254, 0.35))';
/** Containment chassis fill. */
const HUD_CHASSIS = 'var(--surface-1, #070d19)';

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
      /* Was `${HUD_ELECTRIC}55` — appending an alpha pair to a var()
         would produce garbage, so the halo takes the theme's
         pre-multiplied line colour, which is the same ~0.35 alpha. */
      style={{ filter: `drop-shadow(0 0 18px ${HUD_LINE})` }}
    >
      <defs>
        {/* Stark Core Hyper-Glow Gradient */}
        <radialGradient id="jarvis-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={HUD_ACCENT} />
          <stop offset="35%" stopColor={HUD_SOFT} />
          <stop offset="70%" stopColor={HUD_DEEP} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Magnetic Flux Coil Gradient — was gold, now the accent walked down. */}
        <linearGradient id="jarvis-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={HUD_ACCENT} />
          <stop offset="50%" stopColor={HUD_SOFT} />
          <stop offset="100%" stopColor={HUD_DEEP} />
        </linearGradient>
      </defs>

      {/* --- LAYER 1: Outer Telemetry Compass Ring (Slow CW Spin) --- */}
      <g className="vg-jarvis-spin">
        {/* Outer dotted tracking circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={HUD_SOFT}
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
              stroke={HUD_ACCENT}
              strokeWidth="2"
            />
          );
        })}

        {/* Micro Telemetry HUD Labels */}
        <text
          x="50"
          y="7"
          fill={HUD_SOFT}
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
          fill={HUD_SOFT}
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
          stroke={HUD_DEEP}
          strokeWidth="1.2"
          strokeDasharray="4 3 8 3"
          opacity="0.7"
        />
      </g>

      {/* --- LAYER 3: Hexagonal Vibranium Containment Chassis --- */}
      <polygon
        points="50,19 76,34 76,66 50,81 24,66 24,34"
        stroke={HUD_SOFT}
        strokeWidth="1.8"
        fill={HUD_CHASSIS}
        fillOpacity="0.88"
      />
      {/* Inner chamfered hexagon border */}
      <polygon
        points="50,23 72,36 72,64 50,77 28,64 28,36"
        stroke={HUD_DEEP}
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
              stroke={isMajor ? HUD_ACCENT : HUD_SOFT}
              strokeWidth={isMajor ? '1.8' : '1'}
              strokeLinecap="round"
              style={{ opacity: `calc(${isMajor ? 0.6 : 0.4} + var(--vg-level, 0) * 0.4)` }}
            />
            {isMajor && (
              <circle
                cx={x2.toFixed(2)}
                cy={y2.toFixed(2)}
                r="1.5"
                fill={HUD_SOFT}
                style={{
                  filter: `drop-shadow(0 0 calc(2px + var(--vg-level, 0) * 4px) ${HUD_SOFT})`,
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
        stroke={HUD_ACCENT}
        strokeWidth="1"
        strokeDasharray="2 4"
        style={{
          transform: 'scale(calc(0.9 + var(--vg-level, 0) * 0.7))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
          opacity: 'calc(var(--vg-level, 0) * 0.9)',
          filter: `drop-shadow(0 0 6px ${HUD_ACCENT})`,
        }}
      />

      {/* Mid audio pulse ring */}
      <circle
        cx="50"
        cy="50"
        r="11"
        stroke={HUD_SOFT}
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
          filter: `drop-shadow(0 0 calc(6px + var(--vg-level, 0) * 16px) ${HUD_ACCENT})`,
          transform: 'scale(calc(0.8 + var(--vg-level, 0) * 0.65))',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
        }}
      />
      {/* Centre pinpoint — the iris at the heart of the reactor. Drawn from
          --surface-1 so it always contrasts against the accent core: a dark
          pupil in dark mode, a white-hot one in light mode. */}
      <circle
        cx="50"
        cy="50"
        r="3"
        fill="var(--surface-1, #ffffff)"
        style={{
          filter: 'drop-shadow(0 0 4px var(--accent-strong, #ffffff))',
          opacity: 'calc(0.85 + var(--vg-level, 0) * 0.15)',
        }}
      />
    </svg>
  </div>
);
