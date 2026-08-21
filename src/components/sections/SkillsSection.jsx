import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { SkillBadge } from '../ui/SkillBadge';
import { SkillsRadarChart } from '../ui/SkillsRadarChart';

// Was five competing accent colors (blue/purple/cyan/amber/emerald), five
// emoji icons, and five corner glows pulsing forever on a 4s loop. Now the
// only variable is the grid span — colour comes solely from the skill logos.
// The spans carry the 60/40 weighting into the layout: vision opens on a full
// row of its own, GenAI and robotics share the next one 2:1, and the production
// stack closes on another full row. Anything unlisted falls back to one column.
const categoryConfig = {
  'Computer Vision & Perception': { span: 'md:col-span-3' },
  'Generative AI & Autonomous Agents': { span: 'md:col-span-2' },
  'Robotics & Autonomous Systems': { span: 'md:col-span-1' },
  'Full-Stack & Production Core': { span: 'md:col-span-3' },
};

const SkillCard = ({ category, skills, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });
  const cfg = categoryConfig[category] || { span: 'md:col-span-1' };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`panel p-5 ${cfg.span}`}
    >
      <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-rule">
        {/* Mono index replaces the emoji tile */}
        <span className="label label-accent">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-sm font-bold tracking-tight text-ink flex-1 min-w-0 truncate">
          {category}
        </h3>
        <span className="label flex-shrink-0">{skills.length}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <SkillBadge key={skill} skillName={skill} index={i} />
        ))}
      </div>
    </motion.div>
  );
};

export const SkillsSection = ({ t }) => (
  <Section id="skills" title={t.skills.title} subtitle={t.skills.subtitle}>
    {/* Radar chart — the two decorative corner radials are gone */}
    <div className="panel p-6 md:p-8 mb-6">
      <SkillsRadarChart />
    </div>

    {/* A real bento: one full row, then 2+1, then 1+2 */}
    <div className="grid md:grid-cols-3 gap-4">
      {Object.entries(portfolioData.skills).map(([category, skills], index) => (
        <SkillCard key={category} category={category} skills={skills} index={index} />
      ))}
    </div>
  </Section>
);
