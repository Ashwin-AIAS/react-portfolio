import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';

// Assuming ThemeContext will be exported from App.jsx or a separate context file later.
// For now, we'll keep the context dependency injection pattern used in the original code,
// but we will import it from App.jsx once App is orchestrator.
import { ThemeContext } from '../../App';

export const Header = ({ activeSection, lang, t, toggleLang }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isDark, setIsDark } = useContext(ThemeContext);
    const navLinks = ["roadmap", "skills", "github", "projects", "assistant", "certifications", "contact"];
    
    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen ? 'bg-black/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.04]' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 h-14 flex justify-between items-center max-w-6xl">
                <a href="#" className="text-sm font-semibold text-white/90 tracking-tight">{portfolioData.personalInfo.name}</a>
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a key={link} href={`#${link}`} className={`relative text-xs font-medium tracking-wide transition-all duration-300 py-1 ${activeSection === link ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
                            {t.nav[link] || link}
                            {activeSection === link && <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />}
                        </a>
                    ))}
                    <div className="flex items-center gap-4 border-l border-white/[0.08] pl-4">
                        <button
                            onClick={toggleLang}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 text-xs font-semibold tracking-widest text-white/70"
                        >
                            <span className={lang === 'en' ? 'text-white' : 'text-white/30'}>EN</span>
                            <span className="text-white/20">|</span>
                            <span className={lang === 'de' ? 'text-white' : 'text-white/30'}>DE</span>
                        </button>
                        {/* Dark/Light Toggle */}
                        <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all" aria-label="Toggle theme">
                        <motion.span
                            key={isDark ? 'moon' : 'sun'}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm"
                        >{isDark ? '🌙' : '☀️'}</motion.span>
                    </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 text-[10px] font-semibold tracking-widest text-white/70 z-50"
                    >
                        <span className={lang === 'en' ? 'text-white' : 'text-white/30'}>EN</span>
                        <span className="text-white/20">|</span>
                        <span className={lang === 'de' ? 'text-white' : 'text-white/30'}>DE</span>
                    </button>
                    <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all z-50" aria-label="Toggle theme">
                        <motion.span animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.3 }} className="text-sm">{isDark ? '🌙' : '☀️'}</motion.span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50 flex-shrink-0">
                        <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
                    </button>
                </div>
            </nav>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-2xl border-b border-white/[0.04]">
                        <div className="flex flex-col items-center gap-6 py-10">
                            {navLinks.map(link => (<a key={link} href={`#${link}`} onClick={() => setIsMenuOpen(false)} className={`text-sm font-light transition-colors duration-300 ${activeSection === link ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>{t.nav[link] || link}</a>))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
