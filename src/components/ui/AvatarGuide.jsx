import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import avatarEmoji from '/avatar-emoji.png'; // Assuming avatar-emoji.png is in public folder. If not, this might need fallback

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

const emotionFilters = {
  wave: "drop-shadow(0 0 12px rgba(59,130,246,0.9))",
  nod: "drop-shadow(0 0 10px rgba(99,102,241,0.8))",
  flex: "drop-shadow(0 0 14px rgba(234,179,8,0.9))",
  excited: "drop-shadow(0 0 16px rgba(239,68,68,0.9))",
  think: "drop-shadow(0 0 10px rgba(148,163,184,0.7))",
  proud: "drop-shadow(0 0 14px rgba(34,197,94,0.9))",
  bye: "drop-shadow(0 0 12px rgba(251,146,60,0.9))",
};

const getScreenConfig = () => {
  const W = window.innerWidth;
  const isMobile = W < 640;
  return { isMobile };
};

export const AvatarGuide = () => {
    const [tourActive, setTourActive] = useState(() => !sessionStorage.getItem('toured'));
    const [currentStep, setCurrentStep] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [screenConfig, setScreenConfig] = useState(getScreenConfig);

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

    return (
        <motion.div 
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
            animate={{ x: safePos.x, y: safePos.y }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
            <div 
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <AnimatePresence mode="wait">
                    {(tourActive && hasStarted) ? (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                pointerEvents: 'auto', background: 'white', position: 'absolute',
                                bottom: '100%', ...(isRightSide ? { right: 0 } : { left: 0 }),
                                borderRadius: '16px', padding: '12px 16px', marginBottom: '8px',
                                width: screenConfig.isMobile ? '200px' : '260px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                fontSize: screenConfig.isMobile ? '12px' : '13px', color: '#1f2937', fontWeight: 500,
                            }}
                        >
                            <p style={{ margin: '0 0 10px 0', lineHeight: '1.4' }}>{tourSteps[currentStep].message}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {tourSteps.map((_, i) => (
                                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === currentStep ? '#2563eb' : '#cbd5e1', transition: 'background 0.3s' }} />
                                    ))}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setTourActive(false); }} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, fontWeight: 'bold' }}>✕</button>
                            </div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '6px', marginBottom: 0 }}>scroll to explore ↓</p>
                        </motion.div>
                    ) : (!tourActive && isHovered) ? (
                        <motion.div
                            key="idle-bubble"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                pointerEvents: 'auto', background: 'white', borderRadius: '12px',
                                padding: '8px 12px', marginBottom: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                fontSize: '12px', color: '#1f2937', fontWeight: 600, whiteSpace: 'nowrap'
                            }}
                        >Click to restart 👆</motion.div>
                    ) : null}
                </AnimatePresence>

                <motion.img 
                    key={`avatar-${currentStep}`}
                    src={avatarEmoji}
                    animate={hasStarted ? emotionAnimations[tourSteps[currentStep].emotion] : {}}
                    onClick={handleAvatarClick}
                    style={{
                        pointerEvents: 'auto', cursor: tourActive ? 'default' : 'pointer',
                        width: screenConfig.isMobile ? '80px' : '130px', height: screenConfig.isMobile ? '80px' : '130px',
                        objectFit: 'contain', filter: emotionFilters[tourSteps[currentStep].emotion], display: 'block',
                    }}
                    onError={(e) => console.log('Avatar load error:', e)}
                />
            </div>
        </motion.div>
    );
};
