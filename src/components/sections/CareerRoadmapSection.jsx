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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 24 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="glass-card w-full max-w-4xl flex flex-col overflow-hidden"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                    <div className="min-w-0">
                        <p className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-0.5 truncate">{item.institution}</p>
                        <h3 className="text-sm font-semibold text-white/90 truncate">{item.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-white/50 hover:text-white/90 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>
                <div className="flex-1 relative" style={{ minHeight: '55vh' }}>
                    <iframe
                        src={embedUrl}
                        className="w-full h-full absolute inset-0"
                        title={item.title}
                        allow="autoplay"
                    />
                </div>
                <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/[0.06]">
                    <a
                        href={item.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-premium btn-secondary text-sm px-5 py-2"
                    >
                        <DownloadIcon className="w-3.5 h-3.5 mr-2" /> {t.roadmap.downloadPaper}
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};

const TimelineItem = ({ item, index, t, onPreview }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    const isWork = item.type === 'work';
    const Icon = isWork ? BriefcaseIcon : GraduationCapIcon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            {/* Dot + pulse */}
            <div className="absolute -left-[2.85rem] flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: 'spring', damping: 12 }}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isWork ? 'border-violet-500/60 bg-violet-900/20' : 'border-blue-500/60 bg-blue-900/20'}`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isWork ? 'bg-violet-400' : 'bg-blue-400'}`} />
                </motion.div>
                <motion.div
                    className={`absolute w-4 h-4 rounded-full ${isWork ? 'bg-violet-500/20' : 'bg-blue-500/20'}`}
                    animate={isInView ? { scale: [1, 2.2], opacity: [0.6, 0] } : {}}
                    transition={{ duration: 1.6, delay: index * 0.15 + 0.4, repeat: Infinity, repeatDelay: 3.5 }}
                />
            </div>

            {/* Card */}
            <motion.div
                className="glass-card p-6 md:p-8"
                whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xs font-medium tracking-wider uppercase ${isWork ? 'text-violet-400/80' : 'text-blue-400/80'}`}>
                                {item.period}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">
                                {item.type ? (t.roadmap.tags[item.type.toLowerCase()] || item.type) : item.type}
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white/90 mb-1">{item.title}</h3>
                        <p className="text-sm text-white/40 font-light mb-3">{item.institution}</p>
                        <p className="text-sm text-white/30 font-light leading-relaxed whitespace-pre-line">{item.details}</p>
                        {item.paperUrl && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                    onClick={() => onPreview(item)}
                                    className="btn-premium btn-primary text-sm px-5 py-2"
                                >
                                    <EyeIcon className="w-3.5 h-3.5 mr-2" /> {t.roadmap.previewPaper}
                                </button>
                                <a
                                    href={item.paperUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-premium btn-secondary text-sm px-5 py-2"
                                >
                                    <DownloadIcon className="w-3.5 h-3.5 mr-2" /> {t.roadmap.downloadPaper}
                                </a>
                            </div>
                        )}
                    </div>
                    <div className={`hidden md:flex w-10 h-10 rounded-xl flex-shrink-0 items-center justify-center ${isWork ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                        <Icon className={`w-5 h-5 ${isWork ? 'text-violet-400/70' : 'text-blue-400/70'}`} />
                    </div>
                </div>
            </motion.div>
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
                <div ref={lineRef} className="relative pl-10 space-y-16 ml-2">
                    {/* Static base line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.04]" />
                    {/* Animated gradient line */}
                    <motion.div
                        className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-blue-500/50 via-violet-500/30 to-transparent"
                        initial={{ scaleY: 0 }}
                        animate={isLineInView ? { scaleY: 1 } : {}}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: '100%' }}
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
