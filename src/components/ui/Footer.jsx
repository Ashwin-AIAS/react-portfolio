import React from 'react';
import { GitHubIcon, LinkedInIcon } from '../../icons/Icons';
import { portfolioData } from '../../data/portfolioData';

export const Footer = ({ t }) => (
    <footer className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
            <div className="section-divider mb-10"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-xs text-white/20 font-light">&copy; {new Date().getFullYear()} {portfolioData.personalInfo.name}. {t.footer.rights}</p>
                <div className="flex items-center gap-5">
                    <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors duration-300"><GitHubIcon className="w-4 h-4" /></a>
                    <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors duration-300"><LinkedInIcon className="w-4 h-4" /></a>
                </div>
            </div>
        </div>
    </footer>
);
