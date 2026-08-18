import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../App';

export const THEMES = [
    {
        id: 'cyan',
        name: 'Cyber-Optic',
        label: 'LiDAR / Vision',
        color: '#00f2fe',
        dotClass: 'bg-[#00f2fe]'
    },
    {
        id: 'amber',
        name: 'Signal Telemetry',
        label: 'Instrument',
        color: '#ff9f1c',
        dotClass: 'bg-[#ff9f1c]'
    },
    {
        id: 'indigo',
        name: 'Neural Titanium',
        label: 'Frontier AI',
        color: '#6366f1',
        dotClass: 'bg-[#6366f1]'
    },
    {
        id: 'emerald',
        name: 'CUDA Matrix',
        label: 'HPC & Edge',
        color: '#00ff87',
        dotClass: 'bg-[#00ff87]'
    },
    {
        id: 'crimson',
        name: 'Aerospace HUD',
        label: 'Telemetry',
        color: '#ff3366',
        dotClass: 'bg-[#ff3366]'
    }
];

export const ThemePaletteSelector = ({ compact = false }) => {
    const { palette, setPalette, isDark } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const activeTheme = THEMES.find(t => t.id === palette) || THEMES[0];

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change color theme"
                aria-expanded={isOpen}
                className={`flex items-center gap-2 ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded border border-rule hover:border-accent transition-colors`}
                style={{ background: 'var(--surface-1)' }}
            >
                <span
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-transparent transition-transform duration-200"
                    style={{
                        backgroundColor: activeTheme.color,
                        boxShadow: `0 0 8px ${activeTheme.color}80`
                    }}
                />
                <span className="font-mono text-xs text-ink uppercase tracking-wider hidden sm:inline">
                    {activeTheme.id}
                </span>
                <svg
                    className={`w-3 h-3 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-md border border-rule-strong shadow-2xl z-50 backdrop-blur-md"
                        style={{ background: 'var(--surface-2)' }}
                    >
                        <div className="px-2.5 py-1.5 border-b border-rule mb-1 flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-label text-ink-dim">
                                Color Palette
                            </span>
                            <span className="font-mono text-[10px] text-accent">
                                5 Themes
                            </span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {THEMES.map((theme) => {
                                const isSelected = theme.id === palette;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setPalette(theme.id);
                                            setIsOpen(false);
                                        }}
                                        className={`flex items-center justify-between px-2.5 py-2 rounded transition-all text-left group ${
                                            isSelected
                                                ? 'bg-accent-wash text-ink font-semibold'
                                                : 'hover:bg-surface-3 text-ink-muted hover:text-ink'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
                                                style={{
                                                    backgroundColor: theme.color,
                                                    boxShadow: isSelected ? `0 0 10px ${theme.color}` : 'none'
                                                }}
                                            />
                                            <div>
                                                <div className="text-xs font-display leading-none">
                                                    {theme.name}
                                                </div>
                                                <div className="text-[10px] font-mono text-ink-dim mt-0.5">
                                                    {theme.label}
                                                </div>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <motion.span
                                                layoutId="theme-check"
                                                className="w-1.5 h-1.5 rounded-full bg-accent"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
