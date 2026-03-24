import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import AIAssistantVisual from '../visuals/AIAssistantVisual';
import { SendIcon, SparklesIcon, BotIcon, MicIcon, MicOffIcon } from '../../icons/Icons';
import { streamGeminiResponse, getApiKey } from '../../geminiEmbed';
import { useSpeechInput } from '../../hooks/useSpeechInput';
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

const SUGGESTIONS = {
  initial: [
    "What are Ashwin's strongest technical skills?",
    "Tell me about his RAG project",
    "Is he open to relocation in Germany?",
    "Paste a job description for a fit analysis"
  ],
  afterFitReport: [
    "Tell me more about his most relevant project",
    "What's his experience with autonomous systems?",
    "Does he have team collaboration experience?",
    "How quickly could he start a new role?"
  ],
  afterProject: [
    "What other projects has he built?",
    "What tech stack does he prefer?",
    "Does he have any live demos?",
    "What's his GitHub activity like?"
  ],
  afterBackground: [
    "What certifications does he hold?",
    "Tell me about his work experience",
    "What autonomous systems projects has he done?",
    "Can I see his resume?"
  ],
  afterExperience: [
    "What was his role at DXC Technology?",
    "What is he studying at THI Ingolstadt?",
    "Does he have publications or research?",
    "What programming languages does he know?"
  ],
  generic: [
    "What makes Ashwin stand out?",
    "Does he have experience with deep learning?",
    "What's his availability for interviews?",
    "How can I contact him directly?"
  ]
};

function detectSuggestionSet(assistantReply, userMessage) {
  const reply = assistantReply.toLowerCase();
  const query = userMessage.toLowerCase();

  if (
    reply.includes('match score') || 
    reply.includes('matchscore') ||
    reply.includes('matching skills') ||
    reply.includes('skill gap') ||
    query.length > 200
  ) return 'afterFitReport';

  if (
    reply.includes('github') ||
    reply.includes('built') ||
    reply.includes('implemented') ||
    reply.includes('framework') ||
    reply.includes('rag') ||
    reply.includes('yolo') ||
    reply.includes('radar') ||
    reply.includes('cnn')
  ) return 'afterProject';

  if (
    reply.includes('dxc') ||
    reply.includes('analyst') ||
    reply.includes('thi') ||
    reply.includes('ingolstadt') ||
    reply.includes('master') ||
    reply.includes('degree')
  ) return 'afterExperience';

  if (
    reply.includes('python') ||
    reply.includes('pytorch') ||
    reply.includes('skill') ||
    reply.includes('experience') ||
    reply.includes('certification')
  ) return 'afterBackground';

  return 'generic';
}

const CONVERSATION_STARTERS = [
  {
    icon: "📋",
    title: "Analyze a Job Description",
    subtitle: "Paste a JD for an instant fit report",
    message: "I have a job description I'd like you to analyze for Ashwin's fit."
  },
  {
    icon: "🤖",
    title: "AI & ML Projects",
    subtitle: "RAG, YOLO, GANs, computer vision",
    message: "Tell me about Ashwin's most impressive AI and machine learning projects."
  },
  {
    icon: "🚗",
    title: "Autonomous Systems",
    subtitle: "Radar, LiDAR, roundabout coordination",
    message: "What autonomous systems experience does Ashwin have?"
  },
  {
    icon: "💼",
    title: "Work Experience",
    subtitle: "DXC Technology, THI Germany",
    message: "Walk me through Ashwin's professional background and education."
  }
];

const TYPING_STATUSES = {
  fitReport: [
    "Reading job description...",
    "Matching against Ashwin's skills...",
    "Analyzing project relevance...",
    "Calculating fit score...",
    "Crafting your report..."
  ],
  project: [
    "Searching Ashwin's project portfolio...",
    "Pulling technical details...",
    "Composing the answer..."
  ],
  general: [
    "Thinking...",
    "Searching Ashwin's background...",
    "Composing the answer...",
    "Almost ready..."
  ]
};

const CopyIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

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
    const [suggestions, setSuggestions] = useState(SUGGESTIONS.initial);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [typingStatus, setTypingStatus] = useState('');
    const typingIntervalRef = useRef(null);
    const [copiedId, setCopiedId] = useState(null);
    const [voiceError, setVoiceError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(typingIntervalRef.current);
    }, []);

    function startTypingStatus(userMessage) {
        const isJD = userMessage.length > 200 || 
            ['requirement', 'qualification', 'responsibility', 'we are looking'].some(k => userMessage.toLowerCase().includes(k));
        const isProject = ['project', 'rag', 'yolo', 'radar', 'cnn', 'built', 'github'].some(k => userMessage.toLowerCase().includes(k));
        const set = isJD ? TYPING_STATUSES.fitReport : isProject ? TYPING_STATUSES.project : TYPING_STATUSES.general;

        let index = 0;
        setTypingStatus(set[0]);

        typingIntervalRef.current = setInterval(() => {
            index = (index + 1) % set.length;
            setTypingStatus(set[index]);
        }, 1500);
    }

    function stopTypingStatus() {
        clearInterval(typingIntervalRef.current);
        setTypingStatus('');
    }

    const { isListening, startListening, stopListening } = useSpeechInput({
        onResult: (transcript, isFinal) => {
            setInput(transcript);
            if (isFinal) {
                setTimeout(() => {
                    if (transcript.trim()) handleSend(null, transcript);
                }, 400);
            }
        },
        onError: (msg) => {
            setVoiceError(msg);
            setTimeout(() => setVoiceError(''), 4000);
        }
    });

    useEffect(() => {
        const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        if (!supported) {
            setVoiceError('Voice input works best in Chrome or Edge.');
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating]);

    const handleSend = async (e, overrideText) => {
        if (e) e.preventDefault();
        const messageText = overrideText || input;
        if (!messageText.trim() || isGenerating) return;

        setShowSuggestions(false);
        setSuggestions([]);

        const userMsg = messageText.trim();
        setInput('');
        
        startTypingStatus(userMsg);

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
                    stopTypingStatus();
                    
                    const lastUserMsg = newMessages.findLast(m => m.role === 'user');
                    const set = detectSuggestionSet(finalText, lastUserMsg?.content || '');
                    setSuggestions(SUGGESTIONS[set]);
                    setShowSuggestions(true);
                },
                (err) => {
                    console.error("Gemini Error:", err);
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].content = "Sorry, I encountered an error connecting to my core processor.";
                        return updated;
                    });
                    setIsGenerating(false);
                    stopTypingStatus();
                }
            );
        } catch (error) {
            console.error(error);
            setIsGenerating(false);
            stopTypingStatus();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setShowSuggestions(false);
        handleSend(null, suggestion);
    };

    const handleCopy = (text, id) => {
        let copyText = text;
        try {
            const parsed = JSON.parse(text);
            if (parsed.type === 'fit_report') {
                copyText = `Match Score: ${parsed.score}%\n\n` +
                    `Matching Skills:\n${parsed.matching_skills.map(s => `• ${s}`).join('\n')}\n\n` +
                    `Gaps:\n${parsed.missing_skills?.map(g => `• ${g}`).join('\n') || 'None'}\n\n` +
                    `Alignment: ${parsed.alignment}\n\n` +
                    `Recommendation: ${parsed.recommendation}`;
            }
        } catch {}
        
        navigator.clipboard.writeText(copyText).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const handleRegenerate = () => {
        const lastUserIndex = [...messages].reverse().findIndex(m => m.role === 'user');
        if (lastUserIndex === -1) return;
        
        const actualIndex = messages.length - 1 - lastUserIndex;
        const lastUserMessage = messages[actualIndex].content;

        setMessages(prev => prev.slice(0, actualIndex + 1));
        setTimeout(() => handleSend(null, lastUserMessage), 100);
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
            <div className="bg-white/5 border border-white/10 text-white/80 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-md leading-relaxed whitespace-pre-wrap">
                {msg.content}
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
                            <AnimatePresence>
                                {messages.length === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4"
                                    >
                                        {CONVERSATION_STARTERS.map((starter, i) => (
                                            <motion.button
                                                key={starter.title}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08, duration: 0.35 }}
                                                onClick={() => handleSuggestionClick(starter.message)}
                                                disabled={isGenerating}
                                                className="
                                                    group text-left p-4 rounded-2xl
                                                    bg-white/[0.03] border border-white/[0.06]
                                                    hover:bg-white/[0.06] hover:border-white/[0.12]
                                                    transition-all duration-300 cursor-pointer
                                                    disabled:opacity-30 disabled:cursor-not-allowed
                                                "
                                            >
                                                <div className="text-2xl mb-2">{starter.icon}</div>
                                                <div className="text-sm font-medium text-white/80 mb-1 leading-snug group-hover:text-white transition-colors">
                                                    {starter.title}
                                                </div>
                                                <div className="text-xs text-white/30 leading-snug group-hover:text-white/50 transition-colors">
                                                    {starter.subtitle}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {messages.map((msg, i) => {
                                if (msg.role === 'model' && !msg.content) return null;

                                return (
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
                                        {msg.role === 'model' ? (
                                            <div className="group relative max-w-[85%]">
                                                {renderMessageContent(msg)}
                                                <button
                                                    onClick={() => handleCopy(msg.content, i)}
                                                    className="
                                                        absolute top-2 right-2
                                                        opacity-0 group-hover:opacity-100
                                                        transition-all duration-200
                                                        w-7 h-7 rounded-lg
                                                        bg-white/[0.06] border border-white/[0.08]
                                                        hover:bg-white/[0.12] hover:border-white/[0.15]
                                                        flex items-center justify-center
                                                        text-white/40 hover:text-white/70
                                                    "
                                                    title="Copy message"
                                                >
                                                    {copiedId === i ? (
                                                        <motion.span
                                                            initial={{ scale: 0.8 }}
                                                            animate={{ scale: 1 }}
                                                            className="text-green-400 text-[10px] font-medium"
                                                        >
                                                            ✓
                                                        </motion.span>
                                                    ) : (
                                                        <CopyIcon className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            renderMessageContent(msg)
                                        )}
                                    </motion.div>
                                );
                            })}
                            
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        key="suggestions"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex flex-col gap-1 pb-4"
                                    >
                                        <p className="text-[9px] text-white/20 uppercase tracking-widest px-4 pt-2 pb-1 font-medium">
                                            Suggested
                                        </p>
                                        <div className="px-4 flex flex-wrap gap-2">
                                            {suggestions.map((suggestion, i) => (
                                                <motion.button
                                                    key={suggestion}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.06, duration: 0.25 }}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    disabled={isGenerating}
                                                    className="
                                                        suggestion-chip text-xs px-3 py-1.5 rounded-full
                                                        bg-white/[0.04] border border-white/[0.08]
                                                        text-white/50 hover:text-white/80
                                                        hover:bg-white/[0.08] hover:border-white/[0.15]
                                                        transition-all duration-200 cursor-pointer
                                                        disabled:opacity-30 disabled:cursor-not-allowed
                                                        text-left leading-snug
                                                    "
                                                >
                                                    {suggestion}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isGenerating && 
                             !showSuggestions && 
                             messages.length > 1 && 
                             messages[messages.length - 1].role === 'model' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex justify-start px-4 pb-2"
                                >
                                    <button
                                        onClick={handleRegenerate}
                                        className="
                                            flex items-center gap-1.5
                                            text-[11px] text-white/25 
                                            hover:text-white/50
                                            transition-colors duration-200
                                            group
                                        "
                                    >
                                        <svg 
                                            className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" 
                                            viewBox="0 0 24 24" fill="none" 
                                            stroke="currentColor" strokeWidth="2"
                                        >
                                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                            <path d="M3 3v5h5"/>
                                        </svg>
                                        Regenerate response
                                    </button>
                                </motion.div>
                            )}

                            {isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 px-4 py-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400">
                                        <BotIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <div
                                                    key={i}
                                                    className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"
                                                    style={{ animation: `typing-dot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                                                />
                                            ))}
                                        </div>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={typingStatus}
                                                initial={{ opacity: 0, x: 6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -6 }}
                                                transition={{ duration: 0.25 }}
                                                className="text-xs text-white/30 font-light italic"
                                            >
                                                {typingStatus}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/[0.06]">
                            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={isListening ? stopListening : startListening}
                                    disabled={isGenerating}
                                    title={isListening ? "Stop listening" : "Speak your message"}
                                    className={`
                                        flex-shrink-0 w-10 h-10 rounded-full border transition-all duration-300
                                        flex items-center justify-center
                                        ${isListening 
                                        ? 'bg-red-500/20 border-red-500/50 text-red-400 mic-pulse' 
                                        : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.08]'
                                        }
                                        ${isGenerating ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    {isListening ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                                </button>
                                <div className="relative flex-1">
                                    <textarea
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            setShowSuggestions(false);
                                        }}
                                        onBlur={() => {
                                            if (!input.trim()) setShowSuggestions(true);
                                        }}
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
                                </div>
                            </form>
                            {voiceError && (
                                <p className="text-amber-400/70 text-xs mt-2 text-center">
                                    {voiceError}
                                </p>
                            )}
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
