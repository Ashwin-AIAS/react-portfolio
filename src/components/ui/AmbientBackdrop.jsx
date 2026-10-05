import React from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

/**
 * The page's single, continuous backdrop — the thing that turns eight stacked
 * sections into one scene.
 *
 *  - Three aurora orbs drift along their own paths as the page scrolls, so
 *    the light is always somewhere new by the time a section arrives.
 *  - A perspective "LiDAR floor" grid rolls toward the viewer with the scroll
 *    and glows brighter the faster you move (scroll velocity → opacity).
 *  - A vignette + faint grain keep text contrast stable on top of all that.
 *
 * Everything is painted with the live palette tokens, so the backdrop follows
 * the theme switcher without re-mounting. Only transform/opacity animate.
 */

// Grid cell size in px — the floor offset loops modulo this so the roll is seamless.
const CELL = 64;

// Page-progress stops shared by the three orb paths.
const STOPS = [0, 0.18, 0.4, 0.62, 0.82, 1];

const useOrbPath = (progress, xs, ys, scales) => ({
    x: useTransform(progress, STOPS, xs),
    y: useTransform(progress, STOPS, ys),
    scale: useTransform(progress, STOPS, scales),
});

export const AmbientBackdrop = () => {
    const reduced = usePrefersReducedMotion();
    const { scrollY, scrollYProgress } = useScroll();

    // A soft spring on page progress gives the light a little inertia, which
    // is most of what makes it feel physical rather than bolted to the wheel.
    const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.7 });

    const orbA = useOrbPath(
        progress,
        ['-18vw', '28vw', '52vw', '8vw', '-12vw', '30vw'],
        ['-22vh', '6vh', '-14vh', '28vh', '4vh', '-10vh'],
        [1, 1.15, 0.9, 1.2, 1, 1.1],
    );
    const orbB = useOrbPath(
        progress,
        ['58vw', '62vw', '6vw', '-14vw', '44vw', '60vw'],
        ['46vh', '-12vh', '30vh', '-6vh', '40vh', '20vh'],
        [0.9, 1.1, 1.25, 0.95, 1.15, 1],
    );
    const orbC = useOrbPath(
        progress,
        ['22vw', '-10vw', '30vw', '56vw', '14vw', '-6vw'],
        ['70vh', '52vh', '64vh', '40vh', '58vh', '68vh'],
        [0.8, 1, 0.85, 1.1, 0.9, 1],
    );

    // Floor roll: translate the grid within its tilted plane, looping per cell.
    const floorY = useTransform(scrollY, (v) => (v * 0.45) % CELL);

    // Velocity boost: fast flicks light the floor up, rest lets it settle.
    const velocity = useSpring(useVelocity(scrollY), { stiffness: 220, damping: 40 });
    const floorOpacity = useTransform(velocity, [-2600, 0, 2600], [0.95, 0.42, 0.95]);
    const horizonGlow = useTransform(velocity, [-2600, 0, 2600], [0.9, 0.35, 0.9]);

    const live = !reduced;

    return (
        <div className={`ambient${live ? '' : ' ambient--static'}`} aria-hidden="true">
            <motion.div className="ambient-orb ambient-orb--a" style={live ? orbA : undefined} />
            <motion.div className="ambient-orb ambient-orb--b" style={live ? orbB : undefined} />
            <motion.div className="ambient-orb ambient-orb--c" style={live ? orbC : undefined} />

            <motion.div className="ambient-horizon" style={live ? { opacity: horizonGlow } : undefined} />
            <div className="ambient-floor">
                <div className="ambient-plane">
                    <motion.div
                        className="ambient-grid"
                        style={live ? { y: floorY, opacity: floorOpacity } : undefined}
                    />
                </div>
            </div>

            <div className="ambient-vignette" />
            <div className="ambient-grain" />
        </div>
    );
};
