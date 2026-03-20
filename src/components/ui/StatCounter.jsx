import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const StatCounter = ({ end, suffix = '', label }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end]);
    
    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient" style={{ animation: isInView ? 'count-up-glow 1.5s ease-out' : 'none' }}>
                {count}{suffix}
            </div>
            <div className="text-xs text-white/30 font-light mt-1 tracking-wider uppercase">{label}</div>
        </div>
    );
};
