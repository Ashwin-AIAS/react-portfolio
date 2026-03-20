import React from 'react';

const RadarAIVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="relative w-40 h-40">
            {[1, 2, 3].map(r => (
                <div key={r} className="absolute rounded-full border border-cyan-500/20" style={{ width: `${r * 33}%`, height: `${r * 33}%`, top: `${50 - r * 16.5}%`, left: `${50 - r * 16.5}%` }}></div>
            ))}
            <div className="absolute w-full h-full radar-line" style={{ transformOrigin: '50% 50%' }}>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-cyan-500/60 to-transparent" style={{ transformOrigin: 'bottom center' }}></div>
            </div>
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#06b6d4]"></div>
            {[{x: 30, y: 25, label: 'CAR', d: 0}, {x: 65, y: 35, label: 'PED', d: 0.8}, {x: 45, y: 70, label: 'BIKE', d: 1.6}].map((obj, i) => (
                <div key={i} className="absolute" style={{ left: `${obj.x}%`, top: `${obj.y}%` }}>
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full radar-blip shadow-[0_0_6px_#ef4444]" style={{ animationDelay: `${obj.d}s` }}></div>
                    <div className="absolute -top-4 left-3 text-[7px] bg-gray-900/80 text-green-400 px-1 py-0.5 rounded font-mono whitespace-nowrap">{obj.label}</div>
                </div>
            ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">RADAR + GAN CLASSIFICATION</div>
    </div>
);

export default RadarAIVisual;
