import { useState, useRef, useCallback, useEffect } from 'react';

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

// Prompts, model and voice are chosen server-side (/api/live-token).


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
  const [notice, setNotice] = useState('');


  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const playbackContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const sourceRef = useRef(null);

  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const isConnectedRef = useRef(false);
  const sessionTimerRef = useRef(null);
  const connectAbortRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

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

  // Below playNextInQueue so it can list it as a dependency (it is stable).
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
    } catch {
      // Drop a chunk we can't decode rather than break playback.
    }
  }, [playNextInQueue]);

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
              audio: {
                data: base64,
                mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`
              }
            }
          }));
        }
      };
    }).catch((err) => {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone detected. Please connect a microphone.');
      } else {
        setError('Microphone error. Please check your audio settings.');
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

  const clearSessionTimer = () => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  const disconnectCleanup = useCallback(() => {
    clearSessionTimer();
    connectAbortRef.current?.abort();
    connectAbortRef.current = null;
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

  // Cleanup on unmount. Declared after disconnectCleanup so it can list it:
  // that callback is stable, so this still runs exactly once, on unmount.
  useEffect(() => {
    return () => {
      disconnectCleanup();
    };
  }, [disconnectCleanup]);

  /**
   * Starts a voice session for an allowlisted persona id.
   *
   * The browser never sees the API key or the prompt: /api/live-token returns
   * a single-use token whose setup (model, prompt, voice, audio-only output)
   * is locked server-side, and the setup message we send is ignored by Google.
   *
   * @returns {Promise<boolean>} false if no session could be started.
   */
  const connect = useCallback(async (persona, options = {}) => {
    const { onTextChunk = null } = options;

    // Clean up any existing connection
    disconnectCleanup();

    setIsConnecting(true);
    setError('');
    setNotice('');
    setTranscript('');
    setStructuredOutput(null);
    setIsResponseComplete(false);

    const controller = new AbortController();
    connectAbortRef.current = controller;

    let session;
    try {
      const res = await fetch('/api/live-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
        signal: controller.signal,
      });
      if (res.status === 429) {
        const wait = Number(res.headers.get('retry-after')) || 0;
        const when = wait >= 3600 ? 'tomorrow' : wait >= 60 ? `in about ${Math.ceil(wait / 60)} minutes` : 'in a moment';
        setError(`Voice mode is limited to keep this site free to run. Please try again ${when}, or use text chat.`);
        setIsConnecting(false);
        return false;
      }
      if (!res.ok) throw new Error('token');
      session = await res.json();
      if (typeof session?.token !== 'string' || typeof session?.model !== 'string') throw new Error('token');
    } catch {
      if (controller.signal.aborted) return false;
      setError('Voice mode is temporarily unavailable. Text chat still works.');
      setIsConnecting(false);
      return false;
    } finally {
      if (connectAbortRef.current === controller) connectAbortRef.current = null;
    }

    try {
      const wsUrl =
        'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained' +
        `?access_token=${encodeURIComponent(session.token)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // The token carries the full setup; this message only opens the session.
        ws.send(JSON.stringify({ setup: { model: `models/${session.model}` } }));
      };

      const appendText = (text) => {
        setTranscript(prev => {
          const newTranscript = prev + text;

          // Try to detect and parse structured output (JSON)
          try {
            const jsonMatch = newTranscript.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              setStructuredOutput(JSON.parse(jsonMatch[0]));
            }
          } catch {
            // Not valid JSON yet
          }

          if (onTextChunk) onTextChunk(text);
          return newTranscript;
        });
      };

      ws.onmessage = async (event) => {
        try {
          const raw = event.data instanceof Blob ? await event.data.text() : event.data;
          const data = JSON.parse(raw);

          if (data.setupComplete) {
            setIsConnected(true);
            setIsConnecting(false);

            // UX cap: end the session after a few minutes. The real cost
            // limits are the token's constraints and the server-side quotas.
            const maxSeconds = Number(session.maxSessionSeconds) || 300;
            clearSessionTimer();
            sessionTimerRef.current = setTimeout(() => {
              disconnectCleanup();
              setNotice(`Voice session ended after ${Math.round(maxSeconds / 60)} minutes. Tap the mic to start a new one.`);
            }, maxSeconds * 1000);

            startMicCapture(ws).catch(() => {
              // startMicCapture already set a user-facing error.
            });
            return;
          }

          // Google is about to close the connection; end cleanly instead.
          if (data.goAway) {
            disconnectCleanup();
            setNotice('Voice session ended. Tap the mic to start a new one.');
            return;
          }

          if (data.serverContent) {
            const parts = data.serverContent.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.mimeType?.startsWith('audio/')) {
                playAudioChunk(part.inlineData.data);
              }
              if (part.text && !part.thought) appendText(part.text);
            }

            const spoken = data.serverContent.outputTranscription?.text;
            if (spoken) appendText(spoken);

            if (data.serverContent.turnComplete) {
              setTranscript(prev => prev ? prev + '\n\n' : prev);
              setIsResponseComplete(true);
            }
          }
        } catch {
          // Ignore frames we can't parse.
        }
      };

      ws.onerror = () => {
        setError('Connection error. Please try again.');
        setIsConnecting(false);
        setIsConnected(false);
      };

      ws.onclose = () => {
        clearSessionTimer();
        setIsConnected(false);
        setIsConnecting(false);
        stopMicCapture();
      };
      return true;

    } catch {
      setError('Failed to connect. Please try again.');
      setIsConnecting(false);
      return false;
    }
  }, [startMicCapture, stopMicCapture, playAudioChunk, disconnectCleanup]);

  const disconnect = useCallback(() => {
    disconnectCleanup();
  }, [disconnectCleanup]);

  const sendMessage = useCallback((obj) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setIsResponseComplete(false);
      wsRef.current.send(JSON.stringify(obj));
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
    notice,
    audioLevel,
  };
}

