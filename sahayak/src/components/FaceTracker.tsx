import { useEffect, useRef, useState } from 'react';
import { useFaceTracking, FaceGestures } from '../hooks/useFaceTracking';
import { UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FaceTrackerProps {
  onGesture: (gesture: string) => void;
  isActive: boolean;
}

export function FaceTracker({ onGesture, isActive }: FaceTrackerProps) {
  const { status, gestures, setGestures, videoRef, isMockMode } = useFaceTracking(isActive);
  const lastGestureTime = useRef<number>(0);
  const [activeGestureToast, setActiveGestureToast] = useState<string | null>(null);

  // Handle detected gestures
  useEffect(() => {
    if (!isActive) return;

    const now = Date.now();
    if (now - lastGestureTime.current > 900) {
      let triggered: string | null = null;
      let label: string | null = null;

      if (gestures.mouthOpen) {
        triggered = 'OPEN_MOUTH';
        label = '👄 Mouth Open -> Scrolled Down';
      } else if (gestures.sustainedWinkLeft) {
        triggered = 'SUSTAINED_WINK_LEFT';
        label = '😉 Sustained Wink -> Go Back';
      } else if (gestures.doubleEyebrowRaise) {
        triggered = 'DOUBLE_EYEBROW_RAISE';
        label = '🤨 Double Eyebrows -> Scrolled Up';
      } else if (gestures.winkLeft) {
        triggered = 'BLINK_LEFT';
        label = '😉 Left Wink -> Go Back';
      } else if (gestures.winkRight) {
        triggered = 'BLINK_RIGHT';
        label = '😉 Right Wink -> Home Screen';
      } else if (gestures.smile) {
        triggered = 'SMILE';
        label = '😊 Smile -> Click Element';
      } else if (gestures.eyebrowsRaised) {
        triggered = 'EYEBROWS_RAISED';
        label = '🤨 Eyebrows Raised -> Scrolled Up';
      }

      if (triggered && label) {
        onGesture(triggered);
        lastGestureTime.current = now;
        setActiveGestureToast(label);
        setTimeout(() => setActiveGestureToast(null), 1800);
      }
    }
  }, [gestures, isActive, onGesture]);

  if (!isActive) return null;

  const triggerMockGesture = (gestureKey: keyof FaceGestures) => {
    setGestures(prev => ({ ...prev, [gestureKey]: true }));
    setTimeout(() => {
      setGestures(prev => ({ ...prev, [gestureKey]: false }));
    }, 500);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white/90 border border-slate-200 shadow-sm rounded-3xl backdrop-blur-xl animate-in fade-in duration-300 w-full">
      <div className="flex items-center justify-between w-full mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <UserCheck size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 font-display">
              Face Gesture Tracker
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              {isMockMode ? 'Interactive Simulator' : 'MediaPipe Vision Active'}
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-sky-200">
          <ShieldCheck size={12} />
          {status}
        </span>
      </div>

      {/* Active Gesture Trigger Toast */}
      {activeGestureToast && (
        <div className="w-full bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-black flex items-center justify-center gap-2 mb-2 animate-bounce shadow-sm">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{activeGestureToast}</span>
        </div>
      )}
      
      {!isMockMode ? (
        <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-sky-400 shadow-md my-2">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform -scale-x-100"
          ></video>
          {gestures.mouthOpen && (
            <div className="absolute inset-0 bg-sky-500/20 border-4 border-sky-400 rounded-full flex items-center justify-center pointer-events-none">
              <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                👄 MOUTH OPEN
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center mb-2 flex flex-col gap-2.5">
          <p className="text-[10px] text-sky-800 font-black uppercase tracking-wider">Test Drive Gesture Triggers</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => triggerMockGesture('mouthOpen')}
              className="py-3 bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs transition-all shadow-xs"
            >
              👄 Open Mouth
            </button>
            <button
              onClick={() => triggerMockGesture('smile')}
              className="py-3 bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs transition-all shadow-xs"
            >
              😊 Smile
            </button>
            <button
              onClick={() => triggerMockGesture('winkLeft')}
              className="py-3 bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs transition-all shadow-xs"
            >
              😉 Left Wink
            </button>
            <button
              onClick={() => triggerMockGesture('winkRight')}
              className="py-3 bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs transition-all shadow-xs"
            >
              😉 Right Wink
            </button>
          </div>
        </div>
      )}

      {/* Gesture Mapping Legend */}
      <div className="mt-2 text-xs text-slate-600 space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 w-full font-medium">
        <div className={`flex justify-between items-center text-[11px] p-1 rounded-lg transition-all ${gestures.mouthOpen ? 'bg-sky-100 text-sky-900 font-bold' : ''}`}>
          <span>👄 <b>Open Mouth</b></span>
          <span className="text-slate-500 font-mono">Scroll Down</span>
        </div>
        <div className={`flex justify-between items-center text-[11px] p-1 rounded-lg transition-all ${gestures.smile ? 'bg-sky-100 text-sky-900 font-bold' : ''}`}>
          <span>😊 <b>Smile</b></span>
          <span className="text-slate-500 font-mono">Simulate Click</span>
        </div>
        <div className={`flex justify-between items-center text-[11px] p-1 rounded-lg transition-all ${gestures.eyebrowsRaised ? 'bg-sky-100 text-sky-900 font-bold' : ''}`}>
          <span>🤨 <b>Raise Eyebrows</b></span>
          <span className="text-slate-500 font-mono">Scroll Up / Menu</span>
        </div>
        <div className={`flex justify-between items-center text-[11px] p-1 rounded-lg transition-all ${gestures.winkLeft ? 'bg-sky-100 text-sky-900 font-bold' : ''}`}>
          <span>😉 <b>Left Wink</b></span>
          <span className="text-slate-500 font-mono">Go Back</span>
        </div>
        <div className={`flex justify-between items-center text-[11px] p-1 rounded-lg transition-all ${gestures.winkRight ? 'bg-sky-100 text-sky-900 font-bold' : ''}`}>
          <span>😉 <b>Right Wink</b></span>
          <span className="text-slate-500 font-mono">Home Screen</span>
        </div>
      </div>
    </div>
  );
}
