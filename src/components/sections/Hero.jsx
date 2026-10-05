import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { LidarSweep } from '../ui/LidarSweep';
import { useCanPin, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const EASE = [0.16, 1, 0.3, 1];

// The typewriter ticks every 60ms. It lives in its own component so those
// ticks re-render one <p>, not the whole stage.
const RoleTicker = ({ badge }) => {
    const roles = [
        badge.toUpperCase(),
        "COMPUTER VISION & PERCEPTION ENGINEER",
        "AUTONOMOUS DRIVING & SENSOR FUSION",
        "MULTIMODAL & GRAPH RAG ARCHITECT",
        "EDGE PYTORCH & C++ HPC INFERENCE",
    ];
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let currentText = '';
        let charIndex = 0;
        let isTyping = true;
        let timeout;

        const type = () => {
            const currentRole = roles[roleIndex];
            if (isTyping) {
                if (charIndex < currentRole.length) {
                    currentText += currentRole[charIndex];
                    setDisplayText(currentText);
                    charIndex++;
                    timeout = setTimeout(type, 60);
                } else {
                    isTyping = false;
                    timeout = setTimeout(type, 1500);
                }
            } else {
                setDisplayText('');
                setRoleIndex((prev) => (prev + 1) % roles.length);
                isTyping = true;
                charIndex = 0;
                currentText = '';
                timeout = setTimeout(type, 60);
            }
        };

        timeout = setTimeout(type, 60);
        return () => clearTimeout(timeout);
    }, [roleIndex]);

    return (
        <p className="label mb-6 h-5">
            <span className="label-accent">{displayText}</span>
            <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.53, repeat: Infinity }}
                className="label-accent"
            >_</motion.span>
        </p>
    );
};

const IntroCopy = ({ t }) => (
    <>
        <RoleTicker badge={t.hero.badge} />

        {/* Rendered statically — no opacity:0 mount, so this is a
            real LCP candidate instead of an invisible one. The scroll
            choreography starts every value at its resting state. */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-ink leading-[0.92] mb-7">
            {t.hero.greeting} Ashwin
        </h1>

        <p className="text-base md:text-lg text-ink-muted font-light leading-relaxed max-w-xl mb-7">
            {t.hero.bio}
        </p>

        {/* Minimalist Live Availability Pill */}
        <div className="flex items-center gap-2 mb-8 text-xs font-mono text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            <span>Available for <strong>Computer Vision & Autonomous Systems</strong> roles &middot; Ingolstadt, Germany / Remote</span>
        </div>

        {/* Streamlined Action Deck */}
        <div className="flex flex-wrap gap-4 items-center">
            <a href="#projects" className="btn btn-primary group shadow-md hover:shadow-accent/20 cursor-pointer">
                <span>{t.hero.viewProjects}</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>

            <a href="#contact" className="btn btn-secondary cursor-pointer">
                {t.hero.getInTouch || 'Get in Touch'}
            </a>
        </div>
    </>
);

// Portrait — sharp panel with a mono caption strip.
const Portrait = () => (
    <figure className="panel overflow-hidden w-full max-w-xs">
        <img
            src="/profile.jpg"
            alt="Ashwin Vignesh M"
            width="640"
            height="640"
            className="w-full aspect-square object-cover"
        />
        <figcaption className="flex items-center justify-between px-3 py-2 border-t border-rule">
            <span className="label">Ashwin Vignesh M</span>
            <span className="label label-accent">AI ENG</span>
        </figcaption>
    </figure>
);

const Statement = ({ t }) => (
    <>
        <p className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-ink leading-[0.95]">
            {t.hero.statement}
        </p>
        <p className="mt-6 text-base md:text-lg text-ink-muted font-light leading-relaxed max-w-xl mx-auto">
            {t.hero.statementSub}
        </p>
    </>
);

const ScrollCue = ({ t, style }) => (
    <motion.div className="hero-cue" style={style} aria-hidden="true">
        <span className="label">{t.hero.scrollCue}</span>
        <span className="hero-cue-line" />
    </motion.div>
);

// `blur(0px)` still promotes a layer and creates a containing block, so the
// resting state is a real `none`.
const toBlur = (px) => (px < 0.05 ? 'none' : `blur(${px}px)`);

/**
 * Desktop: a camera dolly. The section is a tall runway and the stage pins to
 * the viewport while you scroll through it — the LiDAR field flies past, the
 * intro lifts away out of focus, the portrait pushes in, and one statement
 * takes over the frame before the page releases into the next section.
 */
const PinnedHero = ({ t }) => {
    const runwayRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: runwayRef, offset: ['start start', 'end end'] });
    // A little inertia so wheel steps read as a camera move, not a slideshow.
    const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

    const lidarScale = useTransform(p, [0, 0.75], [1, 2.6]);
    const lidarOpacity = useTransform(p, [0, 0.5, 0.85], [1, 0.75, 0.2]);

    const copyY = useTransform(p, [0, 0.42], [0, -140]);
    const copyOpacity = useTransform(p, [0.04, 0.36], [1, 0]);
    const copyFilter = useTransform(useTransform(p, [0, 0.36], [0, 10]), toBlur);
    const copyPointer = useTransform(p, (v) => (v > 0.3 ? 'none' : 'auto'));

    const portraitScale = useTransform(p, [0, 0.5], [1, 1.35]);
    const portraitY = useTransform(p, [0, 0.5], [0, -50]);
    const portraitOpacity = useTransform(p, [0.22, 0.5], [1, 0]);

    const statementOpacity = useTransform(p, [0.42, 0.62], [0, 1]);
    const statementScale = useTransform(p, [0.42, 0.82], [0.86, 1]);
    const statementY = useTransform(p, [0.42, 0.72], [60, 0]);

    const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

    return (
        <section id="hero" data-narrate="hero" ref={runwayRef} className="relative" style={{ height: '240vh' }}>
            <div className="sticky top-0 h-screen overflow-hidden flex items-center px-6 pt-16">
                <motion.div
                    className="absolute inset-0 overflow-hidden"
                    style={{ scale: lidarScale, opacity: lidarOpacity }}
                >
                    <LidarSweep />
                </motion.div>

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
                        <motion.div
                            className="order-1 md:col-span-7"
                            style={{ y: copyY, opacity: copyOpacity, filter: copyFilter, pointerEvents: copyPointer }}
                        >
                            <IntroCopy t={t} />
                        </motion.div>

                        <motion.div
                            className="order-2 md:col-span-5 flex md:justify-end"
                            style={{ scale: portraitScale, y: portraitY, opacity: portraitOpacity }}
                        >
                            <Portrait />
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
                    style={{ opacity: statementOpacity, scale: statementScale, y: statementY }}
                >
                    <Statement t={t} />
                </motion.div>

                <ScrollCue t={t} style={{ opacity: cueOpacity }} />
            </div>
        </section>
    );
};

/**
 * Phones and short windows: there is no room to pin, so the same scene runs
 * as parallax while the hero scrolls out, and the statement arrives in flow.
 * Reduced motion: the same layout with every value at rest.
 */
const FlowHero = ({ t, still }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

    const lidarScale = useTransform(p, [0, 1], [1, 1.35]);
    const copyY = useTransform(p, [0, 1], [0, 90]);
    const copyOpacity = useTransform(p, [0, 0.75], [1, 0.15]);
    const portraitY = useTransform(p, [0, 1], [0, 40]);
    const cueOpacity = useTransform(p, [0, 0.1], [1, 0]);

    const live = (style) => (still ? undefined : style);

    return (
        <section id="hero" data-narrate="hero" ref={sectionRef} className="relative min-h-screen flex flex-col justify-center px-6 py-28 overflow-hidden">
            <motion.div className="absolute inset-0 overflow-hidden" style={live({ scale: lidarScale })}>
                <LidarSweep />
            </motion.div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
                    <motion.div className="order-1 md:col-span-7" style={live({ y: copyY, opacity: copyOpacity })}>
                        <IntroCopy t={t} />
                    </motion.div>

                    <motion.div className="order-2 md:col-span-5 flex md:justify-end" style={live({ y: portraitY })}>
                        <Portrait />
                    </motion.div>
                </div>

                <motion.div
                    className="mt-24 md:mt-32 text-center"
                    initial={still ? false : { opacity: 0, y: 40, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-15% 0px' }}
                    transition={{ duration: 0.8, ease: EASE }}
                >
                    <Statement t={t} />
                </motion.div>
            </div>

            {!still && <ScrollCue t={t} style={{ opacity: cueOpacity }} />}
        </section>
    );
};

export const Hero = ({ t }) => {
    const canPin = useCanPin();
    const reduced = usePrefersReducedMotion();

    // Keyed so a breakpoint change remounts with fresh scroll offsets instead
    // of re-targeting live motion values mid-flight.
    if (canPin) return <PinnedHero key="pin" t={t} />;
    return <FlowHero key={reduced ? 'still' : 'flow'} t={t} still={reduced} />;
};
