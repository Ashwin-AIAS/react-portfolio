import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Voice guide: these three are tiny and engine-free — the heavy half is lazy (§8).
import { useVoiceGuide } from '../../voice-guide/useVoiceGuide';
import { PersonaAvatar } from '../../voice-guide/components/PersonaAvatar';
import { useAvatarPhase } from '../../voice-guide/useAvatarPhase';
import { CaptionText, AgentControls } from '../../voice-guide/components/CaptionBubble';

const tourSteps = [
  { section: 'hero',           message: "👋 Hey! I'm Ashwin — welcome! Let me show you around." },
  { section: 'assistant',      message: "🤖 Try my AI assistant — paste a job description and see how I match!" },
  { section: 'roadmap',        message: "📚 Here's my journey — B.Tech in India to AI Engineering in Germany!" },
  { section: 'skills',         message: "⚡ My core stack — PyTorch, OpenCV, LangChain, RAG systems and more." },
  { section: 'github',         message: "💻 Here's my live GitHub activity — open source contributions and commits." },
  { section: 'projects',       message: "🚀 These are my projects — from LiDAR fusion to full-stack RAG!" },
  { section: 'certifications', message: "🎓 Certified by Anthropic, NVIDIA, Kaggle and more." },
  { section: 'contact',        message: "📬 Like what you see? I'm open to opportunities — let's connect!" },
];

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
    // Enter/stay/exit for the avatar, keyed to the narration's committed
    // section. Once the guide is ready that section also decides where the
    // guide stands, so it exits in place, moves, then enters, and a fast flick
    // through the page no longer sends it flying from side to side.
    const { phase, shownSection } = useAvatarPhase(voice.ready ? voice.section : null, voice.persona);
    const committedStep = tourSteps.findIndex((s) => s.section === shownSection);
    const step = committedStep >= 0 ? committedStep : currentStep;

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
    const pos = getPositions()[step] || getPositions()[0];
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
            /* Following commits, the avatar has already exited (it ends
               invisible) when the step changes, so the guide cuts straight to
               its new spot and enters there instead of flying across the page
               mid-animation. The raw-scroll fallback keeps the spring. */
            transition={committedStep >= 0 ? { duration: 0 } : { type: "spring", stiffness: 80, damping: 16 }}
            {...mobileTransformReset}
        >
            <motion.div 
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                /* Anti-gravity levitation (holo spec §2.2.1). The guide is a
                   projection now, so it never sits still — the float runs in
                   every state instead of only between tours, on an asymmetric
                   4-stop path so it never reads as a metronome. */
                animate={{ y: [0, -10, 2, -8, 0], rotate: [0, -1.5, 1.5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
                <AnimatePresence mode="wait">
                    {showBubble ? (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            /* Fades out with the avatar's exit, so the old caption
                               is already gone when the guide cuts to its next spot. */
                            animate={phase === 'exit' ? { opacity: 0, y: 10, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="vg-hud-card"
                            /* The whole terminal takes the active character's
                               palette from here (holo spec §2.4). voice-guide.css
                               scopes --accent/--accent-line/--accent-wash to this
                               attribute, and the inline border, shadow and corner
                               arms below already resolve those tokens — so the
                               frame recolours on a persona switch without this
                               component knowing anything about the characters. */
                            data-vg-persona={voice.persona}
                            style={{
                                pointerEvents: 'auto',
                                // Frosted glass. --surface-1 is opaque, so the
                                // translucency is applied in voice-guide.css via
                                // color-mix; until that lazy chunk lands this
                                // solid fill is the fallback (§8).
                                background: 'var(--surface-1)',
                                border: '1px solid var(--accent-line)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
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
                                    <CaptionText text={voice.caption?.text} fallback={tourSteps[step].message} />
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {tourSteps.map((_, i) => (
                                            <div key={i} style={{ width: 5, height: 5, background: i === step ? 'var(--accent)' : 'var(--rule-strong)', transition: 'background 0.3s' }} />
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
                            data-vg-persona={voice.persona}
                            style={{
                                pointerEvents: 'auto',
                                background: 'var(--surface-1)',
                                border: '1px solid var(--accent-line)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
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

                {/* Second stage of the levitation, on its own timer and its own
                    element: the wrapper above drifts the whole guide, this one
                    lets the avatar bank against that drift, which is what makes
                    the motion read as buoyancy rather than as a slide. Kept in
                    CSS so it never has to share a transform with the enter/exit
                    phases, which each visual runs on its own parts. */}
                <div className="vg-levitate">
                {/* Avatar + mouth share one positioned wrapper so they scale together (§6.1). */}
                <div
                    className={`vg-avatar-wrap${voice.enabled && !voice.isSpeaking ? ' vg-idle' : ''}`}
                    /* Optimus spec §5.2 — the only hook the persona visual mode
                       needs. The aura recolours in CSS off this attribute; the
                       intensity stays driven by --vg-level, so nothing here
                       re-renders per frame. */
                    data-vg-persona={voice.persona}
                    onClick={handleAvatarClick}
                    style={{
                        pointerEvents: 'auto', cursor: tourActive && !dismissed ? 'default' : 'pointer',
                        width: '130px', height: '130px',
                        display: isMobile ? 'none' : 'block',
                    }}
                >
                    {/* Autobot crest, arc-reactor HUD, or the memoji and its
                        overlaid mouth — personas spec §3.3. */}
                    <PersonaAvatar persona={voice.persona} size={130} speaking={voice.isSpeaking} phase={phase} />
                </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
