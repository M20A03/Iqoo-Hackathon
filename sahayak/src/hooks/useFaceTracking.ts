import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface FaceGestures {
  smile: boolean;
  eyebrowsRaised: boolean;
  mouthOpen: boolean;
  winkLeft: boolean;
  winkRight: boolean;
  blinkBoth: boolean;
  sustainedWinkLeft: boolean;
  doubleEyebrowRaise: boolean;
}

// Module-level singletons
let globalFaceLandmarker: FaceLandmarker | null = null;
let globalStream: MediaStream | null = null;
let consumerCount = 0;
let isModelLoading = false;

// Timing states
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
        console.warn('GPU delegate failed, falling back to CPU vision:', err);
        try {
          const filesetResolver = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
          );
          const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'CPU'
            },
            outputFaceBlendshapes: true,
            runningMode: 'VIDEO',
            numFaces: 1
          });
          globalFaceLandmarker = landmarker;
          setStatus('Model Ready (CPU)');
        } catch (cpuErr) {
          console.warn('Face model loading failed, using simulator:', cpuErr);
          setIsMockMode(true);
          setStatus('⚠️ Vision Offline. Simulator Ready.');
        }
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
            video: { facingMode: 'user', width: 480, height: 360 }
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

      // Extract blendshapes if available
      let jawOpen = 0;
      let eyeBlinkLeft = 0;
      let eyeBlinkRight = 0;
      let mouthSmileLeft = 0;
      let mouthSmileRight = 0;
      let browOuterUpLeft = 0;
      let browOuterUpRight = 0;

      if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;
        jawOpen = blendshapes.find(b => b.categoryName === 'jawOpen')?.score || 0;
        eyeBlinkLeft = blendshapes.find(b => b.categoryName === 'eyeBlinkLeft')?.score || 0;
        eyeBlinkRight = blendshapes.find(b => b.categoryName === 'eyeBlinkRight')?.score || 0;
        mouthSmileLeft = blendshapes.find(b => b.categoryName === 'mouthSmileLeft')?.score || 0;
        mouthSmileRight = blendshapes.find(b => b.categoryName === 'mouthSmileRight')?.score || 0;
        browOuterUpLeft = blendshapes.find(b => b.categoryName === 'browOuterUpLeft')?.score || 0;
        browOuterUpRight = blendshapes.find(b => b.categoryName === 'browOuterUpRight')?.score || 0;
      }

      // PRIMARY: 478 Landmark Direct Geometric Feature Extractor (EAR, MAR, Brow Ratio, Smile Ratio)
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const lm = results.faceLandmarks[0];

        // 1. Left Eye Aspect Ratio (EAR)
        const leftEyeHeight = Math.hypot(lm[160].x - lm[144].x, lm[160].y - lm[144].y) + 
                              Math.hypot(lm[158].x - lm[153].x, lm[158].y - lm[153].y);
        const leftEyeWidth = 2 * Math.hypot(lm[33].x - lm[133].x, lm[33].y - lm[133].y);
        const leftEAR = leftEyeWidth > 0 ? leftEyeHeight / leftEyeWidth : 0.3;

        // 2. Right Eye Aspect Ratio (EAR)
        const rightEyeHeight = Math.hypot(lm[385].x - lm[380].x, lm[385].y - lm[380].y) + 
                               Math.hypot(lm[387].x - lm[373].x, lm[387].y - lm[373].y);
        const rightEyeWidth = 2 * Math.hypot(lm[362].x - lm[263].x, lm[362].y - lm[263].y);
        const rightEAR = rightEyeWidth > 0 ? rightEyeHeight / rightEyeWidth : 0.3;

        // 3. Mouth Aspect Ratio (MAR)
        const mouthHeight = Math.hypot(lm[14].x - lm[13].x, lm[14].y - lm[13].y);
        const mouthWidth = Math.hypot(lm[291].x - lm[61].x, lm[291].y - lm[61].y);
        const mar = mouthWidth > 0 ? mouthHeight / mouthWidth : 0;

        // 4. Eyebrow Elevation Ratio
        const faceHeight = Math.hypot(lm[152].x - lm[10].x, lm[152].y - lm[10].y);
        const leftBrowDist = Math.abs(lm[159].y - lm[70].y);
        const rightBrowDist = Math.abs(lm[386].y - lm[300].y);
        const browRatio = faceHeight > 0 ? (leftBrowDist + rightBrowDist) / (2 * faceHeight) : 0;

        // 5. Smile Width Ratio
        const outerEyeDist = Math.hypot(lm[263].x - lm[33].x, lm[263].y - lm[33].y);
        const smileRatio = outerEyeDist > 0 ? mouthWidth / outerEyeDist : 0;

        // Unified Classification
        const isMouthOpen = mar > 0.25 || jawOpen > 0.18;
        const isWinkingLeft = (leftEAR < 0.19 && rightEAR > 0.23) || (eyeBlinkLeft > 0.45 && eyeBlinkRight < 0.25);
        const isWinkingRight = (rightEAR < 0.19 && leftEAR > 0.23) || (eyeBlinkRight > 0.45 && eyeBlinkLeft < 0.25);
        const isBlinkingBoth = (leftEAR < 0.18 && rightEAR < 0.18) || (eyeBlinkLeft > 0.5 && eyeBlinkRight > 0.5);
        const isSmile = smileRatio > 0.45 || (mouthSmileLeft > 0.35 && mouthSmileRight > 0.35);
        const isEyebrowsUp = browRatio > 0.052 || browOuterUpLeft > 0.38 || browOuterUpRight > 0.38;

        const now = performance.now();

        // Sustained Wink Logic (1.5 seconds)
        if (isWinkingLeft) {
          if (winkStartTime === 0) winkStartTime = now;
        } else {
          winkStartTime = 0;
        }

        // Double Eyebrow Raise Logic (within 800ms)
        let doubleRaiseTriggered = false;
        if (isEyebrowsUp && (now - lastEyebrowTime > 250)) {
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
          smile: isSmile,
          eyebrowsRaised: isEyebrowsUp,
          mouthOpen: isMouthOpen,
          winkLeft: isWinkingLeft,
          winkRight: isWinkingRight,
          blinkBoth: isBlinkingBoth,
          sustainedWinkLeft: winkStartTime !== 0 && (now - winkStartTime > 1500),
          doubleEyebrowRaise: doubleRaiseTriggered,
        };

        // Guard against unnecessary React state churn
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
    }, 400);

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
