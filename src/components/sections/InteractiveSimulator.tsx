import { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  Eye,
  HeartPulse,
  Pill,
  Activity,
  Volume2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Info,
  ShieldAlert,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import confetti from "canvas-confetti";

type SimulatorTab = "fft" | "sclera" | "ppg" | "pharma" | "gaze" | "tremor";

export function InteractiveSimulator() {
  const [activeTab, setActiveTab] = useState<SimulatorTab>("fft");

  // --- 1. Audio FFT Stethoscope State & Web Audio Synthesizer ---
  const [stethoscopeMode, setStethoscopeMode] = useState<"normal" | "wheeze" | "crackle">("wheeze");
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

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

  // --- 7. Clinical Report Modal ---
  const [showReportModal, setShowReportModal] = useState(false);

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

      if (stethoscopeMode === "wheeze") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
      } else if (stethoscopeMode === "crackle") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
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
  }, [stethoscopeMode]);

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
      category: "Lethal Hemorrhage Warning",
    },
  };

  const currentPharma = pharmaData[selectedPharma];
  const brandTotal = (currentPharma.brandPrice * pharmaQty).toFixed(2);
  const genericTotal = (currentPharma.genericPrice * pharmaQty).toFixed(2);
  const savingsTotal = (Number(brandTotal) - Number(genericTotal)).toFixed(2);

  // Spoken voice guidance for Jan Aushadhi
  const speakPharmaGuidance = (lang: "en" | "hi" | "kn") => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    let text = "";
    if (selectedPharma === "aspirin_warfarin") {
      text = lang === "hi"
        ? "चेतावनी! एस्पिरिन और वारफारिन एक साथ लेने से आंतरिक रक्तस्राव का गंभीर खतरा है।"
        : lang === "kn"
        ? "ಎಚ್ಚರಿಕೆ! ಆಸ್ಪಿರಿನ್ ಮತ್ತು ವಾರ್ಫಾರಿನ್ ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ರಕ್ತಸ್ರಾವಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು."
        : "Warning! Concurrent use of Aspirin and Warfarin poses severe risk of internal hemorrhage.";
    } else {
      text = lang === "hi"
        ? `${currentPharma.brandName} के बदले जन औषधि जेनेरिक उपलब्ध है। कुल बचत ₹${savingsTotal} रुपये।`
        : lang === "kn"
        ? `${currentPharma.brandName} ಬದಲಿಗೆ ಜನ ಔಷಧಿ ಲಭ್ಯವಿದೆ. ಒಟ್ಟು ಉಳಿತಾಯ ₹${savingsTotal} ರೂಪಾಯಿ.`
        : `${currentPharma.brandName} generic equivalent saves ₹${savingsTotal} at Jan Aushadhi.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="simulator" className="py-24 sm:py-32 relative overflow-hidden bg-slate-50/60 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-sky-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>Interactive Clinical Playground</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-display">
              Test Every Feature in Real-Time
            </h2>
            <p className="text-base text-slate-600 font-sans leading-relaxed">
              Experience the biophysical sensor algorithms and zero-touch accessibility engine directly in your browser.
            </p>
          </div>
        </Reveal>

        {/* Global Action Bar */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-cyan-600 active:scale-95 transition-all"
          >
            <FileText className="h-4 w-4" />
            Generate Clinical Medical Summary (PDF)
          </button>
        </div>

        {/* ============================================================== */}
        {/* TABS NAVIGATION                                                */}
        {/* ============================================================== */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 p-1.5 rounded-3xl bg-slate-200/50 backdrop-blur-md border border-slate-300/40">
          {[
            { id: "fft", label: "🩺 Acoustic Stethoscope FFT", badge: "Audio" },
            { id: "sclera", label: "👁️ Sclera & Conjunctiva Scan", badge: "Optical" },
            { id: "ppg", label: "💓 Contactless Camera PPG", badge: "Vitals" },
            { id: "pharma", label: "💊 Jan Aushadhi & CDSCO Shield", badge: "Pharma" },
            { id: "gaze", label: "👤 60 FPS Gaze & Breath Puff", badge: "Zero-Touch" },
            { id: "tremor", label: "〰️ Parkinson's Tremor Filter", badge: "Low-Pass" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as SimulatorTab);
                setIsPlayingSound(false);
              }}
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
                    <button
                      onClick={toggleSoundSynthesis}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black transition-all ${
                        isPlayingSound
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30"
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      {isPlayingSound ? "Stop Breath Audio" : "Listen to Breath Audio"}
                    </button>
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
                      onClick={() => {
                        setStethoscopeMode(m.id as any);
                        setIsPlayingSound(false);
                      }}
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
                        {scleraTarget === "jaundice" ? "Hyperbilirubinemia (Jaundice)" : "Normative Scleral Index"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs">
                  <p className="font-bold text-sky-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-sky-600" /> How It Works &bull; Optical Colorimetry
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    With flash illumination, the camera segments the lower eyelid inner conjunctiva and outer sclera, converting RGB values to CIE-L*a*b* space to detect microvascular pallor and bilirubin staining.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: "anemia", title: "🩸 Severe Anemia Palpebral Pallor (Hb < 8.5)", desc: "Conjunctival microvascular desaturation" },
                    { id: "jaundice", title: "🟡 Jaundice / Hepatitis Scleral Icterus (+14.2)", desc: "Bilirubin yellow hue deposition" },
                    { id: "healthy", title: "✅ Healthy Baseline Controls", desc: "Optimal erythrocyte capillary density" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setScleraTarget(s.id as any)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                        scleraTarget === s.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-slate-800 border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      <p className="text-xs font-bold">{s.title}</p>
                      <p className={`text-[11px] mt-0.5 ${scleraTarget === s.id ? "text-slate-300" : "text-slate-500"}`}>
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTLESS CAMERA PPG */}
          {activeTab === "ppg" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-slate-950 p-6 text-white border border-slate-800 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full bg-rose-500 ${isPpgScanning ? "animate-ping" : ""}`} />
                      CHROMINANCE-BASED PPG
                    </span>
                    <span className="text-slate-400">10-SECOND AIR-GAPPED VITAL SCAN</span>
                  </div>

                  {isPpgScanning && (
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-sky-500 h-full transition-all duration-200"
                        style={{ width: `${ppgProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">HEART RATE</p>
                      <p className="text-3xl font-mono font-extrabold text-white mt-1">
                        {ppgBpm} <span className="text-xs text-rose-400 font-bold">BPM</span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">BLOOD OXYGEN</p>
                      <p className="text-3xl font-mono font-extrabold text-white mt-1">
                        {ppgSpo2} <span className="text-xs text-sky-400 font-bold">%</span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">HRV INDEX</p>
                      <p className="text-3xl font-mono font-extrabold text-white mt-1">
                        {ppgHrv} <span className="text-xs text-emerald-400 font-bold">ms</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs">
                  <p className="font-bold text-sky-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-sky-600" /> How It Works &bull; Camera PPG
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    Measures microscopic blood volume pulses beneath the skin through RGB channel chrominance fluctuation analysis, extracting real-time vitals with zero external sensor hardware.
                  </p>
                </div>

                <button
                  onClick={startPpgScan}
                  disabled={isPpgScanning}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-sky-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPpgScanning ? `Acquiring Hemoglobin Pulses (${ppgProgress}%)...` : "Start 10-Second Camera PPG Scan"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PHARMA SAVINGS & CDSCO SAFETY SHIELD */}
          {activeTab === "pharma" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-md space-y-4">
                  <div className="flex justify-between items-center border-b pb-3 text-xs">
                    <span className="font-mono font-bold text-sky-800">
                      PRADHAN MANTRI JAN AUSHADHI KENDRA DATABASE
                    </span>
                    <div className="flex items-center gap-1">
                      {(["en", "hi", "kn"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setPharmaLang(lang);
                            speakPharmaGuidance(lang);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                            pharmaLang === lang ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                      <button
                        onClick={() => speakPharmaGuidance(pharmaLang)}
                        className="p-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 ml-1"
                        title="Read aloud"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Scanned Branded Medicine:</p>
                    <h3 className="text-lg font-black text-slate-900">{currentPharma.brandName}</h3>
                    <p className="text-xs text-sky-700 font-mono font-bold mt-0.5">
                      Generic Salt: {currentPharma.genericName}
                    </p>
                  </div>

                  {selectedPharma === "aspirin_warfarin" ? (
                    <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 text-rose-900 flex items-start gap-3">
                      <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-sm">🚨 CDSCO CONTRAINDICATION: LETHAL HEMORRHAGE RISK</p>
                        <p className="text-xs mt-1 leading-relaxed">
                          Concurrent dosing of Aspirin (Anti-platelet) + Warfarin (Anticoagulant) increases gastric hemorrhage risk by 340%. Immediate doctor consultation mandatory before dispensing.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-2xl border">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Commercial Price</p>
                        <p className="text-lg font-black text-rose-600 line-through">₹{brandTotal}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Jan Aushadhi</p>
                        <p className="text-lg font-black text-emerald-600">₹{genericTotal}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">You Save</p>
                        <p className="text-lg font-black text-sky-600">₹{savingsTotal} ({currentPharma.savingsPct})</p>
                      </div>
                    </div>
                  )}

                  {/* Quantity Slider */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Prescription Supply Duration:</span>
                      <span className="text-sky-700 font-black">{pharmaQty} Month ({pharmaQty * 30} Days)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={pharmaQty}
                      onChange={(e) => setPharmaQty(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3 lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Medicine Blister Test Case:
                </p>

                <div className="space-y-2">
                  {[
                    { id: "augmentin", title: "💊 Augmentin 625 Duo (77% Savings)", desc: "Amoxy-Clav Bacterial Respiratory" },
                    { id: "lipitor", title: "💊 Lipitor 20mg (85% Savings)", desc: "Atorvastatin Statin Cardiovascular" },
                    { id: "glycomet", title: "💊 Glycomet 500 SR (80% Savings)", desc: "Metformin Type-2 Diabetes" },
                    { id: "aspirin_warfarin", title: "⚠️ Aspirin + Warfarin (Conflict Alert)", desc: "CDSCO Lethal Drug Interaction Shield" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPharma(p.id as any)}
                      className={`w-full p-3 rounded-2xl text-left transition-all border ${
                        selectedPharma === p.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-slate-800 border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      <p className="text-xs font-bold">{p.title}</p>
                      <p className={`text-[11px] mt-0.5 ${selectedPharma === p.id ? "text-slate-300" : "text-slate-500"}`}>
                        {p.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 60 FPS GAZE TRACKING & MICRO-GESTURES */}
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
                  className="relative h-80 rounded-3xl bg-slate-950 p-4 overflow-hidden select-none cursor-crosshair border border-slate-800 shadow-xl"
                >
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[
                      { id: "call_caregiver", label: "📞 Call Caregiver", color: "bg-rose-900/60 border-rose-500/50" },
                      { id: "read_screen", label: "🔊 Read Screen TTS", color: "bg-sky-900/60 border-sky-500/50" },
                      { id: "turn_lights", label: "💡 Turn On Lights", color: "bg-amber-900/60 border-amber-500/50" },
                      { id: "play_music", label: "🎵 Play Music (Spotify)", color: "bg-emerald-900/60 border-emerald-500/50" },
                    ].map((btn) => (
                      <div
                        key={btn.id}
                        onMouseEnter={() => setActiveButton(btn.label)}
                        onMouseLeave={() => setActiveButton(null)}
                        className={`rounded-2xl border p-4 flex flex-col justify-center items-center text-center font-bold text-white transition-all ${btn.color} ${
                          activeButton === btn.label ? "scale-95 ring-2 ring-sky-400 bg-sky-900/90" : ""
                        }`}
                      >
                        <span className="text-sm">{btn.label}</span>
                        {activeButton === btn.label && (
                          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-sky-400 h-full transition-all duration-100"
                              style={{ width: `${dwellProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Iris Gaze Pointer */}
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50 transition-all duration-75 flex items-center justify-center"
                    style={{
                      left: `${gazePos.x}%`,
                      top: `${gazePos.y}%`,
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <div className="h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 lg:col-span-5">
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs">
                  <p className="font-bold text-sky-900 flex items-center gap-1.5 text-sm">
                    <Info className="h-4 w-4 text-sky-600" /> How It Works &bull; 60 FPS Head &amp; Gaze
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-sans">
                    Runs 468 facial landmarks on the Snapdragon NPU to track head pose and iris gaze coordinates, executing dwell-clicks and micro-gestures with zero touch.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleGestureClick("smile")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">😃 Smile Trigger</p>
                    <p className="text-[10px] text-slate-500">Primary UI Click</p>
                  </button>

                  <button
                    onClick={() => handleGestureClick("mouth")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">😮 Mouth Expand</p>
                    <p className="text-[10px] text-slate-500">Downward Page Scroll</p>
                  </button>

                  <button
                    onClick={() => handleGestureClick("puff")}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-sm"
                  >
                    <p className="font-bold text-xs">💨 Breath/Puff</p>
                    <p className="text-[10px] text-slate-500">Read Screen TTS</p>
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

          {/* TAB 6: PARKINSON'S MOTOR TREMOR DAMPENING FILTER */}
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

        {/* --- CLINICAL REPORT EXPORT MODAL --- */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="max-w-lg w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">PulseEdge-OS Clinical Telemetry Report</h3>
                    <p className="text-[11px] font-mono text-slate-500">Patient Diagnostic Record #IQOO-8942-RURAL</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs space-y-3 font-mono text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between border-b pb-2">
                  <span>Timestamp:</span>
                  <span className="font-bold text-slate-900">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Heart Rate (PPG):</span>
                  <span className="font-bold text-slate-900">{ppgBpm} BPM (Normal Resting)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Blood Oxygen (SpO2):</span>
                  <span className="font-bold text-slate-900">{ppgSpo2}% SpO2</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Acoustic Stethoscope:</span>
                  <span className="font-bold text-amber-700">{stethoscopeMode.toUpperCase()} (Peak 480 Hz)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Sclera / Palpebral Biomarker:</span>
                  <span className="font-bold text-slate-900">{scleraTarget.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Jan Aushadhi Generic Match:</span>
                  <span className="font-bold text-emerald-700">{currentPharma.genericName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Edge Compute Engine:</span>
                  <span className="font-bold text-sky-700">Snapdragon 8 Gen NPU (100% Air-Gapped)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3 text-xs font-black text-white hover:bg-sky-600 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <Printer className="h-4 w-4" /> Print / Save Diagnostic PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
