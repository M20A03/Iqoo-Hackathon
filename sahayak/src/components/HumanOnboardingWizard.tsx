import { useState } from 'react';
import { Stethoscope, Sparkles, Check, Globe, HeartPulse, User, X } from 'lucide-react';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';
import confetti from 'canvas-confetti';

interface HumanOnboardingWizardProps {
  onComplete: (config: {
    lang: SupportedLangCode;
    primaryMode: 'diagnostics' | 'eye' | 'voice' | 'pharma';
    seniorMode: boolean;
  }) => void;
  onClose: () => void;
}

export function HumanOnboardingWizard({ onComplete, onClose }: HumanOnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLang, setSelectedLang] = useState<SupportedLangCode>('hi');
  const [selectedIntent, setSelectedIntent] = useState<'diagnostics' | 'eye' | 'voice' | 'pharma'>('diagnostics');
  const [seniorMode, setSeniorMode] = useState(false);

  const handleFinish = () => {
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.75 } });
    onComplete({
      lang: selectedLang,
      primaryMode: selectedIntent,
      seniorMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="max-w-md w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
        >
          <X size={18} />
        </button>
        {/* Step 1: Language & Accessibility */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-3 rounded-2xl bg-sky-100 text-sky-700 mx-auto">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                Welcome to PulseEdge-OS
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Choose your native language for voice & screen assistance:
              </p>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
              {Object.entries(SUPPORTED_INDIAN_LANGUAGES).map(([code, cfg]) => (
                <button
                  key={code}
                  onClick={() => setSelectedLang(code as SupportedLangCode)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedLang === code
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div>
                    <span className="text-sm mr-1.5">{cfg.flag}</span>
                    <span className="text-xs font-black">{cfg.nativeName}</span>
                    <p className={`text-[10px] ${selectedLang === code ? 'text-sky-100' : 'text-slate-400'}`}>
                      {cfg.name}
                    </p>
                  </div>
                  {selectedLang === code && <Check className="h-4 w-4 text-white shrink-0" />}
                </button>
              ))}
            </div>

            {/* Senior / High Contrast Toggle */}
            <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-sky-950">Senior / Tremor Friendly View</p>
                <p className="text-[10px] text-slate-500">Larger 64px buttons & high vibration feedback</p>
              </div>
              <input
                type="checkbox"
                checked={seniorMode}
                onChange={(e) => setSeniorMode(e.target.checked)}
                className="h-5 w-5 rounded accent-sky-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
            >
              Continue &rarr;
            </button>
          </div>
        )}

        {/* Step 2: What do you want to do? */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                How Can We Help You Today?
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pick your primary purpose (you can switch anytime):
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'diagnostics',
                  icon: <Stethoscope className="h-5 w-5 text-sky-600" />,
                  title: '🩺 Check My Health & Vitals',
                  desc: 'Heart rate, blood oxygen, breath stethoscope, and anemia triage',
                },
                {
                  id: 'pharma',
                  icon: <HeartPulse className="h-5 w-5 text-emerald-600" />,
                  title: '💊 Scan Medicine & Jan Aushadhi',
                  desc: 'Find 85%+ cheaper generic salts & check safety contraindications',
                },
                {
                  id: 'eye',
                  icon: <User className="h-5 w-5 text-indigo-600" />,
                  title: '♿ Hands-Free Neuro-Access',
                  desc: 'Control phone using eye gaze, head smile gestures, or single switch',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIntent(item.id as any)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedIntent === item.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.01]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${selectedIntent === item.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-tight">{item.title}</p>
                    <p className={`text-[11px] mt-0.5 ${selectedIntent === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                  {selectedIntent === item.id && <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
              >
                Start Using PulseEdge-OS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
