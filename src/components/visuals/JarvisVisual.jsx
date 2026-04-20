import React from 'react';

const JarvisVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>
            {`
                @keyframes jarvis-pulse {
                    0%, 100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }
                    50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 40px rgba(6, 182, 212, 0.8); }
                }
                @keyframes jarvis-rotate-cw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes jarvis-rotate-ccw {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes voice-bar {
                    0%, 100% { height: 4px; }
                    50% { height: 16px; }
                }
                .jarvis-ring {
                    border: 2px solid rgba(6, 182, 212, 0.2);
                    border-top-color: rgba(6, 182, 212, 0.8);
                    border-radius: 50%;
                }
            `}
        </style>

        {/* Central Core */}
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute w-28 h-28 jarvis-ring" style={{ animation: 'jarvis-rotate-cw 8s linear infinite' }}></div>
            
            {/* Middle Ring */}
            <div className="absolute w-20 h-20 jarvis-ring border-r-cyan-500/80" style={{ animation: 'jarvis-rotate-ccw 5s linear infinite' }}></div>
            
            {/* Inner Ring */}
            <div className="absolute w-14 h-14 jarvis-ring border-b-cyan-400/80" style={{ animation: 'jarvis-rotate-cw 3s linear infinite' }}></div>

            {/* Glowing Core */}
            <div className="w-6 h-6 bg-cyan-500 rounded-full shadow-[0_0_20px_#06b6d4]" style={{ animation: 'jarvis-pulse 2s ease-in-out infinite' }}></div>

            {/* Scanning Line */}
            <div className="absolute w-32 h-[1px] bg-cyan-500/30 blur-[1px]" style={{ animation: 'jarvis-rotate-cw 4s linear infinite' }}></div>
        </div>

        {/* Voice Feedback Bars */}
        <div className="absolute bottom-6 flex items-end gap-1 px-4">
            {[0.2, 0.4, 0.1, 0.5, 0.3, 0.6, 0.2, 0.4].map((delay, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-cyan-400/60 rounded-full" 
                    style={{ 
                        height: '8px',
                        animation: 'voice-bar 1.2s ease-in-out infinite',
                        animationDelay: `${delay}s`
                    }}
                ></div>
            ))}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-cyan-500/50 tracking-[0.3em] font-mono">SYSTEM ACTIVE — JARVIS</div>
    </div>
);

export default JarvisVisual;
