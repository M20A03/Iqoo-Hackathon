package com.neuroassist.edge.tracking

import android.content.Context
import android.graphics.PointF
import android.util.Log
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * GazeTracker — Core front-camera computer vision engine.
 *
 * Uses MediaPipe FaceLandmarker to extract:
 * - Iris coordinates → screen-space cursor position
 * - Head orientation → tilt-based scrolling
 * - Face blendshapes → blink/smile/eyebrow gesture detection
 *
 * Ported from useFaceTracking.ts with native CameraX integration
 * for 60 FPS on-device processing via Snapdragon GPU/NPU.
 */
class GazeTracker(private val context: Context) {

    companion object {
        private const val TAG = "GazeTracker"

        // MediaPipe iris landmark indices (from 468-point mesh)
        private const val LEFT_IRIS_CENTER = 468
        private const val RIGHT_IRIS_CENTER = 473

        // Blendshape thresholds (calibrated from useFaceTracking.ts)
        const val BLINK_THRESHOLD = 0.5f
        const val SMILE_THRESHOLD = 0.4f
        const val EYEBROW_THRESHOLD = 0.45f
        const val JAW_OPEN_THRESHOLD = 0.35f
        const val WINK_COUNTER_THRESHOLD = 0.25f
    }

    // ── Public State Flows ──
    data class GazeState(
        val cursorPosition: PointF = PointF(0.5f, 0.5f), // Normalized 0-1
        val isTracking: Boolean = false,
        val statusMessage: String = "Initializing...",
    )

    data class GestureState(
        val smile: Boolean = false,
        val eyebrowsRaised: Boolean = false,
        val mouthOpen: Boolean = false,
        val winkLeft: Boolean = false,
        val winkRight: Boolean = false,
        val blinkBoth: Boolean = false,
        val sustainedWinkLeft: Boolean = false,
        val doubleEyebrowRaise: Boolean = false,
    )

    private val _gazeState = MutableStateFlow(GazeState())
    val gazeState: StateFlow<GazeState> = _gazeState.asStateFlow()

    private val _gestureState = MutableStateFlow(GestureState())
    val gestureState: StateFlow<GestureState> = _gestureState.asStateFlow()

    // ── Internal State ──
    private var faceLandmarker: FaceLandmarker? = null
    private var isInitialized = false

    // NeuroEdge timing state (ported from useFaceTracking.ts)
    private var winkStartTime = 0L
    private var lastEyebrowTime = 0L
    private var eyebrowCount = 0

    /**
     * Initialize the MediaPipe FaceLandmarker model.
     * Must be called once before processing frames.
     */
    fun initialize() {
        if (isInitialized) return

        try {
            _gazeState.value = _gazeState.value.copy(statusMessage = "Loading Face Model...")
            Log.d(TAG, "Loading MediaPipe model from assets/face_landmarker.task")

            val baseOptions = BaseOptions.builder()
                .setModelAssetPath("face_landmarker.task")
                .setDelegate(com.google.mediapipe.tasks.core.Delegate.CPU) // Force CPU for maximum stability on Oppo/Mediatek devices
                .build()

            val options = FaceLandmarker.FaceLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setOutputFaceBlendshapes(true)
                .setRunningMode(com.google.mediapipe.tasks.vision.core.RunningMode.VIDEO)
                .setNumFaces(1)
                .build()

            // Use application context to prevent memory leaks and potential activity context issues
            faceLandmarker = FaceLandmarker.createFromOptions(context.applicationContext, options)
            isInitialized = true
            _gazeState.value = _gazeState.value.copy(
                statusMessage = "Model Ready",
                isTracking = false // Ready but no face yet
            )
            Log.i(TAG, "FaceLandmarker created successfully")
        } catch (e: Exception) {
            Log.e(TAG, "FaceLandmarker creation failed", e)
            _gazeState.value = _gazeState.value.copy(
                statusMessage = "⚠️ Model Error: ${e.message}",
                isTracking = false
            )
        } catch (e: Error) {
            // Catching java.lang.Error for native library linking failures
            Log.e(TAG, "Native FaceLandmarker error", e)
            _gazeState.value = _gazeState.value.copy(
                statusMessage = "⚠️ Native Error: Incompatible hardware",
                isTracking = false
            )
        }
    }

    /**
     * Process a single camera frame and update gaze + gesture state.
     * Call this from the CameraX analysis use case at ~30-60 FPS.
     */
    fun processFrame(image: MPImage, timestampMs: Long) {
        val landmarker = faceLandmarker ?: return

        try {
            val result = landmarker.detectForVideo(image, timestampMs)
            processResult(result)
        } catch (e: Exception) {
            Log.w(TAG, "Frame processing error: ${e.message}")
        }
    }

    /**
     * Extract gaze position and gesture states from face landmarks.
     * Core logic ported from useFaceTracking.ts predictWebcam().
     */
    private fun processResult(result: FaceLandmarkerResult) {
        if (result.faceLandmarks().isEmpty()) {
            _gazeState.value = _gazeState.value.copy(
                statusMessage = "No face detected",
                isTracking = false
            )
            return
        }

        val landmarks = result.faceLandmarks()[0]
        val blendshapes = result.faceBlendshapes()
            .orElse(null)?.firstOrNull()?.map { it.score() to it.categoryName() }

        // ── Gaze Cursor from Iris Landmarks ──
        if (landmarks.size > RIGHT_IRIS_CENTER) {
            val leftIris = landmarks[LEFT_IRIS_CENTER]
            val rightIris = landmarks[RIGHT_IRIS_CENTER]

            // Average both irises for stable cursor position
            val gazeX = (leftIris.x() + rightIris.x()) / 2f
            val gazeY = (leftIris.y() + rightIris.y()) / 2f

            // Invert X for mirrored front camera
            _gazeState.value = _gazeState.value.copy(
                cursorPosition = PointF(1f - gazeX, gazeY),
                isTracking = true,
                statusMessage = "Detecting gestures..."
            )
        }

        // ── Gesture Detection from Blendshapes ──
        if (blendshapes != null) {
            val blendMap = blendshapes.associate { it.second to it.first }

            val jawOpen = blendMap["jawOpen"] ?: 0f
            val eyeBlinkLeft = blendMap["eyeBlinkLeft"] ?: 0f
            val eyeBlinkRight = blendMap["eyeBlinkRight"] ?: 0f
            val mouthSmileLeft = blendMap["mouthSmileLeft"] ?: 0f
            val mouthSmileRight = blendMap["mouthSmileRight"] ?: 0f
            val browOuterUpLeft = blendMap["browOuterUpLeft"] ?: 0f
            val browOuterUpRight = blendMap["browOuterUpRight"] ?: 0f

            val isWinkingLeft = eyeBlinkLeft > BLINK_THRESHOLD && eyeBlinkRight < WINK_COUNTER_THRESHOLD
            val isEyebrowsUp = browOuterUpLeft > EYEBROW_THRESHOLD || browOuterUpRight > EYEBROW_THRESHOLD
            val now = System.currentTimeMillis()

            // Sustained Wink Logic (2 seconds) — from useFaceTracking.ts
            if (isWinkingLeft) {
                if (winkStartTime == 0L) winkStartTime = now
            } else {
                winkStartTime = 0
            }

            // Double Eyebrow Raise Logic (within 800ms) — from useFaceTracking.ts
            var doubleRaiseTriggered = false
            if (isEyebrowsUp && (now - lastEyebrowTime > 300)) {
                eyebrowCount++
                lastEyebrowTime = now
                if (eyebrowCount >= 2) {
                    doubleRaiseTriggered = true
                    eyebrowCount = 0
                }
            } else if (now - lastEyebrowTime > 800) {
                eyebrowCount = 0
            }

            _gestureState.value = GestureState(
                smile = mouthSmileLeft > SMILE_THRESHOLD && mouthSmileRight > SMILE_THRESHOLD,
                eyebrowsRaised = isEyebrowsUp,
                mouthOpen = jawOpen > JAW_OPEN_THRESHOLD,
                winkLeft = isWinkingLeft,
                winkRight = eyeBlinkRight > BLINK_THRESHOLD && eyeBlinkLeft < WINK_COUNTER_THRESHOLD,
                blinkBoth = eyeBlinkLeft > 0.55f && eyeBlinkRight > 0.55f,
                sustainedWinkLeft = winkStartTime != 0L && (now - winkStartTime > 2000),
                doubleEyebrowRaise = doubleRaiseTriggered,
            )
        }
    }

    /**
     * Release MediaPipe resources when tracking is no longer needed.
     */
    fun release() {
        faceLandmarker?.close()
        faceLandmarker = null
        isInitialized = false
        _gazeState.value = GazeState()
        _gestureState.value = GestureState()
    }
}
