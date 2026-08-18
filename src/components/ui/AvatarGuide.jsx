import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import avatarEmoji from '/avatar-emoji.png'; // Assuming avatar-emoji.png is in public folder. If not, this might need fallback
// Voice guide: these three are tiny and engine-free — the heavy half is lazy (§8).
import { useVoiceGuide } from '../../voice-guide/useVoiceGuide';
import { AvatarMouth } from '../../voice-guide/components/AvatarMouth';
import { CaptionText } from '../../voice-guide/components/CaptionBubble';

const tourSteps = [
  { section: 'hero',           emotion: 'wave',    message: "👋 Hey! I'm Ashwin — welcome! Let me show you around." ,           x: '38vw', y: '-60vh' },
  { section: 'roadmap',        emotion: 'nod',     message: "📚 Here's my journey — B.Tech in India to AI Engineering in Germany!", x: '10vw', y: '-45vh' },
  { section: 'skills',         emotion: 'flex',    message: "⚡ My core stack — PyTorch, OpenCV, LangChain, RAG systems and more.",         x: '60vw', y: '-50vh' },
  { section: 'projects',       emotion: 'excited', message: "🚀 These are my projects — from LiDAR fusion to full-stack RAG!",           x: '15vw', y: '-35vh' },
  { section: 'assistant',      emotion: 'think',   message: "🤖 Try my AI assistant — paste a job description and see how I match!", x: '55vw', y: '-55vh' },
  { section: 'certifications', emotion: 'proud',   message: "🎓 Certified by Anthropic, NVIDIA, Kaggle and more.",                  x: '25vw', y: '-40vh' },
  { section: 'contact',        emotion: 'bye',     message: "📬 Like what you see? I'm open to opportunities — let's connect!",     x: '42vw', y: '-30vh' },
];

const emotionAnimations = {
  wave: { rotate: [0, -30, 25, -20, 15, 0], y: [0, -20, -10, -15, 0], scale: [1, 1.1, 1.05, 1.1, 1], transition: { duration: 0.9, ease: "easeInOut" } },
  nod: { scaleY: [1, 0.85, 1.05, 0.9, 1], y: [0, 10, -5, 8, 0], transition: { duration: 0.7 } },
  flex: { scale: [1, 1.35, 0.95, 1.25, 1], rotate: [0, -10, 10, -5, 0], y: [0, -25, 0, -15, 0], transition: { duration: 0.7 } },
  excited: { y: [0, -40, 0, -30, 0, -20, 0], rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.2, 1, 1.15, 1], transition: { duration: 1.0 } },
  think: { rotate: [0, -20, 0, -15, 0], x: [0, -15, 0, -10, 0], scaleX: [1, 0.92, 1], transition: { duration: 0.8 } },
  proud: { scale: [1, 1.3, 1.1, 1.25, 1], y: [0, -30, -10, -20, 0], rotate: [0, 5, -5, 3, 0], transition: { duration: 0.7 } },
  bye: { rotate: [0, -25, 25, -25, 25, -25, 25, 0], y: [0, -10, 0], scale: [1, 1.1, 1], transition: { duration: 1.2 } },
};

// Seven emotions used to mean seven glow colours — blue, indigo, yellow,
// red, slate, green, orange — on a page with one accent. The motion still
// differs per emotion; the light no longer does.
const AVATAR_GLOW = 'drop-shadow(0 0 12px var(--accent-line))';

const getScreenConfig = () => {
  const W = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const isMobile = W < 768;
  return { isMobile };
};

export const AvatarGuide = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const [tourActive, setTourActive] = useState(() => !sessionStorage.getItem('toured'));
    const [currentStep, setCurrentStep] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [screenConfig, setScreenConfig] = useState(getScreenConfig);
    // Voice guide state. Reports ready:false until the lazy provider mounts, so
    // this component behaves exactly as before until then.
    const voice = useVoiceGuide();
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const handleResize = () => setScreenConfig(getScreenConfig());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!tourActive) return;

        if (!hasStarted) {
            setTimeout(() => {
                setHasStarted(true);
                sessionStorage.setItem('toured', 'true');
            }, 1000);
        }

        const handleScroll = () => {
            const scrollY = window.scrollY + window.innerHeight * 0.4;
            tourSteps.forEach((step, index) => {
                const el = document.getElementById(step.section);
                if (!el) return;
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    setCurrentStep(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tourActive, hasStarted]);

    const getPositions = () => {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const isMobile = W < 640;
        const avatarW = isMobile ? 80 : 130;
        const rightEdge = W - avatarW - 16;
        const leftEdge  = 16;

        return [
            { x: rightEdge,      y: H * 0.30 },
            { x: leftEdge,       y: H * 0.38 },
            { x: rightEdge,      y: H * 0.45 },
            { x: leftEdge,       y: H * 0.50 },
            { x: rightEdge,      y: H * 0.28 },
            { x: leftEdge,       y: H * 0.35 },
            { x: rightEdge,      y: H * 0.55 },
        ];
    };

    const avatarPx = screenConfig.isMobile ? 80 : 144;
    const bubbleH = 140;
    const pos = getPositions()[currentStep] || getPositions()[0];
    const safePos = {
        x: Math.min(Math.max(pos.x, 10), window.innerWidth - avatarPx - 10),
        y: Math.min(Math.max(pos.y, bubbleH), window.innerHeight - avatarPx - bubbleH),
    };

    const isRightSide = safePos.x > window.innerWidth / 2;

    const handleAvatarClick = () => {
        if (!tourActive) {
            setCurrentStep(0);
            setTourActive(true);
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Strip Framer Motion's transform on mobile to prevent coordinate disruption for the 'fixed' popup inside
    const mobileTransformReset = isMobile ? { transformTemplate: () => "none" } : {};

    // Captions are the primary channel and render in every state, including
    // `disabled` (§1.4, §3.3, §1.6: "a visitor who never clicks anything gets a
    // silent, captioned tour"). So the bubble follows the narration caption and
    // is no longer gated behind the once-per-session tour flag — only × hides it.
    const showBubble = !dismissed && (!!voice.caption || (tourActive && hasStarted));
    // × is the single off switch: hides the bubble AND stops narration (§6.2).
    const dismissAll = () => { setDismissed(true); setTourActive(false); voice.disable(); };

    return (
        <motion.div 
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
            animate={isMobile ? { x: 0, y: 0 } : { x: safePos.x, y: safePos.y }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            {...mobileTransformReset}
        >
            <motion.div 
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={tourActive && hasStarted ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <AnimatePresence mode="wait">
                    {showBubble ? (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                pointerEvents: 'auto',
                                background: 'var(--surface-1)',
                                border: '1px solid var(--rule-strong)',
                                ...(isMobile ? {
                                    position: 'fixed', bottom: '16px', left: '8px', right: '8px', top: 'auto', width: 'auto'
                                } : {
                                    position: 'absolute', bottom: '100%', ...(isRightSide ? { right: 0 } : { left: 0 }),
                                    width: '260px'
                                }),
                                borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: '8px',
                                fontSize: isMobile ? '12px' : '13px', color: 'var(--text)', fontWeight: 400,
                            }}
                        >
                            <p style={{ margin: '0 0 10px 0', lineHeight: '1.4' }}>
                                <CaptionText text={voice.caption?.text} fallback={tourSteps[currentStep].message} />
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {tourSteps.map((_, i) => (
                                        <div key={i} style={{ width: 5, height: 5, background: i === currentStep ? 'var(--accent)' : 'var(--rule-strong)', transition: 'background 0.3s' }} />
                                    ))}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); dismissAll(); }} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }} aria-label="Dismiss and stop narration">✕</button>
                            </div>
                            <p className="label" style={{ textAlign: 'center', marginTop: '6px', marginBottom: 0 }}>scroll to explore ↓</p>
                        </motion.div>
                    ) : (!tourActive && isHovered) ? (
                        <motion.div
                            key="idle-bubble"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                pointerEvents: 'auto',
                                background: 'var(--surface-1)',
                                border: '1px solid var(--rule-strong)',
                                borderRadius: 'var(--r-md)',
                                padding: '8px 12px', marginBottom: '8px',
                                fontSize: '12px', color: 'var(--text)', whiteSpace: 'nowrap'
                            }}
                        >Click to restart</motion.div>
                    ) : null}
                </AnimatePresence>

                {/* Avatar + mouth share one positioned wrapper so they scale together (§6.1).
                    The emotion animation moved from the <img> to this wrapper so the mouth
                    overlay stays aligned through it; the image keeps its own filter. */}
                <motion.div
                    key={`avatar-${currentStep}`}
                    className={`vg-avatar-wrap${voice.enabled && !voice.isSpeaking ? ' vg-idle' : ''}`}
                    /* Optimus spec §5.2 — the only hook the persona visual mode
                       needs. The aura recolours in CSS off this attribute; the
                       intensity stays driven by --vg-level, so nothing here
                       re-renders per frame. */
                    data-vg-persona={voice.persona}
                    animate={hasStarted ? emotionAnimations[tourSteps[currentStep].emotion] : {}}
                    onClick={handleAvatarClick}
                    style={{
                        pointerEvents: 'auto', cursor: tourActive ? 'default' : 'pointer',
                        width: '130px', height: '130px',
                        display: isMobile ? 'none' : 'block',
                    }}
                >
                    <img
                        src={avatarEmoji}
                        alt=""
                        style={{
                            width: '130px', height: '130px',
                            objectFit: 'contain', filter: AVATAR_GLOW,
                            display: 'block',
                        }}
                        onError={(e) => console.log('Avatar load error:', e)}
                    />
                    <div className="vg-avatar-glow" aria-hidden="true" />
                    <AvatarMouth active={voice.isSpeaking} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
