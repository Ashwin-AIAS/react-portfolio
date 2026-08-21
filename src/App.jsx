import React, { useState, createContext, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from './hooks/useActiveSection';
import { useLang } from './hooks/useLang';
import avatarEmoji from '/avatar-emoji.png';

// Voice guide (§8): the engine, the sources and the narration scripts all load
// after first paint so they can't affect paint metrics.
const VoiceGuideMount = lazy(() => import('./voice-guide/VoiceGuideMount'));

// The one exception to that, and it has to be: unlocking audio requires a real
// user gesture, the splash click is the first one we get, and by the time the
// lazy chunk lands that gesture is over. ./voice-guide/audioUnlock has no
// imports of its own and never reaches the engine, so pulling it in eagerly
// costs the initial bundle roughly nothing.
import { unlockAudio, primeSpeechSynthesis } from './voice-guide/audioUnlock';

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

/**
 * Boot readout, and the only guaranteed user gesture in the whole session.
 *
 * The boot lines used to run on a 1.4s timer and dismiss themselves. They still
 * run, but the screen now waits for the visitor at the end of them, because
 * that click is what unlocks audio: browsers will not start an AudioContext
 * without a real activation, and nothing else on the page is guaranteed to be
 * clicked before the hero scrolls past. Entering through the button means the
 * tour can speak the moment the portfolio paints instead of waiting for whatever
 * the visitor happens to touch first.
 *
 * The wait is not indefinite. IDLE_EXIT_MS after the boot finishes the splash
 * lets itself out, silently — a visitor who ignores the button still gets the
 * portfolio, and the voice guide falls back to arming on their first scroll or
 * tap exactly as it did before.
 */
const BOOT_MS = 1150;      // progress bar reaches 100% (0.2s delay + 0.95s run)
const IDLE_EXIT_MS = 8000; // ...then this long before we give up waiting

const SplashScreen = ({ onEnter }) => {
  const [booted, setBooted] = useState(false);
  const enteredRef = React.useRef(false);

  // `enter` is the gesture handler. Everything audio-related has to happen
  // synchronously inside it — a setTimeout or an await here and the activation
  // is already spent.
  const enter = useCallback(
    (withAudio) => {
      if (enteredRef.current) return;
      enteredRef.current = true;
      if (withAudio) {
        unlockAudio();
        primeSpeechSynthesis();
      }
      onEnter();
    },
    [onEnter]
  );

  useEffect(() => {
    const bootTimer = setTimeout(() => setBooted(true), BOOT_MS);
    // Not a gesture, so this exit deliberately passes withAudio=false.
    const idleTimer = setTimeout(() => enter(false), BOOT_MS + IDLE_EXIT_MS);
    return () => {
      clearTimeout(bootTimer);
      clearTimeout(idleTimer);
    };
  }, [enter]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={() => enter(true)}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-mono)',
        cursor: booted ? 'pointer' : 'default',
      }}
    >
      <div style={{ width: '100%', maxWidth: '22rem' }}>
        {/* Ashwin's Memoji — the face that is about to start talking. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: 88, height: 88,
            margin: '0 auto 1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Glow ring, breathing on its own so the avatar reads as live
              rather than as a static logo. */}
          <motion.div
            animate={{ scale: [1, 1.14, 1], opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -6,
              borderRadius: '50%',
              border: '1px solid var(--accent)',
              pointerEvents: 'none',
            }}
          />
          <img
            src={avatarEmoji}
            alt="Ashwin"
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 16px var(--accent))',
            }}
          />
        </motion.div>

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

        {/* Completes at 1.15s, which is what flips `booted` and reveals the CTA */}
        <div style={{ height: 2, background: 'var(--surface-3)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.95, delay: 0.2, ease: 'easeInOut' }}
            style={{ height: '100%', background: 'var(--accent)' }}
          />
        </div>

        {/* A real <button>, not a styled div: it takes focus on load order and
            Enter/Space fire click natively, so keyboard visitors get the same
            activation — and therefore the same audio — as a pointer does. */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          /* Deliberately does NOT stopPropagation: React's synthetic
             stopPropagation also stops the native event, and the voice guide
             arms off a window-level listener that needs to see this click.
             The overlay handler firing too is harmless — `enter` is guarded. */
          onClick={() => enter(true)}
          tabIndex={booted ? 0 : -1}
          aria-hidden={!booted}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '1.25rem',
            padding: '0.6rem 1rem',
            background: 'transparent',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--accent)',
            font: 'inherit',
            fontSize: '0.6875rem',
            letterSpacing: '0.18em',
            cursor: 'pointer',
            pointerEvents: booted ? 'auto' : 'none',
          }}
        >
          ▶ START AUDIO TOUR
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={booted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{
            marginTop: '0.6rem',
            textAlign: 'center',
            fontSize: '0.625rem',
            letterSpacing: '0.12em',
            color: 'var(--text-dim)',
          }}
        >
          or click anywhere to enter
        </motion.p>
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

    const dismissSplash = useCallback(() => {
        sessionStorage.setItem('splashSeen', '1');
        setSplashDone(true);
    }, []);

    // A key press is a user activation too, so keyboard visitors who never
    // reach for the mouse still enter with audio unlocked. Lives here rather
    // than on the overlay because an overlay only receives key events once
    // something inside it has focus.
    //
    // Tab is excluded so it can still do its job and move focus to the START
    // button; bare modifiers are excluded because they grant no activation, and
    // entering on them would spend the splash without unlocking anything. No
    // { once: true } for the same reason — a skipped key must not consume the
    // listener that a real one needs.
    useEffect(() => {
        if (splashDone) return undefined;
        const SKIP = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);
        const onKey = (e) => {
            if (SKIP.has(e.key)) return;
            unlockAudio();
            primeSpeechSynthesis();
            dismissSplash();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [splashDone, dismissSplash]);

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
                {!splashDone && <SplashScreen key="splash" onEnter={dismissSplash} />}
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
