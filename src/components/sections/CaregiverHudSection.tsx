import { Activity, ShieldAlert, HeartPulse, Stethoscope, Laptop, Radio, ArrowUpRight, Monitor, Share2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VitalsPpgIllustration, StethoscopeFftIllustration } from "@/components/Illustrations";

export function CaregiverHudSection() {
  return (
    <section id="caregiver" className="relative overflow-hidden py-16 lg:py-24 bg-slate-900 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
                <Radio className="h-6 w-6" />
              </div>
              <div>
                <span className="rounded-full bg-sky-500/20 border border-sky-400/30 px-3 py-0.5 text-[10px] font-black uppercase text-sky-300">
                  OriginOS Office Kit Doctor Station
                </span>
                <h2 className="mt-1 font-sans text-3xl font-extrabold text-white sm:text-4xl">
                  Multi-Window Telemetry HUD
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Office Kit Multi-Window Mirrored
              </span>
            </div>
          </div>

          <p className="mt-4 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-slate-300">
            Streams live acoustic spectrograms, palpebral conjunctiva scans, and contactless PPG vitals to a doctor’s desktop monitor via OriginOS Multi-Window, paired with instant Super Clipboard prescription synchronization.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Live Doctor Monitoring Terminal */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-950 p-6 sm:p-7 border border-slate-800 shadow-xl">
              {/* Terminal Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-sky-400">Clinic Monitor #01 &bull; OriginOS Office Kit</span>
                  <h3 className="font-sans text-lg font-bold text-white mt-0.5">Patient Clinical Telemetry Stream</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
                  0.04s LAG
                </div>
              </div>

              {/* Real-Time Clinical Tile Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 text-center">
                  <p className="text-[9.5px] font-mono tracking-wider text-slate-400 uppercase">HEART RATE &bull; SpO2</p>
                  <p className="mt-1 font-mono text-2xl font-black text-rose-400">74 <span className="text-xs text-slate-400">BPM</span></p>
                  <p className="mt-0.5 text-[10px] font-bold text-cyan-400">SpO2: 98% (Normal)</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 text-center">
                  <p className="text-[9.5px] font-mono tracking-wider text-slate-400 uppercase">AUDIO STETHOSCOPE</p>
                  <p className="mt-1 font-mono text-xl font-black text-amber-400">450Hz Wheeze</p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-400">FFT Bronchial</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 text-center">
                  <p className="text-[9.5px] font-mono tracking-wider text-slate-400 uppercase">CONJUNCTIVA PALLOR</p>
                  <p className="mt-1 font-mono text-xl font-black text-emerald-400">Hb ~ 12.4</p>
                  <p className="mt-0.5 text-[10px] font-bold text-emerald-400">Normal Index</p>
                </div>
              </div>

              {/* Vitals Waveform Vector */}
              <div className="mt-5 rounded-2xl overflow-hidden border border-slate-800">
                <VitalsPpgIllustration />
              </div>

              {/* Recent Event Log */}
              <div className="mt-5 rounded-2xl bg-slate-900 p-4 border border-slate-800">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 mb-2.5">OriginOS Super Clipboard Synced Records</p>
                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400">14:28:12</span>
                    <span>Jan Aushadhi Substitution: <strong className="text-white">Amoxy-Clav 625 (₹48.00)</strong></span>
                    <span className="text-[9.5px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">AUTO-INJECTED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400">14:26:05</span>
                    <span>Acoustic FFT Diagnostic: <strong className="text-white">450 Hz Wheeze Flagged</strong></span>
                    <span className="text-[9.5px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">SPECTROGRAM</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Key Doctor HUD Pillars */}
          <div className="space-y-4 lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-slate-950 p-6 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-400/20">
                    <Share2 className="h-5 w-5" />
                  </span>
                  <h3 className="font-sans text-lg font-bold text-white">Super Clipboard Bidirectional Sync</h3>
                </div>
                <p className="mt-2.5 font-sans text-xs sm:text-sm leading-relaxed text-slate-400">
                  Doctors update medication schedules or flag CDSCO contraindications on desktop computers. OriginOS Super Clipboard immediately syncs the structured payload into the patient's local SQLite database.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-3xl bg-slate-950 p-6 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                    <Monitor className="h-5 w-5" />
                  </span>
                  <h3 className="font-sans text-lg font-bold text-white">Rural PHC Clinical Station</h3>
                </div>
                <p className="mt-2.5 font-sans text-xs sm:text-sm leading-relaxed text-slate-400">
                  Healthcare workers in remote villages use the phone as an all-in-one biophysical scanner and mirror results to larger community screens with zero internet setup.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
