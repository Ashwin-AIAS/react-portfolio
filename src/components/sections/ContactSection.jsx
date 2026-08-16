import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from '../../icons/Icons';

// The contact details were three circular icon chips in a blue-gradient card.
// They are facts, so they render as a readout: LABEL ......... value.
const CONTACT_ROWS = [
    { label: 'Email', key: 'email', Icon: MailIcon, href: (v) => `mailto:${v}` },
    { label: 'Phone', key: 'phone', Icon: PhoneIcon, href: (v) => `tel:${v.replace(/[^+\d]/g, '')}` },
    { label: 'Location', key: 'location', Icon: MapPinIcon, href: null },
];

const Field = ({ id, label, type = 'text', rows }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="label block">{label}</label>
        {rows ? (
            <textarea id={id} name={id} required rows={rows} className="input-field resize-none" placeholder={label} />
        ) : (
            <input type={type} id={id} name={id} required className="input-field" placeholder={label} />
        )}
    </div>
);

export const ContactSection = ({ t }) => {
    const [formStatus, setFormStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        const form = e.target;
        const data = new FormData(form);
        try {
            const response = await fetch("https://formspree.io/f/mqoeqwev", {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                setFormStatus('success');
                form.reset();
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            setFormStatus('error');
        }
    };

    return (
        <Section id="contact" title={t.contact.title} subtitle={t.contact.subtitle}>
            <div className="grid md:grid-cols-5 gap-6">
                <AnimateOnScroll className="md:col-span-2">
                    <Card className="h-full">
                        <div className="p-6 md:p-8 h-full flex flex-col">
                            <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-rule">
                                <span className="label label-accent">Direct</span>
                                <span className="label ml-auto flex items-center gap-1.5">
                                    <span className="status-dot" /> Open to work
                                </span>
                            </div>

                            <h3 className="font-display text-xl font-bold tracking-tight text-ink mb-3">
                                Let's Connect
                            </h3>
                            <p className="text-sm text-ink-muted font-light leading-relaxed mb-8">
                                Whether you have a question, a project idea, or just want to say hi,
                                I'll try my best to get back to you.
                            </p>

                            <dl className="mt-auto border-t border-rule">
                                {CONTACT_ROWS.map(({ label, key, Icon, href }) => {
                                    const value = portfolioData.personalInfo[key];
                                    return (
                                        <div key={key} className="readout-row">
                                            <dt className="flex items-center gap-2">
                                                <Icon className="w-3 h-3 flex-shrink-0" /> {label}
                                            </dt>
                                            <dd className="truncate">
                                                {href ? (
                                                    <a href={href(value)} className="hover:text-accent transition-colors">
                                                        {value}
                                                    </a>
                                                ) : value}
                                            </dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        </div>
                    </Card>
                </AnimateOnScroll>

                <AnimateOnScroll delay={120} className="md:col-span-3">
                    <Card className="h-full">
                        <div className="p-6 md:p-8">
                            <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-rule">
                                <span className="label label-accent">Message</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Field id="name" label={t.contact.namePlaceholder} />
                                    <Field id="email" label={t.contact.emailPlaceholder} type="email" />
                                </div>
                                <Field id="subject" label={t.contact.subjectPlaceholder} />
                                <Field id="message" label={t.contact.messagePlaceholder} rows={5} />

                                <button
                                    type="submit"
                                    disabled={formStatus === 'sending'}
                                    className="btn btn-primary w-full py-3.5 disabled:opacity-60"
                                >
                                    {formStatus === 'sending' ? (
                                        <>
                                            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            {t.contact.sending}
                                        </>
                                    ) : (
                                        <>
                                            <SendIcon className="w-3.5 h-3.5" /> {t.contact.send}
                                        </>
                                    )}
                                </button>

                                {formStatus === 'success' && (
                                    <p className="label flex items-center justify-center gap-2" style={{ color: 'var(--ok)' }}>
                                        <span className="status-dot" /> {t.contact.success}
                                    </p>
                                )}
                                {formStatus === 'error' && (
                                    <p className="label text-center" style={{ color: 'var(--err)' }}>
                                        {t.contact.error}
                                    </p>
                                )}
                            </form>
                        </div>
                    </Card>
                </AnimateOnScroll>
            </div>
        </Section>
    );
};
