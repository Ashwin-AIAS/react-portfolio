import React from 'react';

export const GradientMesh = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-30 top-1/4 left-1/4"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', animation: 'mesh-blob-1 12s ease-in-out infinite' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-25 top-1/3 right-1/4"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', animation: 'mesh-blob-2 15s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 bottom-1/4 left-1/3"
            style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)', animation: 'mesh-blob-3 18s ease-in-out infinite' }} />
    </div>
);
