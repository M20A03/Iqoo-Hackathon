package com.neuroassist.edge.tracking

import android.util.Log

/**
 * BlinkDetector processes blink states to detect complex eye gestures:
 * - Double blink (within 500ms)
 * - Sustained blink (held closed for > 1 second)
 *
 * This acts as a trigger generator for accessibility clicks and selections.
 */
class BlinkDetector(private val onGestureDetected: (BlinkGesture) -> Unit) {

    enum class BlinkGesture {
        DOUBLE_BLINK,
        SUSTAINED_BLINK
    }

    companion object {
        private const val TAG = "BlinkDetector"
        private const val DOUBLE_BLINK_TIMEOUT_MS = 500L
        private const val SUSTAINED_BLINK_THRESHOLD_MS = 1000L
    }

    private var lastBlinkTime = 0L
    private var isBlinking = false
    private var blinkStartTime = 0L
    private var doubleBlinkPending = false

    /**
     * Process the current frame state of both eyes.
     * @param bothEyesClosed True if both eyes are closed based on blendshapes (e.g. > 0.55f).
     */
    fun update(bothEyesClosed: Boolean) {
        val now = System.currentTimeMillis()

        if (bothEyesClosed) {
            if (!isBlinking) {
                // Blink started
                isBlinking = true
                blinkStartTime = now
                Log.d(TAG, "Blink started")
            } else {
                // Check for sustained blink
                if (blinkStartTime > 0 && (now - blinkStartTime) > SUSTAINED_BLINK_THRESHOLD_MS) {
                    onGestureDetected(BlinkGesture.SUSTAINED_BLINK)
                    // Reset start time so it doesn't trigger repeatedly in one hold
                    blinkStartTime = 0L
                }
            }
        } else {
            if (isBlinking) {
                // Blink ended
                isBlinking = false
                val duration = now - (if (blinkStartTime == 0L) now - SUSTAINED_BLINK_THRESHOLD_MS else blinkStartTime)
                Log.d(TAG, "Blink ended, duration: ${duration}ms")

                // Only consider as a quick blink if it wasn't already processed as sustained
                if (blinkStartTime != 0L && duration < SUSTAINED_BLINK_THRESHOLD_MS) {
                    if (now - lastBlinkTime < DOUBLE_BLINK_TIMEOUT_MS) {
                        onGestureDetected(BlinkGesture.DOUBLE_BLINK)
                        lastBlinkTime = 0L // Reset
                    } else {
                        lastBlinkTime = now
                    }
                }
            }
        }
    }
}
