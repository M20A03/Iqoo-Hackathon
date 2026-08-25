import { Download, Play, Zap, ShieldCheck, Activity, HeartPulse, Stethoscope, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
            <Activity className="h-7 w-7" />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-400/30 px-3.5 py-1 text-xs font-black uppercase text-sky-300">
            <Zap className="h-3.5 w-3.5" /> iQOO Hackathon 2026 &bull; HealthTech Track
          </div>

          <h2 className="mt-5 font-sans text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl max-w-2xl">
            Air-Gapped Diagnostics &amp; <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">Zero-Touch Neuro-Access</span>
          </h2>

          <p className="mt-3 font-sans text-sm sm:text-base text-slate-400 max-w-xl">
            100% Offline Edge-AI engine running on Snapdragon NPU hardware and OriginOS Office Kit for motor-impaired users and rural healthcare centers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/Sahayak-Release-v1.0.apk"
              download="Sahayak-Release-v1.0.apk"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-7 py-3.5 text-sm font-black text-white hover:from-sky-600 hover:to-cyan-600 shadow-lg shadow-sky-500/25 hover:scale-[1.02] transition-all"
            >
              <Download className="h-4 w-4" />
              Download Sahayak APK (v1.0)
            </a>
            <a
              href="#simulator"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Play className="h-4 w-4 text-sky-400" />
              Launch Clinical Simulator
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-slate-800/80 pt-8 w-full text-xs text-slate-500 font-sans">
            <p>&copy; {new Date().getFullYear()} PulseEdge-OS (Sahayak) &bull; Air-Gapped Medical Diagnostics &amp; Neuro-Accessibility.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Air-Gapped
              </span>
              <span>&bull;</span>
              <span className="text-sky-400">Snapdragon NPU Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
