import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const TypewriterText = ({ text, className = '' }) => {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i <= text.length) { setDisplayText(text.slice(0, i)); i++; }
            else clearInterval(interval);
        }, 60);
        return () => clearInterval(interval);
    }, [isInView, text]);
    
    useEffect(() => {
        const blink = setInterval(() => setShowCursor(c => !c), 530);
        return () => clearInterval(blink);
    }, []);
    
    return (
        <span ref={ref} className={className}>
            {displayText}
            <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }} className="text-blue-400">|</span>
        </span>
    );
};
