import { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Flame,
  HeartPulse,
  Smartphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function IqooCommunityHub() {
  const [activeCommunityTab, setActiveCommunityTab] = useState<'gaming' | 'lifestyle' | 'fitness'>('gaming');

  // Gaming State
  const [esportsPulse, setEsportsPulse] = useState(128); // Elevated in-game pulse
  const [antiJitterActive, setAntiJitterActive] = useState(true);
  const [tiltStressIndex, setTiltStressIndex] = useState(68);

  // Lifestyle Hands-Free Gesture State
  const [lifestyleGesture, setLifestyleGesture] = useState<string>('Ready for hands-free gesture...');

  // Fitness State
  const [recoveryScore, setRecoveryScore] = useState(88);

  const simulateClutchMoment = () => {
    setEsportsPulse(142);
    setTiltStressIndex(84);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.75 }, colors: ['#f59e0b', '#ef4444'] });
    setTimeout(() => {
      setEsportsPulse(118);
      setTiltStressIndex(54);
    }, 4000);
  };

  const triggerGesture = (type: string) => {
    switch (type) {
      case 'smile':
        setLifestyleGesture('😃 Smile Detected: Answered incoming phone call hands-free while cooking!');
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
        break;
      case 'puff':
        setLifestyleGesture('💨 Breath Puff: Skipped Spotify workout track without touching screen!');
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 }, colors: ['#10b981', '#0ea5e9'] });
        break;
      case 'wink':
        setLifestyleGesture('😉 Wink: Scrolled to next recipe step / Instagram reel!');
        break;
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-md backdrop-blur-xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                For the Entire iQOO Community
              </span>
              <span className="text-[10px] font-mono text-slate-400">Monster Performance</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-display mt-0.5">
              iQOO Monster Power &amp; Lifestyle Hub
            </h2>
          </div>
        </div>

        {/* Tab Badges */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'gaming', label: '🎮 Esports Biometrics', icon: <Gamepad2 size={14} /> },
            { id: 'lifestyle', label: '🍳 Zero-Touch Lifestyle', icon: <Smartphone size={14} /> },
            { id: 'fitness', label: '🏃 Gym & Recovery', icon: <HeartPulse size={14} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveCommunityTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCommunityTab === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. ESPORTS & GAMING BIOMETRIC HUD (FOR GAMERS & STREAMERS)     */}
      {/* ============================================================== */}
      {activeCommunityTab === 'gaming' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>iQOO Game Space Integration:</strong> Uses the front camera & touch engine as an in-game telemetry layer. Tracks real-time adrenaline pulse, tilt stress, and applies <strong>Anti-Jitter Touch Damping</strong> to stabilize sniper crosshair aiming!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[10px] font-mono text-amber-700 font-bold uppercase">IN-GAME ADRENALINE PULSE</p>
              <p className="text-3xl font-mono font-black text-slate-900">{esportsPulse} <span className="text-xs text-amber-600">BPM</span></p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                esportsPulse > 130 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {esportsPulse > 130 ? '🔥 High Adrenaline Clutch' : '⚡ Focused Baseline'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[10px] font-mono text-sky-700 font-bold uppercase">ANTI-JITTER AIM DAMPING</p>
              <p className="text-3xl font-mono font-black text-slate-900">{antiJitterActive ? '1000Hz' : 'OFF'}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block bg-sky-50 text-sky-700 border border-sky-200">
                Zero Finger-Tremor Jitter
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[10px] font-mono text-emerald-700 font-bold uppercase">TILT STRESS INDEX</p>
              <p className="text-3xl font-mono font-black text-slate-900">{tiltStressIndex}%</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimal Tilt Stability
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={simulateClutchMoment}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              🎯 Simulate 1v4 Tournament Clutch Moment
            </button>
            <button
              onClick={() => setAntiJitterActive(!antiJitterActive)}
              className="px-4 py-3 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Toggle Anti-Jitter: {antiJitterActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. LIFESTYLE ZERO-TOUCH GESTURES (FOR COOKING, EATING, GYM)    */}
      {/* ============================================================== */}
      {activeCommunityTab === 'lifestyle' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
            <Smartphone className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Hands-Free OriginOS Smart Gestures:</strong> When cooking with dirty hands, working out with sweaty fingers, or eating dinner, use 60 FPS head micro-gestures & breath puffs to control your iQOO device without touching the screen!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => triggerGesture('smile')}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:bg-sky-50 transition-all shadow-sm group"
            >
              <span className="text-xl">😃</span>
              <p className="font-bold text-xs mt-1 text-slate-900">Smile Trigger</p>
              <p className="text-[10px] text-slate-500">Answer phone call / Open app</p>
            </button>

            <button
              onClick={() => triggerGesture('puff')}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-sm group"
            >
              <span className="text-xl">💨</span>
              <p className="font-bold text-xs mt-1 text-slate-900">Breath Puff</p>
              <p className="text-[10px] text-slate-500">Skip Spotify song / TTS</p>
            </button>

            <button
              onClick={() => triggerGesture('wink')}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-sm group"
            >
              <span className="text-xl">😉</span>
              <p className="font-bold text-xs mt-1 text-slate-900">Wink Gesture</p>
              <p className="text-[10px] text-slate-500">Scroll reel / Next recipe</p>
            </button>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300">
            {lifestyleGesture}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FITNESS, GYM & CARDIO RECOVERY (FOR ATHLETES & YOUTH)       */}
      {activeCommunityTab === 'fitness' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <HeartPulse className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>10-Second Gym &amp; Cardio Recovery:</strong> No smartwatch needed. Check heart rate recovery, autonomic HRV balance, and estimated VO2 Max immediately after gym sets or marathon runs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Post-Workout BPM</p>
              <p className="text-xl font-mono font-black text-rose-600">112 BPM</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Oxygen</p>
              <p className="text-xl font-mono font-black text-sky-600">99% SpO2</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">HRV Recovery</p>
              <p className="text-xl font-mono font-black text-emerald-600">62 ms</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Recovery Score</p>
              <p className="text-xl font-mono font-black text-indigo-600">{recoveryScore}/100</p>
            </div>
          </div>

          <button
            onClick={() => {
              setRecoveryScore(94);
              confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#10b981', '#06b6d4'] });
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black text-xs uppercase tracking-wider shadow-md hover:from-emerald-600 hover:to-cyan-600 transition-all"
          >
            🏃 Check Post-Workout Heart Recovery Index
          </button>
        </div>
      )}
    </div>
  );
}
