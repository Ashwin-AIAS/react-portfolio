import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import AIAssistantVisual from '../visuals/AIAssistantVisual';
import { SendIcon, SparklesIcon, BotIcon, MicIcon, MicOffIcon } from '../../icons/Icons';
import { streamGeminiResponse, getApiKey } from '../../geminiEmbed';
import { useSpeechInput } from '../../hooks/useSpeechInput';
import { useGeminiLive } from '../../hooks/useGeminiLive';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `
You are Ashwin's AI Portfolio Assistant. You handle both general questions about Ashwin (skills, GitHub activity, background, etc.) and job description matching.

Ashwin's Resume Data:
${JSON.stringify(portfolioData)}

GitHub Activity Highlights (Top 10 Recent Repos):
{{GITHUB_REPOS}}

INSTRUCTIONS:
1. For general questions: Answer in a friendly, professional, and concise way (2-3 sentences). Highlight Ashwin's skills and projects.
2. For job description analysis: If the user pastes a job description or asks about fit, YOU MUST RETURN PURE JSON. NEVER return markdown or conversational text for fit analysis.

JSON structure for fit analysis:
{
  "type": "fit_report",
  "score": <0-100 number>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["gap1", "gap2"],
  "alignment": "Short paragraph explaining why Ashwin is a good fit.",
  "recommendation": "Short final recommendation statement."
}
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

// A gauge, not a party trick: the ring is the track, the arc is the reading,
// and the number is mono so it lines up whatever the score. Green/yellow/red
// became the status pair plus the accent — three states, no new hues.
const ScoreDial = ({ score }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? 'var(--ok)' : score >= 60 ? 'var(--accent)' : 'var(--err)';

    return (
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--rule)" strokeWidth="6" />
                <motion.circle
                    cx="50" cy="50" r="40" fill="transparent" stroke={color} strokeWidth="6"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="readout-value text-2xl leading-none" style={{ color }}>{score}</span>
                <span className="label mt-1">Score</span>
            </div>
        </div>
    );
};

const FitReportCard = ({ data, t }) => (
    <div className="panel p-5 mt-2 flex flex-col gap-5 w-full">
        <div className="flex items-center gap-5 pb-5 border-b border-rule">
            <ScoreDial score={data.score || 0} />
            <div className="flex-1 min-w-0">
                <h4 className="font-display text-base font-bold tracking-tight text-ink mb-2">{t.cardTitle}</h4>
                <p className="text-sm text-ink-muted leading-relaxed">{data.alignment}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div>
                <h5 className="label mb-3" style={{ color: 'var(--ok)' }}>Matching Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                    {data.matching_skills?.map(skill => (
                        <span
                            key={skill}
                            className="tech-tag"
                            style={{ color: 'var(--ok)', borderColor: 'var(--ok-wash)' }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h5 className="label label-accent mb-3">Skill Gaps</h5>
                <div className="flex flex-wrap gap-1.5">
                    {data.missing_skills?.length > 0
                        ? data.missing_skills.map(skill => (
                            <span key={skill} className="tech-tag">{skill}</span>
                        ))
                        : <span className="label">No major gaps detected</span>}
                </div>
            </div>
        </div>

        <blockquote className="border-l-2 pl-4 py-1 text-sm text-ink leading-relaxed" style={{ borderColor: 'var(--accent)' }}>
            {data.recommendation}
        </blockquote>
    </div>
);

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
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [activeChip, setActiveChip] = useState(null);
    const isConnectedRef = useRef(false);
    const messagesEndRef = useRef(null);

    const chatContainerRef = useRef(null);

    const geminiLive = useGeminiLive();

    useEffect(() => {
        isConnectedRef.current = geminiLive.isConnected;
    }, [geminiLive.isConnected]);

    const RECRUITER_VOICE_PROMPT = `
You are Ashwin's AI Recruiter assistant. You are helping evaluate Ashwin Kumar for technical roles.
Answer questions about his skills, experience, and projects professionally and concisely.
If the user provides a job description, produce a structured fit report.
Ashwin's Data: ${JSON.stringify(portfolioData)}

Rules:
1. If the user asks a question, answer it in 2-3 sentences.
2. If the user provides a job description, analyze it and then output a JSON object with this structure:
{
  "type": "fit_report",
  "score": <0-100>,
  "matching_skills": [...],
  "missing_skills": [...],
  "alignment": "...",
  "recommendation": "..."
}
Wait for the user to finish speaking before responding.
`;

    // Handle voice transcript streaming into chat
    useEffect(() => {
        if (geminiLive.transcript && geminiLive.isConnected) {
            if (isVoiceMode) {
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'model' && last.isVoice) {
                        const updated = [...prev];
                        updated[updated.length - 1].content = geminiLive.transcript;
                        return updated;
                    } else {
                        return [...prev, { role: 'model', content: geminiLive.transcript, isVoice: true }];
                    }
                });
            }
        }
    }, [geminiLive.transcript, isVoiceMode, geminiLive.isConnected]);

    // Handle structured output from voice
    useEffect(() => {
        if (geminiLive.structuredOutput && geminiLive.structuredOutput.type === 'fit_report') {
            // We can choose to replace the last message or just let it be
        }
    }, [geminiLive.structuredOutput]);

    // Handle completion of a Gemini Live response turn
    useEffect(() => {
        if (geminiLive.isResponseComplete) {
            setIsGenerating(false);
            stopTypingStatus();
            
            // Generate suggestions from the final transcript
            const lastUserMsg = messages.findLast(m => m.role === 'user');
            const set = detectSuggestionSet(geminiLive.transcript, lastUserMsg?.content || '');
            setSuggestions(SUGGESTIONS[set]);
            setShowSuggestions(true);
            
            scrollToBottom(true);
        }
    }, [geminiLive.isResponseComplete]);

    const toggleVoiceMode = async () => {
        if (isVoiceMode) {
            if (geminiLive.isConnected) geminiLive.disconnect();
            setIsVoiceMode(false);
        } else {
            setIsVoiceMode(true);
        }
    };


    const waitForConnection = (timeoutMs = 8000) => {
        return new Promise((resolve, reject) => {
            if (isConnectedRef.current) { resolve(); return; }
            console.log('[CHIP] waiting for connection...');
            const start = Date.now();
            const interval = setInterval(() => {
                if (isConnectedRef.current) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - start > timeoutMs) {
                    clearInterval(interval);
                    reject(new Error('WebSocket connection timed out after ' + timeoutMs + 'ms'));
                }
            }, 100);
        });
    };

    const handleChipClick = async (chipText) => {
        console.log('[CHIP] clicked:', chipText);
        if (isGenerating || activeChip) return;
        
        try {
            setActiveChip(chipText);
            const prompt = RECRUITER_VOICE_PROMPT;

            if (!isConnectedRef.current) {
                console.log('[CHIP] not connected, calling connect()...');
                await geminiLive.connect(prompt, { responseModalities: ['AUDIO', 'TEXT'] });
                console.log('[CHIP] connect() called, waiting for WebSocket open...');
                await waitForConnection();
                console.log('[CHIP] WebSocket is now open');
            }

            if (isConnectedRef.current) {
                console.log('[CHIP] sending message to WebSocket');
                setMessages(prev => [...prev, { role: 'user', content: chipText }]);
                setIsGenerating(true);
                startTypingStatus(chipText);

                geminiLive.sendText(chipText);
                console.log('[CHIP] message sent successfully');
            }
        } catch (err) {
            console.error("[CHIP] error:", err);
            setVoiceError("Connection lost. Please try again.");
        } finally {
            setActiveChip(null);
        }
    };


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

    const scrollToBottom = (smooth = true) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    useEffect(() => {
        scrollToBottom(true);
    }, [messages]);

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

        // Fetch GitHub repos
        let githubContext = "GitHub data unavailable.";
        try {
            const githubRes = await fetch('https://api.github.com/users/Ashwin-AIAS/repos?sort=updated&per_page=10');
            if (githubRes.ok) {
                const repos = await githubRes.json();
                githubContext = repos.map(r => `- ${r.name}: ${r.description || 'No description'} (Language: ${r.language || 'N/A'})`).join('\n');
            }
        } catch (err) {
            console.error("GitHub fetch error:", err);
        }

        const fullSystemPrompt = SYSTEM_PROMPT.replace('{{GITHUB_REPOS}}', githubContext);

        const apiMessages = [
            { role: 'user', content: fullSystemPrompt },
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
                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }, 0);
                },
                (finalText) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].content = finalText;
                        return updated;
                    });
                    setIsGenerating(false);
                    stopTypingStatus();
                    
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTo({
                            top: chatContainerRef.current.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                    
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
            return (
                <div
                    className="text-sm px-4 py-2.5 max-w-[85%] leading-relaxed text-ink bg-surface-3 border border-accent-line"
                    style={{ borderRadius: 'var(--r-md)' }}
                >
                    {msg.content}
                </div>
            );
        }

        // Check if this is a voice-driven structured output or contains JSON
        const sourceMessage = msg.content;
        try {
            const possibleJsonMatch = sourceMessage.match(/\{[\s\S]*\}/);
            if (possibleJsonMatch) {
                const data = JSON.parse(possibleJsonMatch[0]);
                if (data.type === 'fit_report') {
                    return <FitReportCard data={data} t={t.assistant} />;
                }
            }
        } catch (e) {}


        return (
            <div
                className="bg-surface-1 border border-rule text-ink-muted text-sm px-4 py-2.5 leading-relaxed whitespace-pre-wrap"
                style={{ borderRadius: 'var(--r-md)' }}
            >
                {msg.content}
            </div>
        );
    };

    return (
        <Section id="assistant" title={t.assistant.title} subtitle={t.assistant.subtitle}>
            <div className="grid md:grid-cols-5 gap-4">
                <AnimateOnScroll className="md:col-span-2">
                    <Card className="h-full">
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-rule">
                                <span className="label label-accent flex items-center gap-2">
                                    <SparklesIcon className="w-3 h-3" /> {t.assistant.badge}
                                </span>
                            </div>

                            <AIAssistantVisual isGenerating={isGenerating} />

                            <p className="text-sm text-ink-muted font-light leading-relaxed mt-6">
                                {t.assistant.disclaimer}
                            </p>

                            <dl className="mt-auto pt-6 border-t border-rule">
                                <div className="readout-row">
                                    <dt>Mode</dt>
                                    <dd>{isVoiceMode ? 'Live voice' : 'Text'}</dd>
                                </div>
                                <div className="readout-row">
                                    <dt>State</dt>
                                    <dd className="flex items-center gap-2">
                                        <span
                                            className="status-dot"
                                            style={{ background: isGenerating ? 'var(--accent)' : 'var(--ok)' }}
                                        />
                                        {isGenerating ? 'Generating' : 'Ready'}
                                    </dd>
                                </div>
                                <div className="readout-row">
                                    <dt>Model</dt>
                                    <dd>Gemini 2.5 Flash</dd>
                                </div>
                            </dl>
                        </div>
                    </Card>
                </AnimateOnScroll>

                <AnimateOnScroll delay={120} className="md:col-span-3">
                    <Card className="h-[550px] flex flex-col relative overflow-hidden">

                        <div 
                                ref={chatContainerRef}
                                onWheel={(e) => e.stopPropagation()}
                                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth min-h-0"
                            >
                                <AnimatePresence>
                                    {messages.length === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4"
                                        >
                                            {/* The four emoji tiles are now numbered entries —
                                                same four routes in, one less visual language. */}
                                            {CONVERSATION_STARTERS.map((starter, i) => (
                                                <motion.button
                                                    key={starter.title}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.06, duration: 0.3 }}
                                                    onClick={() => handleSuggestionClick(starter.message)}
                                                    disabled={isGenerating}
                                                    className="
                                                        group text-left p-4
                                                        bg-surface-1 border border-rule
                                                        hover:border-accent
                                                        transition-colors duration-200 cursor-pointer
                                                        disabled:opacity-30 disabled:cursor-not-allowed
                                                    "
                                                    style={{ borderRadius: 'var(--r-md)' }}
                                                >
                                                    <div className="label label-accent mb-2">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </div>
                                                    <div className="font-display text-sm font-bold tracking-tight text-ink mb-1 leading-snug group-hover:text-accent transition-colors">
                                                        {starter.title}
                                                    </div>
                                                    <div className="text-xs text-ink-dim leading-snug">
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
                                                <div
                                                    className="w-8 h-8 border border-rule flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-accent"
                                                    style={{ borderRadius: 'var(--r-sm)' }}
                                                >
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
                                                            transition-opacity duration-200
                                                            w-7 h-7
                                                            bg-surface-2 border border-rule
                                                            hover:border-accent
                                                            flex items-center justify-center
                                                            text-ink-dim hover:text-accent
                                                        "
                                                        style={{ borderRadius: 'var(--r-sm)' }}
                                                        title="Copy message"
                                                    >
                                                        {copiedId === i ? (
                                                            <span className="text-[10px] font-medium" style={{ color: 'var(--ok)' }}>
                                                                ✓
                                                            </span>
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
                                            <p className="label px-4 pt-2 pb-1">
                                                Suggested Questions
                                            </p>
                                            <div className="px-4 flex flex-wrap gap-2">
                                                {suggestions.map((suggestion, i) => (
                                                    <motion.button
                                                        type="button"
                                                        key={suggestion}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.06, duration: 0.25 }}
                                                        onClick={() => isVoiceMode ? handleChipClick(suggestion) : handleSuggestionClick(suggestion)}
                                                        disabled={isGenerating || (activeChip && activeChip !== suggestion)}
                                                        className={`
                                                            suggestion-chip chip
                                                            ${activeChip === suggestion ? 'chip-active' : ''}
                                                            disabled:opacity-30 disabled:cursor-not-allowed
                                                        `}
                                                    >
                                                        {activeChip === suggestion && (
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                                style={{
                                                                    border: '2px solid var(--rule-strong)',
                                                                    borderTopColor: 'var(--accent)',
                                                                }}
                                                            />
                                                        )}
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
                                            className="label hover:text-accent transition-colors duration-200 group flex items-center gap-2"
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
                                        <div
                                            className="w-8 h-8 border border-rule flex items-center justify-center flex-shrink-0 text-accent"
                                            style={{ borderRadius: 'var(--r-sm)' }}
                                        >
                                            <BotIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {[0, 1, 2].map(i => (
                                                    <div
                                                        key={i}
                                                        className="w-1.5 h-1.5"
                                                        style={{
                                                            background: 'var(--accent)',
                                                            animation: `typing-dot 1.2s ease-in-out infinite`,
                                                            animationDelay: `${i * 0.2}s`,
                                                        }}
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
                                                    className="label"
                                                >
                                                    {typingStatus}
                                                </motion.span>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                        <div className="flex-shrink-0 p-4 bg-surface-2 border-t border-rule">
                            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isVoiceMode) {
                                                if (geminiLive.isConnected) {
                                                    geminiLive.disconnect();
                                                } else {
                                                    geminiLive.connect(RECRUITER_VOICE_PROMPT, { responseModalities: ['AUDIO', 'TEXT'] });
                                                }
                                            } else {
                                                isListening ? stopListening() : startListening();
                                            }
                                        }}
                                        disabled={isGenerating || (isVoiceMode && geminiLive.isConnecting)}
                                        className={`
                                            flex-shrink-0 w-10 h-10 border transition-colors duration-200
                                            flex items-center justify-center relative
                                            ${(isListening || geminiLive.isConnected)
                                            ? 'border-accent text-accent recruiter-mic-pulse'
                                            : 'bg-surface-1 border-rule text-ink-dim hover:text-accent hover:border-accent'
                                            }
                                            ${(isGenerating || (isVoiceMode && geminiLive.isConnecting)) ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                        style={{ borderRadius: 'var(--r-md)' }}
                                    >
                                        {geminiLive.isConnected && (
                                            <div className="recruiter-waveform">
                                                {Array.from({ length: 8 }).map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: 2 + geminiLive.audioLevel * 15 * (0.5 + Math.random() * 0.5) }}
                                                        className="recruiter-waveform-bar"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {isVoiceMode
                                            ? (geminiLive.isConnected ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />)
                                            : (isListening ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />)
                                        }
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={toggleVoiceMode}
                                        className={`label px-2 py-1.5 border transition-colors ${isVoiceMode ? 'border-accent label-accent' : 'border-rule hover:border-rule-strong'}`}
                                        style={{ borderRadius: 'var(--r-sm)' }}
                                    >
                                        {isVoiceMode ? 'LIVE VOICE' : 'TEXT MODE'}
                                    </button>
                                </div>

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
                                        disabled={isVoiceMode && geminiLive.isConnected}
                                        placeholder={isVoiceMode && geminiLive.isConnected ? "Listening for your voice..." : t.assistant.placeholder}
                                        className="input-field pr-28 resize-none min-h-[50px] max-h-[150px]"
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
                                        className="btn btn-primary absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 py-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? (
                                            <div
                                                className="w-3.5 h-3.5 rounded-full animate-spin"
                                                style={{ border: '2px solid rgba(0,0,0,0.25)', borderTopColor: 'currentColor' }}
                                            />
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-3.5 h-3.5" />
                                                {t.assistant.button}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            {voiceError && (
                                <p className="label mt-2 text-center" style={{ color: 'var(--err)' }}>
                                    {voiceError}
                                </p>
                            )}
                            <div className="label text-center mt-3">
                                Enter to send &middot; Shift+Enter for new line
                            </div>
                        </div>
                    </Card>
                </AnimateOnScroll>
            </div>
        </Section>
    );
};
