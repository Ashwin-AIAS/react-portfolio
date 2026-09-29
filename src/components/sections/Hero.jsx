import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { LidarSweep } from '../ui/LidarSweep';
import { useVoiceGuide } from '../../voice-guide/useVoiceGuide';

export const Hero = ({ t }) => {
    const voice = useVoiceGuide();

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

                        {/* Autonomous Cockpit Telemetry HUD — Real-time engineering benchmarks */}
                        <div className="max-w-xl mb-7 p-4 rounded-2xl bg-surface-1/90 border border-rule/90 shadow-lg backdrop-blur-md relative overflow-hidden">
                            {/* Ambient accent glow */}
                            <div className="absolute top-0 right-0 w-36 h-20 bg-accent/10 blur-xl pointer-events-none" />

                            {/* HUD Header Bar */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule text-[11px] font-mono">
                                <div className="flex items-center gap-2 text-ink-dim">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="tracking-wider uppercase font-semibold text-accent">Perception Telemetry</span>
                                    <span className="text-rule-strong">/</span>
                                    <span className="hidden sm:inline text-ink-muted">Edge Perception Pipeline</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-2 border border-rule text-[10px] text-ok font-mono font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
                                    <span>SUB-16MS LIVE</span>
                                </div>
                            </div>

                            {/* Telemetry Metrics 4-Card Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {/* Metric 1: Real-time Latency */}
                                <div className="p-2.5 rounded-xl bg-surface-2/70 border border-rule/70 hover:border-accent/40 transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">Latency</span>
                                        <span className="text-[9px] font-mono text-ok font-semibold">● 60+ FPS</span>
                                    </div>
                                    <div className="font-mono text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-none mb-1">
                                        &lt;16 ms
                                    </div>
                                    <span className="text-[10px] text-ink-muted block leading-tight">
                                        YOLO26 Real-Time
                                    </span>
                                </div>

                                {/* Metric 2: Multi-Modal Sensor Fusion */}
                                <div className="p-2.5 rounded-xl bg-surface-2/70 border border-rule/70 hover:border-accent/40 transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">Sensors</span>
                                        <span className="text-[9px] font-mono text-accent font-semibold">● Fusion</span>
                                    </div>
                                    <div className="font-mono text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-none mb-1">
                                        3 Modes
                                    </div>
                                    <span className="text-[10px] text-ink-muted block leading-tight">
                                        Radar • LiDAR • Vision
                                    </span>
                                </div>

                                {/* Metric 3: Edge Quantization & HPC */}
                                <div className="p-2.5 rounded-xl bg-surface-2/70 border border-rule/70 hover:border-accent/40 transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">Runtime</span>
                                        <span className="text-[9px] font-mono text-purple-400 font-semibold">● C++ Int8</span>
                                    </div>
                                    <div className="font-mono text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-none mb-1">
                                        Edge HPC
                                    </div>
                                    <span className="text-[10px] text-ink-muted block leading-tight">
                                        Quantized Engine
                                    </span>
                                </div>

                                {/* Metric 4: Vision-Augmented RAG */}
                                <div className="p-2.5 rounded-xl bg-surface-2/70 border border-rule/70 hover:border-accent/40 transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">Agentic AI</span>
                                        <span className="text-[9px] font-mono text-cyan-400 font-semibold">● Hybrid</span>
                                    </div>
                                    <div className="font-mono text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-none mb-1">
                                        Vision-RAG
                                    </div>
                                    <span className="text-[10px] text-ink-muted block leading-tight">
                                        Multimodal Vectors
                                    </span>
                                </div>
                            </div>

                            {/* Telemetry Bus & Real-time Scanline Waveform */}
                            <div className="mt-3 pt-2.5 border-t border-rule/60 flex items-center justify-between text-[10px] font-mono text-ink-dim">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-ink-muted">Telemetry Bus:</span>
                                    <span className="text-ink font-medium">PyTorch &bull; ROS &bull; TensorRT &bull; FastAPI</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1">
                                    {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.3, 0.7, 0.5].map((h, i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ height: [`${h * 6}px`, `${h * 13}px`, `${h * 6}px`] }}
                                            transition={{ duration: 1.2 + (i % 3) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                                            className="w-1 bg-accent/60 rounded-full inline-block"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Action Deck — Direct navigation to interactive features */}
                        <div className="flex flex-wrap gap-3.5 items-center">
                            <a href="#projects" className="btn btn-primary group shadow-md hover:shadow-accent/20 cursor-pointer">
                                <span>{t.hero.viewProjects}</span>
                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    if (voice.enabled) {
                                        voice.toggle();
                                    } else {
                                        voice.enable();
                                    }
                                }}
                                className={`btn btn-secondary cursor-pointer flex items-center gap-2 transition-all ${
                                    voice.enabled ? 'border-accent text-accent' : ''
                                }`}
                                title="Start interactive voice tour"
                            >
                                <span className="text-sm">{voice.enabled ? '🔊' : '🎙️'}</span>
                                <span>{voice.enabled ? (voice.isSpeaking ? 'Mute Voice Tour' : t.hero.audioTourActive || 'Audio Tour Active') : (t.hero.startAudioTour || 'Start Audio Tour')}</span>
                            </button>

                            <a
                                href="#assistant"
                                className="inline-flex items-center gap-2 text-xs font-mono font-medium py-2.5 px-3.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-accent border border-rule hover:border-accent/40 transition-all cursor-pointer shadow-sm"
                            >
                                <span>🤖</span>
                                <span>{t.hero.askAssistant || 'Ask AI Assistant'}</span>
                            </a>
                        </div>

                        {/* Live Candidate Status Pill */}
                        <div className="flex items-center gap-2 mt-4 text-[11px] font-mono text-ink-muted">
                            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                            <span>Available for <strong>Computer Vision & Autonomous Systems</strong> roles &middot; Ingolstadt, Germany / Remote</span>
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


