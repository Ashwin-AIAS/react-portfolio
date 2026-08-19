import React, { useState, createContext, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from './hooks/useActiveSection';
import { useLang } from './hooks/useLang';

// Voice guide (§8): the whole bundle loads after first paint so it can't affect
// paint metrics. Nothing in src/voice-guide is imported eagerly from here.
const VoiceGuideMount = lazy(() => import('./voice-guide/VoiceGuideMount'));

// UI Components
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AvatarGuide } from './components/ui/AvatarGuide';

// Section Components
import { Hero } from './components/sections/Hero';
import { CareerRoadmapSection } from './components/sections/CareerRoadmapSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { GitHubSection } from './components/sections/GitHubSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AIAssistantSection } from './components/sections/AIAssistantSection';
import { CertificationsSection } from './components/sections/CertificationsSection';
import { ContactSection } from './components/sections/ContactSection';

export const ThemeContext = createContext({
    isDark: true,
    setIsDark: () => {},
    palette: 'cyan',
    setPalette: () => {}
});

// Boot readout. Replaces a 2.5s screen that ran 8 concurrent animation
// tracks in a monospace/conic-gradient/green palette used nowhere else on
// the site, with a progress bar that unmounted before it could finish.
// This one is 1.4s, uses the site's own tokens, and hands off into the hero.
const BOOT_LINES = [
  ['PERCEPTION', 'OK'],
  ['LLM SYSTEMS', 'OK'],
  ['SENSOR FUSION', 'OK'],
];

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const t1 = setTimeout(onComplete, 1400);
    return () => clearTimeout(t1);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '22rem' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-display"
          style={{
            fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em',
            color: 'var(--text)', marginBottom: '1rem',
          }}
        >
          Ashwin Vignesh M<span style={{ color: 'var(--accent)' }}>.</span>
        </motion.p>

        <div style={{ height: 1, background: 'var(--rule)', marginBottom: '0.75rem' }} />

        {BOOT_LINES.map(([label, value], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.13, duration: 0.2 }}
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '0.6875rem', letterSpacing: '0.14em',
              padding: '0.3rem 0', color: 'var(--text-dim)',
            }}
          >
            <span>{label}</span>
            <span style={{ color: 'var(--accent)' }}>{value}</span>
          </motion.div>
        ))}

        <div style={{ height: 1, background: 'var(--rule)', margin: '0.75rem 0' }} />

        {/* Completes at 1.15s, comfortably before the 1.4s unmount */}
        <div style={{ height: 2, background: 'var(--surface-3)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.95, delay: 0.2, ease: 'easeInOut' }}
            style={{ height: '100%', background: 'var(--accent)' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme-mode');
        return saved !== null ? saved === 'dark' : true;
    });

    const [palette, setPalette] = useState(() => {
        const saved = localStorage.getItem('theme-palette');
        return saved || 'cyan';
    });
    const [splashDone, setSplashDone] = useState(() => sessionStorage.getItem('splashSeen') === '1');
    const activeSection = useActiveSection();
    const { lang, t, toggleLang } = useLang();
    const [voiceGuideReady, setVoiceGuideReady] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    // §8: defer the voice-guide chunk until the browser is idle after first paint.
    useEffect(() => {
        const start = () => setVoiceGuideReady(true);
        if (typeof window.requestIdleCallback === 'function') {
            const id = window.requestIdleCallback(start, { timeout: 2000 });
            return () => window.cancelIdleCallback?.(id);
        }
        const id = setTimeout(start, 0);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    // Mirror the theme onto <html> so the design tokens reach html/body and
    // the splash screen too — the wrapper div alone leaves them on the dark
    // defaults, which shows through on overscroll in light mode.
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('theme-light', !isDark);
        root.classList.toggle('theme-dark', isDark);
        localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    }, [isDark]);

    // The palette class rides on the same <html> element as the mode class,
    // so the .theme-light.palette-x rules can out-specify the dark defaults.
    useEffect(() => {
        const root = document.documentElement;
        const allPalettes = [
            'palette-cyan',
            'palette-amber',
            'palette-indigo',
            'palette-emerald',
            'palette-crimson',
            'palette-ironman',
            'palette-vibranium',
            'palette-batman',
            'palette-cyberpunk'
        ];
        allPalettes.forEach(cls => root.classList.remove(cls));
        root.classList.add(`palette-${palette}`);
        localStorage.setItem('theme-palette', palette);
    }, [palette]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark, palette, setPalette }}>
            <AnimatePresence>
                {!splashDone && <SplashScreen key="splash" onComplete={() => { sessionStorage.setItem('splashSeen', '1'); setSplashDone(true); }} />}
            </AnimatePresence>
            <div className={`${isDark ? 'theme-dark' : 'theme-light'} palette-${palette} min-h-screen font-sans transition-colors duration-500 relative`}>
<Header activeSection={activeSection} lang={lang} t={t} toggleLang={toggleLang} />
                
                <main>
                    <Hero t={t} />
                    <div className="section-divider"></div>
                    <AIAssistantSection t={t} />
                    <div className="section-divider"></div>
                    <CareerRoadmapSection t={t} />
                    <div className="section-divider"></div>
                    <SkillsSection t={t} />
                    <div className="section-divider"></div>
                    <GitHubSection t={t} />
                    <div className="section-divider"></div>
                    <ProjectsSection t={t} />
                    <div className="section-divider"></div>
                    <CertificationsSection t={t} />
                    <div className="section-divider"></div>
                    <ContactSection t={t} />
                </main>

                <Footer t={t} />
                <ScrollToTop />
                {splashDone && <AvatarGuide />}
                {voiceGuideReady && (
                    <Suspense fallback={null}>
                        <VoiceGuideMount />
                    </Suspense>
                )}
            </div>
        </ThemeContext.Provider>
    );
}
