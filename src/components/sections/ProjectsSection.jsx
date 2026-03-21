import React, { lazy, Suspense, useRef } from 'react';
import { useInView } from 'framer-motion';
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
    PortfolioAI: lazy(() => import('../visuals/PortfolioAIVisual'))
};

const ProjectCardWrapper = ({ project, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
    const Visual = VisualComponents[project.visualComponent];

    return (
        <AnimateOnScroll delay={index * 150} className="h-full">
            <Card className="h-full flex flex-col group border border-white/[0.06] bg-black/40 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] glow-card">
                <div ref={ref} className="h-48 relative overflow-hidden bg-gradient-to-b from-white/[0.05] to-transparent border-b border-white/[0.05]">
                    {isInView ? (
                        <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="flex items-center text-white/30 text-xs tracking-widest"><svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> LOADING VISUAL</span>
                            </div>
                        }>
                            {Visual ? <Visual /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Visual Not Found</div>}
                        </Suspense>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/10 text-xs tracking-widest">SCROLL TO LOAD</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 mix-blend-multiply"></div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-medium tracking-widest text-blue-400/80 uppercase px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">{project.category}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white/90 mb-3 group-hover:text-blue-400 transition-colors duration-300">{project.title}</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed mb-6 whitespace-pre-line flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map(tech => (
                            <span key={tech} className="text-[10px] text-white/50 bg-white/[0.03] border border-white/[0.05] px-2 py-1 rounded capitalize">{tech}</span>
                        ))}
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white transition-colors">
                            <GitHubIcon className="w-4 h-4 mr-2" /> Code
                        </a>
                        {project.liveUrl !== '#' && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Live Demo <ExternalLinkIcon className="w-3.5 h-3.5 ml-2" />
                            </a>
                        )}
                    </div>
                </div>
            </Card>
        </AnimateOnScroll>
    );
};

export const ProjectsSection = ({ t }) => {
    return (
        <Section id="projects" title={t.projects.title} subtitle={t.projects.subtitle}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioData.projects.map((project, index) => (
                    <ProjectCardWrapper key={index} project={project} index={index} />
                ))}
            </div>
        </Section>
    );
};
