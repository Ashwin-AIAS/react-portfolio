import { useState, useRef, useCallback, useEffect } from 'react';
import { getApiKey } from '../geminiEmbed';
import { portfolioData } from '../data/portfolioData';

const SAMPLE_RATE = 16000;

const INTERVIEW_SYSTEM_INSTRUCTION = `You are Ashwin's interactive AI voice agent on his portfolio website. You speak AS Ashwin's representative.

Ashwin's Data:
${JSON.stringify(portfolioData, null, 2)}

RULES:
- Answer questions about Ashwin's skills, projects, experience, education conversationally
- Be enthusiastic, professional, and concise (2-3 sentences per response)
- Highlight relevant projects and skills when answering
- If asked about availability: he's open to opportunities in Germany
- Speak naturally as if in a real interview`;

const LIVECODE_SYSTEM_INSTRUCTION = `You are Ashwin's AI coding assistant on his portfolio. You demonstrate Ashwin's coding expertise by writing code live.

Ashwin's Technical Background:
- Languages: Python, C/C++, SQL, JavaScript
- AI/ML: PyTorch, Keras, TensorFlow, OpenCV, YOLOv8, LangChain, Gemini API
- Projects: RAG systems, Mini-CNN Framework, YOLO Bat Swing Analysis, Radar-AI

RULES:
- When asked to write code, output ONLY the code wrapped in a markdown code block with the language
- Keep code concise (under 40 lines) but functional and well-commented
- After the code block, give a 1-sentence explanation
- If asked about the code, explain it conversationally
- Draw from Ashwin's actual project experience when relevant`;

/**
 * Hook for Gemini Live API real-time audio streaming
 */
export function useGeminiLive() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const playbackContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const modeRef = useRef('interview');
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const floatTo16BitPCM = useCallback((float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }, []);

  const arrayBufferToBase64 = useCallback((buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }, []);

  const base64ToArrayBuffer = useCallback((base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }, []);

  const playAudioChunk = useCallback(async (base64Audio) => {
    if (!playbackContextRef.current) {
      playbackContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }

    const ctx = playbackContextRef.current;
    const pcmData = base64ToArrayBuffer(base64Audio);
    const int16 = new Int16Array(pcmData);
    const float32 = new Float32Array(int16.length);

    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    audioQueueRef.current.push(audioBuffer);

    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  }, []);

  const playNextInQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);

    const ctx = playbackContextRef.current;
    const buffer = audioQueueRef.current.shift();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = playNextInQueue;
    source.start();
  }, []);

  const startMicCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: SAMPLE_RATE });
      const ctx = audioContextRef.current;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Analyser for audio level visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Monitor audio level
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 255);
        setIsUserSpeaking(avg > 25);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      // ScriptProcessor for sending audio data
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(ctx.destination);

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = floatTo16BitPCM(inputData);
          const base64 = arrayBufferToBase64(pcm16);

          wsRef.current.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{
                mimeType: `audio/pcm;rate=${SAMPLE_RATE}`,
                data: base64
              }]
            }
          }));
        }
      };
    } catch (err) {
      console.error('Mic access error:', err);
      setError('Microphone access denied. Please allow microphone access.');
      throw err;
    }
  }, [floatTo16BitPCM, arrayBufferToBase64]);

  const stopMicCapture = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setIsUserSpeaking(false);
  }, []);

  const connect = useCallback(async (mode = 'interview') => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('API key is missing.');
      return;
    }

    modeRef.current = mode;
    setIsConnecting(true);
    setError('');
    setTranscript('');
    setCodeOutput('');

    try {
      const model = 'gemini-3.1-flash-live-preview';
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Send setup message
        const systemInstruction = mode === 'interview' ? INTERVIEW_SYSTEM_INSTRUCTION : LIVECODE_SYSTEM_INSTRUCTION;

        const setupMsg = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: mode === 'interview' ? ['AUDIO'] : ['AUDIO', 'TEXT'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Kore'
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        };

        ws.send(JSON.stringify(setupMsg));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Setup complete
          if (data.setupComplete) {
            setIsConnected(true);
            setIsConnecting(false);
            // Start mic after setup is complete
            startMicCapture().catch(() => {
              disconnect();
            });
            return;
          }

          // Server content (audio/text responses)
          if (data.serverContent) {
            const parts = data.serverContent.modelTurn?.parts || [];

            for (const part of parts) {
              if (part.inlineData?.mimeType?.startsWith('audio/')) {
                playAudioChunk(part.inlineData.data);
              }
              if (part.text) {
                if (mode === 'livecode') {
                  setCodeOutput(prev => prev + part.text);
                }
                setTranscript(prev => prev + part.text);
              }
            }

            // If turn is complete, add a separator
            if (data.serverContent.turnComplete) {
              setTranscript(prev => prev ? prev + '\n\n' : prev);
              setCodeOutput(prev => prev ? prev + '\n' : prev);
            }
          }
        } catch (e) {
          console.error('WS message parse error:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error. Please try again.');
        setIsConnecting(false);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        stopMicCapture();
      };

    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect. Please try again.');
      setIsConnecting(false);
    }
  }, [startMicCapture, stopMicCapture, playAudioChunk]);

  const disconnect = useCallback(() => {
    stopMicCapture();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop any playing audio
    audioQueueRef.current = [];
    isPlayingRef.current = false;

    if (playbackContextRef.current) {
      playbackContextRef.current.close();
      playbackContextRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsUserSpeaking(false);
    setAudioLevel(0);
  }, [stopMicCapture]);

  const sendText = useCallback((text) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        clientContent: {
          turns: [{
            role: 'user',
            parts: [{ text }]
          }],
          turnComplete: true
        }
      }));
    }
  }, []);

  const clearCode = useCallback(() => {
    setCodeOutput('');
  }, []);

  return {
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
  };
}
