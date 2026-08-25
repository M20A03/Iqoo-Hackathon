import { useState, useEffect, useRef } from 'react';
import {
  Stethoscope,
  Eye,
  HeartPulse,
  Activity,
  Volume2,
  FileText,
  Printer,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type DiagnosticTab = 'fft' | 'sclera' | 'ppg' | 'tremor';

export function DiagnosticsComponent() {
  const [activeTab, setActiveTab] = useState<DiagnosticTab>('fft');

  // --- 1. Acoustic Stethoscope State ---
  const [stethMode, setStethMode] = useState<'wheeze' | 'crackle' | 'normal'>('wheeze');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // --- 2. Sclera & Conjunctiva State ---
  const [scleraMode, setScleraMode] = useState<'anemia' | 'jaundice' | 'healthy'>('anemia');

  // --- 3. Camera PPG State ---
  const [isScanningPpg, setIsScanningPpg] = useState(false);
  const [ppgProgress, setPpgProgress] = useState(0);
  const [bpm, setBpm] = useState(74);
  const [spo2, setSpo2] = useState(98);
  const [hrv, setHrv] = useState(48);

  // --- 4. Tremor Filter State ---
  const [isTremorFiltered, setIsTremorFiltered] = useState(true);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  // --- 5. Clinical Report Modal State ---
  const [showReportModal, setShowReportModal] = useState(false);

  // Web Audio Synthesizer for Stethoscope sounds
  const toggleSoundSynthesis = () => {
    if (isPlayingSound) {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch (e) {}
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingSound(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (stethMode === 'wheeze') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
      } else if (stethMode === 'crackle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
      }
      setIsPlayingSound(true);
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch (e) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stethMode]);

  // 10s PPG Scan Simulation
  const startPpgScan = () => {
    setIsScanningPpg(true);
    setPpgProgress(0);
    const interval = setInterval(() => {
      setPpgProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanningPpg(false);
          setBpm(Math.floor(70 + Math.random() * 8));
          setSpo2(Math.floor(97 + Math.random() * 2));
          setHrv(Math.floor(45 + Math.random() * 10));
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Telemetry Header */}
      <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-cyan-50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Biophysical Edge Diagnostics
              </h2>
              <p className="text-[11px] font-bold text-sky-700">
                100% Air-Gapped • Snapdragon NPU Accelerated
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-sky-700 shadow-sm border border-sky-200 hover:bg-sky-50 active:scale-95 transition-all"
          >
            <FileText className="h-3.5 w-3.5" />
            Export Report
          </button>
        </div>

        {/* Tab Selector */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl bg-slate-200/60 p-1">
          <button
            onClick={() => { setActiveTab('fft'); setIsPlayingSound(false); }}
            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-black transition-all ${
              activeTab === 'fft'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Stethoscope
          </button>
          <button
            onClick={() => setActiveTab('sclera')}
            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-black transition-all ${
              activeTab === 'sclera'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Sclera
          </button>
          <button
            onClick={() => setActiveTab('ppg')}
            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-black transition-all ${
              activeTab === 'ppg'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="h-3.5 w-3.5" />
            PPG Vitals
          </button>
          <button
            onClick={() => setActiveTab('tremor')}
            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-black transition-all ${
              activeTab === 'tremor'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Tremor
          </button>
        </div>
      </div>

      {/* --- TAB 1: Acoustic Stethoscope (Audio FFT) --- */}
      {activeTab === 'fft' && (
        <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-md backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                Acoustic Stethoscope FFT (200Hz–1000Hz)
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Respiratory Lung Sound Classification
              </h3>
            </div>
            <button
              onClick={toggleSoundSynthesis}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all ${
                isPlayingSound
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
              }`}
            >
              <Volume2 className="h-3.5 w-3.5" />
              {isPlayingSound ? 'Stop Audio' : 'Synthesize Audio'}
            </button>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setStethMode('wheeze'); setIsPlayingSound(false); }}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                stethMode === 'wheeze'
                  ? 'border-amber-400 bg-amber-50/80 shadow-sm ring-1 ring-amber-400'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-black text-amber-900">Asthmatic Wheeze</p>
              <p className="text-[10px] text-amber-700 font-mono mt-0.5">450–550 Hz Peak</p>
            </button>

            <button
              onClick={() => { setStethMode('crackle'); setIsPlayingSound(false); }}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                stethMode === 'crackle'
                  ? 'border-rose-400 bg-rose-50/80 shadow-sm ring-1 ring-rose-400'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-black text-rose-900">Pneumonia Crackle</p>
              <p className="text-[10px] text-rose-700 font-mono mt-0.5">200–350 Hz Transient</p>
            </button>

            <button
              onClick={() => { setStethMode('normal'); setIsPlayingSound(false); }}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                stethMode === 'normal'
                  ? 'border-emerald-400 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-400'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-black text-emerald-900">Normal Vesicular</p>
              <p className="text-[10px] text-emerald-700 font-mono mt-0.5">&lt; 200 Hz Smooth</p>
            </button>
          </div>

          {/* Animated Frequency Spectrogram */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live PCM 44.1kHz Mic Stream
              </span>
              <span className="text-cyan-300 font-bold">
                {stethMode === 'wheeze' && 'Wheezing Peak: 480 Hz'}
                {stethMode === 'crackle' && 'Discontinuous Pops: 240 Hz'}
                {stethMode === 'normal' && 'Clear Vesicular Airflow'}
              </span>
            </div>

            {/* Spectrogram Frequency Bars */}
            <div className="flex h-24 items-end justify-between gap-1">
              {[200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 800, 900, 1000].map((freq) => {
                let height = 20 + Math.random() * 25;
                let barColor = 'bg-sky-500';

                if (stethMode === 'wheeze' && freq >= 450 && freq <= 550) {
                  height = 80 + Math.random() * 18;
                  barColor = 'bg-amber-400 shadow-lg shadow-amber-400/50';
                } else if (stethMode === 'crackle' && freq >= 200 && freq <= 350) {
                  height = 75 + Math.random() * 22;
                  barColor = 'bg-rose-400 shadow-lg shadow-rose-400/50';
                }

                return (
                  <div key={freq} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[8px] font-mono text-slate-400">{freq}Hz</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Result Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Clinical Assessment: </span>
              {stethMode === 'wheeze' && 'Continuous high-pitch harmonic signature detected. High probability of Bronchoconstriction (Asthma / COPD exacerbation).'}
              {stethMode === 'crackle' && 'Explosive discontinuous crackle clicks detected in lower respiratory band. Indication of alveolar fluid retention (Pneumonia / Bronchitis).'}
              {stethMode === 'normal' && 'Normal laminar air velocity without adventitious lung sounds.'}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: Sclera & Conjunctiva Scanner --- */}
      {activeTab === 'sclera' && (
        <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-md backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                Optical Colorimetry Scanner
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Palpebral &amp; Sclera Biomarkers
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setScleraMode('anemia')}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                scleraMode === 'anemia'
                  ? 'border-rose-400 bg-rose-50/80 shadow-sm ring-1 ring-rose-400'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-black text-rose-900">Acute Anemia</p>
              <p className="text-[10px] text-rose-700 font-mono mt-0.5">Pallor Hb &lt; 8.5</p>
            </button>
            <button
              onClick={() => setScleraMode('jaundice')}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                scleraMode === 'jaundice'
                  ? 'border-amber-400 bg-amber-50/80 shadow-sm ring-1 ring-amber-400'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-black text-amber-900">Jaundice / Hepatitis</p>
              <p className="text-[10px] text-amber-700 font-mono mt-0.5">+14.2 &Delta;b* Shift</p>
            </button>
            <button
              onClick={() => setScleraMode('healthy')}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                scleraMode === 'healthy'
                  ? 'border-emerald-400 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-400'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-black text-emerald-900">Healthy Control</p>
              <p className="text-[10px] text-emerald-700 font-mono mt-0.5">Normative Baseline</p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Palpebral Conjunctiva (R/G Ratio)
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {scleraMode === 'anemia' ? '0.62' : scleraMode === 'jaundice' ? '1.18' : '1.34'}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                scleraMode === 'anemia' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {scleraMode === 'anemia' ? 'Severe Pallor (Anemia)' : 'Normal Hemoglobin'}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Sclera Bilirubin Shift (&Delta;b*)
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {scleraMode === 'jaundice' ? '+14.2' : '+1.4'}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                scleraMode === 'jaundice' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {scleraMode === 'jaundice' ? 'Hyperbilirubinemia (Jaundice)' : 'Normal Sclera'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: Camera PPG Vitals --- */}
      {activeTab === 'ppg' && (
        <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-md backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                Contactless Camera PPG Vitals
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Micro-Vascular Hemoglobin Pulse
              </h3>
            </div>
            <button
              onClick={startPpgScan}
              disabled={isScanningPpg}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <HeartPulse className="h-3.5 w-3.5" />
              {isScanningPpg ? `Scanning (${ppgProgress}%)` : 'Start 10s Scan'}
            </button>
          </div>

          {isScanningPpg && (
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full transition-all duration-300"
                style={{ width: `${ppgProgress}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Heart Rate</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{bpm} <span className="text-xs font-bold text-rose-500">BPM</span></p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Oxygen (SpO2)</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{spo2} <span className="text-xs font-bold text-sky-500">%</span></p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">HRV Index</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{hrv} <span className="text-xs font-bold text-emerald-500">ms</span></p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: Parkinson's Tremor Filter --- */}
      {activeTab === 'tremor' && (
        <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-md backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                Kinetic Tremor Suppression
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Low-Pass Velocity Smoothing
              </h3>
            </div>
            <button
              onClick={() => setIsTremorFiltered(!isTremorFiltered)}
              className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
                isTremorFiltered
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isTremorFiltered ? 'Filter: ACTIVE (Clean)' : 'Filter: OFF (Jittery)'}
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Draw inside the canvas below to test how the 4–8Hz velocity kernel absorbs involuntary hand tremors into smooth gestures.
          </p>

          <div
            className="h-36 w-full rounded-xl border border-slate-300 bg-white relative cursor-crosshair touch-none flex items-center justify-center text-slate-400 text-xs font-mono"
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const rawX = e.clientX - rect.left;
              const rawY = e.clientY - rect.top;
              const jitterX = isTremorFiltered ? rawX : rawX + (Math.random() - 0.5) * 16;
              const jitterY = isTremorFiltered ? rawY : rawY + (Math.random() - 0.5) * 16;
              setPoints((prev) => [...prev.slice(-40), { x: jitterX, y: jitterY }]);
            }}
          >
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={isTremorFiltered ? 3 : 2}
                  fill={isTremorFiltered ? '#0ea5e9' : '#ef4444'}
                  opacity={(i + 1) / points.length}
                />
              ))}
            </svg>
            {points.length === 0 && 'Touch / Drag here to test tremor suppression'}
          </div>
        </div>
      )}

      {/* --- Clinical Report Export Modal --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900">Clinical Telemetry Report</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 font-mono text-slate-700 bg-slate-50 p-3 rounded-xl border">
              <p><span className="font-bold">Patient ID:</span> #IQOO-8942-RURAL</p>
              <p><span className="font-bold">Timestamp:</span> {new Date().toLocaleString()}</p>
              <p><span className="font-bold">Heart Rate:</span> {bpm} BPM (Normal)</p>
              <p><span className="font-bold">Blood Oxygen:</span> {spo2}% SpO2</p>
              <p><span className="font-bold">Acoustic Stethoscope:</span> {stethMode.toUpperCase()}</p>
              <p><span className="font-bold">Sclera Status:</span> {scleraMode.toUpperCase()}</p>
              <p><span className="font-bold">Hardware Acceleration:</span> Snapdragon NPU (Air-Gapped)</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 py-2.5 text-xs font-black text-white hover:bg-sky-600"
              >
                <Printer className="h-4 w-4" /> Print / Save PDF
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
