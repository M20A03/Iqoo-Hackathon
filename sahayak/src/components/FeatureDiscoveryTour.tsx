import { useState } from 'react';
import {
  Compass,
  Stethoscope,
  Eye,
  Pill,
  FolderHeart,
  Gamepad2,
  Smile,
  ToggleRight,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { ControlMode } from './ModeSelector';
import confetti from 'canvas-confetti';

interface FeatureDiscoveryTourProps {
  onSelectFeature: (mode: ControlMode) => void;
  onClose: () => void;
}

interface TourItem {
  id: ControlMode;
  category: 'health' | 'esports' | 'accessibility';
  title: string;
  badge: string;
  icon: React.ReactNode;
  audience: string;
  howItWorks: string;
  whyItHelps: string;
}

const TOUR_ITEMS: TourItem[] = [
  {
    id: 'diagnostics',
    category: 'health',
    title: 'Acoustic Lung Stethoscope & Vitals',
    badge: 'Medical Grade CDSS',
    icon: <Stethoscope className="h-6 w-6 text-sky-600" />,
    audience: 'For anyone with cough, asthma, bronchitis, or chest congestion.',
    howItWorks: 'Hold the bottom mic firmly against your bare upper chest for 8 seconds while taking 3 deep breaths.',
    whyItHelps: 'Analyzes breath sound frequencies (FFT) to screen for bronchial wheezes (450Hz) and pneumonia crackles (650Hz) completely offline.',
  },
  {
    id: 'pharma',
    category: 'health',
    title: 'Jan Aushadhi 85%+ Medicine Price Saver',
    badge: 'Household Savings',
    icon: <Pill className="h-6 w-6 text-rose-600" />,
    audience: 'For every Indian family buying monthly BP, diabetes, or fever medicines.',
    howItWorks: 'Point camera at any medicine strip (e.g. Augmentin, Glycomet, Telma).',
    whyItHelps: 'Instantly identifies Government PM Jan Aushadhi generic salts, saving ₹3,000–₹8,000 monthly for your family.',
  },
  {
    id: 'vault',
    category: 'health',
    title: 'Offline Family Health Vault & Medical ID',
    badge: 'ABHA Ready',
    icon: <FolderHeart className="h-6 w-6 text-indigo-600" />,
    audience: 'For managing health checkup history for parents, spouse, and kids.',
    howItWorks: 'Stores all diagnostic tests, vitals trends, and prescriptions locally in an encrypted vault.',
    whyItHelps: 'Generates an instant offline QR code that any Primary Health Centre (PHC) doctor can scan without internet.',
  },
  {
    id: 'assistant',
    category: 'health',
    title: 'Suno Sahayak — 10-Language Audio Companion',
    badge: 'Zero-Literacy AI',
    icon: <Bot className="h-6 w-6 text-cyan-600" />,
    audience: 'For non-English speakers and rural community members.',
    howItWorks: 'Speak naturally in Hindi, Kannada, Tamil, Telugu, Bengali, Marathi, Gujarati, etc.',
    whyItHelps: 'Gives 3-step practical first-aid advice, nearest hospital directions, and speaks everything out loud.',
  },
  {
    id: 'iqoo',
    category: 'esports',
    title: 'iQOO Esports Biometrics & Aim Stabilizer',
    badge: 'Monster Performance',
    icon: <Gamepad2 className="h-6 w-6 text-amber-600" />,
    audience: 'For gamers, streamers, athletes, and multitaskers.',
    howItWorks: 'Monitors adrenaline pulse during BGMI/COD matches and applies 1000Hz Anti-Jitter Touch Damping.',
    whyItHelps: 'Eliminates sniper crosshair shake, monitors eye fatigue, and lets you answer calls with a smile while cooking.',
  },
  {
    id: 'eye',
    category: 'accessibility',
    title: '60 FPS Gaze & Blink Tracker',
    badge: 'Zero-Touch Access',
    icon: <Eye className="h-6 w-6 text-purple-600" />,
    audience: 'For individuals with ALS, spinal injury, or locked-in state.',
    howItWorks: 'Front camera tracks pupil centroid and eye dwell time at 60 FPS.',
    whyItHelps: 'Enables complete hands-free navigation across phone apps using only eye movements.',
  },
  {
    id: 'face',
    category: 'accessibility',
    title: 'Face & Smile Gesture Control',
    badge: 'Hands-Free OS',
    icon: <Smile className="h-6 w-6 text-emerald-600" />,
    audience: 'For motor impairment, Parkinson’s, or cooking with dirty hands.',
    howItWorks: 'Smile to select, raise eyebrows to scroll, wink to go back.',
    whyItHelps: 'Allows effortless phone navigation without touching the physical display.',
  },
  {
    id: 'switch',
    category: 'accessibility',
    title: 'Acoustic Breath Puff & Sip Switch',
    badge: 'Neuro-Inclusive',
    icon: <ToggleRight className="h-6 w-6 text-pink-600" />,
    audience: 'For severe motor disability and single-switch users.',
    howItWorks: 'Blow gently into bottom mic to trigger keyboard selection.',
    whyItHelps: 'Provides a hardware-free sip-and-puff assistive switch alternative.',
  },
];

export function FeatureDiscoveryTour({ onSelectFeature, onClose }: FeatureDiscoveryTourProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'health' | 'esports' | 'accessibility'>('all');

  const filteredItems = selectedCategory === 'all'
    ? TOUR_ITEMS
    : TOUR_ITEMS.filter((item) => item.category === selectedCategory);

  const handleLaunch = (mode: ControlMode) => {
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.75 } });
    onSelectFeature(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider">
              <Compass className="h-4 w-4" /> Interactive Feature Explorer
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              Everything PulseEdge-OS Can Do For You &amp; Your Family
            </h2>
            <p className="text-xs text-slate-600">
              Select any capability below to explore how it works and launch an instant live test drive.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: '🌟 All 8 Features' },
            { id: 'health', label: '🩺 Clinical Health & Pharma' },
            { id: 'esports', label: '🎮 iQOO Esports & Lifestyle' },
            { id: 'accessibility', label: '♿ Zero-Touch Neuro-Access' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-Column Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 transition-all flex flex-col justify-between space-y-3 group shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-sky-950 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-sky-700 mt-0.5">{item.audience}</p>
                </div>

                <div className="text-[11px] space-y-1 text-slate-600 bg-white p-3 rounded-2xl border border-slate-200/80">
                  <p><strong>How to use:</strong> {item.howItWorks}</p>
                  <p className="text-slate-500 pt-1 border-t border-slate-100"><strong>Why it helps:</strong> {item.whyItHelps}</p>
                </div>
              </div>

              <button
                onClick={() => handleLaunch(item.id)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all group-hover:shadow-md"
              >
                <span>Launch This Mode</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
