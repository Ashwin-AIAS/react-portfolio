import React, { useEffect, useRef } from 'react';

// LiDAR-style radar sweep rendered on a single canvas: a rotating beam with a
// fading trail, faint range rings, and scattered points that light up as the
// beam passes over them. Pauses when off-screen and renders nothing under
// prefers-reduced-motion.
//
// Every colour is read off the live design tokens each frame, so the sweep
// follows whichever palette is active without the component remounting.

// Custom properties come back as authored — '#00f2fe', not 'rgb(...)' — so the
// trail and beam, which need per-segment alpha, have to parse the hex first.
const toRGB = (value) => {
    const v = value.trim();
    const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
        const d = hex[1];
        const full = d.length === 3 ? d[0] + d[0] + d[1] + d[1] + d[2] + d[2] : d;
        return [
            parseInt(full.slice(0, 2), 16),
            parseInt(full.slice(2, 4), 16),
            parseInt(full.slice(4, 6), 16),
        ];
    }
    if (v.toLowerCase().startsWith('rgb')) {
        const inner = v.slice(v.indexOf('(') + 1, v.lastIndexOf(')'));
        const parts = inner.split(',').map((n) => parseFloat(n));
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) return parts.slice(0, 3);
    }
    return null;
};

export const LidarSweep = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const TWO_PI = Math.PI * 2;
        const SWEEP_SPEED = TWO_PI / 9000; // one rotation every 9s, in rad/ms
        let raf = null;
        let visible = true;
        let lastTime = performance.now();
        let sweep = 0;
        let w, h, cx, cy, maxR;
        let points = [];
        // Parsing hex 60x/s is wasted work — the palette only changes on click,
        // so cache the parse and redo it when the raw token value differs.
        let lastAccent = '';
        let accentRGB = [0, 242, 254];
        let lastAccentStrong = '';
        let accentStrongRGB = [56, 189, 248];

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width; h = rect.height;
            canvas.width = w * dpr; canvas.height = h * dpr;
            canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cx = w / 2; cy = h / 2;
            maxR = Math.hypot(w, h) / 2;
            points = Array.from({ length: 110 }, () => ({
                angle: Math.random() * TWO_PI,
                dist: (0.12 + Math.random() * 0.88) * maxR,
                size: 0.8 + Math.random() * 1.6,
                glow: 0,
            }));
        };

        const draw = (now) => {
            const dt = Math.min(now - lastTime, 100);
            lastTime = now;
            // Negative direction so the trail (drawn at increasing angles) sits behind the beam
            sweep = (sweep - SWEEP_SPEED * dt + TWO_PI) % TWO_PI;

            ctx.clearRect(0, 0, w, h);

            const computedStyle = getComputedStyle(canvas);
            const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#00f2fe';
            const accentWash = computedStyle.getPropertyValue('--accent-wash').trim() || 'rgba(0,242,254,0.1)';
            const accentStrong = computedStyle.getPropertyValue('--accent-strong').trim() || accentColor;

            if (accentColor !== lastAccent) {
                lastAccent = accentColor;
                accentRGB = toRGB(accentColor) || [0, 242, 254];
            }
            if (accentStrong !== lastAccentStrong) {
                lastAccentStrong = accentStrong;
                accentStrongRGB = toRGB(accentStrong) || accentRGB;
            }
            const [ar, ag, ab] = accentRGB;
            const [sr, sg, sb] = accentStrongRGB;

            // Range rings
            ctx.strokeStyle = accentWash;
            ctx.lineWidth = 1;
            for (const f of [0.22, 0.42, 0.62, 0.82]) {
                ctx.beginPath();
                ctx.arc(cx, cy, maxR * f, 0, TWO_PI);
                ctx.stroke();
            }

            // Sweep trail: thin sectors fading out behind the beam
            const SEGMENTS = 36;
            for (let i = 0; i < SEGMENTS; i++) {
                const a = sweep + i * 0.009;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, maxR, a, a + 0.011);
                ctx.closePath();
                ctx.fillStyle = `rgba(${ar},${ag},${ab},${0.10 * (1 - i / SEGMENTS)})`;
                ctx.fill();
            }

            // Beam line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(sweep) * maxR, cy + Math.sin(sweep) * maxR);
            ctx.strokeStyle = `rgba(${sr},${sg},${sb},0.32)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Center hub
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5, 0, TWO_PI);
            ctx.fillStyle = `rgba(${sr},${sg},${sb},0.45)`;
            ctx.fill();

            // Detected points: flash when the beam passes, then decay
            const decay = Math.pow(0.9985, dt);
            for (const p of points) {
                const d = (p.angle - sweep + TWO_PI) % TWO_PI;
                if (d < 0.05 || d > TWO_PI - 0.05) p.glow = 1;
                else p.glow *= decay;

                const px = cx + Math.cos(p.angle) * p.dist;
                const py = cy + Math.sin(p.angle) * p.dist;

                if (p.glow > 0.4) {
                    ctx.beginPath();
                    ctx.arc(px, py, p.size * 3, 0, TWO_PI);
                    ctx.fillStyle = `rgba(${ar},${ag},${ab},${p.glow * 0.14})`;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, TWO_PI);
                ctx.fillStyle = p.glow > 0.05 ? accentColor : 'rgba(255,255,255,0.2)';
                ctx.fill();
            }

            raf = visible ? requestAnimationFrame(draw) : null;
        };

        const start = () => {
            if (raf === null) {
                lastTime = performance.now();
                raf = requestAnimationFrame(draw);
            }
        };
        const stop = () => {
            if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
        };

        let inView = true;
        const update = () => {
            visible = inView && !document.hidden;
            visible ? start() : stop();
        };

        const observer = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            update();
        });
        observer.observe(canvas);

        const onVisibility = update;

        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVisibility);
        start();

        return () => {
            stop();
            observer.disconnect();
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.55 }}
            aria-hidden="true"
        />
    );
};
