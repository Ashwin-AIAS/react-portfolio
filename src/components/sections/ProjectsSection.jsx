import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useInView, motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { ExternalLinkIcon, GitHubIcon, PlayIcon } from '../../icons/Icons';
import { useCanPin } from '../../hooks/useMediaQuery';

// Lazy load visual components
const VisualComponents = {
    RAGSystem: lazy(() => import('../visuals/RAGSystemVisual')),
    MiniCNN: lazy(() => import('../visuals/MiniCNNVisual')),
    BatSwing: lazy(() => import('../visuals/BatSwingVisual')),
    RadarAI: lazy(() => import('../visuals/RadarAIVisual')),
    FaceRecon: lazy(() => import('../visuals/FaceReconVisual')),
    LidarFusion: lazy(() => import('../visuals/LidarFusionVisual')),
    Roundabout: lazy(() => import('../visuals/RoundaboutVisual')),
    ReinforcementLearning: lazy(() => import('../visuals/RLVisual')),
    Webhook: lazy(() => import('../visuals/WebhookVisual')),
    PortfolioAI: lazy(() => import('../visuals/PortfolioAIVisual')),
    Jarvis: lazy(() => import('../visuals/JarvisVisual')),
    GymVision: lazy(() => import('../visuals/GymVisionVisual'))
};

// Media slot: a real screenshot when the project has one, otherwise the
// existing animated visual. Drop a file in public/projects/ and set
// `image` in portfolioData.js and that project upgrades automatically.
// `fill` stretches it to its parent instead (the showcase media column).
const ProjectMedia = ({ project, featured, fill = false }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
    const Visual = VisualComponents[project.visualComponent];
    const height = fill
        ? 'h-full'
        : `${featured ? 'aspect-[16/10]' : 'aspect-[16/9]'} border-b border-rule`;

    if (project.image) {
        return (
            <div className={`${height} relative overflow-hidden`}>
                <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>
        );
    }

    return (
        <div ref={ref} className={`${height} relative overflow-hidden bg-surface-2`}>
            {isInView && (
                <Suspense fallback={<div className="w-full h-full" />}>
                    {Visual ? <Visual /> : null}
                </Suspense>
            )}
            {/* Corner marker instead of the old full-bleed black scrim that
                crushed the bottom half of every visual. */}
            <span className="label absolute bottom-2 left-3 opacity-60">Schematic</span>
        </div>
    );
};

// One-shot IntersectionObserver, scoped to a single element rather than the
// whole-page section tracking in src/voice-guide/useActiveSection.js — that
// hook drives multi-section narration state and isn't a fit here. Flips to
// true once the target is seen and disconnects; used to keep the demo
// <video> unmounted until its card has actually scrolled into view.
const useInViewOnce = (ref) => {
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        if (seen || typeof IntersectionObserver === 'undefined') return undefined;
        const el = ref.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setSeen(true);
                observer.disconnect();
            }
        }, { rootMargin: '0px 0px -10% 0px' });
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, seen]);
    return seen;
};

// Click-to-play demo clip: poster + play button until clicked, and the
// <video> tag itself isn't mounted until the frame has scrolled into view.
const ProjectDemoVideo = ({ project }) => {
    const frameRef = useRef(null);
    const videoRef = useRef(null);
    const inView = useInViewOnce(frameRef);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (playing) videoRef.current?.play().catch(() => {});
    }, [playing]);

    if (!project.demoVideoUrl) return null;

    return (
        <div ref={frameRef} className="demo-video-frame mb-5">
            {playing && inView ? (
                <video
                    ref={videoRef}
                    controls
                    preload="none"
                    poster={project.demoVideoPoster}
                    playsInline
                >
                    <source src={project.demoVideoUrl} type="video/mp4" />
                </video>
            ) : (
                <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="demo-video-trigger"
                    aria-label={`Play ${project.title} demo video`}
                >
                    {project.demoVideoPoster && (
                        <img
                            src={project.demoVideoPoster}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    )}
                    <span className="demo-video-play">
                        <span className="demo-video-play-icon">
                            <PlayIcon className="w-5 h-5" />
                        </span>
                    </span>
                </button>
            )}
        </div>
    );
};

const MetricReadout = ({ project }) => {
    const rows = project.metrics
        || (project.metric ? [{ label: 'Result', value: project.metric }] : null);
    if (!rows) return null;

    return (
        <dl className="mb-5 border-t border-rule">
            {rows.map((m) => (
                <div key={m.label} className="readout-row">
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                </div>
            ))}
        </dl>
    );
};

const hasLiveUrl = (project) => project.liveUrl && project.liveUrl !== '#';

// NN ── CATEGORY ............ ▸ LIVE
const ProjectMeta = ({ project, index }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="label label-accent">
            {String(index + 1).padStart(2, '0')}
        </span>
        <span className="label truncate">{project.category}</span>
        {hasLiveUrl(project) && (
            <span className="label label-accent ml-auto flex items-center gap-1.5 flex-shrink-0">
                <span className="status-dot" /> Live
            </span>
        )}
    </div>
);

const ProjectLinks = ({ project }) => (
    <div className="flex gap-5 pt-4 border-t border-rule mt-auto">
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="label hover:text-accent transition-colors inline-flex items-center gap-2">
            <GitHubIcon className="w-3.5 h-3.5" /> Code
        </a>
        {hasLiveUrl(project) && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="label label-accent hover:text-accent-strong transition-colors inline-flex items-center gap-2">
                Live Demo <ExternalLinkIcon className="w-3 h-3" />
            </a>
        )}
    </div>
);

const ProjectCardWrapper = ({ project, index, featured = false }) => (
    <AnimateOnScroll delay={index * 90} className="h-full">
        <Card className={`h-full flex flex-col group ${featured ? 'panel-accent' : ''}`}>
            <ProjectMedia project={project} featured={featured} />

            <div className={`${featured ? 'p-6' : 'p-5'} flex-grow flex flex-col`}>
                <ProjectMeta project={project} index={index} />

                <h3 className={`font-display ${featured ? 'text-2xl' : 'text-lg'} font-bold tracking-tight text-ink mb-3 group-hover:text-accent transition-colors`}>
                    {project.title}
                </h3>

                <p className={`${featured ? 'text-sm' : 'text-[13px]'} text-ink-muted font-light leading-relaxed mb-5 whitespace-pre-line flex-grow`}>
                    {project.description}
                </p>

                {featured && <MetricReadout project={project} />}

                <div className="flex flex-wrap gap-1.5 mb-5">
                    {(featured ? project.technologies : project.technologies.slice(0, 5)).map(tech => (
                        <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                    {!featured && project.technologies.length > 5 && (
                        <span className="tech-tag">+{project.technologies.length - 5}</span>
                    )}
                </div>

                <ProjectDemoVideo project={project} />

                <ProjectLinks project={project} />
            </div>
        </Card>
    </AnimateOnScroll>
);

// Horizontal showcase card: media column left, the write-up right. A demo
// clip, where there is one, beats the schematic as the media.
const ShowcaseCard = ({ project, index }) => (
    <article className="panel panel-accent showcase-card group">
        <div className="showcase-media">
            {project.demoVideoUrl
                ? <ProjectDemoVideo project={project} />
                : <ProjectMedia project={project} featured fill />}
        </div>

        <div className="showcase-body custom-scrollbar">
            <ProjectMeta project={project} index={index} />

            <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-ink mb-4 group-hover:text-accent transition-colors">
                {project.title}
            </h3>

            <p className="text-sm text-ink-muted font-light leading-relaxed mb-5 whitespace-pre-line">
                {project.description}
            </p>

            <MetricReadout project={project} />

            <div className="flex flex-wrap gap-1.5 mb-5">
                {project.technologies.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                ))}
            </div>

            <ProjectLinks project={project} />
        </div>
    </article>
);

// How far each card sits below the one before it, so the stack reads as a
// pile rather than a single card swapping its contents.
const STACK_STEP_REM = 1.1;

const StackSlot = ({ project, index, total, progress }) => {
    // Card i starts receding the moment card i+1 begins to arrive, and keeps
    // going as each later card lands on top of it.
    const depth = total - 1 - index;
    const start = Math.min(index / (total - 1), 0.999);
    const scale = useTransform(progress, [start, 1], [1, 1 - depth * 0.045]);
    const dim = useTransform(progress, [start, 1], [0, Math.min(depth * 0.2, 0.6)]);

    return (
        <div className="showcase-slot" style={{ paddingTop: `calc(6rem + ${index * STACK_STEP_REM}rem)` }}>
            <motion.div
                className="showcase-frame"
                style={{
                    scale,
                    height: `min(34rem, calc(100vh - ${8 + total * STACK_STEP_REM}rem))`,
                }}
            >
                <ShowcaseCard project={project} index={index} />
                <motion.div className="showcase-dim" style={{ opacity: dim }} aria-hidden="true" />
            </motion.div>
        </div>
    );
};

/**
 * Featured projects as a pinned stack: each card is a full-viewport slot that
 * sticks, and as the next one slides up over it the card underneath shrinks
 * back and dims. Only where a two-column card fits in one screen; elsewhere
 * the featured grid renders as before.
 */
const FeaturedStack = ({ projects }) => {
    const stackRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

    return (
        <div ref={stackRef} className="showcase-stack">
            {projects.map((project, index) => (
                <StackSlot
                    key={project.title}
                    project={project}
                    index={index}
                    total={projects.length}
                    progress={scrollYProgress}
                />
            ))}
        </div>
    );
};

export const ProjectsSection = ({ t }) => {
    const [showAll, setShowAll] = useState(false);
    // Stricter than the hero's cut-off: the showcase card is two columns, and
    // below ~1024px wide the write-up column no longer fits one screen.
    const canStack = useCanPin(1024, 700);
    const featured = portfolioData.projects.filter(p => p.featured);
    const rest = portfolioData.projects.filter(p => !p.featured);

    return (
        <Section id="projects" title={t.projects.title} subtitle={t.projects.subtitle}>
            {canStack && featured.length > 1 ? (
                <FeaturedStack projects={featured} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map((project, index) => (
                        <ProjectCardWrapper key={project.title} project={project} index={index} featured />
                    ))}
                </div>
            )}
            <AnimatePresence initial={false}>
                {showAll && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                            {rest.map((project, index) => (
                                <ProjectCardWrapper key={project.title} project={project} index={featured.length + index} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex justify-start mt-10">
                <button onClick={() => setShowAll(!showAll)} className="btn btn-secondary">
                    {showAll ? t.projects.showLess : `${t.projects.showMore} (${rest.length})`}
                    <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>
        </Section>
    );
};
