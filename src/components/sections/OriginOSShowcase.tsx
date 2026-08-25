import { Cpu, Zap, Share2, Layers, Stethoscope, HeartPulse, Activity, ShieldCheck, Monitor, Radio } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { OriginOSOfficeSyncIllustration, UniversalAccessibilityIllustration } from "@/components/Illustrations";

const originOsFeatures = [
  {
    icon: Cpu,
    title: "Snapdragon NPU Edge Runtime",
    badge: "Qualcomm AI Direct",
    description:
      "Accelerates MediaPipe 468-point face mesh, eye-gaze vectoring, and ONNX-quantized optical models locally with sub-15ms inference latency and zero cloud dependency.",
    stats: "60 FPS • Air-Gapped NPU Execution",
  },
  {
    icon: Stethoscope,
    title: "Acoustic FFT Signal Pipeline",
    badge: "16-bit PCM 44.1 kHz",
    description:
      "Real-time Fast Fourier Transform (200 Hz–1000 Hz) spectral binning analyzes respiratory audio directly through the microphone array to detect wheezing and crackles.",
    stats: "Sub-50ms FFT • Pneumonia & Asthma Triage",
  },
  {
    icon: Share2,
    title: "OriginOS Super Clipboard Sync",
    badge: "Office Kit Bidirectional",
    description:
      "Doctors copy prescription notes or Jan Aushadhi generic substitutions on PC/Mac via OriginOS Super Clipboard, auto-injecting dosages directly into the patient's local SQLite DB.",
    stats: "Zero-Touch • Instant SQLite Injection",
  },
  {
    icon: Monitor,
    title: "Office Kit Multi-Window HUD",
    badge: "Doctor Telemetry Mirror",
    description:
      "Streams live acoustic spectrograms, sclera optical scans, and PPG pulse waveforms to a desktop monitor via OriginOS Multi-Window screen mirroring.",
    stats: "Low-Latency • Clinic & Remote Doctor HUD",
  },
];

export function OriginOSShowcase() {
  return (
    <section id="originos" className="relative overflow-hidden py-16 lg:py-24 bg-slate-900 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <span className="rounded-full bg-sky-500/20 border border-sky-400/30 px-3 py-0.5 text-[10px] font-black uppercase text-sky-300">
                  iQOO &bull; OriginOS Architecture
                </span>
                <h2 className="mt-1 font-sans text-3xl font-extrabold text-white sm:text-4xl">
                  Supercharged on <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">iQOO Flagship Hardware</span>
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              ✦ 100% Offline Air-Gapped Compute
            </div>
          </div>

          <p className="mt-4 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-slate-300">
            PulseEdge-OS combines the raw computing throughput of the Snapdragon NPU with OriginOS Office Kit Multi-Window and Super Clipboard primitives for instant telemetry mirroring.
          </p>
        </Reveal>

        {/* 4 Feature Architecture Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {originOsFeatures.map(({ icon: Icon, title, badge, description, stats }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="h-full rounded-3xl bg-slate-950/80 p-6 border border-slate-800 flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400 border border-slate-800">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-sky-500/10 border border-sky-400/20 px-2.5 py-0.5 text-[9.5px] font-black uppercase text-sky-300">
                      {badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-sans text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-slate-400">{description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono font-bold text-sky-400">
                  ✦ {stats}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Deep Dive Visual Showcases */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Showcase 1: Super Clipboard Bridge */}
          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-slate-950 p-6 sm:p-7 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-sky-400">OriginOS Super Clipboard</span>
                  <h3 className="font-sans text-xl font-bold text-white mt-0.5">Super Clipboard Rx Injection</h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black px-2.5 py-0.5">
                  LIVE BRIDGE
                </span>
              </div>
              <p className="mt-3 font-sans text-xs sm:text-sm leading-relaxed text-slate-300">
                When a doctor on a clinic PC copies a prescription update, OriginOS Super Clipboard seamlessly transfers the payload to the patient's phone, injecting dosage reminders into the local SQLite database without manual typing.
              </p>
              <div className="mt-5 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <OriginOSOfficeSyncIllustration />
              </div>
            </div>
          </Reveal>

          {/* Showcase 2: Universal Accessibility Dispatcher */}
          <Reveal delay={0.12}>
            <div className="rounded-3xl bg-slate-950 p-6 sm:p-7 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-sky-400">Android System Integration</span>
                  <h3 className="font-sans text-xl font-bold text-white mt-0.5">Accessibility Service Node Dispatcher</h3>
                </div>
                <span className="rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-black px-2.5 py-0.5">
                  ANY APP
                </span>
              </div>
              <p className="mt-3 font-sans text-xs sm:text-sm leading-relaxed text-slate-300">
                The <code className="bg-slate-900 px-1.5 py-0.5 rounded text-sky-300 font-mono text-xs">NeuroAccessibilityService</code> runs as an OS background service. It translates neural commands (iris dwells, smile triggers, breath puffs) into synthetic accessibility events across WhatsApp, Spotify, or Maps.
              </p>
              <div className="mt-5 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <UniversalAccessibilityIllustration />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
