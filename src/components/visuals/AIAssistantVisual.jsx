import React, { useEffect, useRef, useState, useCallback } from 'react';

const PERSONA_CONFIGS = {
    ashwin: {
        title: 'NEURAL LABS // ASHWIN',
        subtitle: 'Autonomous LiDAR Core • Ready',
        generatingText: 'LiDAR Perception Streaming...',
        idleText: 'Perception Core Online • Standby',
        accentHex: null, // resolved live from CSS --accent (matches Hero LidarSweep)
        secondaryHex: null, // resolved live from CSS --accent-2
        cornerPrefix: 'LIDAR-AI',
        topologyLabel: 'RADAR // SWEEP',
        footerLeft: 'LIDAR LOCK',
    },
    jarvis: {
        title: 'STARK // J.A.R.V.I.S. OS',
        subtitle: 'Arc Reactor Core • Active',
        generatingText: 'Synthesizing Stark Diagnostics...',
        idleText: 'Stark Hologram Online • Ready',
        accentHex: '#F59E0B',
        secondaryHex: '#38BDF8',
        cornerPrefix: 'STARK-OS',
        topologyLabel: 'HOLO // 3D',
        footerLeft: '64 NODES',
    },
    optimus: {
        title: 'AUTOBOT // TELETRAN-1',
        subtitle: 'Matrix of Leadership • Active',
        generatingText: 'Unleashing Matrix Wisdom...',
        idleText: 'Energon Matrix Online • Ready',
        accentHex: '#3B82F6',
        secondaryHex: '#EF4444',
        cornerPrefix: 'AUTOBOT',
        topologyLabel: 'MATRIX // CORE',
        footerLeft: 'ENERGON 100%',
    },
    megatron: {
        title: 'DECEPTICON // WAR MATRIX',
        subtitle: 'Dark Energon Core • Primed',
        generatingText: 'Unleashing Dark Energon Surge...',
        idleText: 'Dark Energon Online • Primed',
        accentHex: '#A855F7',
        secondaryHex: '#EC4899',
        cornerPrefix: 'DECEPTICON',
        topologyLabel: 'SINGULARITY // WAR',
        footerLeft: 'OVERDRIVE',
    },
};

const parseRGB = (value, fallback) => {
    if (!value) return fallback;
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
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
            return parts.slice(0, 3).map(Math.round);
        }
    }
    return fallback;
};

const TWO_PI = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const JARVIS_NODE_COUNT = 64;

function createJarvisNodes() {
    const nodes = [];
    for (let i = 0; i < JARVIS_NODE_COUNT; i++) {
        if (i < 46) {
            const y = 1 - (i / 45) * 2;
            const rad = Math.sqrt(Math.max(0, 1 - y * y));
            const theta = GOLDEN_ANGLE * i;
            const r = i % 5 === 0 ? 0.42 : 0.84;
            nodes.push({
                x: Math.cos(theta) * rad * r,
                y: y * r,
                z: Math.sin(theta) * rad * r,
                layer: i % 5 === 0 ? 'core' : 'mid',
                phase: i * 0.37,
                size: i % 5 === 0 ? 2.4 : 1.75,
            });
        } else {
            const a = ((i - 46) / 18) * TWO_PI;
            const r = 1.04;
            nodes.push({
                x: Math.cos(a) * r,
                y: Math.sin(a) * r * 0.38,
                z: Math.sin(a) * r * 0.92,
                layer: 'outer',
                phase: i * 0.37,
                size: 1.4,
            });
        }
    }
    return nodes;
}

function createLidarPoints() {
    return Array.from({ length: 16 }, (_, idx) => ({
        angle: (idx / 16) * TWO_PI + (idx % 3) * 0.18,
        dist: 0.28 + ((idx * 37) % 68) / 100, // 0.28 .. 0.96
        size: 1.4 + (idx % 3) * 0.5,
        glow: 0,
        secondary: idx % 3 === 0,
    }));
}

const AIAssistantVisual = ({ isGenerating, persona = 'ashwin' }) => {
    const config = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS.ashwin;
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const stateRef = useRef({
        persona,
        isGenerating,
        pointer: { x: 0, y: 0, active: false, rawX: 0, rawY: 0 },
        rotX: 0.18,
        rotY: 0,
        sweepAngle: 0,
        velBoost: 0,
        energy: 0,
        jarvisNodes: createJarvisNodes(),
        jarvisPulses: [],
        lidarPoints: createLidarPoints(),
        shockwaves: [],
    });

    const [hudReadout, setHudReadout] = useState('SYNC // 00°');

    useEffect(() => {
        const st = stateRef.current;
        if (st.persona !== persona) {
            st.persona = persona;
            st.velBoost = Math.max(st.velBoost, 1.2);
            st.shockwaves.push({ r: 0.08, alpha: 0.85, speed: 1.7 });
        }
        st.isGenerating = isGenerating;
    }, [persona, isGenerating]);

    const handlePointerMove = useCallback((e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        stateRef.current.pointer = {
            x: Math.max(-1, Math.min(1, nx)),
            y: Math.max(-1, Math.min(1, ny)),
            rawX: e.clientX - rect.left,
            rawY: e.clientY - rect.top,
            active: true,
        };
        const deg = Math.round(((Math.atan2(ny, nx) * 180) / Math.PI + 360) % 360);
        setHudReadout(`VEC // ${String(deg).padStart(3, '0')}°`);
    }, []);

    const handlePointerLeave = useCallback(() => {
        stateRef.current.pointer.active = false;
        setHudReadout('SYNC // 00°');
    }, []);

    const handlePulseClick = useCallback(() => {
        const st = stateRef.current;
        st.velBoost = Math.min(2.4, st.velBoost + 1.25);
        st.shockwaves.push({ r: 0.05, alpha: 0.95, speed: 2.0 });
        if (st.persona === 'jarvis') {
            for (let k = 0; k < 6; k++) {
                const a = Math.floor(Math.random() * JARVIS_NODE_COUNT);
                const b = (a + 1 + Math.floor(Math.random() * 12)) % JARVIS_NODE_COUNT;
                st.jarvisPulses.push({ from: a, to: b, p: 0, speed: 2.0 + Math.random() });
            }
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let w = 0;
        let h = 0;
        let raf = null;
        let visible = true;
        let lastTime = performance.now();

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = parent.clientWidth;
            h = parent.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        /**
         * 1. ASHWIN: Minimalist Hero-Matched LiDAR Radar Sweep & Breathing Core
         * Clean concentric range rings, rotating laser beam with fading sector trail,
         * sparse point-cloud detections, and a calm breathing center orb.
         */
        const drawAshwinLidar = (now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st) => {
            const rMax = radius * 1.08;
            const sweepSpeed = (reducedMotion ? 0.2 : 1.05) + st.energy * 1.4 + st.velBoost * 1.5;
            st.sweepAngle = (st.sweepAngle - sweepSpeed * dt + TWO_PI) % TWO_PI;

            // Subtle cursor parallax offset
            const ox = st.pointer.active ? st.pointer.x * 6 : 0;
            const oy = st.pointer.active ? st.pointer.y * 6 : 0;
            const rx = cx + ox;
            const ry = cy + oy;

            // Soft ambient glow
            const bgGrad = ctx.createRadialGradient(rx, ry, 2, rx, ry, rMax * 1.25);
            bgGrad.addColorStop(0, `rgba(${ar},${ag},${ab},${0.16 + st.energy * 0.16})`);
            bgGrad.addColorStop(0.55, `rgba(${sr},${sg},${sb},0.05)`);
            bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bgGrad;
            ctx.beginPath();
            ctx.arc(rx, ry, rMax * 1.25, 0, TWO_PI);
            ctx.fill();

            // Crosshair axis ticks
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.12)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rx - rMax * 1.08, ry);
            ctx.lineTo(rx + rMax * 1.08, ry);
            ctx.moveTo(rx, ry - rMax * 1.08);
            ctx.lineTo(rx, ry + rMax * 1.08);
            ctx.stroke();

            // 3 Concentric LiDAR range rings (matching Hero LidarSweep)
            const ringFracs = [0.36, 0.68, 1.0];
            for (let i = 0; i < ringFracs.length; i++) {
                ctx.beginPath();
                ctx.arc(rx, ry, rMax * ringFracs[i], 0, TWO_PI);
                ctx.strokeStyle = i % 2 === 0
                    ? `rgba(${ar},${ag},${ab},${0.22 + st.energy * 0.12})`
                    : `rgba(${sr},${sg},${sb},${0.18 + st.energy * 0.1})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Rotating LiDAR sweep sector trail (28 segments, primary -> secondary blend)
            const SEGMENTS = 28;
            for (let i = 0; i < SEGMENTS; i++) {
                const a = st.sweepAngle + i * 0.018;
                const t = i / SEGMENTS;
                const rMix = Math.round(ar * (1 - t * 0.5) + sr * (t * 0.5));
                const gMix = Math.round(ag * (1 - t * 0.5) + sg * (t * 0.5));
                const bMix = Math.round(ab * (1 - t * 0.5) + sb * (t * 0.5));
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.arc(rx, ry, rMax, a, a + 0.022);
                ctx.closePath();
                ctx.fillStyle = `rgba(${rMix},${gMix},${bMix},${(0.18 + st.energy * 0.12) * (1 - t)})`;
                ctx.fill();
            }

            // Leading laser beam line
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + Math.cos(st.sweepAngle) * rMax, ry + Math.sin(st.sweepAngle) * rMax);
            ctx.strokeStyle = `rgba(${sr},${sg},${sb},${0.65 + st.energy * 0.25})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Detected LiDAR point cloud blips that illuminate as the beam passes
            const decay = Math.pow(0.22, dt);
            for (const pt of st.lidarPoints) {
                const diff = (pt.angle - st.sweepAngle + TWO_PI) % TWO_PI;
                if (diff < 0.09 || diff > TWO_PI - 0.09) {
                    pt.glow = 1.0;
                } else {
                    pt.glow *= decay;
                }
                const px = rx + Math.cos(pt.angle) * (pt.dist * rMax);
                const py = ry + Math.sin(pt.angle) * (pt.dist * rMax);
                const [pr, pg, pb] = pt.secondary ? [sr, sg, sb] : [ar, ag, ab];

                if (pt.glow > 0.25) {
                    ctx.beginPath();
                    ctx.arc(px, py, pt.size * 3.2, 0, TWO_PI);
                    ctx.fillStyle = `rgba(${pr},${pg},${pb},${pt.glow * 0.28})`;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(px, py, pt.size, 0, TWO_PI);
                ctx.fillStyle = pt.glow > 0.08
                    ? `rgba(${pr},${pg},${pb},${0.45 + pt.glow * 0.55})`
                    : 'rgba(255,255,255,0.16)';
                ctx.fill();
            }

            // Minimalist breathing center core orb
            const corePulse = 1 + Math.sin(now * (0.003 + st.energy * 0.005)) * (0.12 + st.energy * 0.18);
            const coreR = 7 * corePulse;
            ctx.beginPath();
            ctx.arc(rx, ry, coreR * 2.2, 0, TWO_PI);
            ctx.fillStyle = `rgba(${ar},${ag},${ab},${0.22 + st.energy * 0.2})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(rx, ry, coreR, 0, TWO_PI);
            ctx.fillStyle = `rgb(${ar},${ag},${ab})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(rx, ry, 2.5, 0, TWO_PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        };

        /**
         * 2. JARVIS: 3D Interactive Stark Hologram Sphere (kept intact!)
         * 64-node 3D Fibonacci neural globe with synaptic links, data packets, and gyro rings.
         */
        const drawJarvisHologram = (now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st) => {
            const spinRate = (reducedMotion ? 0.08 : 0.45) + st.energy * 1.15 + st.velBoost * 1.6;
            st.rotY += dt * spinRate;

            const desiredRotX = st.pointer.active ? -st.pointer.y * 0.65 : 0.22 + Math.sin(now * 0.0007) * 0.12;
            const desiredRotYOffset = st.pointer.active ? st.pointer.x * 0.55 : 0;
            st.rotX += (desiredRotX - st.rotX) * Math.min(1, dt * 6);

            const glowR = radius * (1.35 + st.energy * 0.35);
            const bgGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, glowR);
            bgGrad.addColorStop(0, `rgba(${ar},${ag},${ab},${0.22 + st.energy * 0.18})`);
            bgGrad.addColorStop(0.45, `rgba(${sr},${sg},${sb},${0.08 + st.energy * 0.08})`);
            bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bgGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, TWO_PI);
            ctx.fill();

            // Outer Stark HUD gyroscope rings
            ctx.save();
            ctx.translate(cx, cy);
            for (let ringIdx = 0; ringIdx < 2; ringIdx++) {
                const rr = radius * (ringIdx === 0 ? 1.14 : 0.92);
                const tilt = ringIdx === 0 ? st.rotX * 0.6 + 0.85 : -st.rotX * 0.5 + 0.55;
                const rot = ringIdx === 0 ? now * 0.0004 : -now * 0.0006;
                ctx.save();
                ctx.rotate(rot + desiredRotYOffset * 0.3);
                ctx.scale(1, Math.max(0.22, Math.abs(Math.cos(tilt))));
                ctx.beginPath();
                ctx.arc(0, 0, rr, 0, TWO_PI);
                ctx.strokeStyle = ringIdx === 0
                    ? `rgba(${ar},${ag},${ab},${0.26 + st.energy * 0.2})`
                    : `rgba(${sr},${sg},${sb},${0.2 + st.energy * 0.15})`;
                ctx.lineWidth = 1;
                ctx.setLineDash(ringIdx === 0 ? [8, 6, 2, 6] : [18, 10]);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();

            const cosY = Math.cos(st.rotY + desiredRotYOffset);
            const sinY = Math.sin(st.rotY + desiredRotYOffset);
            const cosX = Math.cos(st.rotX);
            const sinX = Math.sin(st.rotX);
            const fov = 2.6;

            const projected = [];
            for (let i = 0; i < st.jarvisNodes.length; i++) {
                const n = st.jarvisNodes[i];
                const breathe = 1 + Math.sin(now * 0.003 + n.phase) * (0.025 + st.energy * 0.045);
                const bx = n.x * breathe;
                const by = n.y * breathe;
                const bz = n.z * breathe;

                const x1 = bx * cosY - bz * sinY;
                const z1 = bz * cosY + bx * sinY;
                const y2 = by * cosX - z1 * sinX;
                const z2 = z1 * cosX + by * sinX;

                const scale = fov / (fov + z2 + 1.2);
                const sx = cx + x1 * radius * scale * 1.15;
                const sy = cy + y2 * radius * scale * 1.15;

                projected.push({ sx, sy, z: z2, scale, layer: n.layer, size: n.size });
            }

            // Synaptic links
            ctx.lineWidth = 0.85;
            const maxDistSq = (radius * 0.56) ** 2;
            for (let i = 0; i < projected.length; i++) {
                const a = projected[i];
                let links = 0;
                for (let j = i + 1; j < projected.length && links < 3; j++) {
                    const b = projected[j];
                    const dx = a.sx - b.sx;
                    const dy = a.sy - b.sy;
                    const dSq = dx * dx + dy * dy;
                    if (dSq < maxDistSq && Math.abs(a.z - b.z) < 0.65) {
                        links++;
                        const distAlpha = (1 - dSq / maxDistSq) * (0.28 + st.energy * 0.25);
                        const depthFactor = Math.max(0.15, 1 - (a.z + b.z) * 0.25);
                        const alpha = Math.min(0.7, distAlpha * depthFactor);
                        ctx.strokeStyle = (i + j) % 3 === 0
                            ? `rgba(${sr},${sg},${sb},${alpha})`
                            : `rgba(${ar},${ag},${ab},${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(a.sx, a.sy);
                        ctx.lineTo(b.sx, b.sy);
                        ctx.stroke();
                    }
                }
            }

            // Travelling data pulses
            if (!reducedMotion && Math.random() < (0.06 + st.energy * 0.22) && st.jarvisPulses.length < 14) {
                const from = Math.floor(Math.random() * JARVIS_NODE_COUNT);
                const to = (from + 1 + Math.floor(Math.random() * 8)) % JARVIS_NODE_COUNT;
                st.jarvisPulses.push({ from, to, p: 0, speed: 1.4 + st.energy * 1.4 + Math.random() * 0.8 });
            }
            for (let i = st.jarvisPulses.length - 1; i >= 0; i--) {
                const pulse = st.jarvisPulses[i];
                pulse.p += dt * pulse.speed;
                if (pulse.p >= 1) {
                    st.jarvisPulses.splice(i, 1);
                    continue;
                }
                const pa = projected[pulse.from];
                const pb = projected[pulse.to];
                if (pa && pb) {
                    const x = pa.sx + (pb.sx - pa.sx) * pulse.p;
                    const y = pa.sy + (pb.sy - pa.sy) * pulse.p;
                    ctx.beginPath();
                    ctx.arc(x, y, 2.2, 0, TWO_PI);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, TWO_PI);
                    ctx.fillStyle = `rgba(${ar},${ag},${ab},0.45)`;
                    ctx.fill();
                }
            }

            // Depth-sorted 3D nodes
            const sorted = [...projected].sort((a, b) => b.z - a.z);
            for (const pt of sorted) {
                const depthAlpha = Math.max(0.2, Math.min(1, 0.65 - pt.z * 0.35));
                const r = pt.size * pt.scale * (1 + st.energy * 0.2);
                const isCore = pt.layer === 'core';
                const [cr, cg, cb] = isCore ? [sr, sg, sb] : [ar, ag, ab];

                if (depthAlpha > 0.45) {
                    ctx.beginPath();
                    ctx.arc(pt.sx, pt.sy, r * 2.6, 0, TWO_PI);
                    ctx.fillStyle = `rgba(${cr},${cg},${cb},${depthAlpha * 0.22})`;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(pt.sx, pt.sy, r, 0, TWO_PI);
                ctx.fillStyle = isCore && st.energy > 0.3 ? '#ffffff' : `rgba(${cr},${cg},${cb},${depthAlpha})`;
                ctx.fill();
            }
        };

        /**
         * 3. OPTIMUS PRIME: Cybertronian Matrix of Leadership & Mechanical Gear Iris
         * Articulated left/right Matrix handles that open with energy, notched Cybertronian
         * mechanical gear wheel, anamorphic lens flare, and a faceted Energon crystal core.
         */
        const drawOptimusMatrix = (now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st) => {
            const ox = st.pointer.active ? st.pointer.x * 5 : 0;
            const oy = st.pointer.active ? st.pointer.y * 5 : 0;
            const mx = cx + ox;
            const my = cy + oy;
            const gearRot = now * (0.00035 + st.energy * 0.0006);

            // Radiant Energon aura (Blue core -> Crimson outer ring)
            const aura = ctx.createRadialGradient(mx, my, 2, mx, my, radius * 1.45);
            aura.addColorStop(0, `rgba(255,255,255,${0.35 + st.energy * 0.25})`);
            aura.addColorStop(0.28, `rgba(${ar},${ag},${ab},${0.32 + st.energy * 0.2})`);
            aura.addColorStop(0.65, `rgba(${sr},${sg},${sb},${0.12 + st.energy * 0.1})`);
            aura.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = aura;
            ctx.beginPath();
            ctx.arc(mx, my, radius * 1.45, 0, TWO_PI);
            ctx.fill();

            // Outer Cybertronian 16-Tooth Mechanical Gear Ring
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(gearRot);
            const teeth = 16;
            const outerR = radius * 1.02;
            const innerR = radius * 0.88;
            ctx.beginPath();
            for (let i = 0; i < teeth; i++) {
                const a1 = (i / teeth) * TWO_PI;
                const a2 = ((i + 0.35) / teeth) * TWO_PI;
                const a3 = ((i + 0.5) / teeth) * TWO_PI;
                const a4 = ((i + 0.85) / teeth) * TWO_PI;
                ctx.lineTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
                ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
                ctx.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR);
                ctx.lineTo(Math.cos(a4) * innerR, Math.sin(a4) * innerR);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},${0.42 + st.energy * 0.25})`;
            ctx.lineWidth = 1.25;
            ctx.stroke();
            ctx.restore();

            // Counter-rotating Crimson Autobot Crest Octagon
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(-gearRot * 1.4);
            const octR = radius * 0.72;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * TWO_PI;
                const x = Math.cos(a) * octR;
                const y = Math.sin(a) * octR;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(${sr},${sg},${sb},${0.5 + st.energy * 0.3})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();

            // Articulated Matrix Handles (Left & Right mechanical brackets that slide outward)
            const openOffset = (st.pointer.active ? 5 : 0) + st.energy * 9 + st.velBoost * 5 + Math.sin(now * 0.0025) * 2;
            for (const side of [-1, 1]) {
                ctx.save();
                ctx.translate(mx + side * (radius * 0.62 + openOffset), my);
                ctx.scale(side, 1);

                // Outer mechanical handle bracket
                ctx.beginPath();
                ctx.moveTo(0, -radius * 0.52);
                ctx.lineTo(radius * 0.26, -radius * 0.34);
                ctx.lineTo(radius * 0.34, -radius * 0.14);
                ctx.lineTo(radius * 0.18, -radius * 0.14);
                ctx.lineTo(radius * 0.18, radius * 0.14);
                ctx.lineTo(radius * 0.34, radius * 0.14);
                ctx.lineTo(radius * 0.26, radius * 0.34);
                ctx.lineTo(0, radius * 0.52);
                ctx.closePath();
                ctx.fillStyle = `rgba(${ar},${ag},${ab},0.16)`;
                ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.85)`;
                ctx.lineWidth = 1.5;
                ctx.fill();
                ctx.stroke();

                // Crimson Energon conduit slot inside handle
                ctx.beginPath();
                ctx.moveTo(radius * 0.08, -radius * 0.3);
                ctx.lineTo(radius * 0.08, radius * 0.3);
                ctx.strokeStyle = `rgba(${sr},${sg},${sb},0.85)`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }

            // Horizontal Anamorphic Matrix Lens Flare
            const flareW = radius * (1.35 + st.energy * 0.45 + st.velBoost * 0.3);
            const flareGrad = ctx.createLinearGradient(mx - flareW, my, mx + flareW, my);
            flareGrad.addColorStop(0, 'rgba(59,130,246,0)');
            flareGrad.addColorStop(0.35, `rgba(${ar},${ag},${ab},${0.45 + st.energy * 0.3})`);
            flareGrad.addColorStop(0.5, 'rgba(255,255,255,0.95)');
            flareGrad.addColorStop(0.65, `rgba(${ar},${ag},${ab},${0.45 + st.energy * 0.3})`);
            flareGrad.addColorStop(1, 'rgba(59,130,246,0)');
            ctx.fillStyle = flareGrad;
            ctx.beginPath();
            ctx.ellipse(mx, my, flareW, 2.5 + st.energy * 2, 0, 0, TWO_PI);
            ctx.fill();

            // Central Faceted Crystal Core of the Matrix
            const coreR = radius * (0.42 + Math.sin(now * 0.004) * 0.03 + st.energy * 0.06);
            ctx.save();
            ctx.translate(mx, my);
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * TWO_PI + Math.PI / 8;
                const r = i % 2 === 0 ? coreR : coreR * 0.78;
                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            const crystalGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, coreR);
            crystalGrad.addColorStop(0, '#ffffff');
            crystalGrad.addColorStop(0.45, '#60A5FA');
            crystalGrad.addColorStop(0.85, `rgb(${ar},${ag},${ab})`);
            crystalGrad.addColorStop(1, `rgb(${sr},${sg},${sb})`);
            ctx.fillStyle = crystalGrad;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Facet internal lattice lines
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * Math.PI;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * coreR * 0.78, Math.sin(a) * coreR * 0.78);
                ctx.lineTo(-Math.cos(a) * coreR * 0.78, -Math.sin(a) * coreR * 0.78);
                ctx.stroke();
            }
            ctx.restore();
        };

        /**
         * 4. MEGATRON: Dark Energon Singularity & Jagged High-Voltage Lightning Core
         * Sharp angular Decepticon chevron war-blades, a pitch-black void singularity core,
         * and procedural jagged purple/magenta lightning bolts arcing to the outer cage.
         */
        const drawMegatronSingularity = (now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st) => {
            const ox = st.pointer.active ? st.pointer.x * 6 : 0;
            const oy = st.pointer.active ? st.pointer.y * 6 : 0;
            const mx = cx + ox;
            const my = cy + oy;
            const spin = now * (0.0006 + st.energy * 0.0012 + st.velBoost * 0.001);

            // Dark Energon abyssal corona
            const corona = ctx.createRadialGradient(mx, my, radius * 0.12, mx, my, radius * 1.4);
            corona.addColorStop(0, '#05020a');
            corona.addColorStop(0.22, `rgba(${ar},${ag},${ab},${0.48 + st.energy * 0.25})`);
            corona.addColorStop(0.55, `rgba(${sr},${sg},${sb},${0.2 + st.energy * 0.15})`);
            corona.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = corona;
            ctx.beginPath();
            ctx.arc(mx, my, radius * 1.4, 0, TWO_PI);
            ctx.fill();

            // Outer Angular Decepticon 6-Point Star / War Cage
            const vertices = [];
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(spin);
            ctx.beginPath();
            const spikes = 6;
            for (let i = 0; i < spikes * 2; i++) {
                const a = (i / (spikes * 2)) * TWO_PI - Math.PI / 2;
                const r = i % 2 === 0 ? radius * 1.08 : radius * 0.62;
                const vx = Math.cos(a) * r;
                const vy = Math.sin(a) * r;
                if (i % 2 === 0) {
                    // Store world-space outer spike vertices for lightning targets
                    const cosS = Math.cos(spin);
                    const sinS = Math.sin(spin);
                    vertices.push({
                        x: mx + (vx * cosS - vy * sinS),
                        y: my + (vy * cosS + vx * sinS),
                    });
                }
                if (i === 0) ctx.moveTo(vx, vy);
                else ctx.lineTo(vx, vy);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},${0.65 + st.energy * 0.3})`;
            ctx.fillStyle = `rgba(${ar},${ag},${ab},0.07)`;
            ctx.lineWidth = 1.4;
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Counter-spinning razor triangles (Decepticon insignia motif)
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(-spin * 1.35);
            for (let t = 0; t < 2; t++) {
                ctx.rotate(Math.PI);
                ctx.beginPath();
                const tr = radius * 0.82;
                ctx.moveTo(0, -tr);
                ctx.lineTo(tr * 0.75, tr * 0.55);
                ctx.lineTo(0, tr * 0.22);
                ctx.lineTo(-tr * 0.75, tr * 0.55);
                ctx.closePath();
                ctx.strokeStyle = t === 0
                    ? `rgba(${sr},${sg},${sb},0.65)`
                    : `rgba(${ar},${ag},${ab},0.45)`;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
            ctx.restore();

            // Procedural Jagged Dark Energon Lightning Arcs (Core -> Outer Spikes / Cursor)
            const boltTargets = [...vertices];
            if (st.pointer.active) {
                boltTargets.push({ x: st.pointer.rawX, y: st.pointer.rawY, isCursor: true });
            }
            const activeBoltCount = reducedMotion ? 2 : (st.isGenerating ? 6 : 4);
            for (let b = 0; b < activeBoltCount; b++) {
                const target = boltTargets[(b + Math.floor(now / 70)) % boltTargets.length];
                if (!target) continue;

                const segments = 6;
                ctx.beginPath();
                ctx.moveTo(mx, my);
                for (let s = 1; s < segments; s++) {
                    const frac = s / segments;
                    const bx = mx + (target.x - mx) * frac;
                    const by = my + (target.y - my) * frac;
                    const jitter = (1 - Math.abs(frac - 0.5) * 2) * (12 + st.energy * 10);
                    const jx = bx + (Math.random() - 0.5) * jitter * 2;
                    const jy = by + (Math.random() - 0.5) * jitter * 2;
                    ctx.lineTo(jx, jy);
                }
                ctx.lineTo(target.x, target.y);

                // Outer magenta/purple plasma glow
                ctx.strokeStyle = b % 2 === 0
                    ? `rgba(${sr},${sg},${sb},0.85)`
                    : `rgba(${ar},${ag},${ab},0.85)`;
                ctx.lineWidth = 2.2;
                ctx.stroke();

                // White-hot lightning core
                ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                ctx.lineWidth = 0.9;
                ctx.stroke();
            }

            // Singularity Black Hole Core with Crimson/Violet Accretion Diamond
            const coreR = radius * (0.28 + Math.sin(now * 0.008) * 0.03 + st.energy * 0.05);
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = '#05010a';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.rect(-coreR, -coreR, coreR * 2, coreR * 2);
            ctx.fill();
            ctx.stroke();

            // Inner glowing Dark Energon pupil
            ctx.fillStyle = `rgb(${sr},${sg},${sb})`;
            ctx.beginPath();
            ctx.rect(-coreR * 0.42, -coreR * 0.42, coreR * 0.84, coreR * 0.84);
            ctx.fill();
            ctx.restore();
        };

        const draw = (now) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            const st = stateRef.current;
            const pCfg = PERSONA_CONFIGS[st.persona] || PERSONA_CONFIGS.ashwin;

            // Resolve live colors (supports theme palette switching for 'ashwin')
            const styles = getComputedStyle(canvas);
            const rawAccent = pCfg.accentHex || styles.getPropertyValue('--accent') || '#00ff87';
            const rawSecondary = pCfg.secondaryHex || styles.getPropertyValue('--accent-2') || '#38bdf8';
            const [ar, ag, ab] = parseRGB(rawAccent, [0, 255, 135]);
            const [sr, sg, sb] = parseRGB(rawSecondary, [56, 189, 248]);

            const targetEnergy = st.isGenerating ? 1.0 : 0.0;
            st.energy += (targetEnergy - st.energy) * Math.min(1, dt * 4.5);
            st.velBoost = Math.max(0, st.velBoost - dt * 1.4);

            ctx.clearRect(0, 0, w, h);

            const cx = w * 0.5;
            const cy = h * 0.45;
            const radius = Math.min(w, h) * 0.34;

            // Dispatch to the persona-specific visualizer engine
            if (st.persona === 'jarvis') {
                drawJarvisHologram(now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st);
            } else if (st.persona === 'optimus') {
                drawOptimusMatrix(now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st);
            } else if (st.persona === 'megatron') {
                drawMegatronSingularity(now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st);
            } else {
                drawAshwinLidar(now, dt, cx, cy, radius, ar, ag, ab, sr, sg, sb, st);
            }

            // Shared Expanding Shockwaves (on persona switch or click)
            for (let i = st.shockwaves.length - 1; i >= 0; i--) {
                const sw = st.shockwaves[i];
                sw.r += dt * sw.speed;
                sw.alpha -= dt * 0.75;
                if (sw.alpha <= 0) {
                    st.shockwaves.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(cx, cy, sw.r * radius * 1.35, 0, TWO_PI);
                ctx.strokeStyle = `rgba(${ar},${ag},${ab},${sw.alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Bottom 24-band mirrored frequency spectrum analyzer
            const barCount = 24;
            const barGap = 3;
            const barWidth = 2.5;
            const totalW = barCount * (barWidth + barGap) - barGap;
            const startX = cx - totalW / 2;
            const baseY = h - 26;

            for (let b = 0; b < barCount; b++) {
                const centerDist = Math.abs(b - (barCount - 1) / 2) / (barCount / 2);
                const env = Math.max(0.15, 1 - centerDist * 0.75);
                const wave = Math.sin(now * (0.004 + st.energy * 0.008) + b * 0.45) * 0.5 + 0.5;
                const harmonic = Math.cos(now * 0.007 - b * 0.7) * 0.5 + 0.5;
                const amp = (2.5 + (wave * 0.65 + harmonic * 0.35) * (4 + st.energy * 14 + st.velBoost * 5)) * env;
                const bx = startX + b * (barWidth + barGap);

                ctx.fillStyle = b % 3 === 0
                    ? `rgba(${sr},${sg},${sb},${0.45 + st.energy * 0.45})`
                    : `rgba(${ar},${ag},${ab},${0.45 + st.energy * 0.45})`;
                ctx.beginPath();
                ctx.roundRect(bx, baseY - amp / 2, barWidth, amp, 1.5);
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
            if (raf !== null) {
                cancelAnimationFrame(raf);
                raf = null;
            }
        };

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting && !document.hidden;
            visible ? start() : stop();
        });
        observer.observe(canvas);

        resize();
        window.addEventListener('resize', resize);
        start();

        return () => {
            stop();
            observer.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={handlePulseClick}
            title="Interactive Core — Move cursor or click to trigger energy pulse"
            className="w-full h-52 rounded-2xl relative overflow-hidden bg-surface-2/60 border border-rule hover:border-accent/50 backdrop-blur-md flex flex-col items-center justify-between p-3 select-none transition-colors duration-500 cursor-crosshair group"
        >
            {/* Subtle Cyber Grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage:
                        'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                }}
            />

            {/* Top HUD Telemetry Bar */}
            <div className="relative z-10 w-full flex items-center justify-between text-[9px] font-mono text-ink-dim/70 leading-none pointer-events-none">
                <span>┌ [{config.cornerPrefix} // {config.topologyLabel}]</span>
                <span className="group-hover:text-accent transition-colors">
                    {hudReadout} ┐
                </span>
            </div>

            {/* 60fps Persona-Dedicated Visualizer Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
            />

            {/* Bottom Status & Telemetry Footer */}
            <div className="relative z-10 w-full flex items-center justify-between text-[9px] font-mono text-ink-dim/70 leading-none pointer-events-none mt-auto">
                <span>└ {config.footerLeft}</span>
                <div className="flex items-center gap-1.5">
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{
                            background: config.accentHex || 'var(--accent)',
                            boxShadow: `0 0 6px ${config.accentHex || 'var(--accent)'}`,
                        }}
                    />
                    <span className="text-[10px] tracking-wider font-semibold text-ink-muted uppercase">
                        {isGenerating ? config.generatingText : config.idleText}
                    </span>
                </div>
                <span>{isGenerating ? 'STREAM' : '60Hz'} ┘</span>
            </div>
        </div>
    );
};

export default AIAssistantVisual;
