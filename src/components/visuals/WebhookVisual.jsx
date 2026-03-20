import React from 'react';

const WebhookVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="flex items-center gap-3">
            {[{label: 'TRIGGER', color: 'bg-amber-900/50 border-amber-500/30 text-amber-400'},
              {label: 'N8N', color: 'bg-pink-900/50 border-pink-500/30 text-pink-400'},
              {label: 'ACTION', color: 'bg-green-900/50 border-green-500/30 text-green-400'}].map((block, i) => (
                <React.Fragment key={i}>
                    <div className={`${block.color} border rounded-lg px-3 py-2 flex flex-col items-center gap-1 ${i === 1 ? 'wh-pulse' : ''}`}>
                        <div className={`text-[9px] font-mono font-bold ${block.color.split(' ')[2]}`}>{block.label}</div>
                        <div className="flex gap-0.5">
                            {[0, 1, 2].map(j => <div key={j} className="w-1 h-1 bg-current rounded-full opacity-40"></div>)}
                        </div>
                    </div>
                    {i < 2 && (
                        <div className="flex gap-0.5">
                            {[0, 1, 2].map(j => <div key={j} className="w-1.5 h-1.5 bg-cyan-400 rounded-full wh-flow" style={{ animationDelay: `${j * 0.2}s` }}></div>)}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">WEBHOOK AUTOMATION</div>
    </div>
);

export default WebhookVisual;
