import React from 'react';
import { GitHubIcon, LinkedInIcon } from '../../icons/Icons';
import { portfolioData } from '../../data/portfolioData';

// Was a dead 128px band at white/20 (~3:1 contrast, unreadable). Now it
// carries a closing CTA and readable contact details.
export const Footer = ({ t }) => (
    <footer className="px-6 pb-14 pt-4">
        <div className="container mx-auto max-w-6xl">
            <div className="rule-line mb-8" />

            <div className="grid gap-8 md:grid-cols-3 mb-10">
                <div>
                    <p className="label mb-3">Contact</p>
                    <a
                        href={`mailto:${portfolioData.personalInfo.email}`}
                        className="font-mono text-sm text-ink hover:text-accent transition-colors break-all"
                    >
                        {portfolioData.personalInfo.email}
                    </a>
                </div>
                <div>
                    <p className="label mb-3">Location</p>
                    <p className="font-mono text-sm text-ink">{portfolioData.personalInfo.location}</p>
                </div>
                <div>
                    <p className="label mb-3">Status</p>
                    <p className="font-mono text-sm text-ink flex items-center gap-2">
                        <span className="status-dot" /> Open to opportunities
                    </p>
                </div>
            </div>

            <div className="rule-line mb-6" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="label">
                    &copy; {new Date().getFullYear()} {portfolioData.personalInfo.name}. {t.footer.rights}
                </p>
                <div className="flex items-center gap-2">
                    <a
                        href={portfolioData.personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="w-9 h-9 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors"
                    >
                        <GitHubIcon className="w-4 h-4" />
                    </a>
                    <a
                        href={portfolioData.personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="w-9 h-9 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors"
                    >
                        <LinkedInIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);
