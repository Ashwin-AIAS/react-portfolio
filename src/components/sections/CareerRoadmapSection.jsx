import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { DownloadIcon, EyeIcon, BriefcaseIcon, GraduationCapIcon } from '../../icons/Icons';

const PaperModal = ({ item, t, onClose }) => {
    const embedUrl = item.paperUrl.replace(/\/view.*$/, '/preview');
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.72)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="panel w-full max-w-4xl flex flex-col overflow-hidden"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
                    <div className="min-w-0">
                        <p className="label truncate mb-1">{item.institution}</p>
                        <h3 className="font-display text-sm font-bold tracking-tight text-ink truncate">{item.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="ml-4 w-8 h-8 flex-shrink-0 flex items-center justify-center border border-rule text-ink-dim hover:text-accent hover:border-accent transition-colors text-lg leading-none"
                        style={{ borderRadius: 'var(--r-sm)' }}
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 relative bg-surface-2" style={{ minHeight: '55vh' }}>
                    <iframe
                        src={embedUrl}
                        className="w-full h-full absolute inset-0"
                        title={item.title}
                        allow="autoplay"
                    />
                </div>

                <div className="flex justify-end gap-3 px-5 py-4 border-t border-rule">
                    <a
                        href={item.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary py-2 px-4"
                    >
                        <DownloadIcon className="w-3.5 h-3.5" /> {t.roadmap.downloadPaper}
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Work vs education used to be violet vs blue, each with its own tinted tile,
// dot and forever-pulsing halo. The distinction survives as a filled versus
// hollow node — one hue, still readable at a glance.
const TimelineItem = ({ item, index, t, onPreview }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    const isWork = item.type === 'work';
    const Icon = isWork ? BriefcaseIcon : GraduationCapIcon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            {/* Node on the rail */}
            <div
                className="absolute -left-[2.6rem] top-7 w-[9px] h-[9px]"
                style={{
                    background: isWork ? 'var(--accent)' : 'var(--bg)',
                    border: `1px solid ${isWork ? 'var(--accent)' : 'var(--rule-strong)'}`,
                }}
            />

            <div className="panel p-6 md:p-7">
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-rule">
                            <span className="label label-accent flex-shrink-0">{item.period}</span>
                            <span className="label truncate">
                                {item.type ? (t.roadmap.tags[item.type.toLowerCase()] || item.type) : item.type}
                            </span>
                            <Icon className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-ink-dim" />
                        </div>

                        <h3 className="font-display text-xl font-bold tracking-tight text-ink mb-1">{item.title}</h3>
                        <p className="text-sm text-ink-muted font-light mb-3">{item.institution}</p>
                        <p className="text-sm text-ink-dim font-light leading-relaxed whitespace-pre-line">{item.details}</p>

                        {item.paperUrl && (
                            <div className="flex flex-wrap gap-3 mt-5">
                                <button onClick={() => onPreview(item)} className="btn btn-primary py-2 px-4">
                                    <EyeIcon className="w-3.5 h-3.5" /> {t.roadmap.previewPaper}
                                </button>
                                <a
                                    href={item.paperUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary py-2 px-4"
                                >
                                    <DownloadIcon className="w-3.5 h-3.5" /> {t.roadmap.downloadPaper}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const CareerRoadmapSection = ({ t }) => {
    const [previewItem, setPreviewItem] = useState(null);
    const lineRef = useRef(null);
    const isLineInView = useInView(lineRef, { once: true, margin: '-5% 0px' });

    return (
        <>
            <Section id="roadmap" title={t.roadmap.title} subtitle={t.roadmap.subtitle}>
                <div ref={lineRef} className="relative pl-10 space-y-8 ml-2">
                    {/* Rail: a hairline, drawn once on entry */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-rule" />
                    <motion.div
                        className="absolute left-0 top-0 w-px origin-top"
                        style={{ height: '100%', background: 'var(--accent-line)' }}
                        initial={{ scaleY: 0 }}
                        animate={isLineInView ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {portfolioData.careerRoadmap.map((item, index) => (
                        <TimelineItem
                            key={index}
                            item={item}
                            index={index}
                            t={t}
                            onPreview={setPreviewItem}
                        />
                    ))}
                </div>
            </Section>

            <AnimatePresence>
                {previewItem && (
                    <PaperModal
                        key="paper-modal"
                        item={previewItem}
                        t={t}
                        onClose={() => setPreviewItem(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
