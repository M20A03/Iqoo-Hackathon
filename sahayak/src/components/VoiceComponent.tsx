import { useEffect } from 'react';
import { Mic, MicOff, Command } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceComponentProps {
  onCommandParsed: (transcript: string) => void;
}

export function VoiceComponent({ onCommandParsed }: VoiceComponentProps) {
  const { isListening, transcript, error, startListening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !isListening) {
      onCommandParsed(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onCommandParsed, resetTranscript]);

  return (
    <div className="flex flex-col gap-6 w-full bg-surface border border-surface-border rounded-3xl p-8 shadow-card card-gradient">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-3 text-primary">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Command className="text-secondary" size={20} />
          </div>
          Voice Control
        </h2>
        {isListening && (
          <div className="flex items-center gap-2 px-3 py-1 bg-error/10 rounded-full border border-error/20">
             <div className="w-2 h-2 bg-error rounded-full animate-ping"></div>
             <span className="text-[10px] font-black text-error uppercase">Listening</span>
          </div>
        )}
      </div>

      <p className="text-sm text-text-secondary leading-relaxed font-medium">
        Try saying: <span className="text-primary font-bold">"Open WhatsApp"</span>, <span className="text-primary font-bold">"Go back"</span>, or <span className="text-primary font-bold">"Read screen"</span>.
      </p>

      <button
        onClick={startListening}
        disabled={isListening}
        className={`w-full py-10 flex flex-col items-center justify-center gap-4 rounded-2xl font-black text-xl shadow-soft transition-all transform active:scale-95 ${
          isListening 
            ? 'bg-surface-light text-error border-2 border-error/20 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-light text-white border border-primary-dark'
        }`}
        aria-label={isListening ? "Listening..." : "Activate voice control"}
      >
        <div className={`p-4 rounded-full ${isListening ? 'bg-error/10' : 'bg-secondary/10'}`}>
          {isListening ? (
            <MicOff size={48} className="text-error animate-pulse" />
          ) : (
            <Mic size={48} className="text-secondary" />
          )}
        </div>
        <span className={isListening ? 'animate-pulse' : ''}>
          {isListening ? 'Awaiting Voice...' : 'Tap to Command'}
        </span>
      </button>
      
      {error && (
        <div className="text-error text-xs text-center mt-2 font-bold p-3 bg-error/5 rounded-xl border border-error/10" role="alert">
          {error}
        </div>
      )}

      {transcript && (
        <div className="mt-4 p-5 bg-surface-light rounded-2xl border border-surface-border animate-in zoom-in-95">
          <span className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-2">Detected Intent:</span>
          <p className="text-lg italic font-serif text-primary">"{transcript}"</p>
        </div>
      )}
    </div>
  );
}
