import React, { useState, useEffect } from 'react';

const GenerativeAIVisual = () => {
    const [dots, setDots] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => [...d, { x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 }].slice(-15));
        }, 300);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
            {/* Style tags removed */}
            <div className="radar-sweep-container w-[200%] h-[200%] rounded-full absolute">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-r from-transparent to-blue-400/10 rounded-r-full" />
            </div>
            {dots.map((dot, i) => (
                <div key={i} className="absolute w-2 h-2 bg-blue-400 rounded-full synthetic-dot shadow-[0_0_8px_#60a5fa]" style={{ left: `${dot.x}%`, top: `${dot.y}%` }}></div>
            ))}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
    );
};

export default GenerativeAIVisual;
