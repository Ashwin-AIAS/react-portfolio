import { useRef } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { SkillBadge } from '../ui/SkillBadge';
import { SkillsRadarChart } from '../ui/SkillsRadarChart';

const categoryConfig = {
  'Programming & Tools': {
    emoji: '⚙️',
    accent: '#3B82F6',
    gradient: 'from-blue-500/[0.08] via-cyan-500/[0.04] to-transparent',
    border: 'rgba(59,130,246,0.25)',
    span: 'md:col-span-2',
  },
  'AI/ML': {
    emoji: '🧠',
    accent: '#A855F7',
    gradient: 'from-purple-500/[0.09] via-pink-500/[0.04] to-transparent',
    border: 'rgba(168,85,247,0.25)',
    span: '',
  },
  'Web & Backend': {
    emoji: '🌐',
    accent: '#06B6D4',
    gradient: 'from-cyan-500/[0.08] via-blue-500/[0.04] to-transparent',
    border: 'rgba(6,182,212,0.25)',
    span: '',
  },
  'Data Analysis & Visualization': {
    emoji: '📊',
    accent: '#F59E0B',
    gradient: 'from-amber-500/[0.09] via-orange-500/[0.04] to-transparent',
    border: 'rgba(245,158,11,0.25)',
    span: '',
  },
  Collaboration: {
    emoji: '🤝',
    accent: '#10B981',
    gradient: 'from-emerald-500/[0.08] via-green-500/[0.04] to-transparent',
    border: 'rgba(16,185,129,0.25)',
    span: '',
  },
};

const SkillCard = ({ category, skills, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cfg = categoryConfig[category] || {
    emoji: '•', accent: '#6B7280',
    gradient: 'from-white/[0.05] to-transparent',
    border: 'rgba(107,114,128,0.2)', span: '',
  };

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl p-6 bg-gradient-to-br ${cfg.gradient} backdrop-blur-sm overflow-hidden group ${cfg.span}`}
      style={{ border: `1px solid ${cfg.border}` }}
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${cfg.accent}15,
              transparent 40%
            )
          `,
        }}
      />

      {/* Hover inner glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 50px 0 ${cfg.accent}18` }}
      />

      {/* Animated corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${cfg.accent}12, transparent 70%)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
      />

      <div className="relative z-10 pointer-events-none">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pointer-events-auto">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: `${cfg.accent}18`,
              border: `1px solid ${cfg.accent}40`,
              boxShadow: `0 0 16px 0 ${cfg.accent}20`,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {cfg.emoji}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide leading-tight">{category}</h3>
            <p className="text-xs mt-0.5" style={{ color: `${cfg.accent}90` }}>
              {skills.length} technologies
            </p>
          </div>

          {/* Accent line */}
          <div
            className="h-px w-14 flex-shrink-0"
            style={{ background: `linear-gradient(to right, ${cfg.accent}70, transparent)` }}
          />
        </div>

        {/* Skill pills */}
        <div className="flex flex-wrap gap-2 pointer-events-auto">
          {skills.map((skill, i) => (
            <SkillBadge key={skill} skillName={skill} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const SkillsSection = ({ t }) => (
  <Section id="skills" title={t.skills.title} subtitle={t.skills.subtitle}>
    {/* ── Interactive Radar Chart ───────────────────────────── */}
    <div className="mb-10 p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-sm relative overflow-hidden">
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(59,130,246,0.06), transparent 70%)' }}
      />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(168,85,247,0.05), transparent 70%)' }}
      />
      <SkillsRadarChart />
    </div>

    {/* ── Skill Category Cards (existing) ──────────────────── */}
    <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
      {Object.entries(portfolioData.skills).map(([category, skills], index) => (
        <SkillCard key={category} category={category} skills={skills} index={index} />
      ))}
    </div>
  </Section>
);
