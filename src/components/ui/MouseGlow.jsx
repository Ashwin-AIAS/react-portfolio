import React, { useCallback, useEffect, useRef } from 'react';

export const MouseGlow = () => {
    const glowRef = useRef(null);
    
    const handleMouseMove = useCallback((e) => {
        if (glowRef.current) {
            glowRef.current.style.left = `${e.clientX}px`;
            glowRef.current.style.top = `${e.clientY + window.scrollY}px`;
            glowRef.current.style.opacity = '1';
        }
    }, []);
    
    const handleMouseLeave = useCallback(() => {
        if (glowRef.current) glowRef.current.style.opacity = '0';
    }, []);
    
    useEffect(() => {
        const section = glowRef.current?.parentElement;
        if (!section) return;
        section.addEventListener('mousemove', handleMouseMove);
        section.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
            section.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);
    
    return <div ref={glowRef} className="mouse-glow" style={{ opacity: 0 }} />;
};
