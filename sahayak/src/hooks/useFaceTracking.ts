import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface FaceGestures {
  smile: boolean;
  eyebrowsRaised: boolean;
  mouthOpen: boolean;
  winkLeft: boolean;
  winkRight: boolean;
  blinkBoth: boolean;
  sustainedWinkLeft: boolean; // Sahayak-NeuroEdge enhancement
  doubleEyebrowRaise: boolean; // Sahayak-NeuroEdge enhancement
}

// Module-level singletons
let globalFaceLandmarker: FaceLandmarker | null = null;
let globalStream: MediaStream | null = null;
let consumerCount = 0;
let isModelLoading = false;

// NeuroEdge timing states
let winkStartTime = 0;
let lastEyebrowTime = 0;
let eyebrowCount = 0;

export function useFaceTracking(isActive: boolean) {
  const [status, setStatus] = useState<string>('Initializing...');
  const [gestures, setGestures] = useState<FaceGestures>({
    smile: false,
    eyebrowsRaised: false,
    mouthOpen: false,
    winkLeft: false,
    winkRight: false,
    blinkBoth: false,
    sustainedWinkLeft: false,
    doubleEyebrowRaise: false,
  });
  
  const [isMockMode, setIsMockMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const requestRef = useRef<number>();

  // Load MediaPipe FaceLandmarker model once
  useEffect(() => {
    if (globalFaceLandmarker || isModelLoading) {
      if (globalFaceLandmarker) setStatus('Model Ready');
      return;
    }

    isModelLoading = true;
    const initializeTracker = async () => {
      try {
        setStatus('Loading Face Model...');
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        );
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1
        });

        globalFaceLandmarker = landmarker;
        setStatus('Model Ready');
      } catch (err) {
        console.warn('Face model loading failed, using simulator:', err);
        setIsMockMode(true);
        setStatus('⚠️ Model Error. Simulator Active.');
      } finally {
        isModelLoading = false;
      }
    };
    initializeTracker();
  }, []);

  // Manage camera and predictions
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!isActive || !videoElement) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    if (isMockMode) return;

    const startCamera = async () => {
      try {
        if (!globalStream) {
          setStatus('Starting camera...');
          globalStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 320, height: 240 }
          });
        }

        consumerCount++;
        videoElement.srcObject = globalStream;
        videoElement.play();
        
        videoElement.onloadeddata = () => {
          setStatus('Detecting gestures...');
          predictWebcam();
        };
      } catch (err) {
        console.error('Camera access failed:', err);
        setIsMockMode(true);
        setStatus('⚠️ Camera blocked. Simulator Active.');
      }
    };

    const predictWebcam = () => {
      if (!isActive || !videoElement || !globalFaceLandmarker) return;

      let startTimeMs = performance.now();
      const results = globalFaceLandmarker.detectForVideo(videoElement, startTimeMs);

      if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;
        
        const jawOpen = blendshapes.find(b => b.categoryName === 'jawOpen')?.score || 0;
        const eyeBlinkLeft = blendshapes.find(b => b.categoryName === 'eyeBlinkLeft')?.score || 0;
        const eyeBlinkRight = blendshapes.find(b => b.categoryName === 'eyeBlinkRight')?.score || 0;
        const mouthSmileLeft = blendshapes.find(b => b.categoryName === 'mouthSmileLeft')?.score || 0;
        const mouthSmileRight = blendshapes.find(b => b.categoryName === 'mouthSmileRight')?.score || 0;
        const browOuterUpLeft = blendshapes.find(b => b.categoryName === 'browOuterUpLeft')?.score || 0;
        const browOuterUpRight = blendshapes.find(b => b.categoryName === 'browOuterUpRight')?.score || 0;

        const isWinkingLeft = eyeBlinkLeft > 0.5 && eyeBlinkRight < 0.25;
        const isEyebrowsUp = browOuterUpLeft > 0.45 || browOuterUpRight > 0.45;
        const now = performance.now();

        // Sustained Wink Logic (2 seconds)
        if (isWinkingLeft) {
          if (winkStartTime === 0) winkStartTime = now;
        } else {
          winkStartTime = 0;
        }

        // Double Eyebrow Raise Logic (within 800ms)
        let doubleRaiseTriggered = false;
        if (isEyebrowsUp && (now - lastEyebrowTime > 300)) {
          eyebrowCount++;
          lastEyebrowTime = now;
          if (eyebrowCount >= 2) {
            doubleRaiseTriggered = true;
            eyebrowCount = 0;
          }
        } else if (now - lastEyebrowTime > 800) {
          eyebrowCount = 0;
        }

        const nextGestures: FaceGestures = {
          smile: (mouthSmileLeft > 0.4 && mouthSmileRight > 0.4),
          eyebrowsRaised: isEyebrowsUp,
          mouthOpen: jawOpen > 0.35,
          winkLeft: isWinkingLeft,
          winkRight: eyeBlinkRight > 0.5 && eyeBlinkLeft < 0.25,
          blinkBoth: eyeBlinkLeft > 0.55 && eyeBlinkRight > 0.55,
          sustainedWinkLeft: winkStartTime !== 0 && (now - winkStartTime > 2000),
          doubleEyebrowRaise: doubleRaiseTriggered,
        };

        // Guard against unnecessary 60 FPS React re-renders
        setGestures((prev) => {
          if (
            prev.smile === nextGestures.smile &&
            prev.eyebrowsRaised === nextGestures.eyebrowsRaised &&
            prev.mouthOpen === nextGestures.mouthOpen &&
            prev.winkLeft === nextGestures.winkLeft &&
            prev.winkRight === nextGestures.winkRight &&
            prev.blinkBoth === nextGestures.blinkBoth &&
            prev.sustainedWinkLeft === nextGestures.sustainedWinkLeft &&
            prev.doubleEyebrowRaise === nextGestures.doubleEyebrowRaise
          ) {
            return prev;
          }
          return nextGestures;
        });
      }

      if (isActive) {
        requestRef.current = requestAnimationFrame(predictWebcam);
      }
    };

    // Wait for landmarker to be ready if it's not yet
    const checkReady = setInterval(() => {
      if (globalFaceLandmarker) {
        clearInterval(checkReady);
        startCamera();
      }
    }, 500);

    return () => {
      clearInterval(checkReady);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      consumerCount--;
      if (consumerCount <= 0 && globalStream) {
        globalStream.getTracks().forEach(track => track.stop());
        globalStream = null;
      }

      if (videoElement) {
        videoElement.srcObject = null;
      }
      setGestures({
        smile: false,
        eyebrowsRaised: false,
        mouthOpen: false,
        winkLeft: false,
        winkRight: false,
        blinkBoth: false,
        sustainedWinkLeft: false,
        doubleEyebrowRaise: false,
      });
    };
  }, [isActive, isMockMode]);

  return { status, gestures, setGestures, videoRef, isMockMode };
}
