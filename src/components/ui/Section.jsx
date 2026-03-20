import React from 'react';
import { StaggeredReveal } from './StaggeredReveal';

export const Section = ({ id, title, subtitle, children }) => (
    <section id={id} className="py-32 md:py-44 px-6">
        <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                    <StaggeredReveal text={title} />
                </h2>
                {subtitle && <p className="mt-4 text-lg md:text-xl text-white/40 font-light max-w-2xl mx-auto">{subtitle}</p>}
                <div className="mt-6 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            {children}
        </div>
    </section>
);
