import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LidarSweep } from '../ui/LidarSweep';

export const Hero = ({ t }) => {

    const roles = [
        t.hero.badge.toUpperCase(),
        "COMPUTER VISION & PERCEPTION ENGINEER",
        "AUTONOMOUS DRIVING & SENSOR FUSION",
        "MULTIMODAL & GRAPH RAG ARCHITECT",
        "EDGE PYTORCH & C++ HPC INFERENCE",
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

    return (
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

                        <p className="text-base md:text-lg text-ink-muted font-light leading-relaxed max-w-xl mb-7">
                            {t.hero.bio}
                        </p>

                        {/* Minimalist Live Availability Pill */}
                        <div className="flex items-center gap-2 mb-8 text-xs font-mono text-ink-muted">
                            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                            <span>Available for <strong>Computer Vision & Autonomous Systems</strong> roles &middot; Ingolstadt, Germany / Remote</span>
                        </div>

                        {/* Streamlined Action Deck */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <a href="#projects" className="btn btn-primary group shadow-md hover:shadow-accent/20 cursor-pointer">
                                <span>{t.hero.viewProjects}</span>
                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>

                            <a href="#contact" className="btn btn-secondary cursor-pointer">
                                {t.hero.getInTouch || 'Get in Touch'}
                            </a>
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
    );
};


