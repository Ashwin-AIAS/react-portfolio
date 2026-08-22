import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Voice guide: these three are tiny and engine-free — the heavy half is lazy (§8).
import { useVoiceGuide } from '../../voice-guide/useVoiceGuide';
import { PersonaAvatar } from '../../voice-guide/components/PersonaAvatar';
import { CaptionText, AgentControls } from '../../voice-guide/components/CaptionBubble';

const tourSteps = [
  { section: 'hero',           emotion: 'wave',    message: "👋 Hey! I'm Ashwin — welcome! Let me show you around." },
  { section: 'assistant',      emotion: 'think',   message: "🤖 Try my AI assistant — paste a job description and see how I match!" },
  { section: 'roadmap',        emotion: 'nod',     message: "📚 Here's my journey — B.Tech in India to AI Engineering in Germany!" },
  { section: 'skills',         emotion: 'flex',    message: "⚡ My core stack — PyTorch, OpenCV, LangChain, RAG systems and more." },
  { section: 'github',         emotion: 'flex',    message: "💻 Here's my live GitHub activity — open source contributions and commits." },
  { section: 'projects',       emotion: 'excited', message: "🚀 These are my projects — from LiDAR fusion to full-stack RAG!" },
  { section: 'certifications', emotion: 'proud',   message: "🎓 Certified by Anthropic, NVIDIA, Kaggle and more." },
  { section: 'contact',        emotion: 'bye',     message: "📬 Like what you see? I'm open to opportunities — let's connect!" },
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

/**
 * Telemetry corner brackets on the HUD terminal — holo spec §2.2.1.
 *
 * Four ┌ ┐ └ ┘ arms drawn as two borders of an empty square, which is cheaper
 * and crisper at any zoom than glyphs would be. Every value is inline: the card
 * is rendered by this eager component, so the frame has to hold up before
 * voice-guide.css lands. The class on each arm carries only the glow keyframes.
 */
const CORNER_ARM = 13;
const CORNER_BORDER = '2px solid var(--accent)';
const HUD_CORNERS = [
    { key: 'tl', edges: { top: -1, left: -1, borderTop: CORNER_BORDER, borderLeft: CORNER_BORDER } },
    { key: 'tr', edges: { top: -1, right: -1, borderTop: CORNER_BORDER, borderRight: CORNER_BORDER } },
    { key: 'bl', edges: { bottom: -1, left: -1, borderBottom: CORNER_BORDER, borderLeft: CORNER_BORDER } },
    { key: 'br', edges: { bottom: -1, right: -1, borderBottom: CORNER_BORDER, borderRight: CORNER_BORDER } },
].map(({ key, edges }) => ({
    key,
    style: {
        position: 'absolute',
        width: CORNER_ARM,
        height: CORNER_ARM,
        pointerEvents: 'none',
        ...edges,
    },
}));

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

    // Under 768px MobileVoicePill is the entire guide (personas spec §3.4): a
    // 38px bar that never covers content, instead of this bubble sitting on top
    // of the page. The handover waits for voice.ready, so if the lazy chunk
    // never lands the old mobile bubble is still what shows, not nothing.
    if (screenConfig.isMobile && voice.ready) return null;

    const getPositions = () => {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const isMobile = W < 640;
        const avatarW = isMobile ? 80 : 130;
        const rightEdge = W - avatarW - 24;
        const leftEdge  = 24;
        const minY = 350; // Minimum vertical offset to guarantee docked bubble never clips top edge

        return [
            { x: rightEdge,      y: Math.max(H * 0.52, minY) },
            { x: leftEdge,       y: Math.max(H * 0.50, minY) },
            { x: rightEdge,      y: Math.max(H * 0.54, minY) },
            { x: leftEdge,       y: Math.max(H * 0.50, minY) },
            { x: rightEdge,      y: Math.max(H * 0.52, minY) },
            { x: leftEdge,       y: Math.max(H * 0.48, minY) },
            { x: rightEdge,      y: Math.max(H * 0.52, minY) },
            { x: leftEdge,       y: Math.max(H * 0.50, minY) },
        ];
    };

    const avatarPx = screenConfig.isMobile ? 80 : 144;
    const bubbleH = 340; // Full height with docked persona selector, unmute button and status
    const pos = getPositions()[currentStep] || getPositions()[0];
    const safePos = {
        x: Math.min(Math.max(pos.x, 16), Math.max(16, window.innerWidth - avatarPx - 16)),
        y: Math.min(Math.max(pos.y, bubbleH + 20), Math.max(window.innerHeight - avatarPx - 20, bubbleH + 20)),
    };

    const isRightSide = safePos.x > window.innerWidth / 2;

    const handleAvatarClick = () => {
        // × now hides the persona selector and the unmute CTA along with the
        // bubble, since they are docked inside it (personas spec §3.5) and
        // there is no floating pill left to fall back on. Clicking the avatar
        // is the way back.
        setDismissed(false);
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
    // Once the guide is ready the bubble also carries the unmute prompt and the
    // persona selector, so it stays up after the tour copy runs out (personas
    // spec §3.5) — that offer is the only place left to unmute from.
    const showBubble = !dismissed && (!!voice.caption || voice.ready || (tourActive && hasStarted));
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
                            className="vg-hud-card"
                            style={{
                                pointerEvents: 'auto',
                                // Frosted glass. --surface-1 is opaque, so the
                                // translucency is applied in voice-guide.css via
                                // color-mix; until that lazy chunk lands this
                                // solid fill is the fallback (§8).
                                background: 'var(--surface-1)',
                                border: '1px solid var(--accent-line)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                ...(isMobile ? {
                                    position: 'fixed', bottom: '16px', left: '8px', right: '8px', top: 'auto', width: 'auto'
                                } : {
                                    position: 'absolute', bottom: '100%', ...(isRightSide ? { right: 0 } : { left: 0 }),
                                    width: '264px',
                                    maxHeight: 'calc(100vh - 200px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }),
                                borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: '8px',
                                fontSize: isMobile ? '12px' : '13px', color: 'var(--text)', fontWeight: 400,
                                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 20px var(--accent-wash)',
                            }}
                        >
                            {/* Telemetry corner brackets. Positioned inline rather
                                than from the stylesheet so the HUD frame is intact
                                even before the lazy CSS arrives; the class only
                                carries the glow animation. */}
                            {HUD_CORNERS.map(({ key, style }) => (
                                <span key={key} className="vg-hud-corner" aria-hidden="true" style={style} />
                            ))}

                            {/* The card is the frame; this is what scrolls, so the
                                brackets stay pinned to the corners instead of
                                sliding away with the content. */}
                            <div style={{ minHeight: 0, overflowY: isMobile ? 'visible' : 'auto' }}>
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
                                {/* Unmute CTA, mute toggle and persona selector, docked here
                                    rather than floating in their own box at bottom-left
                                    (personas spec §3.5). Renders nothing until ready. */}
                                <AgentControls />
                                <p className="label" style={{ textAlign: 'center', marginTop: '6px', marginBottom: 0 }}>scroll to explore ↓</p>
                            </div>
                        </motion.div>
                    ) : ((!tourActive || dismissed) && isHovered) ? (
                        <motion.div
                            key="idle-bubble"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="vg-hud-card"
                            style={{
                                pointerEvents: 'auto',
                                background: 'var(--surface-1)',
                                border: '1px solid var(--accent-line)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: 'var(--r-md)',
                                padding: '8px 12px', marginBottom: '8px',
                                fontSize: '12px', color: 'var(--text)', whiteSpace: 'nowrap',
                                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 20px var(--accent-wash)',
                                position: 'relative',
                            }}
                        >
                            {HUD_CORNERS.map(({ key, style }) => (
                                <span key={key} className="vg-hud-corner" aria-hidden="true" style={style} />
                            ))}
                            Click to restart
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* Avatar + mouth share one positioned wrapper so they scale together (§6.1).
                    The emotion animation moved from the <img> to this wrapper so the mouth
                    overlay stays aligned through it; PersonaAvatar keeps its own filters. */}
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
                        pointerEvents: 'auto', cursor: tourActive && !dismissed ? 'default' : 'pointer',
                        width: '130px', height: '130px',
                        display: isMobile ? 'none' : 'block',
                    }}
                >
                    {/* Autobot crest, arc-reactor HUD, or the memoji and its
                        overlaid mouth — personas spec §3.3. */}
                    <PersonaAvatar persona={voice.persona} size={130} speaking={voice.isSpeaking} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
