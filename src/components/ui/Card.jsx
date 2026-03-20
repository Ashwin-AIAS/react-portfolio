import React from 'react';

export const Card = ({ children, className }) => (
    <div className={`glass-card overflow-hidden ${className || ''}`}>
        {children}
    </div>
);
