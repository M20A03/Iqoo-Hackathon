import { useState, useEffect, useRef } from 'react';
import { Smartphone, ShieldCheck, CheckCircle, Terminal, Loader } from 'lucide-react';
import { mockAccessibilityServiceStatus, toggleAccessibilityService } from '../utils/accessibility';
import { AIResponse } from '../utils/localAI';

interface AccessibilityServiceDemoProps {
  latestCommand?: AIResponse | null;
}

export function AccessibilityServiceDemo({ latestCommand }: AccessibilityServiceDemoProps) {
  const [isEnabled, setIsEnabled] = useState(mockAccessibilityServiceStatus());
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    toggleAccessibilityService(newState);
    if (newState) {
      setLogs(['Service bound to com.sahayak.AccessibilityService', 'Waiting for commands...']);
    } else {
      setLogs([]);
    }
  };

  useEffect(() => {
    if (latestCommand && isEnabled && latestCommand.logs && latestCommand.logs.length > 0) {
      executeSimulatedLogs(latestCommand.logs);
    }
  }, [latestCommand, isEnabled]);

  const executionId = useRef(0);

  const executeSimulatedLogs = async (commandLogs: string[]) => {
    const id = ++executionId.current;
    setIsExecuting(true);
    setLogs([]);
    
    for (let i = 0; i < commandLogs.length; i++) {
      if (id !== executionId.current) return;
      setLogs(prev => [...prev, `> ${commandLogs[i]}`]);
      await new Promise(r => setTimeout(r, 600)); 
    }
    
    if (id !== executionId.current) return;
    setLogs(prev => [...prev, '> ✅ Execution Complete.']);
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100">
          <Smartphone size={28} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 font-display">
              Universal App Control
            </h2>
            {isEnabled && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Grants permission to read screen hierarchy and dispatch touch/scroll intents hands-free inside <b>any installed app</b>.
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
          isEnabled 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100' 
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        {isEnabled ? (
          <>
            <CheckCircle size={16} className="text-emerald-600" />
            <span>Accessibility Service Active</span>
          </>
        ) : (
          <>
            <ShieldCheck size={16} />
            <span>Enable Android Accessibility Service</span>
          </>
        )}
      </button>

      {isEnabled && (
        <div className="mt-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 overflow-hidden shadow-inner">
           <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800 pb-2 text-[11px]">
             <Terminal size={14} className="text-sky-400" />
             <span className="font-bold text-slate-300">Accessibility Node Dispatcher</span>
             {isExecuting && <Loader size={13} className="ml-auto text-sky-400 animate-spin" />}
           </div>
           
           <div className="flex flex-col gap-1.5 min-h-[90px] max-h-[160px] overflow-y-auto pr-1">
              {logs.length === 0 && <span className="text-slate-500 italic">Awaiting commands... Say "Open WhatsApp" or "Scroll down".</span>}
              {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in duration-200">{log}</div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
