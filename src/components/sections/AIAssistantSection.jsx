import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import AIAssistantVisual from '../visuals/AIAssistantVisual';
import { SendIcon, SparklesIcon, BotIcon } from '../../icons/Icons';
import { streamGeminiResponse, getApiKey } from '../../geminiEmbed';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `
You are Ashwin's AI Recruiter Assistant. You represent Ashwin, an AI Engineer.
Ashwin's Resume Data:
${JSON.stringify(portfolioData)}

If the user asks casual questions or wants general info, talk to them normally and sell Ashwin's skills and projects in a friendly, professional way.
IF you detect that the user has pasted a JOB DESCRIPTION or is asking about Ashwin's fit for a specific role/job, YOU MUST RETURN PURE JSON matching the structure below. NEVER return markdown or conversational text if it is a job evaluation.

{
  "type": "fit_report",
  "score": <0-100 number>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["gap1", "gap2"],
  "alignment": "Short paragraph explaining why Ashwin is a good fit.",
  "recommendation": "Short final recommendation statement."
}

Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Just output the raw JSON object.
`;

const ScoreDial = ({ score }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#4ade80' : score >= 60 ? '#facc15' : '#ef4444';

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle
                    cx="50" cy="50" r="40" fill="transparent" stroke={color} strokeWidth="8"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white leading-none">{score}</span>
                <span className="text-[9px] text-white/50 tracking-wider">SCORE</span>
            </div>
        </div>
    );
};

const FitReportCard = ({ data, t }) => {
    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 mt-2 flex flex-col gap-6 w-full shadow-lg">
            <div className="flex items-center gap-6 pb-6 border-b border-white/[0.06]">
                <ScoreDial score={data.score || 0} />
                <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white/90 mb-2">{t.cardTitle}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{data.alignment}</p>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h5 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Matching Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {data.matching_skills?.map(skill => (
                            <span key={skill} className="px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-300 text-xs">{skill}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Skill Gaps
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {data.missing_skills?.length > 0 ? data.missing_skills.map(skill => (
                            <span key={skill} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">{skill}</span>
                        )) : <span className="text-xs text-white/40 italic">No major gaps detected.</span>}
                    </div>
                </div>
            </div>
            
            <blockquote className="border-l-2 border-blue-500/50 pl-4 py-1 text-sm text-white/80 italic bg-blue-500/5 rounded-r-lg mt-2">
                "{data.recommendation}"
            </blockquote>
        </div>
    );
};

export const AIAssistantSection = ({ t }) => {
    const [messages, setMessages] = useState([
        { role: 'model', content: t.assistant.initialMessage }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        const userMsg = input.trim();
        setInput('');
        
        // Push user message, and a placeholder for the model response
        const newMessages = [...messages, { role: 'user', content: userMsg }, { role: 'model', content: '' }];
        setMessages(newMessages);
        setIsGenerating(true);

        const apiMessages = [
            { role: 'user', content: SYSTEM_PROMPT },
            { role: 'model', content: "Understood. I am ready." },
            ...newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }))
        ];

        try {
            await streamGeminiResponse(
                apiMessages,
                (chunk) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].content = chunk;
                        return updated;
                    });
                },
                (finalText) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].content = finalText;
                        return updated;
                    });
                    setIsGenerating(false);
                },
                (err) => {
                    console.error("Gemini Error:", err);
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].content = "Sorry, I encountered an error connecting to my core processor.";
                        return updated;
                    });
                    setIsGenerating(false);
                }
            );
        } catch (error) {
            console.error(error);
            setIsGenerating(false);
        }
    };

    const renderMessageContent = (msg) => {
        if (msg.role === 'user') {
            return <div className="bg-blue-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md max-w-[85%] leading-relaxed">{msg.content}</div>;
        }

        // Try parsing JSON if content looks like JSON
        try {
            const possibleJson = msg.content.substring(msg.content.indexOf("{"), msg.content.lastIndexOf("}") + 1);
            if (possibleJson && possibleJson.includes('"type": "fit_report"')) {
                const data = JSON.parse(possibleJson);
                if (data.type === 'fit_report') {
                    return <FitReportCard data={data} t={t.assistant} />;
                }
            }
        } catch (e) {
            // Not JSON or incomplete JSON (streaming), just render text
        }

        return (
            <div className="bg-white/5 border border-white/10 text-white/80 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-md max-w-[85%] leading-relaxed whitespace-pre-wrap">
                {msg.content || (isGenerating && <span className="animate-pulse">{t.assistant.generating}</span>)}
            </div>
        );
    };

    return (
        <Section id="assistant" title={t.assistant.title} subtitle={t.assistant.subtitle}>
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                <AnimateOnScroll className="md:col-span-2">
                    <Card className="h-full bg-gradient-to-b from-blue-900/10 to-transparent p-6 md:p-8 flex flex-col justify-center items-center text-center border border-blue-500/20">
                        <AIAssistantVisual isGenerating={isGenerating} />
                        <h3 className="text-xl font-semibold text-white mb-4 mt-8 flex items-center justify-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-blue-400" /> {t.assistant.badge}
                        </h3>
                        <p className="text-sm text-white/50 font-light leading-relaxed">
                            {t.assistant.disclaimer}
                        </p>
                    </Card>
                </AnimateOnScroll>
                
                <AnimateOnScroll delay={200} className="md:col-span-3">
                    <Card className="h-[500px] flex flex-col bg-black/40 border border-white/[0.08] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-50"></div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-blue-400">
                                            <BotIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                    {renderMessageContent(msg)}
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/[0.06]">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t.assistant.placeholder}
                                    className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/50 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/30 resize-none min-h-[50px] max-h-[150px]"
                                    rows="1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isGenerating}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <SendIcon className="w-4 h-4" />
                                </button>
                            </form>
                            <div className="text-[10px] text-center text-white/30 mt-3 font-medium uppercase tracking-widest">
                                Press Enter to send, Shift+Enter for new line
                            </div>
                        </div>
                    </Card>
                </AnimateOnScroll>
            </div>
        </Section>
    );
};
