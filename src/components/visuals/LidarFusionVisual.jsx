import React from 'react';

const LidarFusionVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="absolute top-1/2 left-4 w-0 h-0 border-t-[40px] border-t-transparent border-b-[40px] border-b-transparent border-l-[60px] border-l-cyan-500/10 -translate-y-1/2"></div>
        <svg viewBox="0 0 100 40" className="w-4/6 h-auto z-10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5">
            <path d="M 5,25 C 5,20 10,20 15,20 L 25,15 C 30,10 40,10 50,12 L 70,12 C 80,12 85,20 90,25 C 95,30 95,30 95,30 L 5,30 C 5,30 5,30 5,25 Z" />
            <circle cx="20" cy="30" r="4" stroke="rgba(255,255,255,0.4)" />
            <circle cx="80" cy="30" r="4" stroke="rgba(255,255,255,0.4)" />
        </svg>
        <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full z-20 shadow-[0_0_10px_#06b6d4]"></div>
        <div className="absolute top-1/2 left-4 w-3 h-3 bg-blue-400 rounded-full z-20 shadow-[0_0_10px_#3b82f6] -translate-y-1/2"></div>
        {[...Array(20)].map((_, i) => {
            const targets = [{ x: '15px', y: '10px' }, { x: '25px', y: '-5px' }, { x: '40px', y: '-10px' }, { x: '60px', y: '-8px' }, { x: '80px', y: '5px' }, { x: '90px', y: '15px' }, { x: '80px', y: '20px' }, { x: '20px', y: '20px' }];
            const target = targets[i % targets.length];
            return (<div key={i} className="lidar-point" style={{ top: '16px', left: '16px', '--tx': target.x, '--ty': target.y, animationDelay: `${i * 0.08}s` }} ></div>);
        })}
    </div>
);

export default LidarFusionVisual;
