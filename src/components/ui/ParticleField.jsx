import React, { useRef, useState, useEffect } from 'react';

export const ParticleField = React.memo(() => {
    const particles = useRef(
        Array.from({ length: 18 }, (_, i) => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 15}s`,
            duration: `${15 + Math.random() * 20}s`,
            size: 1 + Math.random() * 2,
        }))
    ).current;

    // Pause the animation once the user scrolls past the hero — the particles
    // are invisible behind section backgrounds but still cost compositor time.
    const [active, setActive] = useState(true);

    useEffect(() => {
        const onScroll = () => setActive(window.scrollY < window.innerHeight * 1.2);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ visibility: active ? 'visible' : 'hidden' }}>
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-blue-400/40"
                    style={{
                        width: `${p.size}px`, height: `${p.size}px`,
                        left: p.left, bottom: '-10px',
                        animation: `particle-drift ${p.duration} linear infinite`,
                        animationDelay: p.delay,
                        animationPlayState: active ? 'running' : 'paused',
                    }}
                />
            ))}
        </div>
    );
});
