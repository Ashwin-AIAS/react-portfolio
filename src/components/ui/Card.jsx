import React from 'react';

export const Card = ({ children, className }) => (
    <div className={`panel overflow-hidden ${className || ''}`}>
        {children}
    </div>
);
