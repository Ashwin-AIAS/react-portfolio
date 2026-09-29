import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PERSONA_CONFIGS = {
    jarvis: {
        title: 'STARK // J.A.R.V.I.S. OS',
        subtitle: 'Arc Reactor Core • Active',
        generatingText: 'Synthesizing Stark Diagnostics...',
        idleText: 'Arc Reactor Online • Ready',
        accentColor: '#F59E0B',
        secondaryColor: '#38BDF8',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        cornerPrefix: 'STARK-OS'
    },
    optimus: {
        title: 'AUTOBOT // TELETRAN-1',
        subtitle: 'Matrix of Leadership • Active',
        generatingText: 'Analyzing Cybertronian Data...',
        idleText: 'Energon Matrix Online • Ready',
        accentColor: '#3B82F6',
        secondaryColor: '#EF4444',
        glowColor: 'rgba(59, 130, 246, 0.4)',
        cornerPrefix: 'AUTOBOT'
    },
    megatron: {
        title: 'DECEPTICON // WAR MATRIX',
        subtitle: 'Dark Energon Core • Primed',
        generatingText: 'Commanding Technical Dominance...',
        idleText: 'Dark Energon Online • Primed',
        accentColor: '#A855F7',
        secondaryColor: '#EC4899',
        glowColor: 'rgba(168, 85, 247, 0.4)',
        cornerPrefix: 'DECEPTICON'
    },
    ashwin: {
        title: 'NEURAL LABS // ASHWIN',
        subtitle: 'Autonomous AI Synapse • Ready',
        generatingText: 'Neural Inference Streaming...',
        idleText: 'Neural Core Online • Standby',
        accentColor: 'var(--accent, #F59E0B)',
        secondaryColor: '#10B981',
        glowColor: 'var(--accent-glow, rgba(245, 158, 11, 0.3))',
        cornerPrefix: 'NEURAL-AI'
    }
};

const AIAssistantVisual = ({ isGenerating, persona = 'ashwin' }) => {
    const config = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS.ashwin;

    return (
        <div className="w-full h-48 rounded-2xl relative overflow-hidden bg-surface-2/60 border border-rule backdrop-blur-md flex flex-col items-center justify-center p-3 select-none transition-colors duration-500">
            {/* Ambient Background Radial Glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-700"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${config.accentColor} 0%, transparent 70%)`,
                    filter: 'blur(25px)',
                    opacity: isGenerating ? 0.38 : 0.18
                }}
            />

            {/* Subtle Cyber Grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(${config.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor} 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                }}
            />

            {/* Corner Cyber Brackets with Persona Prefix */}
            <span className="absolute top-2 left-2 text-[9px] font-mono text-ink-dim/50 leading-none">
                ┌ [{config.cornerPrefix}]
            </span>
            <span className="absolute top-2 right-2 text-[9px] font-mono text-ink-dim/50 leading-none">
                SYS.V2 ┐
            </span>
            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-ink-dim/50 leading-none">
                └ LIVE
            </span>
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-ink-dim/50 leading-none">
                {isGenerating ? 'BUSY' : 'SYNC'} ┘
            </span>

            {/* Central Holographic Core */}
            <div className="relative w-32 h-32 flex items-center justify-center mt-1">
                {/* Variant 1: JARVIS Arc Reactor */}
                {persona === 'jarvis' && (
                    <>
                        {/* Outer Stark Target Reticle */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: isGenerating ? 8 : 24, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle cx="50" cy="50" r="46" fill="none" stroke={config.accentColor} strokeWidth="1" strokeDasharray="6 8 20 8" opacity="0.6" />
                            <circle cx="50" cy="50" r="43" fill="none" stroke={config.secondaryColor} strokeWidth="0.5" strokeDasharray="2 12" opacity="0.4" />
                            {/* Stark Tri-Ticks */}
                            <line x1="50" y1="2" x2="50" y2="8" stroke={config.accentColor} strokeWidth="1.5" />
                            <line x1="98" y1="50" x2="92" y2="50" stroke={config.accentColor} strokeWidth="1.5" />
                            <line x1="50" y1="98" x2="50" y2="92" stroke={config.accentColor} strokeWidth="1.5" />
                            <line x1="2" y1="50" x2="8" y2="50" stroke={config.accentColor} strokeWidth="1.5" />
                        </motion.svg>

                        {/* Mid Gyro Ring */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: -360 }}
                            transition={{ duration: isGenerating ? 6 : 18, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle cx="50" cy="50" r="35" fill="none" stroke={config.accentColor} strokeWidth="1.5" strokeDasharray="28 14 10 14" opacity="0.75" />
                            <circle cx="50" cy="15" r="2" fill={config.secondaryColor} />
                            <circle cx="85" cy="50" r="2" fill={config.secondaryColor} />
                            <circle cx="50" cy="85" r="2" fill={config.secondaryColor} />
                            <circle cx="15" cy="50" r="2" fill={config.secondaryColor} />
                        </motion.svg>

                        {/* Arc Reactor Triangular Core */}
                        <motion.div
                            className="w-16 h-16 rounded-full border-2 flex items-center justify-center relative"
                            style={{
                                borderColor: config.accentColor,
                                boxShadow: isGenerating
                                    ? `0 0 25px ${config.accentColor}, inset 0 0 15px ${config.secondaryColor}`
                                    : `0 0 12px ${config.glowColor}`
                            }}
                            animate={{
                                scale: isGenerating ? [1, 1.1, 0.95, 1] : [1, 1.04, 1]
                            }}
                            transition={{ duration: isGenerating ? 1.2 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <svg className="w-8 h-8" viewBox="0 0 40 40">
                                <polygon
                                    points="20,6 34,30 6,30"
                                    fill="none"
                                    stroke={config.secondaryColor}
                                    strokeWidth="2"
                                    opacity="0.85"
                                />
                                <polygon
                                    points="20,12 28,26 12,26"
                                    fill={config.accentColor}
                                    opacity={isGenerating ? 0.9 : 0.65}
                                />
                            </svg>
                        </motion.div>
                    </>
                )}

                {/* Variant 2: Optimus Prime Matrix of Leadership */}
                {persona === 'optimus' && (
                    <>
                        {/* Autobot Runic Concentric Ring */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: isGenerating ? 9 : 25, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle cx="50" cy="50" r="46" fill="none" stroke={config.accentColor} strokeWidth="1.2" strokeDasharray="16 8 8 8" opacity="0.6" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke={config.secondaryColor} strokeWidth="1" strokeDasharray="6 14" opacity="0.45" />
                        </motion.svg>

                        {/* Counter Energon Gyro */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: -360 }}
                            transition={{ duration: isGenerating ? 7 : 20, repeat: Infinity, ease: 'linear' }}
                        >
                            <polygon points="50,12 88,50 50,88 12,50" fill="none" stroke={config.accentColor} strokeWidth="1.2" opacity="0.5" />
                        </motion.svg>

                        {/* Matrix Crystal Core */}
                        <motion.div
                            className="w-16 h-16 rounded-full border-2 flex items-center justify-center relative"
                            style={{
                                borderColor: config.accentColor,
                                boxShadow: isGenerating
                                    ? `0 0 25px ${config.accentColor}, inset 0 0 15px ${config.secondaryColor}`
                                    : `0 0 12px ${config.glowColor}`
                            }}
                            animate={{
                                scale: isGenerating ? [1, 1.12, 0.94, 1] : [1, 1.03, 1]
                            }}
                            transition={{ duration: isGenerating ? 1.3 : 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {/* Matrix Handles */}
                            <div className="absolute -left-2 w-2 h-6 border-l-2 rounded-l-md" style={{ borderColor: config.accentColor }} />
                            <div className="absolute -right-2 w-2 h-6 border-r-2 rounded-r-md" style={{ borderColor: config.accentColor }} />
                            {/* Crystal Sphere */}
                            <motion.div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: `radial-gradient(circle, ${config.secondaryColor} 0%, ${config.accentColor} 70%)` }}
                                animate={{ scale: isGenerating ? [1, 1.25, 1] : [0.95, 1.05, 0.95] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                            </motion.div>
                        </motion.div>
                    </>
                )}

                {/* Variant 3: Megatron Dark Energon Core */}
                {persona === 'megatron' && (
                    <>
                        {/* Angular Decepticon Diamond Reticle */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: isGenerating ? 6 : 20, repeat: Infinity, ease: 'linear' }}
                        >
                            <polygon points="50,4 96,50 50,96 4,50" fill="none" stroke={config.accentColor} strokeWidth="1.2" strokeDasharray="14 8 4 8" opacity="0.7" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke={config.secondaryColor} strokeWidth="0.8" strokeDasharray="4 16" opacity="0.4" />
                        </motion.svg>

                        {/* Counter-Spin Hexagon */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: -360 }}
                            transition={{ duration: isGenerating ? 5 : 16, repeat: Infinity, ease: 'linear' }}
                        >
                            <polygon points="50,14 81,32 81,68 50,86 19,68 19,32" fill="none" stroke={config.accentColor} strokeWidth="1.5" opacity="0.6" />
                        </motion.svg>

                        {/* Dark Energon Plasma Iris */}
                        <motion.div
                            className="w-16 h-16 rounded-full border-2 flex items-center justify-center relative"
                            style={{
                                borderColor: config.accentColor,
                                boxShadow: isGenerating
                                    ? `0 0 28px ${config.accentColor}, inset 0 0 16px ${config.secondaryColor}`
                                    : `0 0 12px ${config.glowColor}`
                            }}
                            animate={{
                                scale: isGenerating ? [1, 1.15, 0.95, 1] : [1, 1.04, 1]
                            }}
                            transition={{ duration: isGenerating ? 1.1 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {/* Sharp chevron marks */}
                            <motion.div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: `radial-gradient(circle, ${config.secondaryColor} 0%, ${config.accentColor} 80%)` }}
                                animate={{ scale: isGenerating ? [1, 1.35, 1] : [0.9, 1.1, 0.9] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="w-2.5 h-2.5 bg-white transform rotate-45" />
                            </motion.div>
                        </motion.div>
                    </>
                )}

                {/* Variant 4: Ashwin Quantum Neural AI Brain */}
                {persona === 'ashwin' && (
                    <>
                        {/* Outer Multi-modal Radar Ring */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: isGenerating ? 8 : 22, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle cx="50" cy="50" r="44" fill="none" stroke={config.accentColor} strokeWidth="1" strokeDasharray="4 6 12 6" opacity="0.6" />
                            <circle cx="50" cy="50" r="47" fill="none" stroke={config.secondaryColor} strokeWidth="0.5" strokeDasharray="1 14" opacity="0.3" />
                        </motion.svg>

                        {/* Counter-Rotating Gyro Ring */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: -360 }}
                            transition={{ duration: isGenerating ? 6 : 18, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle cx="50" cy="50" r="36" fill="none" stroke={config.accentColor} strokeWidth="1.2" strokeDasharray="20 16 8 16" opacity="0.7" />
                            <circle cx="50" cy="14" r="1.5" fill={config.accentColor} />
                            <circle cx="86" cy="50" r="1.5" fill={config.accentColor} />
                            <circle cx="50" cy="86" r="1.5" fill={config.accentColor} />
                            <circle cx="14" cy="50" r="1.5" fill={config.accentColor} />
                        </motion.svg>

                        {/* Neural Synapse Core */}
                        <motion.div
                            className="w-16 h-16 rounded-full border border-accent/40 flex items-center justify-center relative"
                            style={{
                                boxShadow: isGenerating
                                    ? `0 0 25px ${config.accentColor}, inset 0 0 15px ${config.accentColor}`
                                    : '0 0 12px var(--accent-wash, rgba(245, 158, 11, 0.2))'
                            }}
                            animate={{
                                scale: isGenerating ? [1, 1.08, 0.96, 1] : [1, 1.03, 1]
                            }}
                            transition={{ duration: isGenerating ? 1.4 : 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <motion.div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: `radial-gradient(circle, ${config.accentColor} 0%, transparent 80%)` }}
                                animate={{ scale: isGenerating ? [1, 1.3, 1] : [0.9, 1.1, 0.9] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="w-3 h-3 rounded-full bg-surface-0 border border-white/70 shadow-sm" />
                            </motion.div>
                        </motion.div>
                    </>
                )}

                {/* Dynamic Scanline Sweep across all personas */}
                {isGenerating && (
                    <motion.div
                        className="absolute inset-x-0 h-[2px] pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${config.accentColor}, transparent)`,
                            boxShadow: `0 0 8px ${config.accentColor}`
                        }}
                        animate={{ y: [-42, 42, -42] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
            </div>

            {/* Bottom Real-time Audio / Frequency Waveform */}
            <div className="flex items-center gap-1 mt-1 z-10">
                {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.3, 0.7, 1, 0.5, 0.8].map((h, i) => (
                    <motion.div
                        key={i}
                        className="w-1 rounded-full"
                        style={{ background: config.accentColor }}
                        animate={isGenerating ? {
                            height: [`${h * 8}px`, `${h * 20}px`, `${h * 10}px`],
                            opacity: [0.5, 1, 0.6]
                        } : {
                            height: [`${h * 4}px`, `${h * 7}px`, `${h * 4}px`],
                            opacity: [0.2, 0.45, 0.2]
                        }}
                        transition={{
                            duration: isGenerating ? 0.5 + (i % 4) * 0.1 : 1.8 + (i % 3) * 0.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.05
                        }}
                    />
                ))}
            </div>

            {/* Persona Telemetry Status Line */}
            <div className="flex items-center gap-2 mt-2 z-10">
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                        background: isGenerating ? config.accentColor : config.secondaryColor,
                        boxShadow: `0 0 6px ${isGenerating ? config.accentColor : config.secondaryColor}`
                    }}
                />
                <span className="font-mono text-[10px] tracking-wider font-semibold text-ink-muted uppercase">
                    {isGenerating ? config.generatingText : config.idleText}
                </span>
            </div>
        </div>
    );
};

export default AIAssistantVisual;
