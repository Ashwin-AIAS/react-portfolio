import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { LidarSweep } from '../ui/LidarSweep';
import { DownloadIcon, GitHubIcon, LinkedInIcon } from '../../icons/Icons';

export const Hero = ({ t }) => {
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const resumePreviewUrl = portfolioData.personalInfo.resumeUrl.replace('/view', '/preview');

    const roles = [
        t.hero.badge.toUpperCase(),
        "COMPUTER VISION ENGINEER",
        "LLM & RAG SYSTEMS BUILDER",
        "MASTER'S STUDENT @ THI GERMANY",
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

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setIsResumeOpen(false); };
        if (isResumeOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isResumeOpen]);

    return (
        <>
        <section id="hero" data-narrate="hero" className="relative min-h-screen flex items-center px-6 py-28 overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
            {/* Single background layer. The LiDAR sweep is the only one with
                actual shape — the three blue blurs it used to compete with
                (MouseGlow, GradientMesh, an 800px radial) are gone. */}
            <div className="absolute inset-0 overflow-hidden">
                <LidarSweep />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Text column — flush left, wider than the portrait */}
                    <div className="order-1 md:col-span-7">
                        {/* Mono role ticker replaces the blue badge pill */}
                        <p className="label mb-6 h-5">
                            <span className="label-accent">{displayText}</span>
                            <motion.span
                                aria-hidden="true"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.53, repeat: Infinity }}
                                className="label-accent"
                            >_</motion.span>
                        </p>

                        {/* Rendered statically — no opacity:0 mount, so this is a
                            real LCP candidate instead of an invisible one. */}
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-ink leading-[0.92] mb-7">
                            {t.hero.greeting} Ashwin
                        </h1>

                        <p className="text-base md:text-lg text-ink-muted font-light leading-relaxed max-w-xl mb-9">
                            {t.hero.bio}
                        </p>

                        {/* Instrument readout — also the only place the site
                            states availability and location outright. */}
                        <dl className="max-w-md mb-10 border-t border-rule">
                            <div className="readout-row">
                                <dt>Status</dt>
                                <dd className="flex items-center gap-2">
                                    <span className="status-dot" />
                                    Available &middot; {portfolioData.personalInfo.location}
                                </dd>
                            </div>
                            <div className="readout-row">
                                <dt>Focus</dt>
                                <dd>Perception &middot; LLM Systems</dd>
                            </div>
                            <div className="readout-row">
                                <dt>Degree</dt>
                                <dd>MSc AI Engineering &middot; THI</dd>
                            </div>
                        </dl>

                        <div className="flex flex-wrap gap-4 items-center">
                            <a href="#projects" className="btn btn-primary">
                                {t.hero.viewProjects}
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                            <button onClick={() => setIsResumeOpen(true)} className="btn btn-secondary">
                                <DownloadIcon className="w-4 h-4" /> {t.hero.downloadCv}
                            </button>
                            <div className="flex items-center gap-2">
                                <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors">
                                    <GitHubIcon className="w-4 h-4" />
                                </a>
                                <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors">
                                    <LinkedInIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Portrait — sharp panel with a mono caption strip,
                        replacing the circle + pulsing blue halo. */}
                    <div className="order-2 md:col-span-5 flex md:justify-end">
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
                    </div>
                </div>
            </div>
        </section>

        <AnimatePresence>
            {isResumeOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                    style={{ background: 'rgba(0,0,0,0.72)' }}
                    onClick={() => setIsResumeOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="panel relative w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsResumeOpen(false)}
                            aria-label="Close resume preview"
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded border border-rule bg-surface-2 flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors text-sm"
                        >✕</button>
                        <iframe
                            src={resumePreviewUrl}
                            title="Resume Preview"
                            className="w-full flex-grow border-0"
                            allow="autoplay"
                        />
                        <div className="p-4 border-t border-rule flex justify-center">
                            <a href={portfolioData.personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-6 py-2.5">
                                <DownloadIcon className="w-4 h-4" /> {t.hero.downloadCv}
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

