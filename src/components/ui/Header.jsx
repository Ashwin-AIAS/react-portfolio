import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';

// Assuming ThemeContext will be exported from App.jsx or a separate context file later.
// For now, we'll keep the context dependency injection pattern used in the original code,
// but we will import it from App.jsx once App is orchestrator.
import { ThemeContext } from '../../App';

// Replaces the emoji theme toggle (🌙/☀️) — OS-rendered emoji clashed with
// the SVG icon set used everywhere else.
const ThemeIcon = ({ isDark }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
        {isDark ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        ) : (
            <>
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </>
        )}
    </svg>
);

const LangToggle = ({ lang, toggleLang, compact = false }) => (
    <button
        onClick={toggleLang}
        aria-label="Toggle language"
        className={`label flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded border border-rule hover:border-accent transition-colors z-50`}
    >
        <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
        <span aria-hidden="true">/</span>
        <span className={lang === 'de' ? 'text-accent' : ''}>DE</span>
    </button>
);

export const Header = ({ activeSection, lang, t, toggleLang }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isDark, setIsDark } = useContext(ThemeContext);
    const navLinks = ["assistant", "roadmap", "skills", "github", "projects", "certifications", "contact"];

    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled || isMenuOpen ? 'border-b border-rule' : 'border-b border-transparent'}`}
            style={{ backgroundColor: isScrolled || isMenuOpen ? 'var(--bg)' : 'transparent' }}
        >
            <nav className="container mx-auto px-6 h-16 flex justify-between items-center max-w-6xl">
                <a href="#" className="font-display text-sm font-bold tracking-tight text-ink">
                    {portfolioData.personalInfo.name}<span className="text-accent">.</span>
                </a>

                <div className="hidden md:flex items-center gap-7">
                    {navLinks.map(link => (
                        <a
                            key={link}
                            href={`#${link}`}
                            className={`label relative py-1.5 transition-colors ${activeSection === link ? 'text-accent' : 'hover:text-ink'}`}
                        >
                            {t.nav[link] || link}
                            {/* Full-width accent bar instead of the old 4px dot */}
                            {activeSection === link && (
                                <motion.span
                                    layoutId="nav-marker"
                                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                                />
                            )}
                        </a>
                    ))}
                    <div className="flex items-center gap-2.5 border-l border-rule pl-5">
                        <LangToggle lang={lang} toggleLang={toggleLang} />
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="w-8 h-8 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors"
                            aria-label="Toggle theme"
                        >
                            <ThemeIcon isDark={isDark} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <LangToggle lang={lang} toggleLang={toggleLang} compact />
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-8 h-8 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent transition-colors z-50"
                        aria-label="Toggle theme"
                    >
                        <ThemeIcon isDark={isDark} />
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="z-50 flex-shrink-0 w-8 h-8 flex items-center justify-center text-ink"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="md:hidden absolute top-full left-0 right-0 border-b border-rule"
                        style={{ backgroundColor: 'var(--bg)' }}
                    >
                        <div className="flex flex-col px-6 py-4">
                            {navLinks.map((link, i) => (
                                <a
                                    key={link}
                                    href={`#${link}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`label flex items-center gap-3 py-3 border-b border-rule last:border-b-0 transition-colors ${activeSection === link ? 'text-accent' : 'hover:text-ink'}`}
                                >
                                    <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                                    {t.nav[link] || link}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
