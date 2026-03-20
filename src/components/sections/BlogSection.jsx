import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { TiltCard } from '../ui/TiltCard';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { ExternalLinkIcon } from '../../icons/Icons';

export const BlogSection = () => (
    <Section id="blog" title="Recent Writing" subtitle="Thoughts, tutorials, and insights on AI engineering">
        <div className="grid md:grid-cols-3 gap-8">
            {portfolioData.blogPosts.map((post, index) => (
                <AnimateOnScroll key={index} delay={index * 150}>
                    <TiltCard className="h-full cursor-pointer group rounded-2xl border border-white/[0.06] bg-black/40 p-6 flex flex-col justify-between tilt-card-glow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-medium tracking-widest text-blue-400/80 uppercase px-2 py-1 rounded-full bg-blue-500/10">{post.date}</span>
                                <span className="text-xs text-white/30 font-light flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    {post.readTime}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white/90 mb-3 group-hover:text-blue-400 transition-colors duration-300 leading-snug">{post.title}</h3>
                            <p className="text-sm text-white/40 font-light leading-relaxed mb-6">{post.summary}</p>
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-white/50 bg-white/[0.03] border border-white/[0.05] px-2 py-1 rounded capitalize">{tag}</span>
                                ))}
                            </div>
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                Read Article <ExternalLinkIcon className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </TiltCard>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);
