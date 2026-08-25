import { useState, useCallback } from 'react';
import { processCommand, AIResponse } from '../utils/localAI';

export function useLocalAI() {
  const [history, setHistory] = useState<AIResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const processVoiceCommand = useCallback(async (transcript: string, context?: string) => {
    setLoading(true);
    const result = processCommand(transcript, context);
    
    setHistory(prev => [result, ...prev]);
    setLoading(false);
    return result;
  }, []);

  return { history, loading, processVoiceCommand };
}
