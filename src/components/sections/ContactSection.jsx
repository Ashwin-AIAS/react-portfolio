import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from '../../icons/Icons';

export const ContactSection = () => {
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
        <Section id="contact" title="Get In Touch" subtitle="Currently open to new opportunities and collaborations">
            <div className="grid md:grid-cols-5 gap-12">
                <AnimateOnScroll className="md:col-span-2">
                    <Card className="h-full bg-gradient-to-br from-blue-900/10 to-transparent p-8 md:p-10 border border-blue-500/20">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-8"><MailIcon className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-semibold text-white/90 mb-4 tracking-tight">Let's Connect</h3>
                        <p className="text-sm text-white/40 font-light leading-relaxed mb-10">Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!</p>
                        <div className="space-y-6">
                            <a href={`mailto:${portfolioData.personalInfo.email}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all"><MailIcon className="w-4 h-4" /></div>
                                <span className="text-sm tracking-wide">{portfolioData.personalInfo.email}</span>
                            </a>
                            <div className="flex items-center gap-4 text-white/60">
                                <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center"><PhoneIcon className="w-4 h-4" /></div>
                                <span className="text-sm tracking-wide">{portfolioData.personalInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-4 text-white/60">
                                <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center"><MapPinIcon className="w-4 h-4" /></div>
                                <span className="text-sm tracking-wide">{portfolioData.personalInfo.location}</span>
                            </div>
                        </div>
                    </Card>
                </AnimateOnScroll>
                <AnimateOnScroll delay={200} className="md:col-span-3">
                    <Card className="p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-medium text-white/60 uppercase tracking-widest pl-1">Name</label>
                                    <input type="text" id="name" name="name" required className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/20" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-medium text-white/60 uppercase tracking-widest pl-1">Email</label>
                                    <input type="email" id="email" name="email" required className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/20" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-xs font-medium text-white/60 uppercase tracking-widest pl-1">Subject</label>
                                <input type="text" id="subject" name="subject" required className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/20" placeholder="Project Inquiry" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs font-medium text-white/60 uppercase tracking-widest pl-1">Message</label>
                                <textarea id="message" name="message" required rows="5" className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/20 resize-none" placeholder="Hello..."></textarea>
                            </div>
                            <button type="submit" disabled={formStatus === 'sending'} className="w-full btn-premium btn-primary py-4 mt-2 flex justify-center items-center">
                                {formStatus === 'sending' ? (<span className="flex items-center"><svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</span>) : 
                                 formStatus === 'success' ? (<span className="text-green-300">Message Sent!</span>) : 
                                 (<span className="flex items-center"><SendIcon className="w-4 h-4 mr-2" /> Send Message</span>)}
                            </button>
                            {formStatus === 'error' && <p className="text-red-400 text-xs text-center mt-2">Oops! There was a problem submitting your form.</p>}
                        </form>
                    </Card>
                </AnimateOnScroll>
            </div>
        </Section>
    );
};
