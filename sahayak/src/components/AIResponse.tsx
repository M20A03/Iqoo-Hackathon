import { Volume2, Sparkles } from 'lucide-react';
import { speakText } from '../hooks/useSpeechRecognition';

interface AIResponseProps {
  message?: string;
  action?: string;
}

export function AIResponse({ message, action }: AIResponseProps) {
  if (!message) return null;

  return (
    <div className="flex flex-col gap-3.5 w-full bg-white/90 border border-slate-200 shadow-sm rounded-3xl p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <Sparkles size={16} />
          </div>
          <h2 className="text-sm font-black text-slate-900 font-display">Neural Engine Output</h2>
        </div>
        {action && (
          <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider font-mono">
            {action}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-800 font-semibold leading-relaxed">
        {message}
      </p>

      <button
        onClick={() => speakText(message)}
        className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
      >
        <Volume2 size={16} /> 
        <span>Listen Aloud</span>
      </button>
    </div>
  );
}
