import React from 'react';

const RLVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center p-4">
        {/* Style tags removed */}
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full max-w-[152px] max-h-[152px]">
            {[...Array(16)].map((_, i) => (<div key={i} className="w-full h-full bg-gray-700/50 rounded-sm"></div>))}
        </div>
        <div className="absolute w-[12.5%] h-[12.5%] top-[62.5%] left-[62.5%] flex items-center justify-center text-2xl">🏆</div>
        <div className="absolute w-[12.5%] h-[12.5%] bg-amber-400 rounded-full rl-agent shadow-[0_0_10px_#f59e0b]"></div>
    </div>
);

export default RLVisual;
