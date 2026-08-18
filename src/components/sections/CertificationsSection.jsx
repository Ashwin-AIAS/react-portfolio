import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { ExternalLinkIcon } from '../../icons/Icons';

// The blue circular icon tile scaled to 110% on hover on every card, which
// read as decoration rather than information. A mono index and the issuer
// carry the same weight without the motion.
export const CertificationsSection = ({ t }) => (
    <Section id="certifications" title={t.certifications.title} subtitle={t.certifications.subtitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioData.certifications.map((cert, index) => (
                <AnimateOnScroll key={cert.name} delay={index * 70} className="h-full">
                    <Card className="h-full group">
                        <div className="p-5 h-full flex flex-col">
                            <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-rule">
                                <span className="label label-accent">{String(index + 1).padStart(2, '0')}</span>
                                <span className="label truncate">{cert.issuer}</span>
                            </div>

                            <h3 className="font-display text-base font-bold tracking-tight text-ink leading-snug mb-6 group-hover:text-accent transition-colors">
                                {cert.name}
                            </h3>

                            <div className="mt-auto pt-4 border-t border-rule">
                                <a
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="label label-accent hover:text-accent-strong transition-colors inline-flex items-center gap-2"
                                >
                                    {t.certifications.viewCredential} <ExternalLinkIcon className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);
