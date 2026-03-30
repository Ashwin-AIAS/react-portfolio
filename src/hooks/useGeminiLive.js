import { useState, useRef, useCallback, useEffect } from 'react';
import { getApiKey } from '../geminiEmbed';
import { portfolioData } from '../data/portfolioData';

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

// System instructions removed. They are now passed to connect() by the component.


/**
 * Downsample audio buffer from inputRate to outputRate
 */
function downsampleBuffer(buffer, inputRate, outputRate) {
  if (inputRate === outputRate) return buffer;
  const ratio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    result[i] = buffer[Math.round(i * ratio)];
  }
  return result;
}

function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

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
  const [structuredOutput, setStructuredOutput] = useState(null);
  const [isResponseComplete, setIsResponseComplete] = useState(false);


  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const playbackContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const optionsRef = useRef({});
  const sourceRef = useRef(null);

  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const isConnectedRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectCleanup();
    };
  }, []);

  const playAudioChunk = useCallback((base64Audio) => {
    try {
      if (!playbackContextRef.current || playbackContextRef.current.state === 'closed') {
        playbackContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });
      }

      const ctx = playbackContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const pcmData = base64ToArrayBuffer(base64Audio);
      const int16 = new Int16Array(pcmData);
      const float32 = new Float32Array(int16.length);

      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, OUTPUT_SAMPLE_RATE);
      audioBuffer.getChannelData(0).set(float32);

      audioQueueRef.current.push(audioBuffer);

      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (e) {
      console.error('Error playing audio chunk:', e);
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
    if (!ctx || ctx.state === 'closed') {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    const buffer = audioQueueRef.current.shift();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = playNextInQueue;
    source.start();
  }, []);

  const startMicCapture = useCallback((ws) => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    }).then((stream) => {
      streamRef.current = stream;

      // Create AudioContext — this is inside a user-gesture chain (click → connect → setupComplete → startMic)
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      const actualSampleRate = ctx.sampleRate;

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
        if (ws.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          // Downsample from actual sample rate to 16kHz
          const downsampled = downsampleBuffer(inputData, actualSampleRate, INPUT_SAMPLE_RATE);
          const pcm16 = floatTo16BitPCM(downsampled);
          const base64 = arrayBufferToBase64(pcm16);

          ws.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{
                data: base64,
                mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`
              }]
            }
          }));
        }
      };
    }).catch((err) => {
      console.error('Mic access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone detected. Please connect a microphone.');
      } else {
        setError('Microphone error: ' + err.message);
      }
      throw err;
    });
  }, []);

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
    analyserRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setIsUserSpeaking(false);
  }, []);

  const disconnectCleanup = useCallback(() => {
    stopMicCapture();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;

    if (playbackContextRef.current && playbackContextRef.current.state !== 'closed') {
      playbackContextRef.current.close().catch(() => {});
      playbackContextRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsUserSpeaking(false);
    setAudioLevel(0);
  }, [stopMicCapture]);

  const connect = useCallback(async (systemPrompt, options = {}) => {
    const {
      responseModalities = ['AUDIO'],
      voiceName = 'Aoede',
      onTextChunk = null
    } = options;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
      return;
    }

    // Clean up any existing connection
    disconnectCleanup();

    setIsConnecting(true);
    setError('');
    setTranscript('');
    setStructuredOutput(null);
    setIsResponseComplete(false);

    try {
      const model = 'gemini-3.1-flash-live-preview';
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

      console.log('[WS] connecting to:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] connected, state:', ws.readyState);
        // Use camelCase for the Gemini Multimodal Live API
        const setupMsg = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: responseModalities,
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voiceName
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          }
        };

        console.log('[WS] sending setup:', JSON.stringify(setupMsg, null, 2));
        ws.send(JSON.stringify(setupMsg));
      };


      ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            // Binary data (likely audio PCM)
            // console.log('[WS] binary message received:', event.data.size, 'bytes');
            // In a full implementation, you'd send this to an AudioWorklet
            return;
          }

          const data = JSON.parse(event.data);
          // console.log('[WS] message received:', JSON.stringify(data).substring(0, 500));

          // Setup complete
          if (data.setupComplete) {
            console.log('[WS] setup complete');
            setIsConnected(true);
            setIsConnecting(false);
            // Start mic after setup is complete if requested
            startMicCapture(ws).catch((err) => {
              console.error('[WS] mic capture failed:', err);
              // disconnectCleanup();
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
                setTranscript(prev => {
                  const newTranscript = prev + part.text;
                  
                  // Try to detect and parse structured output (JSON)
                  try {
                    const jsonMatch = newTranscript.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const possibleJson = jsonMatch[0];
                      const parsed = JSON.parse(possibleJson);
                      setStructuredOutput(parsed);
                    }
                  } catch (e) {
                    // Not valid JSON yet
                  }

                  if (onTextChunk) onTextChunk(part.text);
                  return newTranscript;
                });
              }
            }

            if (data.serverContent.turnComplete) {
              setTranscript(prev => prev ? prev + '\n\n' : prev);
              setIsResponseComplete(true);
            }
          }

        } catch (e) {
          console.error('[WS] message parse error:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('[WS] error:', err);
        setError('Connection error. Please try again.');
        setIsConnecting(false);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('[WS] closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        stopMicCapture();
      };

    } catch (err) {
      console.error('[WS] connection critical error:', err);
      setError('Failed to connect. Please try again.');
      setIsConnecting(false);
    }
  }, [startMicCapture, stopMicCapture, playAudioChunk, disconnectCleanup]);

  const disconnect = useCallback(() => {
    disconnectCleanup();
  }, [disconnectCleanup]);

  const sendMessage = useCallback((obj) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WS] sending message:', JSON.stringify(obj, null, 2));
      setIsResponseComplete(false);
      wsRef.current.send(JSON.stringify(obj));
    } else {
      console.error('[WS] sendMessage called but WebSocket is not open, state:', wsRef.current?.readyState);
    }
  }, []);

  const sendText = useCallback((text) => {
    sendMessage({
      clientContent: {
        turns: [{
          role: 'user',
          parts: [{ text }]
        }],
        turnComplete: true
      }
    });
  }, [sendMessage]);

  const clearCode = useCallback(() => {
    setCodeOutput('');
  }, []);

  return {
    connect,
    disconnect,
    sendText,
    sendMessage,
    clearCode,
    isConnected,
    isConnecting,
    isSpeaking,
    isUserSpeaking,
    transcript,
    codeOutput,
    structuredOutput,
    isResponseComplete,
    error,
    audioLevel,
  };
}

