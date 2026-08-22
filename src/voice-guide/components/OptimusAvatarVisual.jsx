/**
 * Optimus Prime avatar — Next-Gen Cybertronian Command Matrix & Battle Armor.
 *
 * A multi-layered Cybertronian battle crest featuring:
 * - Multi-stage beveled titanium battle plates with metallic depth
 * - Iconic antenna fins & chamfered forehead crown
 * - Dual-mode glowing laser optics with scanline reticle and amplitude flare
 * - Anamorphic diffraction spikes that bloom out of the optics on speech
 * - Cybertronian holographic scanlines raked across the whole helmet
 * - Matrix of Leadership collar core with expanding resonance rings
 * - Hydraulic articulated battle mask that articulates to --vg-level
 *
 * Everything reactive reads --vg-level (0..1) written to <html> by store.js,
 * so this component never re-renders while speaking. The two layers that move
 * on their own timer (the scanline rake, the Matrix resonance) are keyframed in
 * voice-guide.css and gated on the amplitude through a wrapper group, so the
 * keyframe animation never fights a level-driven transform on one element.
 *
 * COLOUR RULE (theme-adaptive, MULTI_THEME_SPEC): there are no palette literals
 * left in here. Every colour resolves from the active theme through one of two
 * families, and the split is what keeps the crest readable in all nine palettes
 * and in both light and dark:
 *
 *   - Anything that EMITS light — the crown plate, the optics, the Matrix
 *     crystal — comes from the accent trio: --accent (hottest), --accent-strong
 *     (mid), --accent-dim (falloff).
 *   - Anything STRUCTURAL — the chassis, the eye sockets, the collar — comes
 *     from --surface-1 / --surface-2, so the armour sits on the page instead of
 *     floating on top of it.
 *   - Engraved detail (the crest ridge, the intake flutes, the lens seams) is
 *     --surface-1 on purpose: against an accent plate it inverts with the
 *     theme, cutting dark in dark mode and bright in light mode, which is what
 *     an incised line does in both.
 *
 * Every var() keeps its original literal as the fallback, so an engine that
 * cannot resolve a custom property inside an SVG presentation attribute still
 * renders the crest it always did.
 */
import React from 'react';

/** Laser optic centres — the anchor for both the glow and the flare spikes. */
const OPTICS = [
  { cx: 38.5, cy: 48 },
  { cx: 61.5, cy: 48 },
];

/** Cybertronian scanline rake across the faceplate, in viewBox units. */
const SCANLINES = [16, 24, 32, 40, 48, 56, 64, 72, 80, 88];

/**
 * @param {Object} props
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] brightens the crest while a clip plays
 */
export const OptimusAvatarVisual = ({ size = 130, speaking = false }) => (
  <div
    className={`vg-optimus${speaking ? ' vg-optimus-live' : ''}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    {/* Cybertronian energy aura. Scales with the voice amplitude. */}
    <div
      className="vg-optimus-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.45))' }}
    />
    {/* Matrix-of-Leadership resonance ring */}
    <div className="vg-optimus-ring" />

    <svg
      viewBox="0 0 100 100"
      className="vg-optimus-svg"
      fill="none"
      focusable="false"
      style={{ filter: 'drop-shadow(0 0 16px var(--accent-line, rgba(0,242,254,0.4)))' }}
    >
      <defs>
        {/* Chassis armour — the theme's own surfaces, so the helmet reads as
            the same material as the panels behind it. */}
        <linearGradient id="opt-armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--surface-2, #1e293b)" />
          <stop offset="50%" stopColor="var(--surface-1, #0f172a)" />
          <stop offset="100%" stopColor="var(--surface-1, #020617)" />
        </linearGradient>

        {/* Command crown — the saturated plate, hottest accent falling to dim. */}
        <linearGradient id="opt-cobalt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #38bdf8)" />
          <stop offset="40%" stopColor="var(--accent-strong, #0284c7)" />
          <stop offset="100%" stopColor="var(--accent-dim, #1e3a8a)" />
        </linearGradient>

        {/* Brushed bevel — the same accent walked down into the chassis, so the
            fins and faceplate read as tinted metal rather than a second lamp. */}
        <linearGradient id="opt-silver" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-strong, #e2e8f0)" />
          <stop offset="50%" stopColor="var(--accent-dim, #94a3b8)" />
          <stop offset="100%" stopColor="var(--surface-2, #475569)" />
        </linearGradient>

        {/* Matrix of Leadership core glow */}
        <radialGradient id="opt-matrix-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent, #ffffff)" />
          <stop offset="40%" stopColor="var(--accent-strong, #38bdf8)" />
          <stop offset="80%" stopColor="var(--accent-dim, #0284c7)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* The scanline rake is clipped to the silhouette, so the hologram
            interference stops at the edge of the armour instead of striping the
            page behind it. */}
        <clipPath id="opt-helmet-clip">
          <polygon points="50,6 84,20 84,56 72,86 50,95 28,86 16,56 16,20" />
        </clipPath>
      </defs>

      {/* --- LAYER 1: Cybertronian Head Antenna Fins (Left & Right) --- */}
      <path
        d="M18 42 L11 20 L20 28 L23 48 Z"
        fill="url(#opt-silver)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M82 42 L89 20 L80 28 L77 48 Z"
        fill="url(#opt-silver)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* --- LAYER 2: Main Helmet Base & Outer Beveled Armor --- */}
      <polygon
        points="50,6 84,20 84,56 72,86 50,95 28,86 16,56 16,20"
        fill="url(#opt-armor)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Inner contour armor bevels */}
      <polygon
        points="50,11 79,23 79,53 68,81 50,89 32,81 21,53 21,23"
        fill="none"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="0.8"
        strokeDasharray="4 2"
        opacity="0.4"
      />

      {/* --- LAYER 3: Forehead Crest & Autobot Command Crown --- */}
      <path
        d="M34 22 L50 10 L66 22 L60 36 L40 36 Z"
        fill="url(#opt-cobalt)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Central crest ridge */}
      <line
        x1="50"
        y1="10"
        x2="50"
        y2="36"
        stroke="var(--surface-1, #ffffff)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="50" cy="18" r="2" fill="var(--accent, #00f2fe)" />

      {/* --- LAYER 4: Cheek Flutes & Temple Shielding --- */}
      <path
        d="M23 38 L36 42 L34 56 L20 52 Z"
        fill="var(--surface-2, #1e293b)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="1.2"
      />
      <path
        d="M77 38 L64 42 L66 56 L80 52 Z"
        fill="var(--surface-2, #1e293b)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="1.2"
      />

      {/* --- LAYER 5: Glowing Laser Optics with Scanline Reticle --- */}
      {/* Eye brow shadow visor plate */}
      <path
        d="M32 41 L50 44 L68 41 L66 45 L50 48 L34 45 Z"
        fill="var(--surface-1, #020617)"
        stroke="var(--accent, #00f2fe)"
        strokeWidth="1"
      />

      {/* Left Laser Optic */}
      <polygon
        points="34,46 45,46 42,52 32,50"
        fill="var(--accent-strong, #38bdf8)"
        style={{
          filter:
            'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 12px) var(--accent-strong, #38bdf8))',
          opacity: 'calc(0.75 + var(--vg-level, 0) * 0.25)',
        }}
      />
      <line x1="33" y1="48" x2="44" y2="48" stroke="var(--surface-1, #ffffff)" strokeWidth="1" opacity="0.9" />

      {/* Right Laser Optic */}
      <polygon
        points="66,46 55,46 58,52 68,50"
        fill="var(--accent-strong, #38bdf8)"
        style={{
          filter:
            'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 12px) var(--accent-strong, #38bdf8))',
          opacity: 'calc(0.75 + var(--vg-level, 0) * 0.25)',
        }}
      />
      <line x1="67" y1="48" x2="56" y2="48" stroke="var(--surface-1, #ffffff)" strokeWidth="1" opacity="0.9" />

      {/* --- LAYER 5b: Anamorphic Diffraction Spikes (Audio Reactive) --- */}
      {/* A real lens flares along its axes. Both optics get a wide horizontal
          streak, a short vertical one and two diagonal spikes, all sharing one
          amplitude-driven opacity and bloom, so they spike together on a
          consonant and fall away between words. */}
      {OPTICS.map(({ cx, cy }) => (
        <g
          key={cx}
          className="vg-optimus-flare"
          style={{
            opacity: 'calc(0.18 + var(--vg-level, 0) * 0.82)',
            filter:
              'drop-shadow(0 0 calc(2px + var(--vg-level, 0) * 9px) var(--accent, #00f2fe))',
          }}
        >
          <line
            x1={cx - 26}
            y1={cy}
            x2={cx + 26}
            y2={cy}
            stroke="var(--accent, #00f2fe)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.75"
          />
          <line
            x1={cx}
            y1={cy - 11}
            x2={cx}
            y2={cy + 11}
            stroke="var(--accent, #00f2fe)"
            strokeWidth="0.55"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line
            x1={cx - 8}
            y1={cy - 8}
            x2={cx + 8}
            y2={cy + 8}
            stroke="var(--accent-strong, #38bdf8)"
            strokeWidth="0.4"
            strokeLinecap="round"
            opacity="0.45"
          />
          <line
            x1={cx - 8}
            y1={cy + 8}
            x2={cx + 8}
            y2={cy - 8}
            stroke="var(--accent-strong, #38bdf8)"
            strokeWidth="0.4"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* Hot pinpoint at the centre of the lens. */}
          <circle
            cx={cx}
            cy={cy}
            r="1.1"
            fill="var(--accent, #00f2fe)"
            style={{ opacity: 'calc(0.5 + var(--vg-level, 0) * 0.5)' }}
          />
        </g>
      ))}

      {/* --- LAYER 6: Hydraulic Articulated Battle Mask (Lip-Sync) --- */}
      {/* Upper nose & bridge connector */}
      <polygon points="50,47 45,56 55,56" fill="var(--surface-2, #334155)" stroke="var(--accent, #00f2fe)" strokeWidth="1" />

      {/* Articulating Faceplate / Grille that scales with voice amplitude */}
      <g
        className="vg-optimus-mask"
        style={{
          transform: 'scaleY(calc(1 + var(--vg-level, 0) * 0.75))',
          transformOrigin: '50% 68%',
          transformBox: 'view-box',
        }}
      >
        {/* Main mask plate */}
        <path
          d="M38 58 L62 58 L58 78 L50 82 L42 78 Z"
          fill="url(#opt-silver)"
          stroke="var(--accent, #00f2fe)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Horizontal intake flutes */}
        <line x1="42" y1="63" x2="58" y2="63" stroke="var(--surface-1, #0f172a)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="44" y1="68" x2="56" y2="68" stroke="var(--surface-1, #0f172a)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="46" y1="73" x2="54" y2="73" stroke="var(--surface-1, #0f172a)" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* --- LAYER 7: Matrix of Leadership Collar Core --- */}
      {/* Collar V-mount */}
      <path
        d="M34 84 L50 78 L66 84 L50 93 Z"
        fill="var(--surface-1, #0f172a)"
        stroke="var(--accent-line, rgba(255, 176, 32, 0.75))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Matrix resonance — two rings pushed out of the crystal on their own
          timer. The wrapper carries the amplitude and the children carry the
          motion, so the resonance only appears while the Prime is speaking. */}
      <g style={{ opacity: 'calc(var(--vg-level, 0) * 0.85)' }}>
        <circle
          cx="50"
          cy="85"
          r="6"
          className="vg-optimus-matrix"
          stroke="var(--accent, #38bdf8)"
          strokeWidth="0.9"
        />
        <circle
          cx="50"
          cy="85"
          r="6"
          className="vg-optimus-matrix vg-optimus-matrix-2"
          stroke="var(--accent-strong, #0284c7)"
          strokeWidth="0.7"
          strokeDasharray="2 3"
        />
      </g>
      {/* Glowing Matrix Crystal at the base */}
      <polygon
        points="50,80 54,85 50,90 46,85"
        fill="url(#opt-matrix-glow)"
        style={{
          filter:
            'drop-shadow(0 0 calc(3px + var(--vg-level, 0) * 8px) var(--accent, #38bdf8))',
          opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)',
        }}
      />

      {/* --- LAYER 8: Cybertronian Holographic Scanlines --- */}
      {/* Raked over everything and clipped to the helmet: this is the layer
          that turns a crest into a projection. Dashed at a 1:3 duty cycle so it
          reads as interference rather than as hatching. */}
      <g
        clipPath="url(#opt-helmet-clip)"
        style={{ opacity: 'calc(0.35 + var(--vg-level, 0) * 0.3)' }}
      >
        <g className="vg-optimus-scan">
          {SCANLINES.map((y) => (
            <line
              key={y}
              x1="12"
              y1={y}
              x2="88"
              y2={y}
              stroke="var(--accent, #00f2fe)"
              strokeWidth="0.6"
              strokeDasharray="1 3"
              opacity="0.35"
            />
          ))}
        </g>
      </g>
    </svg>
  </div>
);
