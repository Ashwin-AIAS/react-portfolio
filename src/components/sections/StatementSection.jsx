import React, { useEffect, useRef } from 'react';
import { motion, transform, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { OptimusAvatarVisual } from '../../voice-guide/components/OptimusAvatarVisual';
import { JarvisAvatarVisual } from '../../voice-guide/components/JarvisAvatarVisual';
import { MegatronAvatarVisual } from '../../voice-guide/components/MegatronAvatarVisual';
import { RIGS } from './statementRigs';
import './statementStage.css';

/** The robots never get brighter than this; the headline is the subject. */
const ROBOT_PEAK = 0.22;
const STILL_OPACITY = 0.15;

/** Megatron's stepped glitch runs from GLITCH_START, then cuts at HARD_CUT. */
const GLITCH_START = 0.9;
const HARD_CUT = 0.98;

// Slices and jumps from the guide's own vg-meg-glitch-out, scaled up for a
// stage-sized crest, with two clean frames so it flickers rather than smears.
// The side insets are negative so the svg glow isn't shaved off.
const GLITCH = [
    { clip: 'inset(30% -40% 28% -40%)', x: 30, y: 0 },
    { clip: 'none', x: 0, y: 0 },
    { clip: 'inset(0% -40% 62% -40%)', x: -42, y: -12 },
    { clip: 'inset(55% -40% 12% -40%)', x: 48, y: 12 },
    { clip: 'none', x: -8, y: 0 },
    { clip: 'inset(20% -40% 36% -40%)', x: 30, y: -18 },
    { clip: 'inset(40% -40% 44% -40%)', x: -60, y: 0 },
    { clip: 'inset(48% -40% 48% -40%)', x: -18, y: 0 },
];
const GLITCH_STEP = (HARD_CUT - GLITCH_START) / GLITCH.length;
const glitchAt = (v) =>
    v < GLITCH_START ? null : GLITCH[Math.min(GLITCH.length - 1, Math.floor((v - GLITCH_START) / GLITCH_STEP))];

const megatronFade = transform([0.66, 0.74], [0, ROBOT_PEAK]);

const ROBOT_BOX = { position: 'absolute', width: '55vmin', height: '55vmin' };

/*
 * A robot at opacity 0 is taken out with display:none, not just left
 * transparent. The voice guide writes --vg-level on <html> while it talks,
 * which restyles the whole document each time, and a hidden svg would still
 * be restyled with it, a few hundred nodes per robot. display:none subtrees
 * are skipped.
 */
const shownWhen = (opacity) => (opacity > 0 ? 'block' : 'none');

// Sits between the robots and the copy. Darkest (well, most --bg) under the
// headline, clear by the edges, so the robots read around the words and never
// through them — in either theme, since it is the page's own background.
const MASK = {
    background:
        'radial-gradient(ellipse 60% 45% at 50% 50%, color-mix(in srgb, var(--bg) 60%, transparent) 0%, color-mix(in srgb, var(--bg) 30%, transparent) 50%, transparent 85%)',
};

/** "I teach machines to " + "see." + "" — the accent word is lit separately. */
const splitStatement = (statement, accent) => {
    const i = accent ? statement.lastIndexOf(accent) : -1;
    if (i < 0) return [statement, '', ''];
    return [statement.slice(0, i), accent, statement.slice(i + accent.length)];
};

/**
 * @param {Object} props
 * @param {import('framer-motion').MotionValue<number>} [props.accentOpacity]
 *   0..1, how lit the accent word is; omitted means already lit.
 */
const Headline = ({ t, accentOpacity }) => {
    const [before, accent, after] = splitStatement(t.hero.statement, t.hero.statementAccent);
    const lit = useMotionValue(1);
    const accentMv = accentOpacity ?? lit;
    // Colour isn't animated: an accent copy fades in over the ink one, so the
    // change stays on opacity like everything else on the stage.
    const inkOpacity = useTransform(accentMv, (v) => 1 - v);

    return (
        <>
            {/* Capped at 7xl and ~9.5em so it breaks before the accent word and
                stays clear of the guide's caption card on a 1366px screen. */}
            <p className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-ink leading-[0.95] max-w-[9.5em] mx-auto">
                {before}
                {accent && (
                    <span className="relative inline-block">
                        <motion.span className="inline-block" style={{ opacity: inkOpacity, willChange: 'opacity' }}>
                            {accent}
                        </motion.span>
                        <motion.span
                            aria-hidden="true"
                            className="absolute inset-0 text-accent"
                            style={{ opacity: accentMv, willChange: 'opacity' }}
                        >
                            {accent}
                        </motion.span>
                    </span>
                )}
                {after}
            </p>
            <p className="mt-6 text-base md:text-lg text-ink-muted font-light leading-relaxed max-w-xl mx-auto">
                {t.hero.statementSub}
            </p>
        </>
    );
};

/**
 * Poses one robot from p on every change. Returns the ref for its box.
 * Writes are skipped when a value hasn't moved, so a robot outside its range
 * costs nothing per frame.
 */
const useRig = (p, rig) => {
    const ref = useRef(null);
    useEffect(() => {
        const parts = rig.collect(ref.current);
        const last = new Map();
        const write = (el, prop, value) => {
            if (!el) return;
            const seen = last.get(el) ?? {};
            if (seen[prop] === value) return;
            seen[prop] = value;
            last.set(el, seen);
            el.style[prop] = value;
        };
        const pose = (v) => rig.pose(v, parts, write);
        pose(p.get());
        return p.on('change', pose);
    }, [p, rig]);
    return ref;
};

/** While the stage is pinned the floating guide's avatar steps aside. */
const markStageActive = (on) => document.documentElement.toggleAttribute('data-statement-stage', on);

/**
 * A tall runway with a one-viewport stage pinned inside it. Scroll progress p
 * through the runway is the only clock: the headline holds still in the middle
 * while three guide robots play out behind it.
 *
 *   0.00–0.38  Optimus assembles from loose layers, optics come up last
 *   0.32–0.72  JARVIS spins up; its sweep passes the headline at ~0.5 and
 *              lights the accent word
 *   0.66–1.00  Megatron fades in, eyes flare at ~0.8, glitches from 0.9 and
 *              cuts out at 0.98
 */
const PinnedStatement = ({ t }) => {
    const runwayRef = useRef(null);
    const { scrollYProgress: p } = useScroll({ target: runwayRef, offset: ['start start', 'end end'] });

    // Crossfades and the glitch live on each robot's box; its parts are
    // posed by the rigs (statementRigs.js).
    const optimusRef = useRig(p, RIGS.optimus);
    const jarvisRef = useRig(p, RIGS.jarvis);
    const megatronRef = useRig(p, RIGS.megatron);

    const optimusOpacity = useTransform(p, [0.3, 0.4], [ROBOT_PEAK, 0]);
    const jarvisOpacity = useTransform(p, [0.32, 0.4, 0.64, 0.74], [0, ROBOT_PEAK, ROBOT_PEAK, 0]);
    const megatronOpacity = useTransform(p, (v) => (v >= HARD_CUT ? 0 : megatronFade(v)));
    const accentOpacity = useTransform(p, [0.49, 0.52], [0, 1]);

    const optimusDisplay = useTransform(optimusOpacity, shownWhen);
    const jarvisDisplay = useTransform(jarvisOpacity, shownWhen);
    const megatronDisplay = useTransform(megatronOpacity, shownWhen);
    // Off screen, all three go, so the rest of the page never pays for them.
    const onScreen = useInView(runwayRef);

    const glitchClip = useTransform(p, (v) => glitchAt(v)?.clip ?? 'none');
    const glitchX = useTransform(p, (v) => glitchAt(v)?.x ?? 0);
    const glitchY = useTransform(p, (v) => glitchAt(v)?.y ?? 0);

    const activeRef = useRef(false);
    useMotionValueEvent(p, 'change', (v) => {
        const active = v > 0 && v < 1;
        if (active === activeRef.current) return;
        activeRef.current = active;
        markStageActive(active);
    });
    useEffect(() => () => markStageActive(false), []);

    return (
        <section ref={runwayRef} className="relative h-[160vh] md:h-[250vh]">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6">
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ display: onScreen ? undefined : 'none' }}
                    aria-hidden="true"
                >
                    <motion.div ref={optimusRef} style={{ ...ROBOT_BOX, opacity: optimusOpacity, display: optimusDisplay, willChange: 'opacity' }}>
                        <OptimusAvatarVisual mode="stage" size="100%" />
                    </motion.div>
                    <motion.div ref={jarvisRef} style={{ ...ROBOT_BOX, opacity: jarvisOpacity, display: jarvisDisplay, willChange: 'opacity' }}>
                        <JarvisAvatarVisual mode="stage" size="100%" />
                    </motion.div>
                    <motion.div
                        ref={megatronRef}
                        style={{
                            ...ROBOT_BOX,
                            opacity: megatronOpacity,
                            display: megatronDisplay,
                            x: glitchX,
                            y: glitchY,
                            clipPath: glitchClip,
                            willChange: 'opacity, transform',
                        }}
                    >
                        <MegatronAvatarVisual mode="stage" size="100%" />
                    </motion.div>
                </div>

                <div className="absolute inset-0 pointer-events-none" style={MASK} aria-hidden="true" />

                <div className="relative z-10 text-center">
                    <Headline t={t} accentOpacity={accentOpacity} />
                </div>
            </div>
        </section>
    );
};

/** Reduced motion: no runway, no pin — one still JARVIS and the word already lit. */
const StillStatement = ({ t }) => (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div style={{ ...ROBOT_BOX, opacity: STILL_OPACITY }}>
                <JarvisAvatarVisual mode="stage" size="100%" />
            </div>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={MASK} aria-hidden="true" />
        <div className="relative z-10 text-center">
            <Headline t={t} />
        </div>
    </section>
);

export const StatementSection = ({ t }) => {
    const reduced = usePrefersReducedMotion();
    return reduced ? <StillStatement t={t} /> : <PinnedStatement t={t} />;
};
