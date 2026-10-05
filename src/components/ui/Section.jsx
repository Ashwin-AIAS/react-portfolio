import React, { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

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

const EASE = [0.16, 1, 0.3, 1];

// Each word rises out of its own mask, one after another. Spaces sit outside
// the masks so the line still wraps and reads as ordinary text.
const MaskedHeading = ({ text, shown, still }) => {
    const words = String(text ?? '').split(' ');
    return words.map((word, i) => (
        <React.Fragment key={i}>
            <span className="word-mask">
                <motion.span
                    className="inline-block"
                    initial={still ? false : { y: '105%' }}
                    animate={shown ? { y: '0%' } : undefined}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.08 + i * 0.07 }}
                >
                    {word}
                </motion.span>
            </span>
            {i < words.length - 1 && ' '}
        </React.Fragment>
    ));
};

/**
 * A section arrives from depth: while its top edge travels from the bottom of
 * the viewport to the upper third, its content scales up and rises into
 * place. The values reach identity once it has arrived, so nothing inside a
 * settled section sits under a live transform (the project stack pins in
 * here). Keep fixed-position UI outside <Section> — the roadmap modal does.
 */
export const Section = ({ id, title, subtitle, children }) => {
    const sectionRef = useRef(null);
    const headRef = useRef(null);
    const still = usePrefersReducedMotion();
    const headInView = useInView(headRef, { once: true, margin: '-80px' });
    const shown = still || headInView;

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 0.3'] });
    const depth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });
    const scale = useTransform(depth, [0, 1], [0.92, 1]);
    const y = useTransform(depth, [0, 1], [90, 0]);
    const opacity = useTransform(depth, [0, 0.7], [0.25, 1]);

    return (
        <section id={id} data-narrate={id} ref={sectionRef} className="py-24 md:py-32 px-6">
            <motion.div
                className="container mx-auto max-w-6xl"
                style={still ? undefined : { scale, y, opacity }}
            >
                <div ref={headRef} className="mb-14 md:mb-16">
                    {/* 05 ──────────────────────────────── */}
                    <div className={`section-index mb-5${shown ? ' is-drawn' : ''}`}>
                        <span>{SECTION_INDEX[id] || '--'}</span>
                    </div>

                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-ink">
                        <MaskedHeading text={title} shown={shown} still={still} />
                    </h2>

                    {subtitle && (
                        <motion.p
                            className="mt-3 max-w-2xl text-base md:text-lg text-ink-muted font-light leading-relaxed"
                            initial={still ? false : { opacity: 0, y: 12 }}
                            animate={shown ? { opacity: 1, y: 0 } : undefined}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
                {children}
            </motion.div>
        </section>
    );
};
