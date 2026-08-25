import { useState, useCallback } from 'react';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';

export function useSpeechRecognition(langCode: SupportedLangCode = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError('Speech Recognition API is not supported in this browser.');
      return;
    }

    setTranscript('');
    setError(null);

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Configure dialect
    const speechLang = SUPPORTED_INDIAN_LANGUAGES[langCode]?.speechCode || 'en-IN';
    recognition.lang = speechLang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const t = event.results[current][0].transcript;
      setTranscript(t);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [SpeechRecognitionAPI, langCode]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { isListening, transcript, error, startListening, resetTranscript };
}

export function speakText(text: string, langCode: SupportedLangCode = 'en') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const speechLang = SUPPORTED_INDIAN_LANGUAGES[langCode]?.speechCode || 'en-IN';
    utterance.lang = speechLang;
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  }
}
