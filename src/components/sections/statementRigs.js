/**
 * Scroll rigs for the three guide robots on the statement stage.
 *
 * Each rig finds the parts a visual already has (the same groups its guide
 * enter/exit CSS animates) and poses them for a scroll progress p. Poses are
 * written straight onto those elements as inline transform/opacity rather
 * than through custom properties on a wrapper: a custom property inherits, so
 * changing one restyles every node in the svg each frame, while transform and
 * opacity restyle only the element they are set on.
 *
 * Transform origins and boxes live in statementStage.css.
 */
import { transform } from 'framer-motion';

const unit = (from, to) => transform([from, to], [0, 1]);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const n = (x) => +x.toFixed(3);

/** Reads one of the numeric custom properties a part carries inline. */
const prop = (el, name, fallback) => {
    const v = parseFloat(el.style.getPropertyValue(name));
    return Number.isNaN(v) ? fallback : v;
};

/* ------------------------------------------------------------- Optimus --- */
/* p 0–0.28: the layers assemble. Each reuses its guide offset (--dx/--dy,
   --s) and stagger (--i), starting (1.4 + 0.3i)× that offset away — about
   60–120px on a desktop stage — and settling in order. p 0.24–0.34: optics. */
const optimusAssembly = unit(0, 0.28);
const optimusOptics = unit(0.24, 0.34);

const optimus = {
    collect: (root) => ({
        parts: [...root.querySelectorAll('.vg-opt-part')].map((el) => ({
            el,
            i: prop(el, '--i', 0),
            dx: prop(el, '--dx', 0),
            dy: prop(el, '--dy', 0),
            s: prop(el, '--s', 1),
        })),
        optics: root.querySelector('.vg-opt-optics'),
        aura: root.querySelector('.vg-optimus-aura'),
        ring: root.querySelector('.vg-optimus-ring'),
    }),
    pose: (p, { parts, optics, aura, ring }, write) => {
        const asm = optimusAssembly(p);
        for (const { el, i, dx, dy, s } of parts) {
            const t = clamp01((asm - i * 0.07) / 0.58);
            const k = (1.4 + i * 0.3) * (1 - t);
            write(el, 'transform', `translate(${n(dx * k)}px, ${n(dy * k)}px) scale(${n(1 - (1 - s) * 3 * (1 - t))})`);
            write(el, 'opacity', n(0.25 + 0.75 * t));
        }
        const o = optimusOptics(p);
        write(optics, 'opacity', n(0.15 + 0.85 * o));
        write(aura, 'opacity', n(0.1 + 0.6 * o));
        write(ring, 'opacity', n(0.15 + 0.45 * o));
    },
};

/* -------------------------------------------------------------- JARVIS --- */
/* p 0.32–0.72: the cage scales 0.4 → 1 while turning three quarters, the two
   dial rings counter-rotate inside it, the frame firms up and the core glow
   rises. The sweep turns once, phased to lie along the headline at 3 o'clock
   at p ≈ 0.5 (j = 0.45), the moment the accent word lights. */
const jarvisProgress = unit(0.32, 0.72);

const jarvis = {
    collect: (root) => ({
        rings: root.querySelector('.vg-jarvis-rings'),
        spin: root.querySelector('.vg-jarvis-spin'),
        spinRev: root.querySelector('.vg-jarvis-spin-rev'),
        frame: root.querySelector('.vg-jarvis-frame'),
        core: root.querySelector('.vg-jarvis-core'),
        aura: root.querySelector('.vg-jarvis-aura'),
        sweep: root.querySelector('.vg-jarvis-sweep'),
    }),
    pose: (p, { rings, spin, spinRev, frame, core, aura, sweep }, write) => {
        const j = jarvisProgress(p);
        write(rings, 'transform', `rotate(${n((j - 1) * 270)}deg) scale(${n(0.4 + 0.6 * j)})`);
        write(spin, 'transform', `rotate(${n(j * 90)}deg)`);
        write(spinRev, 'transform', `rotate(${n(j * -150)}deg)`);
        write(frame, 'opacity', n(0.3 + 0.7 * j));
        write(frame, 'transform', `scale(${n(0.85 + 0.15 * j)})`);
        write(core, 'opacity', n(0.2 + 0.8 * j));
        write(core, 'transform', `scale(${n(0.6 + 0.4 * j)})`);
        write(aura, 'opacity', n(0.75 * j));
        write(sweep, 'opacity', 1);
        write(sweep, 'transform', `rotate(${n((j - 0.45) * 360)}deg)`);
    },
};

/* ------------------------------------------------------------ Megatron --- */
/* p 0.66–1: reticle and crosshair counter-rotate; the eyes flare at ≈ 0.8.
   The glitch and the hard cut are on the wrapper, in StatementSection. */
const megatronProgress = unit(0.66, 1);
const megatronFlare = transform([0.76, 0.8, 0.86], [0, 1, 0.2]);

const megatron = {
    collect: (root) => ({
        reticle: root.querySelector('.vg-megatron-reticle'),
        crosshair: root.querySelector('.vg-megatron-crosshair'),
        eyes: root.querySelector('.vg-meg-eyes'),
        aura: root.querySelector('.vg-megatron-aura'),
    }),
    pose: (p, { reticle, crosshair, eyes, aura }, write) => {
        const m = megatronProgress(p);
        const f = megatronFlare(p);
        write(reticle, 'transform', `rotate(${n(m * 120)}deg)`);
        write(crosshair, 'transform', `rotate(${n(m * -80)}deg)`);
        write(eyes, 'opacity', n(0.6 + 0.4 * f));
        write(eyes, 'transform', `scale(${n(1 + 0.35 * f)})`);
        write(aura, 'opacity', n(0.2 + 0.7 * f));
    },
};

export const RIGS = { optimus, jarvis, megatron };
