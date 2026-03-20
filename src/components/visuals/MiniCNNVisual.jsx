import React from 'react';

const MiniCNNVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="flex items-center gap-3">
            {[{w: 'w-8', h: 'h-24', c: 'bg-purple-500/30 border-purple-500/50', n: 4, label: 'Conv'},
              {w: 'w-6', h: 'h-20', c: 'bg-blue-500/30 border-blue-500/50', n: 3, label: 'Pool'},
              {w: 'w-6', h: 'h-16', c: 'bg-cyan-500/30 border-cyan-500/50', n: 3, label: 'Conv'},
              {w: 'w-4', h: 'h-12', c: 'bg-teal-500/30 border-teal-500/50', n: 2, label: 'FC'},
              {w: 'w-3', h: 'h-8', c: 'bg-green-500/30 border-green-500/50', n: 1, label: 'Out'}].map((layer, li) => (
                <div key={li} className="flex flex-col items-center gap-1">
                    <div className={`${layer.w} ${layer.h} ${layer.c} border rounded-md relative overflow-hidden`}>
                        {[...Array(layer.n)].map((_, ni) => (
                            <div key={ni} className="cnn-data absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ top: `${((ni + 1) / (layer.n + 1)) * 100}%`, animationDelay: `${li * 0.3 + ni * 0.2}s` }}></div>
                        ))}
                    </div>
                    <span className="text-[8px] text-gray-500 font-mono">{layer.label}</span>
                </div>
            ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">LeNet-5 INFERENCE</div>
    </div>
);

export default MiniCNNVisual;
