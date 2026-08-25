import { useState } from 'react';
import { OCRComponent } from './OCRComponent';
import { FileText, Volume2 } from 'lucide-react';
import { speakText } from '../hooks/useSpeechRecognition';

interface ScanComponentProps {
  onTextExtracted: (text: string) => void;
}

export function ScanComponent({ onTextExtracted }: ScanComponentProps) {
  const [scannedText, setScannedText] = useState<string>('');

  const handleTextExtracted = (text: string) => {
    setScannedText(text);
    onTextExtracted(text);
  };

  return (
    <div className="w-full flex flex-col">
      <OCRComponent onTextExtracted={handleTextExtracted} speakText={speakText} />

      {scannedText && (
        <div className="p-6 bg-background/60 backdrop-blur-md border-t border-surface-border flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
            <FileText size={14} /> Extracted Data
          </div>
          <div className="p-4 bg-surface rounded-2xl border border-surface-border/50">
             <p className="text-sm text-text-primary font-medium leading-relaxed italic">{scannedText}</p>
          </div>
          <button
            onClick={() => speakText(scannedText)}
            className="w-full py-4 bg-primary hover:bg-primary-light text-text-primary border border-surface-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-soft"
          >
            <Volume2 size={16} className="text-secondary" /> Read Aloud
          </button>
        </div>
      )}
    </div>
  );
}
