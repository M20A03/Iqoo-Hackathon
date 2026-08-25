import { useState } from "react";
import { Menu, X, Download, Play, Cpu, ShieldCheck, Monitor, Radio, HeartPulse, Sparkles, Activity } from "lucide-react";

const links = [
  { href: "#diagnostic-hud", label: "Diagnostic HUD" },
  { href: "#app", label: "Master Modules" },
  { href: "#originos", label: "Snapdragon & OriginOS" },
  { href: "#caregiver", label: "Doctor HUD" },
  { href: "#simulator", label: "Clinical Simulator" },
  { href: "#who", label: "Target Audience" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/80 bg-white/75 px-5 py-2.5 shadow-lg backdrop-blur-xl transition-all">
        {/* Brand Logo & Name */}
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform border border-sky-300/70 bg-slate-900">
            <img
              src="/sahayak-logo.png"
              alt="PulseEdge-OS Sahayak Official Logo"
              className="h-full w-full object-cover"
            />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 border border-white"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-xl font-black tracking-tight text-slate-900 leading-none">
                PulseEdge<span className="text-sky-500 font-extrabold">-OS</span>
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-sky-700 border border-sky-200/80">
                iQOO HealthTech
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-slate-700 font-bold uppercase mt-0.5">
              Sahayak Physical &bull; Snapdragon NPU
            </span>
          </div>
        </a>

        {/* Real-time Status Badges (Telemetry Pill) */}
        <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100/90 px-3.5 py-1 text-[11px] font-bold text-slate-800 border border-slate-200/80">
          <span className="flex items-center gap-1.5 text-sky-700">
            <Cpu className="h-3.5 w-3.5" /> NPU 60 FPS
          </span>
          <span className="text-slate-400">&bull;</span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Offline Air-Gapped
          </span>
          <span className="text-slate-400">&bull;</span>
          <span className="flex items-center gap-1.5 text-indigo-700">
            <Monitor className="h-3.5 w-3.5" /> Office Kit Live
          </span>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-2.5 sm:flex">
          <a
            href="/Sahayak-Release-v1.0.apk"
            download="Sahayak-Release-v1.0.apk"
            className="inline-flex min-h-9 items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-xs font-black text-white hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-sky-500/25 transition-all uppercase tracking-wider"
          >
            <Download aria-hidden="true" className="h-3.5 w-3.5" />
            Download APK (v1.0)
          </a>
          <a
            href="#simulator"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-2 text-xs font-bold text-sky-600 hover:bg-sky-50 transition-all uppercase tracking-wider"
          >
            <Play aria-hidden="true" className="h-3.5 w-3.5 text-sky-500" />
            Simulator
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-white/90 bg-white/95 p-4 shadow-xl backdrop-blur-2xl xl:hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-extrabold text-sky-600">
              <Cpu className="h-3 w-3" /> Snapdragon NPU: 60 FPS
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600">
              <ShieldCheck className="h-3 w-3" /> Air-Gapped
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                >
                  ✦ {l.label}
                </a>
              </li>
            ))}
            <li className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <a
                href="/Sahayak-Release-v1.0.apk"
                download="Sahayak-Release-v1.0.apk"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 text-sm font-black text-white"
              >
                <Download className="h-4 w-4" /> Download APK (v1.0)
              </a>
              <a
                href="#simulator"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-600"
              >
                <Play className="h-4 w-4" /> Open Clinical Simulator
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
