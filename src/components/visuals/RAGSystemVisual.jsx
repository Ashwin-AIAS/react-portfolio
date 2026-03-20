import React from 'react';

const RAGSystemVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="rag-doc w-10 h-8 bg-cyan-900/60 border border-cyan-500/30 rounded flex items-center justify-center" style={{ animationDelay: `${i * 0.4}s` }}>
                        <div className="space-y-1"><div className="w-5 h-0.5 bg-cyan-400/60 rounded"></div><div className="w-3 h-0.5 bg-cyan-400/40 rounded"></div></div>
                    </div>
                ))}
            </div>
            <svg width="30" height="40" className="text-cyan-500/50"><path d="M5 20 L25 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></path><polygon points="22,15 28,20 22,25" fill="currentColor"/></svg>
            <div className="relative w-16 h-16">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="absolute w-2.5 h-2.5 bg-blue-400 rounded-full rag-node shadow-[0_0_6px_#60a5fa]" style={{ top: `${50 + 28 * Math.sin(i * Math.PI / 3) - 5}%`, left: `${50 + 28 * Math.cos(i * Math.PI / 3) - 5}%`, animationDelay: `${i * 0.3}s` }}></div>
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_12px_#06b6d4]"></div>
            </div>
            <svg width="30" height="40" className="text-cyan-500/50"><path d="M5 20 L25 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></path><polygon points="22,15 28,20 22,25" fill="currentColor"/></svg>
            <div className="w-14 h-10 bg-green-900/50 border border-green-500/30 rounded-lg flex items-center justify-center">
                <div className="space-y-1"><div className="w-7 h-0.5 bg-green-400/80 rounded"></div><div className="w-5 h-0.5 bg-green-400/60 rounded"></div><div className="w-6 h-0.5 bg-green-400/40 rounded"></div></div>
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">DOC → VECTORS → ANSWER</div>
    </div>
);

export default RAGSystemVisual;
