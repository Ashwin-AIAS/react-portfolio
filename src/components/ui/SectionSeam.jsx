import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

/**
 * The hairline between sections, with a seam of light that runs along it as
 * it crosses the viewport — left to right on the way down, back on the way
 * up. Takes no layout space beyond the old 1px divider.
 */
export const SectionSeam = () => {
    const ref = useRef(null);
    const still = usePrefersReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

    // The beam is 40% of the seam wide, so -100% → 250% of its own width
    // carries it fully across.
    const x = useTransform(scrollYProgress, [0.1, 0.9], ['-100%', '250%']);
    const opacity = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0, 1, 1, 0]);

    return (
        <div ref={ref} className="section-seam" aria-hidden="true">
            {!still && <motion.span className="section-seam-beam" style={{ x, opacity }} />}
        </div>
    );
};
