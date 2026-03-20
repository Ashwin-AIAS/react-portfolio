import React, { useRef } from 'react';

export const ParticleField = React.memo(() => {
    const particles = useRef(
        Array.from({ length: 18 }, (_, i) => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 15}s`,
            duration: `${15 + Math.random() * 20}s`,
            size: 1 + Math.random() * 2,
        }))
    ).current;
    
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-blue-400/40"
                    style={{
                        width: `${p.size}px`, height: `${p.size}px`,
                        left: p.left, bottom: '-10px',
                        animation: `particle-drift ${p.duration} linear infinite`,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
});
