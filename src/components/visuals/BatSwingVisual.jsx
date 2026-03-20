import React from 'react';

const BatSwingVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="relative w-32 h-32">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-1 h-8 bg-gray-400/60 rounded"></div>
            <div className="absolute top-[35%] left-1/2 -translate-x-[3px] bat-arm">
                <div className="w-1.5 h-14 bg-gradient-to-b from-amber-700 to-amber-500 rounded-b-full"></div>
            </div>
            {[-30, -15, 0, 15, 30].map((angle, i) => (
                <div key={i} className="absolute top-[35%] left-1/2 w-12 h-0.5 bg-cyan-400/20 rounded swing-trail" style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'left center', animationDelay: `${i * 0.1}s`, animationName: 'swing-trail', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }}></div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {['SPD', 'ANG', 'DUR'].map((m, i) => (
                    <div key={i} className="text-[8px] bg-gray-700/80 text-cyan-400 px-1.5 py-0.5 rounded font-mono">{m}</div>
                ))}
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">SWING ANALYSIS</div>
    </div>
);

export default BatSwingVisual;
