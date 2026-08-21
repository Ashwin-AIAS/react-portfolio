/**
 * Megatron avatar — the Decepticon counterpart to OptimusAvatarVisual.
 *
 * The Decepticon insignia rendered as a helmet: the angular crest, two glowing
 * red optics, and a segmented mouthguard whose bars rise and fall with the
 * voice. Everything reactive reads --vg-level, the 0..1 custom property the
 * engine writes to <html> each frame (store.js), so this component never
 * re-renders while speaking.
 *
 * Same split as the other three: shape and colour are inline because
 * AvatarGuide.jsx is eager while voice-guide.css only lands with the lazy
 * chunk (§8), so anything essential to the silhouette has to travel with the
 * markup. Only keyframed motion lives in the stylesheet, where arriving a few
 * hundred ms late costs nothing. Every var() therefore carries a fallback.
 *
 * The violet and the red are literals, not --accent — the same reasoning as
 * the Autobot amber and the arc-reactor cyan next door. A Decepticon crest in
 * whatever accent the visitor picked in the theme switcher is not a Decepticon
 * crest. The glow intensities still come from --vg-level, so it belongs to the
 * same system as the rest.
 */
import React from 'react';

const DECEPTICON_VIOLET = '#a855f7';
const DECEPTICON_DEEP = '#4c1d95';
const OPTIC_RED = '#ff2d2d';

/**
 * The insignia outline: horns out to the top corners, a central peak between
 * them, flared cheek plates, and a converging chin.
 */
const CREST_POINTS = '8,20 30,33 50,18 70,33 92,20 80,46 88,55 60,74 50,92 40,74 12,55 20,46';

/**
 * Segmented mouthguard, five bars across the jaw. `f` scales how far each bar
 * travels: the centre opens widest and the outer pair barely move, which is
 * what makes the row read as a mouth rather than a level meter.
 */
const MOUTH_BARS = [
  { x: 33.5, f: 0.55 },
  { x: 40.5, f: 0.8 },
  { x: 47.5, f: 1.0 },
  { x: 54.5, f: 0.8 },
  { x: 61.5, f: 0.55 },
];

const BAR_WIDTH = 5;
/** Bars hang from this line and grow downward, the way a jaw drops. */
const BAR_TOP = 58;
const BAR_HEIGHT = 12;

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
    {/* Dark-energon aura. Scales with the voice. */}
    <div
      className="vg-megatron-aura"
      style={{ transform: 'scale(calc(1 + var(--vg-level, 0) * 0.45))' }}
    />
    {/* Containment ring, on its own timer — see voice-guide.css. */}
    <div className="vg-megatron-ring" />

    <svg
      viewBox="0 0 100 100"
      className="vg-megatron-svg"
      fill="none"
      focusable="false"
      style={{ filter: `drop-shadow(0 0 15px ${DECEPTICON_VIOLET}66)` }}
    >
      {/* Decepticon insignia */}
      <polygon
        points={CREST_POINTS}
        fill={DECEPTICON_DEEP}
        fillOpacity="0.9"
        stroke={DECEPTICON_VIOLET}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Brow bar, tying the two horns together above the optics */}
      <path
        d="M26 38 L50 30 L74 38"
        stroke={DECEPTICON_VIOLET}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Optics. Bloom and opacity both track the amplitude, so the stare
          intensifies on every stressed syllable. */}
      {[
        { points: '31,44 45,42 43,50 32,49' },
        { points: '69,44 55,42 57,50 68,49' },
      ].map((eye) => (
        <polygon
          key={eye.points}
          points={eye.points}
          fill={OPTIC_RED}
          style={{
            filter: `drop-shadow(0 0 calc(5px + var(--vg-level, 0) * 12px) ${OPTIC_RED})`,
            opacity: 'calc(0.72 + var(--vg-level, 0) * 0.28)',
          }}
        />
      ))}

      {/* Segmented mouthguard — this is the Megatron persona's lip sync.
          Each bar hangs from BAR_TOP and drops on its own factor. 0.16 is the
          closed floor (MOUTH_MIN_SCALE in config.js), so the guard never fully
          disappears between words. */}
      <g className="vg-megatron-mouth">
        {MOUTH_BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={BAR_TOP}
            width={BAR_WIDTH}
            height={BAR_HEIGHT}
            rx="1"
            fill={DECEPTICON_VIOLET}
            style={{
              transform: `scaleY(calc(0.16 + var(--vg-level, 0) * ${bar.f * 0.84}))`,
              transformOrigin: '50% 0%',
              transformBox: 'fill-box',
              opacity: `calc(0.6 + var(--vg-level, 0) * ${bar.f * 0.4})`,
            }}
          />
        ))}
      </g>
    </svg>
  </div>
);
