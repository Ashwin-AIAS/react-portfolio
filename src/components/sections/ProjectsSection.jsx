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

const MetricReadout = ({ project, compact = false }) => {
    const allRows = project.metrics
        || (project.metric ? [{ label: 'Result', value: project.metric }] : null);
    if (!allRows) return null;

    const rows = compact ? allRows.slice(0, 2) : allRows;

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

const ProjectLinks = ({ project, t, onInspect }) => (
    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-rule mt-auto">
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="label hover:text-accent transition-colors inline-flex items-center gap-2">
            <GitHubIcon className="w-3.5 h-3.5" /> Code
        </a>
        {hasLiveUrl(project) && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="label label-accent hover:text-accent-strong transition-colors inline-flex items-center gap-2">
                Live Demo <ExternalLinkIcon className="w-3 h-3" />
            </a>
        )}
        {project.architecture && onInspect && (
            <button
                type="button"
                onClick={() => onInspect(project)}
                className="label label-accent hover:text-ink ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-accent/40 bg-accent/10 hover:border-accent transition-colors cursor-pointer"
            >
                <span>⬡ {t?.projects?.architectureBtn || 'Architecture & Specs'}</span>
            </button>
        )}
    </div>
);

// Interactive Architecture & Engineering Case-Study Modal
const ArchitectureModal = ({ project, t, onClose }) => {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    if (!project) return null;
    const arch = project.architecture || {};

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.78)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="panel panel-accent w-full max-w-4xl flex flex-col overflow-hidden"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-rule bg-surface-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="status-dot" />
                            <span className="label label-accent">{project.category} // System Architecture Dossier</span>
                        </div>
                        <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-ink truncate">
                            {project.title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="ml-4 w-8 h-8 flex-shrink-0 flex items-center justify-center border border-rule text-ink-dim hover:text-accent hover:border-accent transition-colors text-lg leading-none cursor-pointer"
                        style={{ borderRadius: 'var(--r-sm)' }}
                    >
                        ×
                    </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {/* 1. System Dataflow Pipeline */}
                    {arch.pipeline && arch.pipeline.length > 0 && (
                        <div>
                            <span className="label label-accent block mb-3">
                                01 // {t?.projects?.pipelineTitle || 'System Dataflow Pipeline'}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 p-4 rounded bg-surface-2 border border-rule">
                                {arch.pipeline.map((stage, idx) => (
                                    <React.Fragment key={stage}>
                                        <div className="px-3 py-2 rounded bg-surface-1 border border-accent/40 font-mono text-xs text-ink flex items-center gap-2">
                                            <span className="text-[10px] text-accent font-bold">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <span>{stage}</span>
                                        </div>
                                        {idx < arch.pipeline.length - 1 && (
                                            <span className="font-mono text-accent text-xs font-bold px-0.5">
                                                →
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. Engineering Bottleneck vs Architectural Trade-Off */}
                    {(arch.problem || arch.tradeoff) && (
                        <div className="grid md:grid-cols-2 gap-4">
                            {arch.problem && (
                                <div className="p-4 rounded bg-surface-2 border border-rule">
                                    <span className="label block mb-2" style={{ color: 'var(--err)' }}>
                                        02 // {t?.projects?.problemTitle || 'Engineering Bottleneck'}
                                    </span>
                                    <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                                        {arch.problem}
                                    </p>
                                </div>
                            )}
                            {arch.tradeoff && (
                                <div className="p-4 rounded bg-surface-2 border border-accent/40">
                                    <span className="label label-accent block mb-2">
                                        03 // {t?.projects?.tradeoffTitle || 'Architectural Trade-Off & Solution'}
                                    </span>
                                    <p className="text-xs md:text-sm text-ink leading-relaxed">
                                        {arch.tradeoff}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Verified Telemetry & Implementation Highlights */}
                    <div className="grid md:grid-cols-12 gap-5">
                        {project.metrics && project.metrics.length > 0 && (
                            <div className="md:col-span-5 p-4 rounded bg-surface-2 border border-rule">
                                <span className="label label-accent block mb-3">
                                    04 // {t?.projects?.benchmarksTitle || 'Verified System Telemetry'}
                                </span>
                                <dl className="divide-y divide-rule">
                                    {project.metrics.map(m => (
                                        <div key={m.label} className="readout-row">
                                            <dt>{m.label}</dt>
                                            <dd className="ml-auto text-right">{m.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        {arch.highlights && arch.highlights.length > 0 && (
                            <div className={`${project.metrics?.length ? 'md:col-span-7' : 'md:col-span-12'} p-4 rounded bg-surface-2 border border-rule`}>
                                <span className="label label-accent block mb-3">
                                    05 // {t?.projects?.highlightsTitle || 'Implementation Highlights'}
                                </span>
                                <ul className="space-y-2">
                                    {arch.highlights.map((item, i) => (
                                        <li key={i} className="text-xs md:text-sm text-ink-muted flex items-start gap-2.5 leading-relaxed">
                                            <span className="text-accent font-mono text-xs mt-0.5">▸</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Tech Stack Strip */}
                    <div>
                        <span className="label block mb-2">Production Stack & Dependencies</span>
                        <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map(tech => (
                                <span key={tech} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-rule bg-surface-2">
                    <div className="flex items-center gap-3">
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary py-2 px-4"
                        >
                            <GitHubIcon className="w-3.5 h-3.5" /> View Source Repository
                        </a>
                        {hasLiveUrl(project) && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary py-2 px-4"
                            >
                                Live Deployment <ExternalLinkIcon className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary py-2 px-4 cursor-pointer"
                    >
                        {t?.projects?.closeArchitecture || 'Close'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ProjectCardWrapper = ({ project, index, featured = false, t, onInspect }) => (
    <AnimateOnScroll delay={index * 60} className="h-full">
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

                <MetricReadout project={project} compact={!featured} />

                <div className="flex flex-wrap gap-1.5 mb-5">
                    {(featured ? project.technologies : project.technologies.slice(0, 5)).map(tech => (
                        <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                    {!featured && project.technologies.length > 5 && (
                        <span className="tech-tag">+{project.technologies.length - 5}</span>
                    )}
                </div>

                <ProjectDemoVideo project={project} />

                <ProjectLinks project={project} t={t} onInspect={onInspect} />
            </div>
        </Card>
    </AnimateOnScroll>
);

// Horizontal showcase card: media column left, the write-up right. A demo
// clip, where there is one, beats the schematic as the media.
const ShowcaseCard = ({ project, index, t, onInspect }) => (
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

            <ProjectLinks project={project} t={t} onInspect={onInspect} />
        </div>
    </article>
);

// How far each card sits below the one before it, so the stack reads as a
// pile rather than a single card swapping its contents.
const STACK_STEP_REM = 1.1;

const StackSlot = ({ project, index, total, progress, t, onInspect }) => {
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
                <ShowcaseCard project={project} index={index} t={t} onInspect={onInspect} />
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
const FeaturedStack = ({ projects, t, onInspect }) => {
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
                    t={t}
                    onInspect={onInspect}
                />
            ))}
        </div>
    );
};

const CATEGORIES = [
    'All',
    'Computer Vision',
    'Autonomous Systems',
    'GenAI & RAG',
    'Edge C++ & Tools'
];

export const ProjectsSection = ({ t }) => {
    const [showAll, setShowAll] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [inspectedProject, setInspectedProject] = useState(null);

    // Stricter than the hero's cut-off: the showcase card is two columns, and
    // below ~1024px wide the write-up column no longer fits one screen.
    const canStack = useCanPin(1024, 700);
    const allProjects = portfolioData.projects;
    const featured = allProjects.filter(p => p.featured);
    const rest = allProjects.filter(p => !p.featured);

    const filteredProjects = activeCategory === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === activeCategory);

    return (
        <>
            <Section id="projects" title={t.projects.title} subtitle={t.projects.subtitle}>
                {/* Category Filter Tabs for Recruiters & Engineers */}
                <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-rule">
                    {CATEGORIES.map(cat => {
                        const count = cat === 'All'
                            ? allProjects.length
                            : allProjects.filter(p => p.category === cat).length;
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3.5 py-2 rounded border font-mono text-xs flex items-center gap-2 transition-all cursor-pointer ${
                                    isActive
                                        ? 'border-accent bg-accent/10 text-accent font-semibold'
                                        : 'border-rule bg-surface-1 text-ink-muted hover:border-rule-strong hover:text-ink'
                                }`}
                            >
                                <span>{cat === 'All' ? (t.projects.filterAll || 'All Deployments') : cat}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-ink-dim'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {activeCategory === 'All' ? (
                    <>
                        {canStack && featured.length > 1 ? (
                            <FeaturedStack projects={featured} t={t} onInspect={setInspectedProject} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {featured.map((project, index) => (
                                    <ProjectCardWrapper
                                        key={project.title}
                                        project={project}
                                        index={index}
                                        featured
                                        t={t}
                                        onInspect={setInspectedProject}
                                    />
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
                                            <ProjectCardWrapper
                                                key={project.title}
                                                project={project}
                                                index={featured.length + index}
                                                t={t}
                                                onInspect={setInspectedProject}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex justify-start mt-10">
                            <button onClick={() => setShowAll(!showAll)} className="btn btn-secondary cursor-pointer">
                                {showAll ? t.projects.showLess : `${t.projects.showMore} (${rest.length})`}
                                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCardWrapper
                                key={project.title}
                                project={project}
                                index={index}
                                featured={project.featured}
                                t={t}
                                onInspect={setInspectedProject}
                            />
                        ))}
                    </motion.div>
                )}
            </Section>

            {/* Fixed-position modal rendered outside <Section> so section depth transforms never affect fixed positioning */}
            <AnimatePresence>
                {inspectedProject && (
                    <ArchitectureModal
                        key="arch-modal"
                        project={inspectedProject}
                        t={t}
                        onClose={() => setInspectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
