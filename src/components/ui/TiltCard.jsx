import React, { useCallback, useRef } from 'react';

export const TiltCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    
    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const shine = card.querySelector('.tilt-shine');
        if (shine) {
            shine.style.setProperty('--shine-x', `${(x / rect.width) * 100}%`);
            shine.style.setProperty('--shine-y', `${(y / rect.height) * 100}%`);
        }
    }, []);
    
    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }, []);
    
    return (
        <div ref={cardRef} className={`tilt-card ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="tilt-card-inner">
                <div className="tilt-shine"></div>
                {children}
            </div>
        </div>
    );
};
