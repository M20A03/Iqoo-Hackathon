import { Stethoscope, Eye, Pill, Monitor, Smartphone, Zap } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    icon: Stethoscope,
    title: "1. Physical Sensor Diagnostics",
    text: "Microphone captures 16-bit PCM FFT acoustics (200–1000Hz), while camera optics compute Sclera/Conjunctiva color ratios and PPG vitals.",
  },
  {
    icon: Eye,
    title: "2. Zero-Touch Neuro-Engine",
    text: "Snapdragon NPU runs MediaPipe 468-landmark mesh at 60 FPS for iris gaze vectors, smile/blink micro-clicks, and breath puff triggers with tremor filtering.",
  },
  {
    icon: Pill,
    title: "3. Rural Pharma & Safety",
    text: "Offline OCR extracts medicine packaging, queries local Room DB to match Jan Aushadhi generic chemical salts, and evaluates CDSCO contraindications.",
  },
  {
    icon: Monitor,
    title: "4. Office Kit Telemetry Bridge",
    text: "Streams mirrored spectrograms and vitals to desktop monitors via OriginOS Multi-Window, with bidirectional Super Clipboard prescription injection.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-700">
              ✦ Architecture Pipeline
            </span>
            <h2 className="mt-3 font-sans text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How PulseEdge-OS Operates
            </h2>
            <p className="mt-3 font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
              Four modular sub-systems architected for zero cloud latency and complete offline autonomy.
            </p>
          </div>
        </Reveal>

        {/* 4 Pipeline Steps */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="glass-panel p-6 flex flex-col justify-between h-full hover:border-sky-300 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-sky-500">
                      0{i + 1}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="mt-5 font-sans text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">{text}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-600">
                  <span>✦</span> Module 0{i + 1} Pipeline
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
