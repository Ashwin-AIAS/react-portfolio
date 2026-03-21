import { useState, useRef, useCallback } from 'react';

export function useSpeechInput({ onResult, onError }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.lang = document.documentElement.lang === 'de' 
      ? 'de-DE' 
      : 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      onResult(transcript, event.results[0].isFinal);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        onError('Microphone access denied. Please allow microphone permission in your browser settings.');
      } else if (event.error === 'no-speech') {
        onError('No speech detected. Please try again.');
      }
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, startListening, stopListening };
}
