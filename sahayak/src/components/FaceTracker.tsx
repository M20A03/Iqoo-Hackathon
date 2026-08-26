import { useEffect, useRef } from 'react';
import { useFaceTracking, FaceGestures } from '../hooks/useFaceTracking';
import { UserCheck, ShieldCheck } from 'lucide-react';

interface FaceTrackerProps {
  onGesture: (gesture: string) => void;
  isActive: boolean;
}

export function FaceTracker({ onGesture, isActive }: FaceTrackerProps) {
  const { status, gestures, setGestures, videoRef, isMockMode } = useFaceTracking(isActive);
  const lastGestureTime = useRef<number>(0);

  // Handle detected gestures
  useEffect(() => {
    if (!isActive) return;

    const now = Date.now();
    if (now - lastGestureTime.current > 1500) {
      if (gestures.sustainedWinkLeft) {
        onGesture('SUSTAINED_WINK_LEFT');
        lastGestureTime.current = now;
      } else if (gestures.doubleEyebrowRaise) {
        onGesture('DOUBLE_EYEBROW_RAISE');
        lastGestureTime.current = now;
      } else if (gestures.mouthOpen) {
        onGesture('OPEN_MOUTH');
        lastGestureTime.current = now;
      } else if (gestures.winkLeft) {
        onGesture('BLINK_LEFT');
        lastGestureTime.current = now;
      } else if (gestures.winkRight) {
        onGesture('BLINK_RIGHT');
        lastGestureTime.current = now;
      } else if (gestures.smile) {
        onGesture('SMILE');
        lastGestureTime.current = now;
      } else if (gestures.eyebrowsRaised) {
        onGesture('EYEBROWS_RAISED');
        lastGestureTime.current = now;
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
      <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-100">
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
      
      {!isMockMode ? (
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-sky-400 shadow-md my-2">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform -scale-x-100"
          ></video>
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
        <div className="flex justify-between items-center text-[11px]">
          <span>👄 <b>Open Mouth</b></span>
          <span className="text-slate-500 font-mono">Scroll Down</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>😊 <b>Smile</b></span>
          <span className="text-slate-500 font-mono">Simulate Click</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>🤨 <b>Raise Eyebrows</b></span>
          <span className="text-slate-500 font-mono">Right Click / Menu</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>😉 <b>Left Wink</b></span>
          <span className="text-slate-500 font-mono">Go Back</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>😉 <b>Right Wink</b></span>
          <span className="text-slate-500 font-mono">Home Screen</span>
        </div>
      </div>
    </div>
  );
}
