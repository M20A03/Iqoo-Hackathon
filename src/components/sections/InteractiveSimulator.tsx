import { useState, useRef, useEffect } from "react";
import {
  Play,
  Stethoscope,
  Eye,
  HeartPulse,
  Pill,
  Activity,
  Mic,
  Volume2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Smartphone,
  Radio,
  HelpCircle,
  TrendingDown,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import confetti from "canvas-confetti";

type SimulatorTab = "fft" | "sclera" | "ppg" | "pharma" | "gaze" | "tremor";

export function InteractiveSimulator() {
  const [activeTab, setActiveTab] = useState<SimulatorTab>("fft");

  // --- 1. Audio FFT Stethoscope State ---
  const [stethoscopeMode, setStethoscopeMode] = useState<"normal" | "wheeze" | "crackle">("wheeze");
  const [isAudioLive, setIsAudioLive] = useState(true);

  // --- 2. Sclera & Conjunctiva State ---
  const [scleraTarget, setScleraTarget] = useState<"anemia" | "jaundice" | "healthy">("anemia");

  // --- 3. Camera PPG State ---
  const [isPpgScanning, setIsPpgScanning] = useState(false);
  const [ppgBpm, setPpgBpm] = useState(74);
  const [ppgSpo2, setPpgSpo2] = useState(98);
  const [ppgHrv, setPpgHrv] = useState(48);
  const [ppgProgress, setPpgProgress] = useState(0);

  // --- 4. Jan Aushadhi & CDSCO State (Sliding Price Calculator Drawer) ---
  const [selectedPharma, setSelectedPharma] = useState<"augmentin" | "lipitor" | "glycomet" | "aspirin_warfarin">("augmentin");
  const [pharmaQty, setPharmaQty] = useState(1);
  const [pharmaLang, setPharmaLang] = useState<"en" | "hi" | "kn">("en");

  // --- 5. Gaze & Micro-Gestures State (360 Dwell Pointer) ---
  const [gazePos, setGazePos] = useState({ x: 50, y: 50 });
  const [gazeActionLog, setGazeActionLog] = useState("Move your cursor inside the viewport to simulate 60 FPS iris tracking.");
  const [dwellProgress, setDwellProgress] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // --- 6. Tremor Filter State ---
  const [tremorEnabled, setTremorEnabled] = useState(true);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);

  // Dwell Timer simulation for 360 radial progress
  useEffect(() => {
    let interval: any;
    if (activeButton) {
      interval = setInterval(() => {
        setDwellProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerAction(activeButton);
            return 0;
          }
          return prev + 15;
        });
      }, 100);
    } else {
      setDwellProgress(0);
    }
    return () => clearInterval(interval);
  }, [activeButton]);

  const triggerAction = (actionName: string) => {
    setGazeActionLog(`✦ Dwell Complete: Selected "${actionName}" via Iris Gaze!`);
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.75 },
      colors: ["#0ea5e9", "#06b6d4", "#6366f1"],
    });
  };

  const handleGestureClick = (gesture: string) => {
    switch (gesture) {
      case "smile":
        setGazeActionLog("😃 Smile Detected: Performed primary click on focused UI node!");
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.75 } });
        break;
      case "mouth":
        setGazeActionLog("😮 Mouth-Aspect-Ratio Expanded: Dispatched downward page scroll.");
        break;
      case "puff":
        setGazeActionLog("💨 High-Energy Breath/Puff Acoustic Trigger: Invoked Read Screen TTS.");
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.75 }, colors: ["#0ea5e9", "#10b981"] });
        break;
      case "wink":
        setGazeActionLog("😉 Left Eye Wink Micro-Gesture: Triggered Caregiver SOS Speed-Dial.");
        break;
    }
  };

  // PPG Scanner Simulation
  const startPpgScan = () => {
    setIsPpgScanning(true);
    setPpgProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setPpgProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsPpgScanning(false);
        setPpgBpm(Math.floor(72 + Math.random() * 8));
        setPpgSpo2(Math.floor(97 + Math.random() * 2));
        setPpgHrv(Math.floor(45 + Math.random() * 12));
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.75 }, colors: ["#ef4444", "#0ea5e9"] });
      }
    }, 200);
  };

  // Pharma calculation helpers
  const pharmaData = {
    augmentin: {
      brandName: "Augmentin 625 Duo",
      genericName: "Amoxy-Clav 625 (Amoxicillin + Potassium Clavulanate)",
      brandPrice: 210.5,
      genericPrice: 48.0,
      savingsPct: "77%",
      category: "Broad-Spectrum Antibiotic",
    },
    lipitor: {
      brandName: "Lipitor 20mg",
      genericName: "Atorvastatin Calcium 20mg",
      brandPrice: 380.0,
      genericPrice: 54.0,
      savingsPct: "85%",
      category: "Cholesterol Reducer (Statin)",
    },
    glycomet: {
      brandName: "Glycomet 500 SR",
      genericName: "Metformin Hydrochloride 500mg",
      brandPrice: 85.0,
      genericPrice: 16.5,
      savingsPct: "80%",
      category: "Anti-Diabetic",
    },
    aspirin_warfarin: {
      brandName: "Ecosprin (Aspirin) + Warf (Warfarin)",
      genericName: "Dual Anticoagulant Interaction",
      brandPrice: 195.0,
      genericPrice: 42.0,
      savingsPct: "78%",
      category: "DANGEROUS CDSCO CONTRAINDICATION",
    },
  };

  const currentPharma = pharmaData[selectedPharma];
  const totalBrand = (currentPharma.brandPrice * pharmaQty).toFixed(2);
  const totalGeneric = (currentPharma.genericPrice * pharmaQty).toFixed(2);
  const totalSavings = (
    (currentPharma.brandPrice - currentPharma.genericPrice) *
    pharmaQty
  ).toFixed(2);

  return (
    <section id="simulator" className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-transparent via-sky-50/40 to-slate-100/60">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-700">
                <Sparkles className="h-3.5 w-3.5 text-sky-500" /> Interactive Clinical Simulator
              </span>
              <h2 className="mt-3 font-sans text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Experience All 6 Neural &amp; Clinical Engines
              </h2>
            </div>
            <p className="max-w-md font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every engine runs 100% locally on Snapdragon NPU hardware. Select a module below to test its real-time diagnostic stream:
            </p>
          </div>
        </Reveal>

        {/* 6 Tabs Pill Bar */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { id: "fft", label: "🩺 Acoustic Stethoscope (Audio FFT)", badge: "200Hz–1kHz" },
            { id: "sclera", label: "👁️ Sclera & Conjunctiva Scanner", badge: "Optical" },
            { id: "ppg", label: "💓 Camera PPG Vitals (BPM & SpO2)", badge: "Capillary" },
            { id: "pharma", label: "💊 Jan Aushadhi & CDSCO Drawer", badge: "Up to 85% Off" },
            { id: "gaze", label: "👤 60 FPS Gaze & Breath Puff", badge: "Zero-Touch" },
            { id: "tremor", label: "〰️ Parkinson's Tremor Filter", badge: "Low-Pass" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as SimulatorTab)}
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all border flex items-center gap-2 ${
                activeTab === t.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                  : "bg-white/85 text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeTab === t.id ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB PLAYGROUND CARD (FROSTED CLINICAL GLASS PANEL)             */}
        {/* ============================================================== */}
        <div className="mt-6 glass-panel p-6 sm:p-8 relative">
          {/* TAB 1: ACOUSTIC FFT STETHOSCOPE */}
          {activeTab === "fft" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-slate-950 p-6 text-white border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 text-xs font-mono">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      AUDIORECORD PCM 44.1 kHz
                    </span>
                    <span className="text-slate-400">FFT BAND: 200 Hz – 1000 Hz</span>
                  </div>

                  {/* Frequency Waveform Bars */}
                  <div className="flex items-end justify-between h-40 pt-4 px-4 bg-slate-900 rounded-xl border border-slate-800">
                    {[
                      { freq: "200Hz", h: stethoscopeMode === "crackle" ? "85%" : stethoscopeMode === "wheeze" ? "35%" : "25%", color: stethoscopeMode === "crackle" ? "#ef4444" : "#0ea5e9" },
                      { freq: "280Hz", h: stethoscopeMode === "crackle" ? "95%" : stethoscopeMode === "wheeze" ? "40%" : "30%", color: stethoscopeMode === "crackle" ? "#ef4444" : "#0ea5e9" },
                      { freq: "380Hz", h: stethoscopeMode === "crackle" ? "75%" : stethoscopeMode === "wheeze" ? "70%" : "20%", color: stethoscopeMode === "crackle" ? "#ef4444" : "#0ea5e9" },
                      { freq: "450Hz", h: stethoscopeMode === "wheeze" ? "100%" : stethoscopeMode === "crackle" ? "45%" : "20%", color: stethoscopeMode === "wheeze" ? "#f59e0b" : "#0ea5e9" },
                      { freq: "550Hz", h: stethoscopeMode === "wheeze" ? "90%" : stethoscopeMode === "crackle" ? "30%" : "15%", color: stethoscopeMode === "wheeze" ? "#f59e0b" : "#0ea5e9" },
                      { freq: "700Hz", h: stethoscopeMode === "wheeze" ? "65%" : stethoscopeMode === "crackle" ? "20%" : "15%", color: stethoscopeMode === "wheeze" ? "#f59e0b" : "#0ea5e9" },
                      { freq: "1000Hz", h: "18%", color: "#0ea5e9" },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 mx-1">
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 shadow-md"
                          style={{ height: bar.h, backgroundColor: bar.color }}
                        />
                        <span className="text-[9.5px] font-mono text-slate-400">{bar.freq}</span>
                      </div>
                    ))}
                  </div>

                  {/* Diagnostic Banner */}
                  <div className={`mt-4 rounded-xl p-4 border text-xs leading-relaxed ${
                    stethoscopeMode === "wheeze"
                      ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
                      : stethoscopeMode === "crackle"
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                      : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Stethoscope className="h-4 w-4" />
                      {stethoscopeMode === "wheeze" && "HIGH-PITCH BRONCHIAL WHEEZING DETECTED (450–550 Hz)"}
                      {stethoscopeMode === "crackle" && "DISCONTINUOUS DRY CRACKLES DETECTED (200–350 Hz)"}
                      {stethoscopeMode === "normal" && "NORMAL CLEAR VESICULAR SOUNDS"}
                    </div>
                    <p className="mt-1 opacity-90 font-sans">
                      {stethoscopeMode === "wheeze" && "Indication: Airway bronchoconstriction consistent with Asthma or COPD. Inhaler dosage recommended."}
                      {stethoscopeMode === "crackle" && "Indication: Alveolar fluid tension indicative of early-stage Pneumonia. Immediate clinical triage advised."}
                      {stethoscopeMode === "normal" && "Indication: Symmetrical respiratory acoustics without abnormal adventitious sounds."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls & Explanation */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs">
                  <p className="font-bold text-sky-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-sky-600" /> How It Works &bull; Acoustic Stethoscope
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    The user places the bottom microphone against the patient's upper back or chest. The app runs a 16-bit PCM Fast Fourier Transform on the Snapdragon NPU to analyze frequency distribution between 200 Hz and 1000 Hz.
                  </p>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Acoustic Respiratory Test Case:
                </p>

                <div className="space-y-2">
                  {[
                    { id: "wheeze", title: "🎷 Asthmatic High-Pitch Wheeze (450 Hz)", desc: "Airway narrowing during exhalation" },
                    { id: "crackle", title: "🪵 Pneumonia Dry Crackles (240 Hz)", desc: "Alveolar fluid tension during inhalation" },
                    { id: "normal", title: "✅ Normal Vesicular Breath Sounds", desc: "Smooth baseline breath rhythm" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setStethoscopeMode(m.id as any)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                        stethoscopeMode === m.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-slate-800 border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      <p className="text-xs font-bold">{m.title}</p>
                      <p className={`text-[11px] mt-0.5 ${stethoscopeMode === m.id ? "text-slate-300" : "text-slate-500"}`}>
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCLERA & INNER-EYELID CONJUNCTIVA */}
          {activeTab === "sclera" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-slate-950 p-6 text-white border border-slate-800 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono">
                    <span className="text-sky-400 font-bold">✦ CALIBRATED FLASH COLORIMETRIC MATRIX</span>
                    <span className="text-slate-400">SNAPDRAGON NPU RAW RGB</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                      <p className="text-[10px] font-mono text-sky-400 uppercase">PALPEBRAL PALLOR (R/G RATIO)</p>
                      <p className="text-3xl font-mono font-extrabold text-white mt-1">
                        {scleraTarget === "anemia" ? "0.62" : "1.28"}
                      </p>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full mt-2 inline-block ${
                        scleraTarget === "anemia" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}>
                        {scleraTarget === "anemia" ? "Acute Anemia Risk (Hb < 8.5)" : "Normal Hemoglobin Index"}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                      <p className="text-[10px] font-mono text-amber-400 uppercase">SCLERAL YELLOW SHIFT (&Delta;b*)</p>
                      <p className="text-3xl font-mono font-extrabold text-white mt-1">
                        {scleraTarget === "jaundice" ? "+14.2" : "+1.8"}
                      </p>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full mt-2 inline-block ${
                        scleraTarget === "jaundice" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}>
                        {scleraTarget === "jaundice" ? "Bilirubin Icteric Alert" : "Healthy White Sclera"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-100 text-xs">
                  <p className="font-bold text-cyan-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-cyan-600" /> How It Works &bull; Optical Eye Biomarkers
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    The camera LED flash illuminates the palpebral conjunctiva (inside lower eyelid) or white sclera. The ISP measures capillary blood density to estimate hemoglobin levels and yellow-shift color indices.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: "anemia", title: "🩸 Palpebral Conjunctiva: Acute Anemia Pallor", desc: "Low capillary red channel density" },
                    { id: "jaundice", title: "🟡 Sclera: Jaundice & Hepatitis Yellow Shift", desc: "Bilirubin shift on CIELAB b* axis" },
                    { id: "healthy", title: "✅ Normal Physiological Biomarkers", desc: "Normal micro-vascular density" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setScleraTarget(m.id as any)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                        scleraTarget === m.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-slate-800 border-slate-200 hover:border-cyan-300"
                      }`}
                    >
                      <p className="text-xs font-bold">{m.title}</p>
                      <p className={`text-[11px] mt-0.5 ${scleraTarget === m.id ? "text-slate-300" : "text-slate-500"}`}>
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAMERA PPG (PULSE & SPO2) */}
          {activeTab === "ppg" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-slate-950 p-6 text-white border border-slate-800 shadow-xl text-center">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 text-xs font-mono">
                    <span className="text-rose-400 font-bold">✦ PHOTOPLETHYSMOGRAPHY (PPG)</span>
                    <span className="text-slate-400">100% OFFLINE</span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2">
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl border-2 ${
                      isPpgScanning ? "border-rose-500 animate-spin bg-rose-500/10" : "border-rose-500/40 bg-rose-500/10"
                    }`}>
                      <HeartPulse className={`h-10 w-10 ${isPpgScanning ? "text-rose-400 animate-pulse" : "text-rose-400"}`} />
                    </div>

                    {isPpgScanning && (
                      <div className="mt-4 w-60 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-500 to-cyan-400 h-full transition-all duration-200" style={{ width: `${ppgProgress}%` }} />
                      </div>
                    )}

                    <div className="mt-6 grid grid-cols-3 gap-3 w-full">
                      <div className="rounded-2xl bg-slate-900 p-3 border border-slate-800">
                        <p className="text-[9.5px] font-mono text-slate-400 uppercase">HEART RATE</p>
                        <p className="text-2xl font-mono font-extrabold text-white mt-0.5">{ppgBpm} <span className="text-xs text-rose-400">BPM</span></p>
                      </div>
                      <div className="rounded-2xl bg-slate-900 p-3 border border-slate-800">
                        <p className="text-[9.5px] font-mono text-slate-400 uppercase">SpO2 OXYGEN</p>
                        <p className="text-2xl font-mono font-extrabold text-cyan-400 mt-0.5">{ppgSpo2}%</p>
                      </div>
                      <div className="rounded-2xl bg-slate-900 p-3 border border-slate-800">
                        <p className="text-[9.5px] font-mono text-slate-400 uppercase">HRV STRESS</p>
                        <p className="text-2xl font-mono font-extrabold text-slate-200 mt-0.5">{ppgHrv} <span className="text-xs text-slate-400">ms</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 text-xs">
                  <p className="font-bold text-rose-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-rose-600" /> How It Works &bull; Camera PPG Vitals
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    The camera lens detects subtle skin micro-color variations created by pulsatile blood flow. The app extracts pulse waveform periodicity and oxygenated vs deoxygenated hemoglobin ratios.
                  </p>
                </div>

                <button
                  disabled={isPpgScanning}
                  onClick={startPpgScan}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-500/25 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {isPpgScanning ? "Measuring Capillary Pulse Stream..." : "▶ Start 10-Second Vitals Scan"}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: JAN AUSHADHI PRICE-COMPARISON DRAWER & CDSCO CHECKER     */}
          {/* ============================================================== */}
          {activeTab === "pharma" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                {/* 5D Interactive Price Comparison Card */}
                <div className="rounded-3xl bg-slate-950 p-6 text-white border border-slate-800 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono">
                    <span className="text-sky-400 font-bold flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4 text-emerald-400" />
                      JAN AUSHADHI GENERIC COST SAVER
                    </span>
                    <span className="text-slate-400">OFFLINE ROOM SQLITE</span>
                  </div>

                  {/* Comparison Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-900 p-4 border border-rose-500/30">
                      <span className="text-[10px] font-mono text-rose-400 uppercase">BRANDED PRESCRIPTION</span>
                      <p className="text-base font-bold text-white mt-1">{currentPharma.brandName}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{currentPharma.category}</p>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="font-mono text-2xl font-black text-rose-400">₹{totalBrand}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({pharmaQty} pack)</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4 border border-emerald-500/50 relative overflow-hidden">
                      <div className="absolute top-2 right-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9.5px] font-black px-2 py-0.5">
                        {currentPharma.savingsPct} SAVINGS
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">JAN AUSHADHI GENERIC</span>
                      <p className="text-base font-bold text-emerald-300 mt-1">{currentPharma.genericName}</p>
                      <p className="text-[11px] text-slate-400">Identical Active Salt</p>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="font-mono text-2xl font-black text-emerald-400">₹{totalGeneric}</span>
                        <span className="text-[10px] text-emerald-300 font-mono font-bold">(Save ₹{totalSavings})</span>
                      </div>
                    </div>
                  </div>

                  {/* CDSCO Alert Banner (if applicable) */}
                  {selectedPharma === "aspirin_warfarin" && (
                    <div className="rounded-2xl p-4 bg-rose-950/60 border border-rose-500 text-rose-200 text-xs">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <ShieldAlert className="h-4 w-4 text-rose-400" />
                        CRITICAL CDSCO CONTRAINDICATION: DUAL BLOOD THINNER
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed">
                        {pharmaLang === "en"
                          ? "WARNING: Concomitant use of Aspirin and Warfarin substantially multiplies internal hemorrhage risk. Do not dispense without physician approval."
                          : pharmaLang === "hi"
                          ? "चेतावनी: एस्पिरिन और वारफारिन को एक साथ लेने पर रक्तस्राव का गंभीर खतरा है। डॉक्टर की सलाह के बिना न लें।"
                          : "ಎಚ್ಚರಿಕೆ: ಆಸ್ಪಿರಿನ್ ಮತ್ತು ವಾರ್ಫಾರಿನ್ ಅನ್ನು ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ. ತೀವ್ರ ರಕ್ತಸ್ರಾವದ ಅಪಾಯವಿದೆ."}
                      </p>
                    </div>
                  )}

                  {/* Sliding Quantity Counter */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                    <span className="text-slate-400 font-mono">Prescription Supply:</span>
                    <div className="flex items-center gap-2">
                      {[1, 3, 6].map((q) => (
                        <button
                          key={q}
                          onClick={() => setPharmaQty(q)}
                          className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
                            pharmaQty === q ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {q} {q === 1 ? "Month" : "Months"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100 text-xs">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-amber-600" /> How It Works &bull; Jan Aushadhi &amp; CDSCO
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    The camera OCR scans branded blister packs. PulseEdge-OS maps the active chemical salt to government Jan Aushadhi generic equivalents, cutting medication expenses by up to 85% while checking CDSCO contraindication tables.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: "augmentin", title: "💊 Augmentin 625 Duo (77% Cost Saver)", desc: "Antibiotic • ₹210 vs ₹48 generic" },
                    { id: "lipitor", title: "💊 Lipitor 20mg (85% Cost Saver)", desc: "Cholesterol • ₹380 vs ₹54 generic" },
                    { id: "glycomet", title: "💊 Glycomet 500 SR (80% Cost Saver)", desc: "Diabetes • ₹85 vs ₹16.5 generic" },
                    { id: "aspirin_warfarin", title: "⚠️ Aspirin + Warfarin (CDSCO Warning)", desc: "Dangerous drug-drug interaction alert" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedPharma(m.id as any)}
                      className={`w-full p-3 rounded-2xl text-left transition-all border ${
                        selectedPharma === m.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-slate-800 border-slate-200 hover:border-amber-300"
                      }`}
                    >
                      <p className="text-xs font-bold">{m.title}</p>
                      <p className={`text-[11px] mt-0.5 ${selectedPharma === m.id ? "text-slate-300" : "text-slate-500"}`}>
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Multilingual Speech Audio Selector */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-500">Spoken Language:</span>
                  {(["en", "hi", "kn"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setPharmaLang(l)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        pharmaLang === l ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "ಕನ್ನಡ"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: GAZE & BREATH PUFF SELECTION (360 DWELL POINTER)        */}
          {/* ============================================================== */}
          {activeTab === "gaze" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setGazePos({ x, y });
                  }}
                  className="relative h-80 rounded-3xl bg-slate-950 p-6 overflow-hidden cursor-crosshair select-none border border-slate-800 shadow-xl"
                >
                  <div className="grid grid-cols-2 gap-4 h-full relative z-10">
                    {[
                      { id: "whatsapp", label: "💬 Message Doctor", sub: "WhatsApp Node" },
                      { id: "vitals", label: "💓 Check PPG Vitals", sub: "Camera Pulse" },
                      { id: "stetho", label: "🩺 Stethoscope Scan", sub: "Audio FFT" },
                      { id: "sos", label: "🚨 Emergency Caregiver SOS", sub: "OriginOS Bridge" },
                    ].map((btn) => (
                      <div
                        key={btn.id}
                        onMouseEnter={() => setActiveButton(btn.label)}
                        onMouseLeave={() => setActiveButton(null)}
                        className={`rounded-2xl border p-4 flex flex-col justify-center items-center text-center transition-all ${
                          activeButton === btn.label
                            ? "border-sky-400 bg-sky-500 text-white scale-[1.02] shadow-lg shadow-sky-500/25"
                            : "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        <p className="font-bold text-sm">{btn.label}</p>
                        <p className="text-[10px] font-mono mt-1 opacity-80">{btn.sub}</p>
                        {activeButton === btn.label && (
                          <div className="mt-2 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-white h-full transition-all duration-100"
                              style={{ width: `${dwellProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 360-Degree Floating Gaze Pointer with Radial Timer */}
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75"
                    style={{ left: `${gazePos.x}%`, top: `${gazePos.y}%`, width: 48, height: 48 }}
                  >
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#0ea5e9"
                        strokeWidth="3"
                        strokeDasharray="113"
                        strokeDashoffset={113 - (113 * dwellProgress) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute h-2.5 w-2.5 rounded-full bg-sky-400 shadow-lg shadow-sky-400" />
                  </div>
                </div>
                <p className="mt-2 text-xs font-mono text-sky-600">✦ Hover inside viewport to simulate 60 FPS iris gaze dwell selection.</p>
              </div>

              {/* Gesture Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs">
                  <p className="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-indigo-600" /> How It Works &bull; 60 FPS Neural Micro-Gestures
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    The front camera tracks 468 facial mesh landmarks on the Snapdragon NPU. Intentional smiles, mouth opening, or acoustic breath puffs trigger synthetic taps and scrolls across any Android app.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleGestureClick("smile")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">😃 Smile</p>
                    <p className="text-[10px] text-slate-500">Primary Click Trigger</p>
                  </button>

                  <button
                    onClick={() => handleGestureClick("mouth")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">😮 Mouth Open</p>
                    <p className="text-[10px] text-slate-500">Downward Page Scroll</p>
                  </button>

                  <button
                    onClick={() => handleGestureClick("puff")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">💨 Breath / Puff</p>
                    <p className="text-[10px] text-slate-500">Acoustic Breath Click</p>
                  </button>

                  <button
                    onClick={() => handleGestureClick("wink")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-rose-400 hover:bg-rose-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">😉 Left Eye Wink</p>
                    <p className="text-[10px] text-slate-500">Emergency Caregiver SOS</p>
                  </button>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3.5 border border-slate-800 font-mono text-xs text-sky-400">
                  {gazeActionLog}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: PARKINSON'S MOTOR TREMOR DAMPENING FILTER              */}
          {/* ============================================================== */}
          {activeTab === "tremor" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    let x = e.clientX - rect.left;
                    let y = e.clientY - rect.top;
                    if (!tremorEnabled) {
                      x += (Math.random() - 0.5) * 35;
                      y += (Math.random() - 0.5) * 35;
                    }
                    setDrawnPoints((prev) => [...prev.slice(-35), { x, y }]);
                  }}
                  className="relative h-80 rounded-3xl bg-slate-950 p-4 overflow-hidden select-none cursor-pointer border border-slate-800 shadow-xl"
                >
                  <div className="absolute top-4 left-4 z-20 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md">
                    Mode: {tremorEnabled ? "✅ Low-Pass Tremor Filter ACTIVE (Smooth Stroke)" : "❌ Raw 8Hz Jittery Input (Unfiltered)"}
                  </div>

                  <svg className="w-full h-full absolute inset-0 pointer-events-none">
                    {drawnPoints.length > 1 && (
                      <polyline
                        points={drawnPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke={tremorEnabled ? "#0ea5e9" : "#ef4444"}
                        strokeWidth={tremorEnabled ? "6" : "3"}
                        strokeLinecap="round"
                        strokeDasharray={tremorEnabled ? "none" : "3 3"}
                      />
                    )}
                  </svg>
                  <p className="absolute bottom-4 left-4 text-xs font-mono text-slate-400">Move your cursor across this canvas to test touch velocity damping.</p>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-xs">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-emerald-600" /> How It Works &bull; Parkinson's Tremor Filter
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    A software low-pass filter intercepts raw touchscreen motion events to calculate velocity vectors, discarding oscillatory 4–8Hz tremors and transforming erratic tremors into single intentional taps.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTremorEnabled(!tremorEnabled);
                    setDrawnPoints([]);
                  }}
                  className={`w-full py-4 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md ${
                    tremorEnabled
                      ? "bg-sky-500 text-white shadow-sky-500/25 hover:bg-sky-600"
                      : "bg-rose-500 text-white shadow-rose-500/25 hover:bg-rose-600"
                  }`}
                >
                  Toggle Tremor Filter: {tremorEnabled ? "ENABLED (Smooth Low-Pass)" : "DISABLED (Raw 8Hz Jitter)"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
