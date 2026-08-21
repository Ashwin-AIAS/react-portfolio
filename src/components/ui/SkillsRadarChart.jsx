import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── Proficiency data (0–100 scale) ────────────────────────────
// Each area used to carry its own hue (blue/purple/pink/cyan/green/amber),
// which put six more colours on a page that has one. The reading is the
// polygon; hover is what singles an axis out.
//
// The six axes are the 60/40 split of portfolioData.skills read as a shape.
// Vision and the deep-learning core it rests on are the two longest spokes —
// that asymmetry IS the 60%, and it is the first thing the polygon says before
// anyone reads a label. The remaining four cover the generative-AI, agent,
// retrieval and robotics 40% at a deliberately tighter spread, so the chart
// reads as one specialism with real breadth rather than six equal claims.
const skillAreas = [
  { label: 'Computer Vision',       short: 'CV',      value: 94, skills: ['OpenCV', 'YOLOv8 / YOLO26', 'MediaPipe', '3D Reconstruction', 'Pose Biomechanics'] },
  { label: 'GenAI & Agents',        short: 'GenAI',   value: 88, skills: ['LangChain', 'Claude / Gemini / GPT-4', 'Autonomous AI Agents', 'OpenAI Whisper', 'Prompt Engineering'] },
  { label: 'RAG & Vector Retrieval', short: 'RAG',    value: 86, skills: ['RAG & Graph RAG', 'pgvector', 'ChromaDB', 'Neo4j', 'Cross-Encoder Reranking'] },
  { label: 'Autonomous Systems',    short: 'Auto',    value: 82, skills: ['Sensor Fusion', 'LiDAR & RADAR', 'SUMO Simulation', 'Simulink', 'Kalman Filtering'] },
  { label: 'Deep Learning',         short: 'DL',      value: 90, skills: ['PyTorch', 'TensorFlow', 'CNNs', 'GANs', 'Reinforcement Learning'] },
  { label: 'Production & Edge Stack', short: 'Stack', value: 84, skills: ['FastAPI', 'Docker', 'PostgreSQL', 'Redis', 'Int8 Quantization', 'Edge AI (C/C++)'] },
];

const LEVELS = 5;           // concentric rings
const SIZE   = 380;         // SVG viewBox
const CX     = SIZE / 2;
const CY     = SIZE / 2;
const RADIUS = SIZE * 0.38; // outermost ring radius

// ─── Helpers ───────────────────────────────────────────────────
const toRad = (deg) => (Math.PI / 180) * deg;

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

// var() is not reliable inside SVG presentation attributes, so every token
// below is applied through `style` instead of `fill=` / `stroke=`.
const RULE = { stroke: 'var(--rule)' };

// ─── Component ────────────────────────────────────────────────
export const SkillsRadarChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [hovered, setHovered] = useState(null);   // index
  const total = skillAreas.length;

  // Animated values — start from 0, grow to real values
  const displayValues = isInView ? skillAreas.map((s) => s.value) : skillAreas.map(() => 0);
  const dataPolygon = polygonPoints(displayValues, total, CX, CY, RADIUS);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full flex flex-col items-center"
    >
      <div className="w-full flex items-baseline gap-3 mb-6 pb-3 border-b border-rule">
        <span className="label label-accent">Proficiency Radar</span>
        <span className="label ml-auto">0–100</span>
      </div>

      {/* ── SVG Radar ──────────────────────────────────────── */}
      <div className="relative w-full" style={{ maxWidth: SIZE + 80 }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
          {/* ── Grid rings ──────────────────────────────────── */}
          {Array.from({ length: LEVELS }).map((_, lvl) => (
            <polygon
              key={`ring-${lvl}`}
              points={ringPoints(lvl, total, CX, CY, RADIUS)}
              fill="none"
              strokeWidth="1"
              style={RULE}
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
                strokeWidth="1"
                style={RULE}
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
                fontSize="8"
                style={{ fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
              >
                {pct}
              </text>
            );
          })}

          {/* ── Data polygon (animated) ────────────────────── */}
          <motion.polygon
            points={dataPolygon}
            strokeWidth="1.5"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fill: 'var(--accent-wash)', stroke: 'var(--accent)' }}
          />

          {/* ── Data vertices ──────────────────────────────── */}
          {skillAreas.map((area, i) => {
            const angle = (360 / total) * i - 90;
            const r = (displayValues[i] / 100) * RADIUS;
            const p = pointOnCircle(CX, CY, r, angle);
            const isHov = hovered === i;
            const s = isHov ? 5 : 3.5;
            return (
              <motion.rect
                key={`vertex-${i}`}
                x={p.x - s} y={p.y - s}
                width={s * 2} height={s * 2}
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
                style={{
                  fill: isHov ? 'var(--accent)' : 'var(--bg)',
                  stroke: 'var(--accent)',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
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
                  fontSize="10"
                  style={{
                    fill: isHov ? 'var(--accent)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'fill 0.18s',
                  }}
                >
                  {area.short}
                </text>
                {isHov && (
                  <text
                    x={p.x}
                    y={p.y + 14}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fontSize="10"
                    style={{ fill: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                  >
                    {area.value}
                  </text>
                )}
              </g>
            );
          })}

          <rect x={CX - 1.5} y={CY - 1.5} width="3" height="3" style={{ fill: 'var(--accent)' }} />
        </svg>

        {/* ── Hover readout (HTML overlay) ─────────────────── */}
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none"
              style={{ left: '50%', bottom: '-10px', transform: 'translateX(-50%)', zIndex: 20 }}
            >
              <div className="panel panel-accent px-4 py-3 text-center" style={{ minWidth: 200 }}>
                <div className="flex items-center justify-center gap-3 mb-2 pb-2 border-b border-rule">
                  <span className="label">{skillAreas[hovered].label}</span>
                  <span className="readout-value readout-value-accent text-sm">
                    {skillAreas[hovered].value}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {skillAreas[hovered].skills.map((s) => (
                    <span key={s} className="tech-tag">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Legend (below chart) ───────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2 mt-6 px-4">
        {skillAreas.map((area, i) => (
          <motion.button
            key={area.label}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`chip ${hovered === i ? 'chip-active' : ''}`}
          >
            {area.label}
            <span className="label">{area.value}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
