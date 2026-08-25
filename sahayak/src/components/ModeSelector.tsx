export type ControlMode = 'voice' | 'switch' | 'face' | 'eye' | 'hybrid' | 'diagnostics';
import { Mic, ToggleRight, ScanFace, Eye, Combine, Stethoscope } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ControlMode;
  onModeChange: (mode: ControlMode) => void;
}

const modes = [
  { id: 'diagnostics', label: 'Diagnostics', icon: <Stethoscope size={18} /> },
  { id: 'voice', label: 'Voice', icon: <Mic size={18} /> },
  { id: 'eye', label: 'Eye Gaze', icon: <Eye size={18} /> },
  { id: 'face', label: 'Face Click', icon: <ScanFace size={18} /> },
  { id: 'switch', label: 'Switch', icon: <ToggleRight size={18} /> },
  { id: 'hybrid', label: 'Hybrid', icon: <Combine size={18} /> },
] as const;

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4" role="group" aria-label="Control Modes">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id as ControlMode)}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all group ${
            currentMode === mode.id
              ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-[1.02]'
              : 'border-slate-200 bg-white/80 text-slate-600 hover:border-sky-300 hover:text-sky-600'
          }`}
          aria-pressed={currentMode === mode.id}
          aria-label={`${mode.label} Mode`}
        >
          <div className={`mb-1.5 p-2 rounded-xl transition-colors ${
             currentMode === mode.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-sky-600'
          }`}>
             {mode.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider leading-none">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
