import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── Proficiency data (0–100 scale) ────────────────────────────
const skillAreas = [
  { label: 'Computer Vision',     short: 'CV',       value: 90, color: '#3B82F6', skills: ['OpenCV', 'YOLOv8', 'MediaPipe', 'CNNs', '3D Reconstruction'] },
  { label: 'NLP & RAG',           short: 'NLP',      value: 85, color: '#A855F7', skills: ['LangChain', 'pgvector', 'Gemini API', 'Prompt Engineering'] },
  { label: 'AI / ML Core',        short: 'AI/ML',    value: 88, color: '#EC4899', skills: ['PyTorch', 'TensorFlow', 'Keras', 'GANs', 'RL'] },
  { label: 'Full-Stack Dev',      short: 'Full‑Stack', value: 78, color: '#06B6D4', skills: ['React', 'FastAPI', 'PostgreSQL', 'Streamlit'] },
  { label: 'Autonomous Systems',  short: 'Auto',     value: 82, color: '#22C55E', skills: ['Sensor Fusion', 'LiDAR', 'SUMO', 'Simulink', 'RADAR'] },
  { label: 'Tools & DevOps',      short: 'DevOps',   value: 75, color: '#F59E0B', skills: ['Docker', 'CMake', 'Git', 'N8N', 'Power BI'] },
];

const LEVELS = 5;           // concentric rings
const SIZE   = 380;         // SVG viewBox
const CX     = SIZE / 2;
const CY     = SIZE / 2;
const RADIUS = SIZE * 0.38; // outermost ring radius

// ─── Helpers ───────────────────────────────────────────────────
const toRad   = (deg) => (Math.PI / 180) * deg;
const angleOf = (i, total) => toRad((360 / total) * i - 90);

const pointOnCircle = (cx, cy, r, angleDeg) => {
  const a = toRad(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const polygonPoints = (values, total, cx, cy, maxR) =>
  values
    .map((v, i) => {
      const angle = (360 / total) * i - 90;
      const r = (v / 100) * maxR;
      const p = pointOnCircle(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    })
    .join(' ');

const ringPoints = (level, total, cx, cy, maxR) => {
  const r = (maxR / LEVELS) * (level + 1);
  return Array.from({ length: total })
    .map((_, i) => {
      const angle = (360 / total) * i - 90;
      const p = pointOnCircle(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    })
    .join(' ');
};

// ─── Component ────────────────────────────────────────────────
export const SkillsRadarChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [hovered, setHovered] = useState(null);   // index
  const [animDone, setAnimDone] = useState(false);
  const total = skillAreas.length;

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setAnimDone(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  // Animated values — start from 0, grow to real values
  const displayValues = isInView ? skillAreas.map((s) => s.value) : skillAreas.map(() => 0);
  const dataPolygon = polygonPoints(displayValues, total, CX, CY, RADIUS);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full flex flex-col items-center"
    >
      {/* ── Title ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/40" />
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-white/30">
          Proficiency Radar
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/40" />
      </div>

      {/* ── SVG Radar ──────────────────────────────────────── */}
      <div className="relative w-full" style={{ maxWidth: SIZE + 80 }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full h-auto"
          style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.08))' }}
        >
          <defs>
            {/* radial glow for fill */}
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.03" />
            </radialGradient>
            {/* scan line animation */}
            <linearGradient id="scan-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%"  stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ── Grid rings ──────────────────────────────────── */}
          {Array.from({ length: LEVELS }).map((_, lvl) => (
            <polygon
              key={`ring-${lvl}`}
              points={ringPoints(lvl, total, CX, CY, RADIUS)}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}

          {/* ── Axis lines ──────────────────────────────────── */}
          {skillAreas.map((_, i) => {
            const outer = pointOnCircle(CX, CY, RADIUS, (360 / total) * i - 90);
            return (
              <line
                key={`axis-${i}`}
                x1={CX} y1={CY}
                x2={outer.x} y2={outer.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* ── Ring percentage labels ─────────────────────── */}
          {Array.from({ length: LEVELS }).map((_, lvl) => {
            const pct = ((lvl + 1) / LEVELS) * 100;
            const r = (RADIUS / LEVELS) * (lvl + 1);
            return (
              <text
                key={`pct-${lvl}`}
                x={CX + 4}
                y={CY - r + 4}
                fill="rgba(255,255,255,0.15)"
                fontSize="8"
                fontFamily="monospace"
              >
                {pct}%
              </text>
            );
          })}

          {/* ── Data polygon (animated) ────────────────────── */}
          <motion.polygon
            points={dataPolygon}
            fill="url(#radar-glow)"
            stroke="rgba(59,130,246,0.6)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.3))' }}
          />

          {/* ── Data vertices (dots) ──────────────────────── */}
          {skillAreas.map((area, i) => {
            const angle = (360 / total) * i - 90;
            const r = (displayValues[i] / 100) * RADIUS;
            const p = pointOnCircle(CX, CY, r, angle);
            const isHov = hovered === i;
            return (
              <g key={`vertex-${i}`}>
                {/* Pulse ring */}
                {animDone && (
                  <circle
                    cx={p.x} cy={p.y} r="8"
                    fill="none"
                    stroke={area.color}
                    strokeWidth="0.8"
                    opacity="0.4"
                    style={{ animation: `radarPulse 2.5s ease-out infinite ${i * 0.4}s` }}
                  />
                )}
                {/* Outer glow */}
                <motion.circle
                  cx={p.x} cy={p.y} r={isHov ? 7 : 5}
                  fill={`${area.color}30`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                />
                {/* Core dot */}
                <motion.circle
                  cx={p.x} cy={p.y} r={isHov ? 4.5 : 3}
                  fill={area.color}
                  stroke="#000"
                  strokeWidth="1"
                  style={{
                    cursor: 'pointer',
                    filter: `drop-shadow(0 0 6px ${area.color})`,
                    transition: 'r 0.2s ease',
                  }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1, type: 'spring' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            );
          })}

          {/* ── Axis labels (around perimeter) ─────────────── */}
          {skillAreas.map((area, i) => {
            const angle = (360 / total) * i - 90;
            const labelR = RADIUS + 24;
            const p = pointOnCircle(CX, CY, labelR, angle);

            // Determine text anchor based on position
            let anchor = 'middle';
            if (angle > -85 && angle < 85) anchor = 'start';      // right half
            else if (angle > 95 || angle < -95) anchor = 'end';   // left half

            const isHov = hovered === i;

            return (
              <g key={`label-${i}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fill={isHov ? area.color : 'rgba(255,255,255,0.5)'}
                  fontSize="11"
                  fontWeight={isHov ? '700' : '500'}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  style={{ transition: 'fill 0.2s, font-weight 0.2s' }}
                >
                  {area.short}
                </text>
                {/* Value badge on hover */}
                {isHov && (
                  <text
                    x={p.x}
                    y={p.y + 14}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fill={area.color}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {area.value}%
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Center decoration ──────────────────────────── */}
          <circle cx={CX} cy={CY} r="3" fill="rgba(59,130,246,0.5)" />
          <circle cx={CX} cy={CY} r="1" fill="white" opacity="0.6" />
        </svg>

        {/* ── Hover Tooltip (HTML overlay) ─────────────────── */}
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                bottom: '-10px',
                transform: 'translateX(-50%)',
                zIndex: 20,
              }}
            >
              <div
                className="px-5 py-3.5 rounded-xl backdrop-blur-xl border text-center"
                style={{
                  background: 'rgba(0,0,0,0.75)',
                  borderColor: `${skillAreas[hovered].color}40`,
                  boxShadow: `0 4px 30px ${skillAreas[hovered].color}15`,
                  minWidth: 180,
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: skillAreas[hovered].color,
                      boxShadow: `0 0 8px ${skillAreas[hovered].color}`,
                    }}
                  />
                  <span className="text-xs font-bold tracking-wide text-white/90">
                    {skillAreas[hovered].label}
                  </span>
                  <span
                    className="text-xs font-bold ml-1"
                    style={{ color: skillAreas[hovered].color }}
                  >
                    {skillAreas[hovered].value}%
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {skillAreas[hovered].skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${skillAreas[hovered].color}15`,
                        color: `${skillAreas[hovered].color}`,
                        border: `1px solid ${skillAreas[hovered].color}30`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Legend pills (below chart) ─────────────────────── */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
        {skillAreas.map((area, i) => (
          <motion.button
            key={area.label}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer border"
            style={{
              background: hovered === i ? `${area.color}18` : 'rgba(255,255,255,0.03)',
              borderColor: hovered === i ? `${area.color}50` : 'rgba(255,255,255,0.06)',
              color: hovered === i ? area.color : 'rgba(255,255,255,0.45)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: area.color,
                boxShadow: hovered === i ? `0 0 6px ${area.color}` : 'none',
              }}
            />
            {area.label}
          </motion.button>
        ))}
      </div>

      {/* ── Keyframe for pulse animation ────────────────────── */}
      <style>{`
        @keyframes radarPulse {
          0% { r: 4; opacity: 0.5; }
          100% { r: 16; opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
};
