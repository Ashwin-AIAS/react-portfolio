import React from 'react';

const PortfolioAIVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="w-64 rounded-xl border border-white/10 bg-gray-900/80 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-black/40 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
                <div className="flex-1 mx-2 h-3 bg-white/5 rounded-full text-[7px] text-white/20 flex items-center px-2">ashwin.dev</div>
            </div>
            {/* Chat messages */}
            <div className="p-3 space-y-2">
                <div className="msg-in flex justify-end" style={{ animationDelay: '0.2s', animationName: 'msg-appear', animationDuration: '0.4s', animationTimingFunction: 'ease-out', animationFillMode: 'forwards' }}>
                    <div className="bg-blue-600/80 text-white text-[9px] px-2.5 py-1.5 rounded-xl rounded-tr-sm max-w-[80%]">Analyze this job description...</div>
                </div>
                <div className="msg-in flex justify-start" style={{ animationDelay: '0.8s', animationName: 'msg-appear', animationDuration: '0.4s', animationTimingFunction: 'ease-out', animationFillMode: 'forwards' }}>
                    <div className="bg-white/5 border border-white/10 text-white/70 text-[9px] px-2.5 py-1.5 rounded-xl rounded-tl-sm max-w-[80%]">
                        <div className="text-green-400 font-mono font-bold mb-1">Match Score: 82%</div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full" style={{ animation: 'score-fill 1.5s ease-out 1s forwards', width: 0 }}></div>
                        </div>
                    </div>
                </div>
                <div className="msg-in flex justify-start" style={{ animationDelay: '1.4s', animationName: 'msg-appear', animationDuration: '0.4s', animationTimingFunction: 'ease-out', animationFillMode: 'forwards' }}>
                    <div className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl rounded-tl-sm flex gap-1 items-center">
                        {[0, 0.15, 0.3].map((d, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-blue-400 typing-dot" style={{ animationDelay: `${d}s` }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">AI RECRUITER ASSISTANT</div>
    </div>
);

export default PortfolioAIVisual;
