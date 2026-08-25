// src/hooks/useSilentSpeech.ts
import { useEffect, useRef, useState } from 'react';

export function useSilentSpeech(isActive: boolean, onTrigger: (type: string) => void) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isActive) {
      stopListening();
      return;
    }

    startListening();
    return () => stopListening();
  }, [isActive]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListening(true);

      const checkAudio = () => {
        if (!analyserRef.current || !isActive) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Detect high-frequency spikes (clicks/puffs)
        // High frequency bins are at the end of the array
        let highFreqSum = 0;
        for (let i = bufferLength - 10; i < bufferLength; i++) {
          highFreqSum += dataArray[i];
        }

        const average = highFreqSum / 10;
        if (average > 100) { // Threshold for a "click"
          onTrigger('BREATH_CLICK');
          // Cooldown to prevent multiple triggers
          setTimeout(() => {
            if (isActive) requestAnimationFrame(checkAudio);
          }, 1000);
          return;
        }

        requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.error('Silent speech audio access failed:', err);
    }
  };

  const stopListening = () => {
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    setIsListening(false);
  };

  return { isListening };
}
