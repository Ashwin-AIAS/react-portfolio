import React from 'react';
import { motion } from 'framer-motion';

// Instrument-panel section headers: flush left, mono index marker, a hairline
// that runs to the edge. Replaces the seven pixel-identical centered slabs.
const SECTION_INDEX = {
    assistant: '01',
    roadmap: '02',
    skills: '03',
    github: '04',
    projects: '05',
    certifications: '06',
    contact: '07',
};

export const Section = ({ id, title, subtitle, children }) => (
    <section id={id} data-narrate={id} className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-6xl">
            <motion.div
                className="mb-14 md:mb-16"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* 05 ──────────────────────────────── */}
                <div className="section-index mb-5">
                    <span>{SECTION_INDEX[id] || '--'}</span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-ink">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-3 max-w-2xl text-base md:text-lg text-ink-muted font-light leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </motion.div>
            {children}
        </div>
    </section>
);
