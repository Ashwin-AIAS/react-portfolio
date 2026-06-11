import React from 'react';

// Keyframe poses for a side-view squat (viewBox 200x150)
const POSES = {
    body: {
        standing: '100,42 100,55 100,88 102,112 100,135',
        squat: '112,68 110,78 88,102 114,114 106,135'
    },
    arm: {
        standing: { x1: 100, y1: 58, x2: 128, y2: 66 },
        squat: { x1: 110, y1: 80, x2: 140, y2: 80 }
    },
    head: {
        standing: { cx: 100, cy: 34 },
        squat: { cx: 113, cy: 60 }
    }
};

const DUR = '2.4s';
const cycle = (a, b) => `${a};${b};${a}`;

const Joint = ({ standing, squat }) => (
    <circle r="2.5" fill="#34d399" opacity="0.9">
        <animate attributeName="cx" values={cycle(standing[0], squat[0])} dur={DUR} repeatCount="indefinite" />
        <animate attributeName="cy" values={cycle(standing[1], squat[1])} dur={DUR} repeatCount="indefinite" />
    </circle>
);

const GymVisionVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>
            {`
                @keyframes gv-scan {
                    0%, 100% { top: 10%; opacity: 0.6; }
                    50% { top: 85%; opacity: 0.9; }
                }
                @keyframes gv-score {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                @keyframes gv-rep {
                    0%, 45% { opacity: 0; transform: translateY(4px); }
                    50%, 75% { opacity: 1; transform: translateY(0); }
                    80%, 100% { opacity: 0; transform: translateY(-4px); }
                }
            `}
        </style>

        {/* Grid backdrop */}
        <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
                backgroundImage: 'linear-gradient(rgba(52,211,153,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.6) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
        ></div>

        {/* Scanning line */}
        <div className="absolute left-0 w-full h-[1px] bg-emerald-400/40 blur-[1px]" style={{ animation: 'gv-scan 4.8s ease-in-out infinite' }}></div>

        {/* Animated squat skeleton */}
        <svg viewBox="0 0 200 150" className="h-full w-auto relative">
            {/* Detection bounding box */}
            <rect x="70" y="22" width="80" height="120" fill="none" stroke="#34d399" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.35" rx="4" />

            {/* Head */}
            <circle r="8" fill="none" stroke="#6ee7b7" strokeWidth="2">
                <animate attributeName="cx" values={cycle(POSES.head.standing.cx, POSES.head.squat.cx)} dur={DUR} repeatCount="indefinite" />
                <animate attributeName="cy" values={cycle(POSES.head.standing.cy, POSES.head.squat.cy)} dur={DUR} repeatCount="indefinite" />
            </circle>

            {/* Body: shoulder → hip → knee → ankle */}
            <polyline fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <animate attributeName="points" values={cycle(POSES.body.standing, POSES.body.squat)} dur={DUR} repeatCount="indefinite" />
            </polyline>

            {/* Arm */}
            <line stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round">
                {['x1', 'y1', 'x2', 'y2'].map(attr => (
                    <animate key={attr} attributeName={attr} values={cycle(POSES.arm.standing[attr], POSES.arm.squat[attr])} dur={DUR} repeatCount="indefinite" />
                ))}
            </line>

            {/* Keypoint markers */}
            <Joint standing={[100, 55]} squat={[110, 78]} />
            <Joint standing={[100, 88]} squat={[88, 102]} />
            <Joint standing={[102, 112]} squat={[114, 114]} />
            <Joint standing={[100, 135]} squat={[106, 135]} />
            <Joint standing={[128, 66]} squat={[140, 80]} />
        </svg>

        {/* HUD overlays */}
        <div className="absolute top-3 left-4 text-[10px] font-mono text-emerald-400/80" style={{ animation: 'gv-score 2.4s ease-in-out infinite' }}>
            FORM SCORE: 92%
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono text-emerald-300/70" style={{ animation: 'gv-rep 2.4s ease-in-out infinite' }}>
            REP +1
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-emerald-500/50 tracking-[0.3em] font-mono whitespace-nowrap">POSE LOCKED — GYMVISION</div>
    </div>
);

export default GymVisionVisual;
