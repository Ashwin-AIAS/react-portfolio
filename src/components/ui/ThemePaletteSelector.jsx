import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../ThemeContext';

export const THEMES = [
    // ── TRI-NEON COLLECTION (Dark Base + Primary Neon + Secondary Neon) ──
    {
        id: 'viper',
        name: 'Cyber-Viper',
        label: 'Neon Green × Hot Pink',
        bg: '#050709',
        color: '#00ff87',
        color2: '#ff007f',
        group: 'tri-neon'
    },
    {
        id: 'synthwave',
        name: 'Synthwave Sunset',
        label: 'Laser Pink × Electric Cyan',
        bg: '#080412',
        color: '#ff2a85',
        color2: '#00f2fe',
        group: 'tri-neon'
    },
    {
        id: 'eva01',
        name: 'EVA-01 Mecha',
        label: 'Acid Green × Neon Purple',
        bg: '#090514',
        color: '#39ff14',
        color2: '#b026ff',
        group: 'tri-neon'
    },
    {
        id: 'nightcity',
        name: 'Night City 2077',
        label: 'Cyber Yellow × Neon Cyan',
        bg: '#07060e',
        color: '#fcee0a',
        color2: '#00f0ff',
        group: 'tri-neon'
    },
    {
        id: 'toxicberry',
        name: 'Toxic Berry',
        label: 'Acid Lime × Neon Fuchsia',
        bg: '#050507',
        color: '#c6ff00',
        color2: '#d946ef',
        group: 'tri-neon'
    },
    {
        id: 'plasma',
        name: 'Plasma Fusion',
        label: 'Electric Cyan × Crimson',
        bg: '#040711',
        color: '#00f2fe',
        color2: '#ff3366',
        group: 'tri-neon'
    },
    {
        id: 'akira',
        name: 'Akira Telemetry',
        label: 'Laser Red × Neon Teal',
        bg: '#070709',
        color: '#ff1e42',
        color2: '#00ffcc',
        group: 'tri-neon'
    },
    {
        id: 'aurora',
        name: 'Neural Aurora',
        label: 'Neon Mint × Ultraviolet',
        bg: '#03090c',
        color: '#00ffa3',
        color2: '#a855f7',
        group: 'tri-neon'
    },

    // ── INSTRUMENT & SCI-FI (Upgraded to 3-Color) ────────────────────────
    {
        id: 'cyan',
        name: 'Cyber-Optic',
        label: 'Cyan × Electric Violet',
        bg: '#05080f',
        color: '#00f2fe',
        color2: '#a855f7',
        group: 'instrument'
    },
    {
        id: 'amber',
        name: 'Signal Telemetry',
        label: 'Amber × Radar Cyan',
        bg: '#06080b',
        color: '#ff9f1c',
        color2: '#00f2fe',
        group: 'instrument'
    },
    {
        id: 'indigo',
        name: 'Neural Titanium',
        label: 'Indigo × Neon Aqua',
        bg: '#08090f',
        color: '#6366f1',
        color2: '#22d3ee',
        group: 'instrument'
    },
    {
        id: 'emerald',
        name: 'CUDA Matrix',
        label: 'Emerald × Laser Sky',
        bg: '#040806',
        color: '#00ff87',
        color2: '#38bdf8',
        group: 'instrument'
    },
    {
        id: 'crimson',
        name: 'Aerospace HUD',
        label: 'Crimson × Afterburner',
        bg: '#0b0708',
        color: '#ff3366',
        color2: '#ffb703',
        group: 'instrument'
    },
    {
        id: 'ironman',
        name: 'Stark Arc-Reactor',
        label: 'Hot-Rod Red × Arc Gold',
        bg: '#080406',
        color: '#e63946',
        color2: '#ffb703',
        group: 'instrument'
    },
    {
        id: 'vibranium',
        name: 'Wakanda Vibranium',
        label: 'Purple × Kinetic Blue',
        bg: '#06040a',
        color: '#a855f7',
        color2: '#38bdf8',
        group: 'instrument'
    },
    {
        id: 'batman',
        name: 'Gotham Tactical',
        label: 'Wayne Gold × Sonar Blue',
        bg: '#060708',
        color: '#eab308',
        color2: '#38bdf8',
        group: 'instrument'
    },
    {
        id: 'cyberpunk',
        name: 'Neo Cyberpunk',
        label: 'Magenta × Cyber Yellow',
        bg: '#07030e',
        color: '#ff007f',
        color2: '#fcee0a',
        group: 'instrument'
    },

    // ── NOIR COLLECTION (True Black + Dual Accent) ───────────────────────
    {
        id: 'obsidian',
        name: 'Obsidian Mono',
        label: 'Pure White × Ice Blue',
        bg: '#000000',
        color: '#ffffff',
        color2: '#38bdf8',
        group: 'noir'
    },
    {
        id: 'titanium',
        name: 'Carbon Titanium',
        label: 'Brushed Steel × Orange',
        bg: '#0a0a0b',
        color: '#a8b3c4',
        color2: '#f97316',
        group: 'noir'
    },
    {
        id: 'onyx',
        name: 'Onyx & Gold',
        label: 'Champagne × Emerald',
        bg: '#0a0908',
        color: '#d4af37',
        color2: '#10b981',
        group: 'noir'
    },
    {
        id: 'venom',
        name: 'Venom Acid',
        label: 'Symbiote Lime × Cyan',
        bg: '#000000',
        color: '#c6ff00',
        color2: '#00f2fe',
        group: 'noir'
    },
    {
        id: 'ember',
        name: 'Molten Ember',
        label: 'Forge Orange × Magenta',
        bg: '#000000',
        color: '#ff4d00',
        color2: '#ff007f',
        group: 'noir'
    }
];

const GROUP_LABELS = {
    'tri-neon': 'Tri-Neon • 3-Color',
    'instrument': 'Sci-Fi & Instrument',
    'noir': 'Noir • True Black'
};

const TriColorSwatch = ({ bg, color, color2, glow = false, size = 'md' }) => {
    const dim = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    return (
        <span className="inline-flex items-center -space-x-1 flex-shrink-0" aria-hidden="true">
            <span
                className={`${dim} rounded-full border border-white/25`}
                style={{ backgroundColor: bg }}
                title={`Base: ${bg}`}
            />
            <span
                className={`${dim} rounded-full border border-black/40`}
                style={{
                    backgroundColor: color,
                    boxShadow: glow ? `0 0 8px ${color}90` : 'none'
                }}
                title={`Primary: ${color}`}
            />
            <span
                className={`${dim} rounded-full border border-black/40`}
                style={{
                    backgroundColor: color2,
                    boxShadow: glow ? `0 0 8px ${color2}90` : 'none'
                }}
                title={`Secondary: ${color2}`}
            />
        </span>
    );
};

export const ThemePaletteSelector = ({ compact = false }) => {
    const { palette, setPalette } = useContext(ThemeContext);
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
                <TriColorSwatch
                    bg={activeTheme.bg}
                    color={activeTheme.color}
                    color2={activeTheme.color2}
                    glow
                    size="sm"
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
                        className="fixed inset-x-3 top-[4.25rem] w-auto sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-64 max-h-[75vh] overflow-y-auto p-1.5 rounded-md border border-rule-strong shadow-2xl z-50 backdrop-blur-md custom-scrollbar"
                        style={{ background: 'var(--surface-2)' }}
                    >
                        <div className="px-2.5 py-1.5 border-b border-rule mb-1 flex items-center justify-between sticky top-0 bg-[var(--surface-2)] z-10">
                            <span className="font-mono text-[10px] uppercase tracking-label text-ink-dim">
                                3-Color Palettes
                            </span>
                            <span className="font-mono text-[10px] text-accent">
                                {THEMES.length} Themes
                            </span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {THEMES.map((theme, i) => {
                                const isSelected = theme.id === palette;
                                const startsGroup = theme.group !== THEMES[i - 1]?.group;
                                return (
                                    <React.Fragment key={theme.id}>
                                        {startsGroup && (
                                            <div
                                                className={`px-2.5 pt-2 pb-1 ${i > 0 ? 'mt-1 border-t border-rule' : ''} font-mono text-[10px] uppercase tracking-label text-ink-dim flex items-center justify-between`}
                                            >
                                                <span>{GROUP_LABELS[theme.group] || theme.group}</span>
                                                {theme.group === 'tri-neon' && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-wash text-accent border border-accent/30">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <button
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
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <TriColorSwatch
                                                    bg={theme.bg}
                                                    color={theme.color}
                                                    color2={theme.color2}
                                                    glow={isSelected}
                                                />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-display leading-none truncate">
                                                        {theme.name}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-ink-dim mt-0.5 truncate">
                                                        {theme.label}
                                                    </div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <span className="inline-flex items-center gap-1 flex-shrink-0 ml-2">
                                                    <motion.span
                                                        layoutId="theme-check"
                                                        className="w-1.5 h-1.5 rounded-full bg-accent"
                                                    />
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{ backgroundColor: theme.color2 }}
                                                    />
                                                </span>
                                            )}
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
