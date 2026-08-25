package com.neuroassist.edge.input

import android.view.MotionEvent

/**
 * TremorFilterEngine implements touch coordinate smoothing algorithms
 * (such as a Low-Pass Exponential Moving Average filter) to filter out
 * high-frequency jitter caused by Parkinson's or motor tremors.
 */
class TremorFilterEngine {

    companion object {
        // Alpha determines the smoothing factor. Lower alpha = more smoothing, but more lag.
        // A value of 0.15 is generally a good balance for tremor filtering (4-6Hz).
        private const val DEFAULT_ALPHA = 0.15f
    }

    private var alpha = DEFAULT_ALPHA
    private var isFiltering = false

    private var lastX = 0f
    private var lastY = 0f
    private var hasLast = false

    /**
     * Enables or disables touch tremor filtering.
     */
    fun setEnabled(enabled: Boolean) {
        isFiltering = enabled
        if (!enabled) {
            hasLast = false
        }
    }

    /**
     * Set customized smoothing factor.
     * @param factor Range between 0.01 (extreme smoothing) and 1.0 (no smoothing).
     */
    fun setSmoothingFactor(factor: Float) {
        alpha = factor.coerceIn(0.01f, 1.0f)
    }

    /**
     * Filters a raw MotionEvent's coordinates.
     * Modifies the coordinates inside the MotionEvent in-place if filtering is enabled.
     */
    fun filter(event: MotionEvent) {
        if (!isFiltering) return

        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                // Initialize filter with starting coordinates
                lastX = event.x
                lastY = event.y
                hasLast = true
            }
            MotionEvent.ACTION_MOVE -> {
                if (hasLast) {
                    // Exponential Moving Average: S_t = alpha * Y_t + (1 - alpha) * S_{t-1}
                    val filteredX = alpha * event.x + (1f - alpha) * lastX
                    val filteredY = alpha * event.y + (1f - alpha) * lastY

                    lastX = filteredX
                    lastY = filteredY

                    // Update event coordinates
                    event.setLocation(filteredX, filteredY)
                } else {
                    lastX = event.x
                    lastY = event.y
                    hasLast = true
                }
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                hasLast = false
            }
        }
    }
}
