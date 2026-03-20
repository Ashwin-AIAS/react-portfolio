import React, { useState, useEffect } from 'react';

const FaceReconVisual = () => {
    const [rotation, setRotation] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setRotation(r => (r + 1) % 360), 30);
        return () => clearInterval(interval);
    }, []);
    const points = Array.from({ length: 20 }, (_, i) => {
        const theta = (i / 10) * Math.PI;
        const phi = (i % 10) * Math.PI / 5;
        const x = 30 * Math.sin(theta) * Math.cos(phi + rotation * Math.PI / 180);
        const y = 40 * Math.cos(theta);
        return { x: 50 + x, y: 45 + y * 0.6, z: Math.sin(phi + rotation * Math.PI / 180) };
    });
    return (
        <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={1 + p.z * 0.5} fill={p.z > 0 ? '#06b6d4' : '#164e63'} opacity={0.5 + p.z * 0.3} />
                ))}
                {points.slice(0, -1).map((p, i) => (
                    <line key={`l${i}`} x1={p.x} y1={p.y} x2={points[i + 1].x} y2={points[i + 1].y} stroke="#06b6d4" strokeWidth="0.3" opacity={0.2 + p.z * 0.2} />
                ))}
            </svg>
            <div className="absolute top-3 right-3 flex flex-col gap-1">
                <div className="text-[8px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded font-mono">DETECTED</div>
                <div className="text-[8px] bg-cyan-900/50 text-cyan-400 px-1.5 py-0.5 rounded font-mono">3D MAP</div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">3D RECONSTRUCTION</div>
        </div>
    );
};

export default FaceReconVisual;
