import React, { lazy, Suspense, useRef, useState } from 'react';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { ExternalLinkIcon, GitHubIcon } from '../../icons/Icons';

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
const ProjectMedia = ({ project, featured }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
    const Visual = VisualComponents[project.visualComponent];
    const height = featured ? 'aspect-[16/10]' : 'aspect-[16/9]';

    if (project.image) {
        return (
            <div className={`${height} relative overflow-hidden border-b border-rule`}>
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
        <div ref={ref} className={`${height} relative overflow-hidden border-b border-rule bg-surface-2`}>
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

const ProjectCardWrapper = ({ project, index, featured = false }) => (
    <AnimateOnScroll delay={index * 90} className="h-full">
        <Card className={`h-full flex flex-col group ${featured ? 'panel-accent' : ''}`}>
            <ProjectMedia project={project} featured={featured} />

            <div className={`${featured ? 'p-6' : 'p-5'} flex-grow flex flex-col`}>
                {/* NN ── CATEGORY ............ ▸ LIVE */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="label label-accent">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="label truncate">{project.category}</span>
                    {project.liveUrl && project.liveUrl !== '#' && (
                        <span className="label label-accent ml-auto flex items-center gap-1.5 flex-shrink-0">
                            <span className="status-dot" /> Live
                        </span>
                    )}
                </div>

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

                <div className="flex gap-5 pt-4 border-t border-rule mt-auto">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="label hover:text-accent transition-colors inline-flex items-center gap-2">
                        <GitHubIcon className="w-3.5 h-3.5" /> Code
                    </a>
                    {project.liveUrl && project.liveUrl !== '#' && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="label label-accent hover:text-accent-strong transition-colors inline-flex items-center gap-2">
                            Live Demo <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </div>
        </Card>
    </AnimateOnScroll>
);

export const ProjectsSection = ({ t }) => {
    const [showAll, setShowAll] = useState(false);
    const featured = portfolioData.projects.filter(p => p.featured);
    const rest = portfolioData.projects.filter(p => !p.featured);

    return (
        <Section id="projects" title={t.projects.title} subtitle={t.projects.subtitle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((project, index) => (
                    <ProjectCardWrapper key={project.title} project={project} index={index} featured />
                ))}
            </div>
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
