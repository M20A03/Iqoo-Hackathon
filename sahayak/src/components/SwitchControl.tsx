import { useState, useEffect, useCallback } from 'react';
import { ToggleRight, Bluetooth, Play, Square } from 'lucide-react';

interface SwitchControlProps {
  isActive: boolean;
  onCommand: (cmd: string) => void;
}

const COMMANDS = [
  { id: 0, label: 'Read Screen', command: 'read text' },
  { id: 1, label: 'Clear History', command: 'clear history' },
  { id: 2, label: 'What time is it?', command: 'what time is it' },
  { id: 3, label: 'Emergency Help', command: 'help' }
];

export function SwitchControl({ isActive, onCommand }: SwitchControlProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  // Auto-scan items
  useEffect(() => {
    let interval: any = null;
    if (isActive && isScanning) {
      interval = setInterval(() => {
        setActiveItem(prev => (prev + 1) % COMMANDS.length);
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isScanning]);

  // Handle Switch Press (Space or Enter)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || !isScanning) return;
    
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      const selectedCommand = COMMANDS[activeItem].command;
      onCommand(selectedCommand);
    }
  }, [isActive, isScanning, activeItem, onCommand]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col gap-4 w-full bg-white/90 border border-slate-200 shadow-sm rounded-3xl p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <ToggleRight size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-display">
              Motor Switch Control
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">Single / Dual Switch Scanning</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 text-[10px] font-bold">
          <Bluetooth size={13} className={isScanning ? 'text-sky-600 animate-pulse' : 'text-slate-400'} />
          <span>{isScanning ? 'Auto Scanning' : 'Standby'}</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Press <kbd className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold text-slate-800">Space</kbd> or <kbd className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold text-slate-800">Enter</kbd> (or external adaptive switch) when the target action is highlighted.
      </p>

      {/* Interactive Command Scanning Matrix */}
      <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-3.5 shadow-inner">
        <div className="grid grid-cols-2 gap-2.5">
          {COMMANDS.map(item => (
            <div 
              key={item.id}
              className={`p-4 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${
                isScanning && activeItem === item.id 
                  ? 'bg-indigo-600 text-white border-indigo-700 scale-[1.02] shadow-md ring-2 ring-indigo-300' 
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50/80 p-3.5 rounded-2xl flex flex-col gap-2 border border-slate-200 text-xs">
        <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
          <span className="text-slate-500 font-medium">Scan Dwell Speed</span>
          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">1.5s</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Switch Trigger</span>
          <span className="font-bold text-slate-800">Space / Enter / BT Pedal</span>
        </div>
      </div>

      <button
        onClick={() => setIsScanning(!isScanning)}
        className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
          isScanning 
            ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        {isScanning ? (
          <>
            <Square size={14} /> Stop Scanning
          </>
        ) : (
          <>
            <Play size={14} /> Start Auto-Scan
          </>
        )}
      </button>
    </div>
  );
}
