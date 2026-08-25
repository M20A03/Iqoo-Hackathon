export type ControlMode = 'voice' | 'switch' | 'face' | 'eye' | 'hybrid';
import { Mic, ToggleRight, ScanFace, Eye, Combine } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ControlMode;
  onModeChange: (mode: ControlMode) => void;
}

const modes = [
  { id: 'voice', label: 'Voice', icon: <Mic size={20} /> },
  { id: 'switch', label: 'Switch', icon: <ToggleRight size={20} /> },
  { id: 'face', label: 'Face', icon: <ScanFace size={20} /> },
  { id: 'eye', label: 'Eye', icon: <Eye size={20} /> },
  { id: 'hybrid', label: 'Hybrid', icon: <Combine size={20} /> },
] as const;

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-3 mb-4" role="group" aria-label="Control Modes">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id as ControlMode)}
          className={`flex-1 flex flex-col items-center justify-center p-5 rounded-2xl border transition-all min-w-[90px] group ${
            currentMode === mode.id
              ? 'border-primary bg-primary text-white shadow-soft scale-[1.02]'
              : 'border-surface-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary'
          }`}
          aria-pressed={currentMode === mode.id}
          aria-label={`${mode.label} Control Mode`}
        >
          <div className={`mb-3 p-3 rounded-xl transition-colors ${
             currentMode === mode.id ? 'bg-white/10 text-secondary' : 'bg-surface-light text-text-muted group-hover:text-primary'
          }`}>
             {mode.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
