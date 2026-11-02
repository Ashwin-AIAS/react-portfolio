import React from 'react';
import { portfolioData } from '../../data/portfolioData';

const GEMINI_TERMS_URL = 'https://ai.google.dev/gemini-api/terms';
const GOOGLE_PRIVACY_URL = 'https://policies.google.com/privacy';

/**
 * Plain-language privacy notice (SECURITY_PLAN.md, P9). The chat and mic
 * notices link here (#privacy). Deliberately not a <Section>: it carries no
 * index number and no voice-guide narration, and it sits quietly above the
 * footer.
 */
export const PrivacySection = ({ t }) => {
    const p = t.privacy;
    const email = portfolioData.personalInfo.email;

    return (
        <section id="privacy" aria-labelledby="privacy-title" className="px-6 pt-8 pb-16 scroll-mt-24">
            <div className="container mx-auto max-w-6xl">
                <div className="rule-line mb-10" />

                <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <header>
                        <p className="label mb-3">{p.updated}</p>
                        <h2 id="privacy-title" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink">
                            {p.title}
                        </h2>
                        <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-sm">{p.subtitle}</p>
                    </header>

                    <div className="space-y-8">
                        {p.items.map((item) => (
                            <div key={item.heading}>
                                <h3 className="label label-accent mb-3">{item.heading}</h3>
                                <div className="space-y-3">
                                    {item.body.map((para, i) => (
                                        <p key={i} className="text-sm text-ink-muted leading-relaxed max-w-prose">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 border-t border-rule space-y-3">
                            <p className="text-sm text-ink-muted leading-relaxed">
                                {p.contact}{' '}
                                <a
                                    href={`mailto:${email}`}
                                    className="font-mono text-ink hover:text-accent transition-colors break-all"
                                >
                                    {email}
                                </a>
                                .
                            </p>
                            <p className="flex flex-wrap gap-x-5 gap-y-2">
                                <a
                                    href={GEMINI_TERMS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="label hover:text-accent transition-colors"
                                >
                                    {p.googleTerms} ↗
                                </a>
                                <a
                                    href={GOOGLE_PRIVACY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="label hover:text-accent transition-colors"
                                >
                                    {p.googlePrivacy} ↗
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
