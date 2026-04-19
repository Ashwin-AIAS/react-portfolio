import React, { useState, createContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from './hooks/useActiveSection';
import { useLang } from './hooks/useLang';

// UI Components
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { ParticleField } from './components/ui/ParticleField';
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
import { BlogSection } from './components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';

export const ThemeContext = createContext({ isDark: true, setIsDark: () => {} });

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'exit'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 2800);
    const t2 = setTimeout(onComplete, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'monospace'
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: 'clamp(200px, 40vw, 400px)',
        height: 'clamp(200px, 40vw, 400px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
        animation: 'splashPulse 3s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* HUD — left panel */}
      <motion.div
        className="splash-hud"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1, x: phase === 'exit' ? -40 : 0 }}
        transition={{ duration: 0.4, delay: phase === 'exit' ? 0 : 0.8 }}
        style={{
          position: 'absolute',
          left: 'clamp(16px, 5vw, 80px)',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column',
          gap: 'clamp(8px, 1.5vh, 14px)'
        }}
      >
        {[
          { label: 'RAG_ENGINE', val: 'ACTIVE' },
          { label: 'COMPUTER_VISION', val: 'ACTIVE' },
          { label: 'LLM_INTERFACE', val: 'ACTIVE' },
        ].map(({ label, val }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.18 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{
              width: 'clamp(7px, 1vw, 10px)',
              height: 'clamp(7px, 1vw, 10px)',
              borderRadius: '50%',
              background: '#3b82f6',
              boxShadow: '0 0 6px #3b82f6',
              flexShrink: 0
            }} />
            <span style={{
              fontSize: 'clamp(11px, 1.2vw, 15px)',
              color: 'rgba(99,179,237,0.85)',
              letterSpacing: '0.08em'
            }}>{label}</span>
            <span style={{
              fontSize: 'clamp(11px, 1.2vw, 15px)',
              color: 'rgba(74,222,128,0.9)',
              fontWeight: 600
            }}>{val}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* HUD — right panel */}
      <motion.div
        className="splash-hud"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1, x: phase === 'exit' ? 40 : 0 }}
        transition={{ duration: 0.4, delay: phase === 'exit' ? 0 : 0.8 }}
        style={{
          position: 'absolute',
          right: 'clamp(16px, 5vw, 80px)',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column',
          gap: 'clamp(8px, 1.5vh, 14px)',
          alignItems: 'flex-end'
        }}
      >
        {[
          { label: 'SENSOR_FUSION', val: 'OK' },
          { label: 'AUTONOMOUS_SYS', val: 'OK' },
          { label: 'CV_PIPELINE', val: 'OK' },
        ].map(({ label, val }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + i * 0.18 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span style={{
              fontSize: 'clamp(11px, 1.2vw, 15px)',
              color: 'rgba(74,222,128,0.9)',
              fontWeight: 600
            }}>{val}</span>
            <span style={{
              fontSize: 'clamp(11px, 1.2vw, 15px)',
              color: 'rgba(99,179,237,0.85)',
              letterSpacing: '0.08em'
            }}>{label}</span>
            <div style={{
              width: 'clamp(7px, 1vw, 10px)',
              height: 'clamp(7px, 1vw, 10px)',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              flexShrink: 0
            }} />
          </motion.div>
        ))}
      </motion.div>

      {/* CENTER — Avatar + name + bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(16px, 3vh, 28px)', zIndex: 1 }}>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={phase === 'exit'
            ? { opacity: 0, scale: 0.7, x: '38vw', y: '-22vh' }
            : { opacity: 1, scale: 1, x: 0, y: 0 }
          }
          transition={phase === 'exit'
            ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          }
          style={{ position: 'relative', width: 'clamp(110px, 18vw, 180px)', height: 'clamp(110px, 18vw, 180px)' }}
        >
          {/* Spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '-5px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)'
            }}
          />
          {/* Black gap */}
          <div style={{ position: 'absolute', inset: '-1px', borderRadius: '50%', background: '#000' }} />
          {/* Avatar img */}
          <img
            src="/Profile pic.jpg"
            alt="Ashwin"
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', height: '100%',
              borderRadius: '50%', objectFit: 'cover', objectPosition: 'top'
            }}
          />
          {/* Online dot */}
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px', zIndex: 2,
            width: 'clamp(10px, 1.5vw, 16px)',
            height: 'clamp(10px, 1.5vw, 16px)',
            borderRadius: '50%', background: '#22c55e',
            border: '2px solid #000',
            boxShadow: '0 0 8px #22c55e',
            animation: 'splashDot 1.5s ease-in-out infinite'
          }} />
        </motion.div>

        {/* Name + tagline + bar — fade out in exit phase */}
        <motion.div
          animate={{ opacity: phase === 'exit' ? 0 : 1, y: phase === 'exit' ? 10 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.5vh, 16px)' }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 3rem)',
              fontWeight: 700, color: 'white',
              letterSpacing: '-0.5px', margin: 0,
              fontFamily: 'inherit'
            }}
          >
            Ashwin<span style={{ color: '#3b82f6' }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              fontSize: 'clamp(9px, 1.1vw, 13px)',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            AI Engineer · Autonomous Systems
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              width: 'clamp(120px, 18vw, 200px)',
              height: '2px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '2px', overflow: 'hidden'
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.0, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '2px' }}
            />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.25); opacity: 1; }
        }
        @keyframes splashDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 480px) {
          /* On very small screens, hide HUD panels to avoid overlap */
          .splash-hud { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default function App() {
    const [isDark, setIsDark] = useState(true);
    const [splashDone, setSplashDone] = useState(false);
    const activeSection = useActiveSection();
    const { lang, t, toggleLang } = useLang();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <AnimatePresence>
                {!splashDone && <SplashScreen key="splash" onComplete={() => setSplashDone(true)} />}
            </AnimatePresence>
            <div className={`${isDark ? 'theme-dark' : 'theme-light'} min-h-screen font-sans transition-colors duration-500 relative`}>
                {/* Render ParticleField globally using React Portal */}
                {createPortal(<ParticleField />, document.body)}

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
                    <BlogSection />
                    <div className="section-divider"></div>
                    <ContactSection t={t} />
                </main>

                <Footer t={t} />
                <ScrollToTop />
                <AvatarGuide />
            </div>
        </ThemeContext.Provider>
    );
}
