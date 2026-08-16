import React, { useEffect, useRef } from 'react';

// LiDAR-style radar sweep rendered on a single canvas: a rotating beam with a
// fading trail, faint range rings, and scattered points that light up as the
// beam passes over them. Pauses when off-screen and renders nothing under
// prefers-reduced-motion.
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

            // Range rings
            ctx.strokeStyle = 'rgba(255,159,28,0.06)';
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
                ctx.fillStyle = `rgba(255,159,28,${0.10 * (1 - i / SEGMENTS)})`;
                ctx.fill();
            }

            // Beam line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(sweep) * maxR, cy + Math.sin(sweep) * maxR);
            ctx.strokeStyle = 'rgba(255,181,77,0.32)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Center hub
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5, 0, TWO_PI);
            ctx.fillStyle = 'rgba(255,181,77,0.45)';
            ctx.fill();

            // Detected points: flash when the beam passes, then decay
            const decay = Math.pow(0.9985, dt);
            for (const p of points) {
                const d = (p.angle - sweep + TWO_PI) % TWO_PI;
                if (d < 0.05 || d > TWO_PI - 0.05) p.glow = 1;
                else p.glow *= decay;

                const px = cx + Math.cos(p.angle) * p.dist;
                const py = cy + Math.sin(p.angle) * p.dist;
                const alpha = 0.08 + p.glow * 0.6;

                if (p.glow > 0.4) {
                    ctx.beginPath();
                    ctx.arc(px, py, p.size * 3, 0, TWO_PI);
                    ctx.fillStyle = `rgba(255,159,28,${p.glow * 0.14})`;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, TWO_PI);
                ctx.fillStyle = `rgba(255,200,130,${alpha})`;
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
