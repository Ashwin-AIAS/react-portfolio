import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { SkillBadge } from '../ui/SkillBadge';

export const SkillsSection = () => (
    <Section id="skills" title="Technical Arsenal" subtitle="Tools and technologies I use to build robust AI and software solutions">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {Object.entries(portfolioData.skills).map(([category, skills], index) => (
                <AnimateOnScroll key={index} delay={index * 150} className={`glass-card p-8 bg-gradient-to-br from-white/[0.03] to-transparent ${index === 0 ? 'md:col-span-2' : ''}`}>
                    <h3 className="text-xl font-medium text-white/90 tracking-wide mb-6 flex items-center gap-3">
                        <div className="w-8 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                        {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {skills.map(skill => (
                            <SkillBadge key={skill} skillName={skill} />
                        ))}
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);
