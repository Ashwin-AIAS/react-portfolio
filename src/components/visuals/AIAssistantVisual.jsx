import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantVisual = ({ isGenerating }) => {
    return (
        <div className="w-full h-44 rounded-2xl relative overflow-hidden bg-surface-2/60 border border-rule backdrop-blur-md flex flex-col items-center justify-center p-3 select-none">
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-700"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    opacity: isGenerating ? 0.35 : 0.18
                }}
            />

            {/* Subtle Cyber Grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                    backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                }}
            />

            {/* Corner Cyber Brackets */}
            <span className="absolute top-2 left-2 text-[10px] font-mono text-ink-dim/40 leading-none">┌</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-ink-dim/40 leading-none">┐</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-ink-dim/40 leading-none">└</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-ink-dim/40 leading-none">┘</span>

            {/* Central Holographic Neural Core */}
            <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outer Radar Sweep Ring */}
                <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: isGenerating ? 8 : 22,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="1"
                        strokeDasharray="4 6 12 6"
                        opacity={isGenerating ? 0.7 : 0.35}
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="0.5"
                        strokeDasharray="1 14"
                        opacity="0.25"
                    />
                </motion.svg>

                {/* Counter-Rotating Gyro Ring */}
                <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: isGenerating ? 6 : 18,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="36"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="1.2"
                        strokeDasharray="20 16 8 16"
                        opacity={isGenerating ? 0.8 : 0.4}
                    />
                    {/* Cardinal Navigation Pips */}
                    <circle cx="50" cy="14" r="1.5" fill="var(--accent)" opacity="0.8" />
                    <circle cx="86" cy="50" r="1.5" fill="var(--accent)" opacity="0.8" />
                    <circle cx="50" cy="86" r="1.5" fill="var(--accent)" opacity="0.8" />
                    <circle cx="14" cy="50" r="1.5" fill="var(--accent)" opacity="0.8" />
                </motion.svg>

                {/* Energy Iris Ring with Pulsing Glow */}
                <motion.div
                    className="w-16 h-16 rounded-full border border-accent/40 flex items-center justify-center relative"
                    animate={isGenerating ? {
                        scale: [1, 1.08, 0.96, 1],
                        borderColor: ['rgba(var(--accent-rgb, 245, 158, 11), 0.4)', 'rgba(var(--accent-rgb, 245, 158, 11), 0.9)', 'rgba(var(--accent-rgb, 245, 158, 11), 0.4)']
                    } : {
                        scale: [1, 1.03, 1]
                    }}
                    transition={{
                        duration: isGenerating ? 1.4 : 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    style={{
                        boxShadow: isGenerating
                            ? '0 0 25px var(--accent), inset 0 0 15px var(--accent)'
                            : '0 0 12px var(--accent-wash, rgba(245, 158, 11, 0.2))'
                    }}
                >
                    {/* Inner Quantum Core Sphere */}
                    <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                            background: 'radial-gradient(circle, var(--accent) 0%, transparent 80%)'
                        }}
                        animate={isGenerating ? {
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 1, 0.8]
                        } : {
                            scale: [0.9, 1.1, 0.9],
                            opacity: [0.5, 0.75, 0.5]
                        }}
                        transition={{
                            duration: isGenerating ? 0.8 : 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <div className="w-3 h-3 rounded-full bg-surface-0 border border-white/60 shadow-sm" />
                    </motion.div>

                    {/* Orbiting Satellite Particle */}
                    <motion.div
                        className="absolute w-2 h-2 rounded-full"
                        style={{ background: 'var(--accent)' }}
                        animate={{
                            rotate: 360,
                            x: [0, 24, 0, -24, 0],
                            y: [-24, 0, 24, 0, -24]
                        }}
                        transition={{
                            duration: isGenerating ? 1.6 : 4,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </motion.div>

                {/* Scanline Sweep */}
                {isGenerating && (
                    <motion.div
                        className="absolute inset-x-0 h-[2px] pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                            boxShadow: '0 0 8px var(--accent)'
                        }}
                        animate={{ y: [-38, 38, -38] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
            </div>

            {/* Bottom Real-time Audio / Frequency Waveform */}
            <div className="flex items-center gap-1 mt-1 z-10">
                {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.3, 0.7, 1, 0.5, 0.8].map((h, i) => (
                    <motion.div
                        key={i}
                        className="w-1 rounded-full"
                        style={{ background: 'var(--accent)' }}
                        animate={isGenerating ? {
                            height: [`${h * 8}px`, `${h * 20}px`, `${h * 10}px`],
                            opacity: [0.5, 1, 0.6]
                        } : {
                            height: [`${h * 5}px`, `${h * 8}px`, `${h * 5}px`],
                            opacity: [0.25, 0.5, 0.25]
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

            {/* Telemetry Status Line */}
            <div className="flex items-center gap-2 mt-2 z-10">
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                        background: isGenerating ? 'var(--accent)' : 'var(--ok, #10B981)',
                        boxShadow: isGenerating ? '0 0 6px var(--accent)' : '0 0 6px var(--ok, #10B981)'
                    }}
                />
                <span className="font-mono text-[10px] tracking-wider font-semibold text-ink-muted uppercase">
                    {isGenerating ? 'Neural Synthesis Active' : 'Neural Core Online • Standby'}
                </span>
            </div>
        </div>
    );
};

export default AIAssistantVisual;
