interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 40, className = "", showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center bg-white rounded-2xl border border-sky-200/80 shadow-md shadow-sky-500/10 overflow-hidden group hover:scale-105 transition-all shrink-0"
      >
        <img
          src="/icons/icon-192.png"
          alt="PulseEdge-OS Sahayak Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image not found
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-slate-900">
              PulseEdge<span className="text-sky-500">-OS</span>
            </span>
            <span className="rounded-full bg-sky-50 px-1.5 py-0.5 text-[8px] font-black uppercase text-sky-700 border border-sky-200">
              iQOO
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            Sahayak &bull; NPU Air-Gapped
          </span>
        </div>
      )}
    </div>
  );
}
