import { useState } from "react";
import {
  Gamepad2,
  Sparkles,
  Flame,
  Zap,
  HeartPulse,
  Smartphone,
  CheckCircle2,
  Pill,
  Users,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import confetti from "canvas-confetti";

export function IqooCommunitySection() {
  const [activePersona, setActivePersona] = useState<"gamer" | "lifestyle" | "fitness" | "family">("gamer");
  const [esportsBpm, setEsportsBpm] = useState(132);
  const [aimStabilizerActive, setAimStabilizerActive] = useState(true);

  const simulateClutch = () => {
    setEsportsBpm(146);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.75 }, colors: ["#f59e0b", "#ef4444", "#0ea5e9"] });
    setTimeout(() => setEsportsBpm(124), 3500);
  };

  return (
    <section id="iqoo-community" className="py-24 sm:py-32 relative overflow-hidden bg-slate-900 text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-sky-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shadow-sm">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Engineered for 100% of the iQOO Community</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
              Why Every iQOO User Needs PulseEdge-OS
            </h2>
            <p className="text-base text-slate-400 font-sans leading-relaxed">
              Beyond clinical accessibility, PulseEdge-OS leverages iQOO’s raw Snapdragon NPU horsepower, 144Hz touch engines, and camera sensors to power esports biometrics, hands-free smart gestures, and everyday household pharmacy savings.
            </p>
          </div>
        </Reveal>

        {/* Persona Selector Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 p-1.5 rounded-3xl bg-slate-800/80 border border-slate-700 max-w-2xl mx-auto">
          {[
            { id: "gamer", label: "🎮 Gamers & Streamers", desc: "Esports HUD & Aim Damping" },
            { id: "lifestyle", label: "🍳 Everyday Multitaskers", desc: "Zero-Touch Smart Gestures" },
            { id: "fitness", label: "🏃 Athletes & Gym", desc: "10s Vitals & Recovery" },
            { id: "family", label: "👨‍👩‍👧 Indian Households", desc: "85% Medicine Savings" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id as any)}
              className={`flex-1 min-w-[130px] rounded-2xl py-3 px-4 text-xs font-bold transition-all border text-center ${
                activePersona === p.id
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-[1.02] font-black"
                  : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white"
              }`}
            >
              <p className="leading-tight">{p.label}</p>
            </button>
          ))}
        </div>

        {/* Dynamic Persona Card */}
        <div className="mt-8 glass-panel p-6 sm:p-10 border border-slate-800 bg-slate-950/80 rounded-3xl shadow-2xl">
          {/* 1. GAMERS & ESPORTS */}
          {activePersona === "gamer" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                  <Gamepad2 className="h-4 w-4" /> iQOO Game Space &bull; In-Game Overlay
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                  Live Esports Biometric HUD &amp; Anti-Jitter Touch Stabilizer
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Repurposing our clinical Parkinson’s tremor damping algorithm into an <strong>Esports Anti-Jitter Aim Stabilizer</strong>: intercepts high-frequency hand tremors during high-stakes clutch tournament moments to stabilize sniper crosshairs.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] font-mono text-amber-400">CLUTCH ADRENALINE</p>
                    <p className="text-2xl font-mono font-black text-white mt-0.5">{esportsBpm} BPM</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] font-mono text-cyan-400">AIM STABILIZER</p>
                    <p className="text-2xl font-mono font-black text-cyan-300">{aimStabilizerActive ? "1000Hz" : "OFF"}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] font-mono text-emerald-400">TILT STABILITY</p>
                    <p className="text-2xl font-mono font-black text-emerald-300">98.4%</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={simulateClutch}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    🎯 Simulate 1v4 Tournament Clutch Moment
                  </button>
                  <button
                    onClick={() => setAimStabilizerActive(!aimStabilizerActive)}
                    className="px-4 py-3.5 rounded-2xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-900"
                  >
                    Stabilizer: {aimStabilizerActive ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> Why Gamers Love It
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Real-time heart rate overlay on Twitch/YouTube live streams.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Crosshair jitter damping for BGMI, Call of Duty Mobile, and FreeFire.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Eye fatigue &amp; blue-light blink rate warning after 2 hours of gaming.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 2. EVERYDAY LIFESTYLE & MULTITASKING */}
          {activePersona === "lifestyle" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold border border-sky-500/40">
                  <Smartphone className="h-4 w-4" /> OriginOS Smart Action Engine
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                  Zero-Touch Gestures for Cooking, Eating &amp; Gym
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Hands covered in flour while cooking? Sweaty palms at the gym? Eating butter chicken with your fingers? Use <strong>60 FPS Head/Smile gestures &amp; Breath Puffs</strong> to answer calls, scroll reels, and skip music without smudging your screen.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-2xl">😃</span>
                    <p className="text-xs font-bold text-white mt-1">Smile Gesture</p>
                    <p className="text-[10px] text-slate-400">Accept phone call</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-2xl">💨</span>
                    <p className="text-xs font-bold text-white mt-1">Breath Puff</p>
                    <p className="text-[10px] text-slate-400">Skip Spotify song</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-2xl">😉</span>
                    <p className="text-xs font-bold text-white mt-1">Wink Gesture</p>
                    <p className="text-[10px] text-slate-400">Scroll reel / recipe</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Daily Convenience Superpowers
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Cook hands-free following online recipe steps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Answer phone calls while driving or washing dishes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>100% offline — zero battery drain on Snapdragon NPU.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 3. FITNESS & GYM */}
          {activePersona === "fitness" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                  <HeartPulse className="h-4 w-4" /> Gym &amp; Cardio Recovery
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                  10-Second Vitals &amp; Post-Workout Recovery Without a Smartwatch
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  No need to spend ₹30,000 on an Apple Watch. Immediately after heavy gym sets or high-intensity interval training, place your finger on the rear camera to measure heart rate recovery, SpO2, and autonomic nervous system HRV balance in 10 seconds.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400">POST-SET BPM</p>
                    <p className="text-2xl font-mono font-black text-rose-400">114 BPM</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400">BLOOD OXYGEN</p>
                    <p className="text-2xl font-mono font-black text-sky-400">99%</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400">RECOVERY SCORE</p>
                    <p className="text-2xl font-mono font-black text-emerald-400">92/100</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Award className="h-4 w-4" /> Athlete Features
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Heart rate recovery drop (Peak HR minus 1-min post-exercise HR).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Lung capacity audio check after 5km runs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Overtraining warning via daily morning HRV drift.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. INDIAN HOUSEHOLDS & FAMILIES */}
          {activePersona === "family" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/40">
                  <Pill className="h-4 w-4" /> 50+ NLEM Jan Aushadhi &bull; Household Savings
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                  Save ₹3,000–₹8,000 Monthly on Family Prescription Medicines
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Every Indian family buys medicines for diabetes, blood pressure, fever, or cholesterol (Glycomet, Telma, Augmentin, Dolo). Scan any prescription strip to instantly locate Government PM Jan Aushadhi generic salts with <strong>85%+ price savings</strong> and check lethal drug interactions.
                </p>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">Augmentin 625mg &rarr; Amoxicillin + Clavulanic Acid</p>
                    <p className="text-slate-400 text-[11px]">Commercial: ₹220 &bull; Jan Aushadhi: ₹45</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/40">
                    Save ₹175 (80%)
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Family Health Guardian
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Monthly health checkups for elderly parents at home.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Lethal drug-drug interaction warning (CDSCO Shield).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Spoken voice guidance in 10 Indian regional languages.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
