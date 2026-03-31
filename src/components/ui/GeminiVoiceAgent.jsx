import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeminiLive } from '../../hooks/useGeminiLive';
import { MicIcon } from '../../icons/Icons';
import { portfolioData } from '../../data/portfolioData';


const INTERVIEW_PROMPTS = [
  "What are Ashwin's strongest skills?",
  "Tell me about the RAG project",
  "What's his experience with autonomous systems?",
  "Why should I hire Ashwin?",
];

const LIVECODE_PROMPTS = [
  "Write a RAG retrieval pipeline in Python",
  "CNN inference function in C++",
  "React hook for WebSocket streaming",
  "FastAPI endpoint with embeddings",
];

const INTERVIEW_SYSTEM_INSTRUCTION = `You are Ashwin's AI portfolio assistant. Answer questions about Ashwin's skills, projects, and experience in a friendly, concise way. Ashwin is an AI Engineer specializing in autonomous systems, RAG pipelines, computer vision, and generative AI. He is pursuing a Master's in AI Engineering at THI Germany.

Ashwin's Full Data:
${JSON.stringify({ projects: [], skills: [] }, null, 2)} 

RULES:
- Be enthusiastic, professional, and concise (2-3 sentences per response)
- Highlight relevant projects and skills when answering
- If asked about availability: he's open to opportunities in Germany
- Speak naturally as if in a real interview`;
// Note: In a real app, we'd import portfolioData here. For now I'll just use a placeholder or import it if I can.
// Actually, it was imported in the hook. I should import it here too.

const LIVECODE_SYSTEM_INSTRUCTION = `You are Ashwin's AI coding assistant on his portfolio. You demonstrate Ashwin's coding expertise by writing code live.

Ashwin's Technical Background:
- Languages: Python, C/C++, SQL, JavaScript
- AI/ML: PyTorch, Keras, TensorFlow, OpenCV, YOLOv8, LangChain, Gemini API
- Projects: RAG systems, Mini-CNN Framework, YOLO Bat Swing Analysis, Radar-AI

RULES:
- When asked to write code, output the code wrapped in a markdown code block with the language
- Keep code concise (under 40 lines) but functional and well-commented
- After the code block, give a 1-sentence explanation
- Draw from Ashwin's actual project experience when relevant`;


// --- Waveform Visualizer ---
const WaveformVisualizer = ({ audioLevel, isSpeaking, isUserSpeaking }) => {
  const bars = 24;
  return (
    <div className="voice-waveform" style={{ pointerEvents: 'none' }}>
      {Array.from({ length: bars }).map((_, i) => {
        const distance = Math.abs(i - bars / 2) / (bars / 2);
        const baseHeight = 3;
        const maxHeight = 36;
        const level = isSpeaking ? 0.7 : isUserSpeaking ? audioLevel : 0.05;
        const height = baseHeight + (maxHeight - baseHeight) * level * (1 - distance * 0.6) * (0.5 + Math.random() * 0.5);

        return (
          <motion.div
            key={i}
            className="voice-waveform-bar"
            animate={{ height }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            style={{
              background: isSpeaking
                ? 'linear-gradient(to top, #3b82f6, #8b5cf6)'
                : isUserSpeaking
                  ? 'linear-gradient(to top, #06b6d4, #3b82f6)'
                  : 'linear-gradient(to top, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            }}
          />
        );
      })}
    </div>
  );
};

// --- Code Display ---
const CodeDisplay = ({ code, onClear }) => {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [code]);

  const handleCopy = () => {
    const codeMatch = code.match(/```[\w]*\n([\s\S]*?)```/);
    navigator.clipboard.writeText(codeMatch ? codeMatch[1].trim() : code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    return (
      <div className="voice-code-empty">
        <div className="voice-code-empty-icon">{'</>'}</div>
        <p>Ask me to write code and it will appear here in real-time</p>
      </div>
    );
  }

  const langMatch = code.match(/```(\w+)/);
  const language = langMatch ? langMatch[1] : 'code';

  return (
    <div className="voice-code-container">
      <div className="voice-code-header">
        <div className="voice-code-lang">
          <span className="voice-code-dot"></span>
          {language}
        </div>
        <div className="voice-code-actions">
          <button type="button" onClick={onClear} className="voice-code-btn" title="Clear">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
          <button type="button" onClick={handleCopy} className="voice-code-btn" title="Copy">
            {copied ? (
              <span className="text-green-400 text-xs">✓</span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <pre ref={codeRef} className="voice-code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// --- Main Inline Panel Component (not a modal) ---
export const GeminiVoiceAgent = ({ isActive, onActivate }) => {
  const [mode, setMode] = useState('interview');
  const {
    connect,
    disconnect,
    sendText,
    isConnected,
    isConnecting,
    isSpeaking,
    isUserSpeaking,
    transcript,
    error,
    audioLevel,
  } = useGeminiLive();


  const [localCodeOutput, setLocalCodeOutput] = useState('');
  const transcriptRef = useRef(null);


  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      onActivate?.();
      
      const systemPrompt = mode === 'livecode' ? LIVECODE_SYSTEM_INSTRUCTION : INTERVIEW_SYSTEM_INSTRUCTION.replace('${JSON.stringify({ projects: [], skills: [] }, null, 2)}', JSON.stringify(portfolioData, null, 2));
      const options = {
        responseModalities: mode === 'livecode' ? ['AUDIO', 'TEXT'] : ['AUDIO'],
        onTextChunk: mode === 'livecode' ? (chunk) => setLocalCodeOutput(prev => prev + chunk) : null
      };

      await connect(systemPrompt, options);
    }
  };


  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    if (isConnected) {
      disconnect();
    }
    setMode(newMode);
    setLocalCodeOutput('');
  };


  // Auto-connect + send when clicking a chip
  const handlePromptClick = async (prompt) => {
    if (!isConnected && !isConnecting) {
      onActivate?.();
      
      const systemPrompt = mode === 'livecode' ? LIVECODE_SYSTEM_INSTRUCTION : INTERVIEW_SYSTEM_INSTRUCTION.replace('${JSON.stringify({ projects: [], skills: [] }, null, 2)}', JSON.stringify(portfolioData, null, 2));
      const options = {
        responseModalities: mode === 'livecode' ? ['AUDIO', 'TEXT'] : ['AUDIO'],
        onTextChunk: mode === 'livecode' ? (chunk) => setLocalCodeOutput(prev => prev + chunk) : null
      };

      await connect(systemPrompt, options);
      // Wait a moment for connection to establish, then send
      const checkAndSend = () => {
        setTimeout(() => {
          sendText(prompt);
        }, 1500);
      };
      checkAndSend();
    } else if (isConnected) {
      sendText(prompt);
    }
  };


  const prompts = mode === 'interview' ? INTERVIEW_PROMPTS : LIVECODE_PROMPTS;

  const statusText = isConnecting
    ? 'Connecting...'
    : isConnected
      ? isSpeaking
        ? 'AI is speaking...'
        : isUserSpeaking
          ? 'Listening...'
          : 'Ready — speak or tap a prompt'
      : 'Tap mic or a prompt to start';

  // IDLE STATE — shows avatar greeting before user activates
  if (!isActive && !isConnected && !isConnecting) {
    return (
      <div className="hero-voice-idle">
        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hero-speech-bubble"
        >
          <span>👋 Hey! I'm Ashwin — welcome! Let me show you around.</span>
          <div className="hero-speech-bubble-arrow"></div>
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hero-avatar-container"
        >
          <div className="hero-avatar-ring">
            <img src="/Profile%20pic.jpg" alt="Ashwin" className="hero-avatar-img" />
          </div>
        </motion.div>

        {/* Dot indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="hero-dot-indicators"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`hero-dot ${i === 0 ? 'active' : ''}`} />
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="hero-scroll-hint"
        >
          scroll to explore ↓
        </motion.p>

        {/* Floating mic button */}
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="hero-mic-float"
          onClick={handleConnect}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
        >
          <MicIcon className="w-5 h-5" />
        </motion.button>

        {/* Quick prompt chips in idle state too */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="hero-idle-prompts"
          style={{ position: 'relative', zIndex: 10 }}
        >
          {prompts.slice(0, 3).map((prompt, i) => (
            <button
              key={prompt}
              type="button"
              className="voice-agent-prompt-chip"
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  // ACTIVE STATE — full voice agent UI inline
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="hero-voice-active"
    >
      {/* Mode tabs + status */}
      <div className="voice-agent-header">
        <div className="voice-agent-tabs">
          <button
            type="button"
            className={`voice-agent-tab ${mode === 'interview' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('interview')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            Interview
          </button>
          <button
            type="button"
            className={`voice-agent-tab ${mode === 'livecode' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('livecode')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            Live Code
          </button>
        </div>
        <div className="voice-agent-status">
          <span className={`voice-agent-status-dot ${isConnected ? 'connected' : ''} ${isConnecting ? 'connecting' : ''}`}></span>
          {statusText}
        </div>
      </div>

      {/* Code panel for livecode mode */}
  {mode === 'livecode' && (
      <div className="voice-agent-code-panel-inline">
        <CodeDisplay code={localCodeOutput} onClear={() => setLocalCodeOutput('')} />
      </div>
    )}


      {/* Waveform */}
      <div className="voice-agent-waveform-area" style={{ pointerEvents: 'none' }}>
        <WaveformVisualizer
          audioLevel={audioLevel}
          isSpeaking={isSpeaking}
          isUserSpeaking={isUserSpeaking}
        />
      </div>

      {/* Mic button */}
      <div className="voice-agent-mic-wrapper">
        <motion.button
          type="button"
          onClick={handleConnect}
          disabled={isConnecting}
          className={`voice-agent-mic-btn ${isConnected ? 'active' : ''} ${isConnecting ? 'connecting' : ''}`}
          whileTap={{ scale: 0.92 }}
        >
          {isConnecting ? (
            <div className="voice-agent-spinner" />
          ) : isConnected ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <MicIcon className="w-6 h-6" />
          )}
        </motion.button>
        {isConnected && (
          <motion.div
            className="voice-agent-mic-ring"
            animate={{
              scale: [1, 1.3 + audioLevel * 0.5, 1],
              opacity: [0.5, 0.15, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <div ref={transcriptRef} className="voice-agent-transcript">
          {transcript}
        </div>
      )}

      {/* Prompt chips — always clickable, auto-connect on click */}
      <div className="voice-agent-prompts" style={{ position: 'relative', zIndex: 10 }}>
        {prompts.map((prompt, i) => (
          <motion.button
            key={prompt}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            className="voice-agent-prompt-chip"
            onClick={() => handlePromptClick(prompt)}
            disabled={isSpeaking}
            whileTap={{ scale: 0.96 }}
          >
            {prompt}
          </motion.button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="voice-agent-error"
        >
          {error}
        </motion.div>
      )}

      {/* Footer */}
      <div className="voice-agent-footer">
        <span>Powered by Gemini Live</span>
        <span className="voice-agent-footer-dot">·</span>
        <span>Real-time voice AI</span>
      </div>
    </motion.div>
  );
};
