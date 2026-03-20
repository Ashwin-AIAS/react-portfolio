import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantVisual = ({ isGenerating }) => (
    <div className="w-full h-28 bg-black/30 rounded-xl relative overflow-hidden">
        <AnimatePresence mode="wait">
            {!isGenerating ? (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full p-4 flex flex-col justify-center space-y-2.5"
                >
                    <div className="w-3/4 h-1.5 bg-white/[0.04] rounded-full"></div>
                    <div className="w-full h-1.5 bg-white/[0.04] rounded-full"></div>
                    <div className="w-1/2 h-1.5 bg-white/[0.04] rounded-full"></div>
                </motion.div>
            ) : (
                <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 relative"
                >
                    {/* Outer glow pulse */}
                    <motion.div
                        className="absolute inset-0 bg-cyan-500/5 rounded-xl"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Robot head container */}
                    <div className="relative">
                        {/* Antenna */}
                        <motion.div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-cyan-400 rounded-full"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Robot head outline */}
                        <div
                            className="relative w-14 h-10 border-2 border-cyan-400/60 rounded-lg overflow-hidden"
                            style={{ boxShadow: '0 0 12px rgba(6,182,212,0.4), 0 0 24px rgba(6,182,212,0.15)' }}
                        >
                            {/* Eyes */}
                            <div className="flex justify-center gap-3 mt-2">
                                <motion.div
                                    className="w-2 h-2 bg-cyan-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <motion.div
                                    className="w-2 h-2 bg-cyan-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                />
                            </div>

                            {/* Mouth bar */}
                            <div className="flex justify-center mt-1.5">
                                <motion.div
                                    className="h-1 bg-cyan-400/80 rounded-full"
                                    animate={{ width: ['30%', '70%', '30%'] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>

                            {/* Scan line */}
                            <motion.div
                                className="absolute left-0 w-full h-[2px] bg-cyan-400/40"
                                animate={{ y: [0, 40, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                    </div>

                    {/* Status text */}
                    <motion.span
                        className="font-mono text-xs text-cyan-400/70 tracking-widest"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        ANALYZING PROFILE...
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default AIAssistantVisual;
