export type ControlMode = 'iqoo' | 'diagnostics' | 'pharma' | 'vault' | 'assistant' | 'voice' | 'eye' | 'face' | 'switch' | 'hybrid';
import { Mic, ToggleRight, ScanFace, Eye, Combine, Stethoscope, Pill, Gamepad2, FolderHeart, Bot } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ControlMode;
  onModeChange: (mode: ControlMode) => void;
}

const modes = [
  { id: 'iqoo', label: 'iQOO Monster', icon: <Gamepad2 size={18} /> },
  { id: 'diagnostics', label: 'Vitals & Steth', icon: <Stethoscope size={18} /> },
  { id: 'pharma', label: 'Jan Aushadhi', icon: <Pill size={18} /> },
  { id: 'vault', label: 'Health Vault', icon: <FolderHeart size={18} /> },
  { id: 'assistant', label: 'Suno Sahayak', icon: <Bot size={18} /> },
  { id: 'voice', label: 'Voice (10 Lang)', icon: <Mic size={18} /> },
  { id: 'eye', label: 'Eye Gaze', icon: <Eye size={18} /> },
  { id: 'face', label: 'Face Gestures', icon: <ScanFace size={18} /> },
  { id: 'switch', label: 'Switch Control', icon: <ToggleRight size={18} /> },
  { id: 'hybrid', label: 'Hybrid Cockpit', icon: <Combine size={18} /> },
] as const;

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-4" role="group" aria-label="Control Modes">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id as ControlMode)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all group ${
            currentMode === mode.id
              ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-[1.02]'
              : 'border-slate-200 bg-white/80 text-slate-600 hover:border-sky-300 hover:text-sky-600'
          }`}
          aria-pressed={currentMode === mode.id}
          aria-label={`${mode.label} Mode`}
        >
          <div className={`mb-1 p-1.5 rounded-xl transition-colors ${
             currentMode === mode.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-sky-600'
          }`}>
             {mode.icon}
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider leading-none text-center">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
