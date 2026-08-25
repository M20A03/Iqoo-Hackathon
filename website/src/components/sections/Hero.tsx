import { useState, useEffect } from "react";
import { Zap, Stethoscope, Eye, HeartPulse, Download, Play, Cpu, ShieldCheck, Activity, Sparkles, AlertCircle, ArrowUpRight, Volume2, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import elderlyManImg from "@/assets/elderly-man-using-app.jpg";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";

export function Hero() {
  const reduceMotion = useReducedMotion();

  // Interactive Live Diagnostic State
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [stethoType, setStethoType] = useState<"wheeze" | "crackle" | "normal">("wheeze");
  const [activeEyeMetric, setActiveEyeMetric] = useState<"anemia" | "jaundice">("anemia");
  const [liveBpm, setLiveBpm] = useState(74);

  // Gentle Heartbeat BPM fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBpm((prev) => (prev === 74 ? 76 : prev === 76 ? 73 : 74));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Subtle Gradient & Clinical Grid */}
      <div className="absolute inset-0 bg-clinical-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-200/40 via-cyan-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Header Badge & Tagline */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              iQOO Hackathon 2026 &bull; HealthTech &amp; Accessibility Track
            </span>
          </div>

          <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
            Air-Gapped Medical Diagnostics &amp; <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              Zero-Touch Neuro-Accessibility
            </span>
          </h1>

          <p className="mt-5 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-slate-600 font-sans">
            <strong>PulseEdge-OS (Sahayak)</strong> turns standard iQOO flagship sensors into clinical-grade diagnostic tools and an air-gapped hands-free operating layer for motor-impaired individuals (ALS, Parkinson’s, Cerebral Palsy) and rural health centers.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/PulseEdge-OS.apk"
              download="PulseEdge-OS.apk"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:scale-[1.02] transition-all"
            >
              <Download className="h-4 w-4" />
              Download PulseEdge OS APK
            </a>
            <a
              href="#simulator"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-all shadow-sm"
            >
              <Play className="h-4 w-4 text-sky-500" />
              Launch Clinical Playground
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CORE VISUAL COMPONENT: HERO DIAGNOSTIC 3-COLUMN 5D GRID         */}
        {/* ============================================================== */}
        <div id="diagnostic-hud" className="mt-14">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                5D Sensory Dynamic Telemetry HUD &bull; Snapdragon NPU
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              100% On-Device &bull; 0.0ms Cloud Latency
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ---------------------------------------------------------- */}
            {/* CARD 1: ACOUSTIC STETHOSCOPE CARD (Audio FFT Spectrogram) */}
            {/* ---------------------------------------------------------- */}
            <div className="glass-panel p-6 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Stethoscope className="h-20 w-20 text-sky-500" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base">Acoustic Stethoscope</h3>
                      <p className="text-[11px] font-mono text-slate-500">AUDIORECORD FFT (200Hz–1kHz)</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    16-Bit PCM
                  </span>
                </div>

                {/* Real-time Glowing Audio Spectrogram Waveform */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                    <span>BAND: 200 Hz - 1000 Hz</span>
                    <span className="text-sky-400 font-bold">
                      {stethoType === "wheeze" ? "450 Hz (Wheeze)" : stethoType === "crackle" ? "240 Hz (Crackles)" : "Normal"}
                    </span>
                  </div>

                  {/* Animated Waveform Frequency Bars */}
                  <div className="flex items-end justify-between h-20 px-2 gap-1.5">
                    <div className={`w-full rounded-t ${isPlayingAudio ? "bar-1" : "h-3"} bg-gradient-to-t from-sky-600 to-cyan-400`} />
                    <div className={`w-full rounded-t ${isPlayingAudio ? "bar-2" : "h-6"} bg-gradient-to-t from-sky-600 to-cyan-400`} />
                    <div className={`w-full rounded-t ${isPlayingAudio ? "bar-3" : "h-12"} bg-gradient-to-t from-sky-600 ${stethoType === "wheeze" ? "to-amber-400" : "to-cyan-400"}`} />
                    <div className={`w-full rounded-t ${isPlayingAudio ? "bar-4" : "h-16"} bg-gradient-to-t from-sky-600 ${stethoType === "wheeze" ? "to-amber-400" : "to-cyan-400"}`} />
                    <div className={`w-full rounded-t ${isPlayingAudio ? "bar-5" : "h-8"} bg-gradient-to-t from-sky-600 to-cyan-400`} />
                    <div className={`w-full rounded-t ${isPlayingAudio ? "bar-6" : "h-4"} bg-gradient-to-t from-sky-600 to-cyan-400`} />
                  </div>
                </div>

                {/* Clinical Interpretation Readout */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Activity className="h-3.5 w-3.5 text-sky-500" />
                    <span>
                      {stethoType === "wheeze" && "Asthmatic Wheezing (450 Hz)"}
                      {stethoType === "crackle" && "Pneumonia Dry Crackles (240 Hz)"}
                      {stethoType === "normal" && "Normal Vesicular Breathing"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {stethoType === "wheeze" && "Detected high-pitch musical airway narrowing in bronchial cycle."}
                    {stethoType === "crackle" && "Explosive discontinuous opening of fluid-filled alveoli."}
                    {stethoType === "normal" && "Symmetrical acoustic airflow without adventitious sounds."}
                  </p>
                </div>
              </div>

              {/* Interactive Audio Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {(["wheeze", "crackle", "normal"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setStethoType(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        stethoType === mode
                          ? "bg-sky-500 text-white shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 text-[10px] font-bold"
                  title="Toggle animation waveform"
                >
                  {isPlayingAudio ? "Pause" : "Live"}
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* CARD 2: OPTICAL BIOMARKER EYE-SCAN (Sclera & Conjunctiva)  */}
            {/* ---------------------------------------------------------- */}
            <div className="glass-panel p-6 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Eye className="h-20 w-20 text-cyan-500" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base">Optical Sclera Scan</h3>
                      <p className="text-[11px] font-mono text-slate-500">COLOR DENSITY BIOMARKERS</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-cyan-50 text-cyan-600 border border-cyan-200 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    Calibrated Macro
                  </span>
                </div>

                {/* 5D Radial Progress / Colorimetric Readout */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white flex items-center justify-around">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-slate-800" fill="transparent" />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          className="text-sky-400 transition-all duration-700"
                          strokeDasharray="163"
                          strokeDashoffset={activeEyeMetric === "anemia" ? "105" : "40"}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-xs font-mono font-bold text-white">
                        {activeEyeMetric === "anemia" ? "0.62" : "1.28"}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-mono text-slate-400">R/G PALLOR</p>
                  </div>

                  <div className="text-center border-l border-slate-800 pl-4">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-slate-800" fill="transparent" />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          className="text-amber-400 transition-all duration-700"
                          strokeDasharray="163"
                          strokeDashoffset={activeEyeMetric === "jaundice" ? "50" : "140"}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-xs font-mono font-bold text-amber-300">
                        {activeEyeMetric === "jaundice" ? "+14.2" : "+1.8"}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-mono text-slate-400">&Delta;b* ICTERIC</p>
                  </div>
                </div>

                {/* Diagnostic Readout Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {activeEyeMetric === "anemia" ? "Palpebral Conjunctiva Anemia" : "Scleral Jaundice / Hepatitis"}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeEyeMetric === "anemia" ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}>
                      {activeEyeMetric === "anemia" ? "Hb < 8.5 g/dL" : "Elevated Bilirubin"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {activeEyeMetric === "anemia"
                      ? "Capillary pallor index indicates acute iron-deficiency anemia risk."
                      : "Scleral chromaticity shift indicates bilirubin accumulation."}
                  </p>
                </div>
              </div>

              {/* Selector Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveEyeMetric("anemia")}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeEyeMetric === "anemia"
                      ? "bg-cyan-500 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  Anemia Pallor
                </button>
                <button
                  onClick={() => setActiveEyeMetric("jaundice")}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeEyeMetric === "jaundice"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  Jaundice Shift
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* CARD 3: CAMERA PPG LIVE VITALS (BPM & SpO2)                */}
            {/* ---------------------------------------------------------- */}
            <div className="glass-panel p-6 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse className="h-20 w-20 text-rose-500" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base">Camera PPG Vitals</h3>
                      <p className="text-[11px] font-mono text-slate-500">HEMOGLOBIN ABSORPTION</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 text-[10px] font-extrabold uppercase animate-pulse">
                    Live Stream
                  </span>
                </div>

                {/* Cardiac Pulsing Display with Real-time BPM and SpO2 */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-cardiac">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-3xl font-extrabold text-white">{liveBpm}</span>
                        <span className="text-xs font-mono text-rose-400 font-bold">BPM</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">RESTING PULSE</p>
                    </div>
                  </div>

                  <div className="border-l border-slate-800 pl-4 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="font-mono text-3xl font-extrabold text-cyan-400">98</span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">%</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">SpO2 OXYGEN</p>
                  </div>
                </div>

                {/* Waveform Micro-Stream SVG */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Normal Rhythm
                    </span>
                    <span>HRV: 48ms &bull; ±1.5% Error</span>
                  </div>
                  {/* Subtle cardiac line */}
                  <svg className="w-full h-8 mt-2 text-rose-500" viewBox="0 0 200 30" fill="none">
                    <path
                      d="M0 15 H50 L55 5 L60 25 L65 2 L70 20 L75 15 H125 L130 5 L135 25 L140 2 L145 20 L150 15 H200"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                <span>✦ Zero Hardware Clip Needed</span>
                <a href="#simulator" className="text-sky-600 hover:text-sky-700 flex items-center gap-1">
                  10s Scan <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
