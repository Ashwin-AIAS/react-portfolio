import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { MouseGlow } from '../ui/MouseGlow';
import { GradientMesh } from '../ui/GradientMesh';
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
        <section id="hero" className="relative min-h-screen flex items-center justify-center bg-black px-6 py-20 overflow-hidden">
            <MouseGlow />
            <GradientMesh />
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-400/60 rounded-full" style={{ animation: 'orbit-1 15s linear infinite' }}></div>
                    <div className="w-1.5 h-1.5 bg-violet-400/40 rounded-full" style={{ animation: 'orbit-2 20s linear infinite' }}></div>
                    <div className="w-1 h-1 bg-cyan-400/50 rounded-full" style={{ animation: 'orbit-3 12s linear infinite' }}></div>
                </div>
            </div>
            
            <div className="container mx-auto max-w-4xl relative z-10 text-center md:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.0, duration: 0.6, ease: "easeOut" }}
                    className="mb-6 flex justify-center md:justify-start"
                >
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                        <motion.div
                            className="w-2 h-2 rounded-full bg-green-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium text-green-400 tracking-wide">Open to Opportunities</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                >
                    <p className="text-sm font-medium text-white/40 tracking-widest uppercase mb-4 h-5 block">
                        <span className="text-blue-400">{displayText}</span>
                        <motion.span 
                            animate={{ opacity: [1, 0] }} 
                            transition={{ duration: 0.53, repeat: Infinity }}
                        >|</motion.span>
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
                        {t.hero.greeting} <span className="text-gradient">Ashwin</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.30, duration: 0.6, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl text-white/40 font-light leading-relaxed max-w-2xl mx-auto md:mx-0 mb-12">
                        {t.hero.bio}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center"
                >
                    <button onClick={() => setIsResumeOpen(true)} className="btn-premium btn-secondary">
                        <DownloadIcon className="w-5 h-5 mr-3" /> {t.hero.downloadCv}
                    </button>
                    <div className="flex items-center gap-5">
                        <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] hover:border-white/20 transition-all">
                            <GitHubIcon className="w-5 h-5" />
                        </a>
                        <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] hover:border-white/20 transition-all">
                            <LinkedInIcon className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>

        <AnimatePresence>
            {isResumeOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={() => setIsResumeOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-4xl h-[85vh] bg-black/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsResumeOpen(false)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-sm"
                        >✕</button>
                        <iframe
                            src={resumePreviewUrl}
                            title="Resume Preview"
                            className="w-full flex-grow border-0"
                            allow="autoplay"
                        />
                        <div className="p-4 border-t border-white/[0.06] flex justify-center">
                            <a href={portfolioData.personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-premium btn-primary text-sm px-6 py-2.5">
                                <DownloadIcon className="w-4 h-4 mr-2" /> {t.hero.downloadCv}
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

