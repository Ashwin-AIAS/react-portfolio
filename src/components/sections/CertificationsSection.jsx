import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { ExternalLinkIcon, GraduationCapIcon } from '../../icons/Icons';

export const CertificationsSection = () => (
    <Section id="certifications" title="Certifications" subtitle="Continuous learning and verified expertise">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.certifications.map((cert, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                    <Card className="h-full group hover:border-blue-500/30 transition-all duration-500">
                        <div className="p-6 h-full flex flex-col">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                                <GraduationCapIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium text-white/90 mb-2 leading-tight">{cert.name}</h3>
                            <p className="text-sm text-white/40 mb-6 font-light">{cert.issuer}</p>
                            <div className="mt-auto">
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                                    View Credential <ExternalLinkIcon className="w-3 h-3 ml-2" />
                                </a>
                            </div>
                        </div>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);
