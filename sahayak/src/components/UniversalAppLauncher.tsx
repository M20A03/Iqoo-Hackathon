import { useState } from 'react';
import {
  Smartphone,
  MessageCircle,
  Video,
  PhoneCall,
  Navigation,
  Music,
  Camera,
  Play,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { executeDeepLink } from '../utils/deepLinks';
import confetti from 'canvas-confetti';

interface AppAction {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  bgLight: string;
  borderColor: string;
  sampleCommand: string;
  action: string;
  target: string;
  param?: string;
}

const APPS_ECOSYSTEM: AppAction[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Communication',
    icon: MessageCircle,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    sampleCommand: '"Send WhatsApp to Mother: I am feeling better"',
    action: 'OPEN_APP',
    target: 'whatsapp',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Entertainment',
    icon: Video,
    color: 'text-rose-600',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
    sampleCommand: '"Play relaxing breathing exercises on YouTube"',
    action: 'OPEN_AND_SEARCH',
    target: 'youtube',
    param: 'breathing exercises',
  },
  {
    id: 'phone',
    name: 'Phone Dialer',
    category: 'Emergency & Speed Dial',
    icon: PhoneCall,
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    sampleCommand: '"Call Doctor on Phone"',
    action: 'OPEN_APP',
    target: 'phone',
    param: '108',
  },
  {
    id: 'maps',
    name: 'Google Maps',
    category: 'Navigation',
    icon: Navigation,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    sampleCommand: '"Navigate to nearest Jan Aushadhi Kendra"',
    action: 'OPEN_AND_SEARCH',
    target: 'maps',
    param: 'Jan Aushadhi Kendra near me',
  },
  {
    id: 'media',
    name: 'Universal Music & Audio',
    category: 'Media Players',
    icon: Music,
    color: 'text-teal-600',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
    sampleCommand: '"Play soothing healing instrumental music"',
    action: 'OPEN_APP',
    target: 'spotify',
  },
  {
    id: 'camera',
    name: 'Camera & OCR',
    category: 'Medical Imaging',
    icon: Camera,
    color: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    sampleCommand: '"Open Camera to scan prescription"',
    action: 'OPEN_APP',
    target: 'camera',
  },
];

export function UniversalAppLauncher() {
  const [lastLaunched, setLastLaunched] = useState<string | null>(null);

  const handleLaunch = async (app: AppAction) => {
    setLastLaunched(app.name);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.85 } });
    await executeDeepLink(app.action, app.target, app.param);
    setTimeout(() => setLastLaunched(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100">
            <Smartphone size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-display">
              Universal Hands-Free App Control
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Controls <b>ANY</b> installed phone app via Voice, Gaze &amp; Gestures
            </p>
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
          All Apps Supported
        </span>
      </div>

      {/* Grid of Universal App Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {APPS_ECOSYSTEM.map((app) => {
          const Icon = app.icon;
          const isCurrent = lastLaunched === app.name;

          return (
            <div
              key={app.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 shadow-xs ${
                isCurrent 
                  ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200' 
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${app.bgLight} ${app.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{app.name}</h3>
                    <span className="text-[10px] text-slate-400 font-medium block">{app.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunch(app)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                    isCurrent
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={`Launch ${app.name}`}
                >
                  {isCurrent ? <CheckCircle2 size={13} /> : <Play size={13} />}
                  <span className="text-[11px] font-black">{isCurrent ? 'Launched' : 'Launch'}</span>
                </button>
              </div>

              <div className="bg-white/90 px-2.5 py-1.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 font-medium italic truncate">
                {app.sampleCommand}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ExternalLink size={12} className="text-sky-600" />
          <span>Intent dispatch via Android Accessibility &amp; Deep Links</span>
        </span>
        <span className="font-mono font-bold text-slate-700">100% Zero-Touch</span>
      </div>
    </div>
  );
}
