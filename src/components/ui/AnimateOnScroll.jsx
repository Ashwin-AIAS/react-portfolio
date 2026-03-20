import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const AnimateOnScroll = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }} animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }} className={className}>
            {children}
        </motion.div>
    );
};
