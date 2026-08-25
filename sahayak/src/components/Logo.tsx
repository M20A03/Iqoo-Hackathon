import React from 'react';

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
        className="relative flex items-center justify-center bg-white rounded-xl border border-surface-border shadow-soft overflow-hidden group hover:border-secondary transition-all"
      >
        {/* Stylized Pulse Background */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity"
        >
          <path
            d="M0 50 L20 50 L30 20 L45 80 L55 30 L65 50 L100 50"
            fill="none"
            stroke="#FFB800"
            strokeWidth="3"
            className="animate-pulse"
          />
        </svg>

        {/* Main "P" Logo Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary relative z-10 w-3/5 h-3/5"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" className="opacity-10" stroke="#2CA470" />
          <path d="M7 21V3h7a5 5 0 0 1 0 10H7" stroke="#FFB800" />
          <circle cx="12" cy="12" r="1" fill="#2CA470" className="animate-ping" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-serif font-black tracking-tighter text-primary uppercase">
            Pulse<span className="text-secondary">Edge</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-accent mt-1">
            Neuro-Diagnostic OS
          </span>
        </div>
      )}
    </div>
  );
}
