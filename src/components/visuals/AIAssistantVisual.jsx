import React, { useEffect, useRef, useState, useCallback } from 'react';

const PERSONA_CONFIGS = {
    jarvis: {
        title: 'STARK // J.A.R.V.I.S. OS',
        subtitle: 'Arc Reactor Core • Active',
        generatingText: 'Synthesizing Stark Diagnostics...',
        idleText: 'Arc Reactor Online • Ready',
        accentHex: '#F59E0B',
        secondaryHex: '#38BDF8',
        cornerPrefix: 'STARK-OS',
        topologyLabel: 'ARC-GYRO // 85',
    },
    optimus: {
        title: 'AUTOBOT // TELETRAN-1',
        subtitle: 'Matrix of Leadership • Active',
        generatingText: 'Analyzing Cybertronian Data...',
        idleText: 'Energon Matrix Online • Ready',
        accentHex: '#3B82F6',
        secondaryHex: '#EF4444',
        cornerPrefix: 'AUTOBOT',
        topologyLabel: 'MATRIX // PRIME',
    },
    megatron: {
        title: 'DECEPTICON // WAR MATRIX',
        subtitle: 'Dark Energon Core • Primed',
        generatingText: 'Commanding Technical Dominance...',
        idleText: 'Dark Energon Online • Primed',
        accentHex: '#A855F7',
        secondaryHex: '#EC4899',
        cornerPrefix: 'DECEPTICON',
        topologyLabel: 'TESSERACT // WAR',
    },
    ashwin: {
        title: 'NEURAL LABS // ASHWIN',
        subtitle: 'Autonomous AI Synapse • Ready',
        generatingText: 'Neural Inference Streaming...',
        idleText: 'Neural Core Online • Standby',
        accentHex: null, // resolved live from CSS --accent
        secondaryHex: null, // resolved live from CSS --accent-2
        cornerPrefix: 'NEURAL-AI',
        topologyLabel: 'SYNAPSE // 3D',
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

const NODE_COUNT = 64;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Computes the target 3D coordinates (in range roughly [-1, 1]) for each node
 * based on the active persona so switching personas morphs the 3D structure smoothly.
 */
function computePersonaTargets(personaId) {
    const targets = [];

    for (let i = 0; i < NODE_COUNT; i++) {
        const t = i / NODE_COUNT;

        if (personaId === 'jarvis') {
            // Stark Arc Reactor: outer containment torus + inner inverted triangular prism core
            if (i < 28) {
                const a = (i / 28) * Math.PI * 2;
                const ringOffset = (i % 2 === 0 ? 1.0 : 0.86);
                targets.push({
                    x: Math.cos(a) * ringOffset,
                    y: Math.sin(a) * ringOffset,
                    z: (i % 2 === 0 ? 0.14 : -0.14),
                    layer: 'outer',
                });
            } else if (i < 48) {
                // Tilted gyro ring
                const a = ((i - 28) / 20) * Math.PI * 2;
                const r = 0.64;
                targets.push({
                    x: Math.cos(a) * r,
                    y: Math.sin(a) * r * Math.cos(0.9),
                    z: Math.sin(a) * r * Math.sin(0.9),
                    layer: 'mid',
                });
            } else {
                // Triangular Arc Reactor core vertices & edges
                const k = i - 48; // 0..15
                const edge = k % 3;
                const s = (Math.floor(k / 3) / 5);
                const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
                const a1 = angles[edge];
                const a2 = angles[(edge + 1) % 3];
                const r = 0.38;
                const x = (Math.cos(a1) * (1 - s) + Math.cos(a2) * s) * r;
                const y = (Math.sin(a1) * (1 - s) + Math.sin(a2) * s) * r;
                const z = ((k % 2 === 0 ? 1 : -1) * 0.12);
                targets.push({ x, y, z, layer: 'core' });
            }
        } else if (personaId === 'optimus') {
            // Matrix of Leadership: central crystal icosahedron + dual lateral containment handles
            if (i < 32) {
                // Crystal sphere/icosahedron core
                const y = 1 - (i / 31) * 2;
                const rad = Math.sqrt(Math.max(0, 1 - y * y));
                const theta = GOLDEN_ANGLE * i;
                const r = 0.52;
                targets.push({
                    x: Math.cos(theta) * rad * r,
                    y: y * r,
                    z: Math.sin(theta) * rad * r,
                    layer: 'core',
                });
            } else if (i < 48) {
                // Left & right Cybertronian Matrix handles / fins
                const k = i - 32; // 0..15
                const side = k < 8 ? -1 : 1;
                const idx = k % 8;
                const spread = (idx / 7 - 0.5) * 1.1;
                targets.push({
                    x: side * (0.78 + 0.18 * Math.cos(spread * 2)),
                    y: spread * 0.85,
                    z: Math.sin(spread * 3) * 0.22,
                    layer: 'outer',
                });
            } else {
                // Equatorial energy ring
                const a = ((i - 48) / 16) * Math.PI * 2;
                targets.push({
                    x: Math.cos(a) * 0.95,
                    y: Math.sin(a) * 0.22,
                    z: Math.sin(a) * 0.95,
                    layer: 'mid',
                });
            }
        } else if (personaId === 'megatron') {
            // Decepticon Dark Energon Hyper-Octahedron / Tesseract lattice
            if (i < 24) {
                // Outer octahedron / diamond edges
                const edges = [
                    [0, 1.05, 0], [1.0, 0, 0], [0, -1.05, 0], [-1.0, 0, 0],
                    [0, 0, 1.0], [0, 0, -1.0],
                ];
                const pairs = [
                    [0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 4], [1, 4], [2, 4], [3, 4],
                    [0, 5], [1, 5], [2, 5], [3, 5],
                ];
                const pair = pairs[i % pairs.length];
                const frac = (Math.floor(i / pairs.length) + 0.35) / 2;
                const p1 = edges[pair[0]];
                const p2 = edges[pair[1]];
                targets.push({
                    x: p1[0] + (p2[0] - p1[0]) * frac,
                    y: p1[1] + (p2[1] - p1[1]) * frac,
                    z: p1[2] + (p2[2] - p1[2]) * frac,
                    layer: 'outer',
                });
            } else if (i < 48) {
                // Inner rotated cube (tesseract inner cell)
                const k = i - 24; // 0..23
                const corner = k % 8;
                const scale = 0.42 + (Math.floor(k / 8) * 0.14);
                targets.push({
                    x: ((corner & 1) ? 1 : -1) * scale,
                    y: ((corner & 2) ? 1 : -1) * scale,
                    z: ((corner & 4) ? 1 : -1) * scale,
                    layer: 'mid',
                });
            } else {
                // Dense dark-energon singularity core
                const a = (i - 48) * GOLDEN_ANGLE;
                const r = 0.22;
                targets.push({
                    x: Math.cos(a) * r,
                    y: (((i - 48) / 16) - 0.5) * 0.4,
                    z: Math.sin(a) * r,
                    layer: 'core',
                });
            }
        } else {
            // Ashwin: 3D Fibonacci Neural Synapse Cortex + Sensor Fusion Orbital Ring
            if (i < 46) {
                const y = 1 - (i / 45) * 2;
                const rad = Math.sqrt(Math.max(0, 1 - y * y));
                const theta = GOLDEN_ANGLE * i;
                const r = i % 5 === 0 ? 0.42 : 0.82;
                targets.push({
                    x: Math.cos(theta) * rad * r,
                    y: y * r,
                    z: Math.sin(theta) * rad * r,
                    layer: i % 5 === 0 ? 'core' : 'mid',
                });
            } else {
                // Tilted LiDAR/Sensor orbital ring
                const a = ((i - 46) / 18) * Math.PI * 2;
                const r = 1.04;
                targets.push({
                    x: Math.cos(a) * r,
                    y: Math.sin(a) * r * 0.38,
                    z: Math.sin(a) * r * 0.92,
                    layer: 'outer',
                });
            }
        }
    }

    return targets;
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
        velBoost: 0,
        energy: 0,
        nodes: [],
        pulses: [],
        shockwaves: [],
        morphFlash: 0,
    });

    const [tiltReadout, setTiltReadout] = useState('00° / 00°');

    // Sync props into mutable ref for the 60fps loop
    useEffect(() => {
        const st = stateRef.current;
        if (st.persona !== persona) {
            st.persona = persona;
            const newTargets = computePersonaTargets(persona);
            st.nodes.forEach((n, idx) => {
                if (newTargets[idx]) {
                    n.tx = newTargets[idx].x;
                    n.ty = newTargets[idx].y;
                    n.tz = newTargets[idx].z;
                    n.layer = newTargets[idx].layer;
                }
            });
            st.morphFlash = 1.0;
            st.velBoost = Math.max(st.velBoost, 1.4);
            st.shockwaves.push({ r: 0.05, alpha: 0.9, speed: 1.8 });
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
        const pitch = Math.round(-ny * 28);
        const yaw = Math.round(nx * 28);
        setTiltReadout(`${pitch >= 0 ? '+' : ''}${pitch}° / ${yaw >= 0 ? '+' : ''}${yaw}°`);
    }, []);

    const handlePointerLeave = useCallback(() => {
        stateRef.current.pointer.active = false;
        setTiltReadout('00° / 00°');
    }, []);

    const handlePulseClick = useCallback(() => {
        const st = stateRef.current;
        st.velBoost = Math.min(2.5, st.velBoost + 1.3);
        st.morphFlash = 0.85;
        st.shockwaves.push({ r: 0.04, alpha: 1.0, speed: 2.1 });
        // Spawn a burst of synaptic data packets
        for (let k = 0; k < 6; k++) {
            const a = Math.floor(Math.random() * NODE_COUNT);
            const b = (a + 1 + Math.floor(Math.random() * 12)) % NODE_COUNT;
            st.pulses.push({ from: a, to: b, p: 0, speed: 1.8 + Math.random() * 1.4 });
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Initialize 3D nodes
        const initialTargets = computePersonaTargets(stateRef.current.persona);
        stateRef.current.nodes = initialTargets.map((t, idx) => ({
            x: t.x,
            y: t.y,
            z: t.z,
            tx: t.x,
            ty: t.y,
            tz: t.z,
            layer: t.layer,
            phase: idx * 0.37,
            size: t.layer === 'core' ? 2.4 : t.layer === 'mid' ? 1.8 : 1.4,
        }));

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

            // Smooth state transitions
            const targetEnergy = st.isGenerating ? 1.0 : 0.0;
            st.energy += (targetEnergy - st.energy) * Math.min(1, dt * 4.5);
            st.velBoost = Math.max(0, st.velBoost - dt * 1.4);
            st.morphFlash = Math.max(0, st.morphFlash - dt * 2.2);

            const spinRate = (reducedMotion ? 0.08 : 0.45) + st.energy * 1.15 + st.velBoost * 1.6;
            st.rotY += dt * spinRate;

            const desiredRotX = st.pointer.active ? -st.pointer.y * 0.65 : 0.22 + Math.sin(now * 0.0007) * 0.12;
            const desiredRotYOffset = st.pointer.active ? st.pointer.x * 0.55 : 0;
            st.rotX += (desiredRotX - st.rotX) * Math.min(1, dt * 6);

            ctx.clearRect(0, 0, w, h);

            const cx = w * 0.5;
            const cy = h * 0.45;
            const radius = Math.min(w, h) * 0.34;

            // 1. Background radial core glow
            const glowR = radius * (1.35 + st.energy * 0.35 + st.morphFlash * 0.25);
            const bgGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, glowR);
            bgGrad.addColorStop(0, `rgba(${ar},${ag},${ab},${0.22 + st.energy * 0.18 + st.morphFlash * 0.2})`);
            bgGrad.addColorStop(0.45, `rgba(${sr},${sg},${sb},${0.08 + st.energy * 0.08})`);
            bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bgGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fill();

            // 2. Outer HUD gyroscope rings (tilted in 3D)
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
                ctx.arc(0, 0, rr, 0, Math.PI * 2);
                ctx.strokeStyle = ringIdx === 0
                    ? `rgba(${ar},${ag},${ab},${0.22 + st.energy * 0.2})`
                    : `rgba(${sr},${sg},${sb},${0.18 + st.energy * 0.15})`;
                ctx.lineWidth = 1;
                ctx.setLineDash(ringIdx === 0 ? [8, 6, 2, 6] : [18, 10]);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();

            // 3. Interpolate 3D nodes toward active persona targets & project to 2D
            const cosY = Math.cos(st.rotY + desiredRotYOffset);
            const sinY = Math.sin(st.rotY + desiredRotYOffset);
            const cosX = Math.cos(st.rotX);
            const sinX = Math.sin(st.rotX);
            const fov = 2.6;

            const projected = [];
            for (let i = 0; i < st.nodes.length; i++) {
                const n = st.nodes[i];
                // Morph lerp
                const lerpRate = Math.min(1, dt * 6.5);
                n.x += (n.tx - n.x) * lerpRate;
                n.y += (n.ty - n.y) * lerpRate;
                n.z += (n.tz - n.z) * lerpRate;

                // Subtle breathing oscillation
                const breathe = 1 + Math.sin(now * 0.003 + n.phase) * (0.025 + st.energy * 0.045);
                const bx = n.x * breathe;
                const by = n.y * breathe;
                const bz = n.z * breathe;

                // Rotate Y then X
                const x1 = bx * cosY - bz * sinY;
                const z1 = bz * cosY + bx * sinY;
                const y2 = by * cosX - z1 * sinX;
                const z2 = z1 * cosX + by * sinX;

                const scale = fov / (fov + z2 + 1.2);
                const sx = cx + x1 * radius * scale * 1.15;
                const sy = cy + y2 * radius * scale * 1.15;

                projected.push({
                    idx: i,
                    sx,
                    sy,
                    z: z2,
                    scale,
                    layer: n.layer,
                    size: n.size,
                });
            }

            // 4. Synaptic edges between nearby 3D nodes
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
                        const depthFactor = Math.max(0.15, (1 - (a.z + b.z) * 0.25));
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

            // 5. Interactive cursor tether lines when hovering
            if (st.pointer.active) {
                const px = st.pointer.rawX;
                const py = st.pointer.rawY;
                const tetherRadiusSq = (radius * 0.95) ** 2;
                ctx.lineWidth = 0.9;
                for (let i = 0; i < projected.length; i++) {
                    const p = projected[i];
                    const dx = p.sx - px;
                    const dy = p.sy - py;
                    const dSq = dx * dx + dy * dy;
                    if (dSq < tetherRadiusSq) {
                        const a = (1 - dSq / tetherRadiusSq) * 0.45;
                        ctx.strokeStyle = `rgba(${sr},${sg},${sb},${a})`;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(p.sx, p.sy);
                        ctx.stroke();
                    }
                }
                // Subtle HUD reticle at pointer
                ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.45)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.stroke();
            }

            // 6. Spawn & advance travelling synaptic data pulses
            const spawnChance = (0.06 + st.energy * 0.22);
            if (!reducedMotion && Math.random() < spawnChance && st.pulses.length < 14) {
                const from = Math.floor(Math.random() * NODE_COUNT);
                const to = (from + 1 + Math.floor(Math.random() * 8)) % NODE_COUNT;
                st.pulses.push({
                    from,
                    to,
                    p: 0,
                    speed: 1.4 + st.energy * 1.4 + Math.random() * 0.8,
                });
            }

            for (let i = st.pulses.length - 1; i >= 0; i--) {
                const pulse = st.pulses[i];
                pulse.p += dt * pulse.speed;
                if (pulse.p >= 1) {
                    st.pulses.splice(i, 1);
                    continue;
                }
                const pa = projected[pulse.from];
                const pb = projected[pulse.to];
                if (pa && pb) {
                    const x = pa.sx + (pb.sx - pa.sx) * pulse.p;
                    const y = pa.sy + (pb.sy - pa.sy) * pulse.p;
                    ctx.beginPath();
                    ctx.arc(x, y, 2.3, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${ar},${ag},${ab},0.45)`;
                    ctx.fill();
                }
            }

            // 7. Sort nodes back-to-front by z and render 3D hologram nodes
            const sorted = [...projected].sort((a, b) => b.z - a.z);
            for (const pt of sorted) {
                const depthAlpha = Math.max(0.2, Math.min(1, 0.65 - pt.z * 0.35));
                const r = pt.size * pt.scale * (1 + st.energy * 0.2);
                const isCore = pt.layer === 'core';
                const [cr, cg, cb] = isCore ? [sr, sg, sb] : [ar, ag, ab];

                // Outer node halo
                if (depthAlpha > 0.45) {
                    ctx.beginPath();
                    ctx.arc(pt.sx, pt.sy, r * 2.6, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${cr},${cg},${cb},${depthAlpha * 0.22})`;
                    ctx.fill();
                }

                // Node core
                ctx.beginPath();
                ctx.arc(pt.sx, pt.sy, r, 0, Math.PI * 2);
                ctx.fillStyle = isCore && st.energy > 0.3
                    ? '#ffffff'
                    : `rgba(${cr},${cg},${cb},${depthAlpha})`;
                ctx.fill();
            }

            // 8. Expanding shockwave rings (on persona switch, click, or active generation)
            if (!reducedMotion && st.isGenerating && st.shockwaves.length === 0 && Math.random() < 0.04) {
                st.shockwaves.push({ r: 0.1, alpha: 0.65, speed: 1.1 });
            }
            for (let i = st.shockwaves.length - 1; i >= 0; i--) {
                const sw = st.shockwaves[i];
                sw.r += dt * sw.speed;
                sw.alpha -= dt * 0.75;
                if (sw.alpha <= 0) {
                    st.shockwaves.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(cx, cy, sw.r * radius * 1.35, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${ar},${ag},${ab},${sw.alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // 9. Bottom 24-band mirrored frequency spectrum analyzer
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
            title="Interactive 3D Neural Core — Move cursor to tilt, click to fire synaptic pulse"
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
                    TILT {tiltReadout} ┐
                </span>
            </div>

            {/* 60fps 3D Hologram Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
            />

            {/* Bottom Status & Telemetry Footer */}
            <div className="relative z-10 w-full flex items-center justify-between text-[9px] font-mono text-ink-dim/70 leading-none pointer-events-none mt-auto">
                <span>└ {NODE_COUNT} NODES</span>
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
