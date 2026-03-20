import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { DownloadIcon } from '../../icons/Icons';

export const CareerRoadmapSection = () => (
    <Section id="roadmap" title="Career Roadmap" subtitle="Education & professional experience">
        <div className="relative border-l border-white/[0.06] pl-10 space-y-16 ml-2">
            {portfolioData.careerRoadmap.map((item, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                    <div className="relative">
                        <div className="absolute -left-[2.85rem] w-4 h-4 rounded-full border-2 border-blue-500/50 bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        </div>
                        <div className="glass-card p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-medium text-blue-400/80 tracking-wider uppercase">{item.period}</span>
                                <span className="px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">{item.type}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white/90 mb-1">{item.title}</h3>
                            <p className="text-sm text-white/40 font-light mb-3">{item.institution}</p>
                            <p className="text-sm text-white/30 font-light leading-relaxed whitespace-pre-line">{item.details}</p>
                            {item.paperUrl && (
                                <a href={item.paperUrl} target="_blank" rel="noopener noreferrer" className="btn-premium btn-secondary mt-4 text-sm px-5 py-2">
                                    <DownloadIcon className="w-3.5 h-3.5 mr-2" /> Download Paper
                                </a>
                            )}
                        </div>
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);
