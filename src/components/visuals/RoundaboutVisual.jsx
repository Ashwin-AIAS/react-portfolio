import React from 'react';

const RoundaboutVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        {/* Style tags removed */}
        <div className="w-40 h-40 absolute">
            <div className="absolute w-full h-6 bg-gray-600 top-1/2 -translate-y-1/2"></div>
            <div className="absolute h-full w-6 bg-gray-600 left-1/2 -translate-x-1/2"></div>
            <div className="w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-full border-4 border-gray-600"></div>
            <div className="absolute w-full h-full top-0 left-0">
                <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-red-500 rounded-sm car car-1"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-blue-500 rounded-sm car car-2"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-yellow-500 rounded-sm car car-3"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
            </div>
        </div>
    </div>
);

export default RoundaboutVisual;
