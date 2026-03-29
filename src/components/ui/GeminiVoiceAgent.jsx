import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeminiLive } from '../../hooks/useGeminiLive';
import { MicIcon } from '../../icons/Icons';

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

// --- Waveform Visualizer ---
const WaveformVisualizer = ({ audioLevel, isSpeaking, isUserSpeaking }) => {
  const bars = 32;
  return (
    <div className="voice-waveform">
      {Array.from({ length: bars }).map((_, i) => {
        const distance = Math.abs(i - bars / 2) / (bars / 2);
        const baseHeight = 4;
        const maxHeight = 48;
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
                ? `linear-gradient(to top, #3b82f6, #8b5cf6)`
                : isUserSpeaking
                  ? `linear-gradient(to top, #06b6d4, #3b82f6)`
                  : `linear-gradient(to top, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
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
    // Extract code from markdown code blocks if present
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

  // Parse language from code block
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
          <button onClick={onClear} className="voice-code-btn" title="Clear">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
          <button onClick={handleCopy} className="voice-code-btn" title="Copy">
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

// --- Main Component ---
export const GeminiVoiceAgent = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('interview');
  const {
    connect,
    disconnect,
    sendText,
    clearCode,
    isConnected,
    isConnecting,
    isSpeaking,
    isUserSpeaking,
    transcript,
    codeOutput,
    error,
    audioLevel,
  } = useGeminiLive();

  const transcriptRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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
      await connect(mode === 'livecode' ? 'livecode' : 'interview');
    }
  };

  const handleModeSwitch = async (newMode) => {
    if (newMode === mode) return;
    if (isConnected) {
      disconnect();
    }
    setMode(newMode);
  };

  const handleClose = () => {
    disconnect();
    onClose();
  };

  const handlePromptClick = (prompt) => {
    sendText(prompt);
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
      : 'Click the mic to start';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="voice-agent-overlay"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="voice-agent-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button onClick={handleClose} className="voice-agent-close" title="Close (Esc)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header with mode tabs */}
            <div className="voice-agent-header">
              <div className="voice-agent-tabs">
                <button
                  className={`voice-agent-tab ${mode === 'interview' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('interview')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                  Interview Me
                </button>
                <button
                  className={`voice-agent-tab ${mode === 'livecode' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('livecode')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

            {/* Main content area */}
            <div className={`voice-agent-body ${mode === 'livecode' ? 'livecode-layout' : ''}`}>
              {mode === 'livecode' && (
                <div className="voice-agent-code-panel">
                  <CodeDisplay code={codeOutput} onClear={clearCode} />
                </div>
              )}

              <div className="voice-agent-voice-panel">
                {/* Waveform */}
                <div className="voice-agent-waveform-area">
                  <WaveformVisualizer
                    audioLevel={audioLevel}
                    isSpeaking={isSpeaking}
                    isUserSpeaking={isUserSpeaking}
                  />
                </div>

                {/* Central mic button */}
                <div className="voice-agent-mic-wrapper">
                  <motion.button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className={`voice-agent-mic-btn ${isConnected ? 'active' : ''} ${isConnecting ? 'connecting' : ''}`}
                    whileTap={{ scale: 0.92 }}
                  >
                    {isConnecting ? (
                      <div className="voice-agent-spinner" />
                    ) : isConnected ? (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    ) : (
                      <MicIcon className="w-7 h-7" />
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

                {/* Prompt chips */}
                {!isConnecting && (
                  <div className="voice-agent-prompts">
                    {prompts.map((prompt, i) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="voice-agent-prompt-chip"
                        onClick={() => handlePromptClick(prompt)}
                        disabled={!isConnected}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                )}

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
              </div>
            </div>

            {/* Footer */}
            <div className="voice-agent-footer">
              <span>Powered by Gemini 3.1 Flash Live</span>
              <span className="voice-agent-footer-dot">·</span>
              <span>Real-time voice AI</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
