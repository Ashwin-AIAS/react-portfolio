import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { LidarSweep } from '../ui/LidarSweep';
import { useCanPin, usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { portfolioData } from '../../data/portfolioData';
import { DownloadIcon, EyeIcon, ExternalLinkIcon } from '../../icons/Icons';

const ResumeModal = ({ t, onClose }) => {
    const resumeUrl = portfolioData.personalInfo.resumeUrl;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.76)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="panel w-full max-w-4xl flex flex-col overflow-hidden"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
                    <div className="min-w-0">
                        <p className="label label-accent truncate mb-1">Official Curriculum Vitae</p>
                        <h3 className="font-display text-sm font-bold tracking-tight text-ink truncate">
                            Ashwin Vignesh M — M.Sc. AI Engineering for Autonomous Systems (THI Germany)
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="ml-4 w-8 h-8 flex-shrink-0 flex items-center justify-center border border-rule text-ink-dim hover:text-accent hover:border-accent transition-colors text-lg leading-none cursor-pointer"
                        style={{ borderRadius: 'var(--r-sm)' }}
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 relative bg-surface-2" style={{ minHeight: '62vh' }}>
                    <iframe
                        src={resumeUrl}
                        className="w-full h-full absolute inset-0"
                        title="Ashwin Vignesh M Resume"
                    />
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-4 border-t border-rule">
                    <span className="label">Ingolstadt, Germany • Open to Relocation & Remote</span>
                    <div className="flex items-center gap-3">
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary py-2 px-4"
                        >
                            <ExternalLinkIcon className="w-3.5 h-3.5" /> Open in Tab
                        </a>
                        <a
                            href={resumeUrl}
                            download="Ashwin_Vignesh_M_Resume.pdf"
                            className="btn btn-primary py-2 px-4"
                        >
                            <DownloadIcon className="w-3.5 h-3.5" /> {t.hero.downloadCv || 'Download CV'}
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// The typewriter ticks every 60ms. It lives in its own component so those
// ticks re-render one <p>, not the whole stage.
const RoleTicker = ({ badge }) => {
    // Memoised: the ticker re-renders every 60ms, and a fresh array each time
    // would restart the typing effect below on every tick.
    const roles = useMemo(() => [
        badge.toUpperCase(),
        "COMPUTER VISION & PERCEPTION ENGINEER",
        "AUTONOMOUS DRIVING & SENSOR FUSION",
        "MULTIMODAL & GRAPH RAG ARCHITECT",
        "EDGE PYTORCH & C++ HPC INFERENCE",
    ], [badge]);
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
    }, [roleIndex, roles]);

    return (
        <p className="label mb-5 h-5">
            <span className="label-accent">{displayText}</span>
            <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.53, repeat: Infinity }}
                className="label-accent-2"
            >_</motion.span>
        </p>
    );
};

const IntroCopy = ({ t, onPreviewCv }) => {
    const facts = t.hero.recruiterFacts || portfolioData.personalInfo.recruiterFacts || [];

    return (
        <>
            <RoleTicker badge={t.hero.badge} />

            {/* Rendered statically — no opacity:0 mount, so this is a
                real LCP candidate instead of an invisible one. The scroll
                choreography starts every value at its resting state. */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-ink leading-[0.92] mb-6">
                {t.hero.greeting} Ashwin
            </h1>

            <p className="text-base md:text-lg text-ink-muted font-light leading-relaxed max-w-xl mb-6">
                {t.hero.bio}
            </p>

            {/* Minimalist Live Availability Pill */}
            <div className="flex items-center gap-2 mb-6 text-xs font-mono text-ink-muted">
                <span className="w-2 h-2 rounded-full bg-ok animate-pulse flex-shrink-0" />
                <span>Available for <strong>Computer Vision & Autonomous Systems</strong> roles &middot; Ingolstadt, Germany / Remote</span>
            </div>

            {/* Streamlined Action Deck with Direct CV Download & Preview */}
            <div className="flex flex-wrap gap-3 items-center mb-7">
                <a href="#projects" className="btn btn-primary group shadow-md hover:shadow-accent/20 cursor-pointer">
                    <span>{t.hero.viewProjects}</span>
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>

                <a
                    href={portfolioData.personalInfo.resumeUrl}
                    download="Ashwin_Vignesh_M_Resume.pdf"
                    className="btn btn-secondary cursor-pointer"
                >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    <span>{t.hero.downloadCv || 'Download CV'}</span>
                </a>

                <button
                    type="button"
                    onClick={onPreviewCv}
                    className="btn btn-secondary px-4 cursor-pointer"
                    title="Preview Resume in Modal"
                >
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span>{t.hero.previewCv || 'Preview CV'}</span>
                </button>
            </div>

            {/* Recruiter Quick-Facts Strip (German / EU Tech Readiness) */}
            {facts.length > 0 && (
                <div className="panel p-3.5 max-w-xl bg-surface-1/90">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {facts.map((fact) => (
                            <div key={fact.label} className="flex items-baseline justify-between sm:justify-start gap-2 text-xs">
                                <span className="label label-accent-2 text-[10px] flex-shrink-0">{fact.label}:</span>
                                <span className="font-mono text-[11px] text-ink truncate">{fact.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

// Portrait — cutout silhouette blended into the LiDAR field with a bottom fade and HUD caption strip.
const Portrait = () => (
    <figure className="relative w-full max-w-sm">
        {/* Soft theme-aware radial backlight behind the silhouette */}
        <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
                background:
                    'radial-gradient(circle at 50% 42%, var(--accent-wash) 0%, var(--accent-2-wash) 36%, transparent 70%)',
                filter: 'blur(18px)',
            }}
        />

        <div className="relative w-full aspect-[4/5] overflow-hidden">
            <img
                src="/profile-cutout.webp"
                alt="Ashwin Vignesh M"
                width="960"
                height="1451"
                className="w-full h-full object-cover object-[50%_10%] select-none pointer-events-none"
                style={{
                    WebkitMaskImage:
                        'linear-gradient(to bottom, #000 0%, #000 66%, rgba(0,0,0,0.45) 84%, transparent 98%)',
                    maskImage:
                        'linear-gradient(to bottom, #000 0%, #000 66%, rgba(0,0,0,0.45) 84%, transparent 98%)',
                    filter: 'drop-shadow(0 0 24px var(--accent-wash)) contrast(1.03)',
                }}
            />
        </div>

        <figcaption
            className="relative z-10 -mt-3 flex items-center justify-between px-3.5 py-2 border border-rule backdrop-blur-md"
            style={{
                background: 'color-mix(in srgb, var(--surface-1) 78%, transparent)',
                borderRadius: 'var(--r-sm)',
            }}
        >
            <span className="label">Ashwin Vignesh M</span>
            <span className="label label-accent-2">AI ENG</span>
        </figcaption>
    </figure>
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
 * intro lifts away out of focus and the portrait pushes in, then the page
 * releases into StatementSection, which runs its own pinned scene.
 *
 * The runway used to be 240vh with the statement taking over its back half.
 * It is 190vh now; every range below is the old one rescaled by 140/90, so
 * each move still takes the same distance of scroll as before.
 */
const PinnedHero = ({ t, onPreviewCv }) => {
    const runwayRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: runwayRef, offset: ['start start', 'end end'] });
    // A little inertia so wheel steps read as a camera move, not a slideshow.
    const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

    const lidarScale = useTransform(p, [0, 1], [1, 2.4]);
    const lidarOpacity = useTransform(p, [0, 0.78, 1], [1, 0.75, 0.2]);

    const copyY = useTransform(p, [0, 0.65], [0, -140]);
    const copyOpacity = useTransform(p, [0.06, 0.56], [1, 0]);
    const copyFilter = useTransform(useTransform(p, [0, 0.56], [0, 10]), toBlur);
    const copyPointer = useTransform(p, (v) => (v > 0.47 ? 'none' : 'auto'));

    const portraitScale = useTransform(p, [0, 0.78], [1, 1.35]);
    const portraitY = useTransform(p, [0, 0.78], [0, -50]);
    const portraitOpacity = useTransform(p, [0.34, 0.78], [1, 0]);

    const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

    return (
        <section id="hero" data-narrate="hero" ref={runwayRef} className="relative" style={{ height: '190vh' }}>
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
                            <IntroCopy t={t} onPreviewCv={onPreviewCv} />
                        </motion.div>

                        <motion.div
                            className="order-2 md:col-span-5 flex md:justify-end"
                            style={{ scale: portraitScale, y: portraitY, opacity: portraitOpacity }}
                        >
                            <Portrait />
                        </motion.div>
                    </div>
                </div>

                <ScrollCue t={t} style={{ opacity: cueOpacity }} />
            </div>
        </section>
    );
};

/**
 * Phones and short windows: there is no room to pin, so the same scene runs
 * as parallax while the hero scrolls out.
 * Reduced motion: the same layout with every value at rest.
 */
const FlowHero = ({ t, still, onPreviewCv }) => {
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
                        <IntroCopy t={t} onPreviewCv={onPreviewCv} />
                    </motion.div>

                    <motion.div className="order-2 md:col-span-5 flex md:justify-end" style={live({ y: portraitY })}>
                        <Portrait />
                    </motion.div>
                </div>
            </div>

            {!still && <ScrollCue t={t} style={{ opacity: cueOpacity }} />}
        </section>
    );
};

export const Hero = ({ t }) => {
    const [showResumeModal, setShowResumeModal] = useState(false);
    const canPin = useCanPin();
    const reduced = usePrefersReducedMotion();

    return (
        <>
            {canPin ? (
                <PinnedHero key="pin" t={t} onPreviewCv={() => setShowResumeModal(true)} />
            ) : (
                <FlowHero key={reduced ? 'still' : 'flow'} t={t} still={reduced} onPreviewCv={() => setShowResumeModal(true)} />
            )}
            <AnimatePresence>
                {showResumeModal && (
                    <ResumeModal
                        key="hero-resume-modal"
                        t={t}
                        onClose={() => setShowResumeModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
