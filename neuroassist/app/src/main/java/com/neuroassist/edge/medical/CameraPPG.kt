package com.neuroassist.edge.medical

import android.util.Log
import kotlin.math.max
import kotlin.math.min

/**
 * CameraPPG — Photoplethysmography (PPG) Vitals Engine.
 *
 * Implements contactless heart rate detection by analyzing subtle red channel
 * color variations in the fingertip pressed against the rear camera lens (with flash).
 */
class CameraPPG {

    companion object {
        private const val TAG = "CameraPPG"
        private const val WINDOW_SIZE = 150 // ~5 seconds of data at 30 FPS
        private const val MIN_BPM = 45f
        private const val MAX_BPM = 180f
        private const val SAMPLE_RATE = 30f // Target FPS
    }

    private val readings = mutableListOf<Float>()
    private var lastPeakTime = 0L
    private val intervals = mutableListOf<Long>()

    /**
     * Resets the vitals scanner session.
     */
    fun reset() {
        readings.clear()
        intervals.clear()
        lastPeakTime = 0L
    }

    /**
     * Process a single average red pixel intensity value.
     * @param redMean Average value of the red channel (0 to 255).
     * @return Calculated heart rate (BPM) if a stable measurement exists, otherwise 0.
     */
    fun processFrame(redMean: Float): Int {
        readings.add(redMean)
        if (readings.size > WINDOW_SIZE) {
            readings.removeAt(0)
        }

        if (readings.size < WINDOW_SIZE) {
            return 0 // Need more frames to establish baseline
        }

        // Apply a simple high-pass and moving average smoothing filter in one go
        val smoothed = applyMovingAverage(readings)

        // Peak detection
        val bpm = detectBpm(smoothed)
        if (bpm in MIN_BPM.toInt()..MAX_BPM.toInt()) {
            return bpm
        }

        return 0
    }

    private fun applyMovingAverage(data: List<Float>): List<Float> {
        val window = 5
        val result = mutableListOf<Float>()
        for (i in data.indices) {
            val start = max(0, i - window)
            val end = min(data.size - 1, i + window)
            var sum = 0f
            for (j in start..end) {
                sum += data[j]
            }
            result.add(sum / (end - start + 1))
        }
        return result
    }

    private fun detectBpm(data: List<Float>): Int {
        val peaks = mutableListOf<Int>()
        // Calculate dynamic threshold
        var mean = 0f
        data.forEach { mean += it }
        mean /= data.size

        // Count peaks (values higher than neighbors and above mean threshold)
        for (i in 1 until data.size - 1) {
            if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > mean) {
                peaks.add(i)
            }
        }

        if (peaks.size < 2) return 0

        // Calculate time delta between peaks (assuming ~30 FPS sample rate)
        val peakDeltas = mutableListOf<Float>()
        for (p in 1 until peaks.size) {
            val frameDiff = peaks[p] - peaks[p - 1]
            val timeDiffSec = frameDiff / SAMPLE_RATE
            peakDeltas.add(timeDiffSec)
        }

        val avgPeriodSec = peakDeltas.average().toFloat()
        if (avgPeriodSec <= 0f) return 0

        val bpm = (60f / avgPeriodSec).toInt()
        Log.d(TAG, "Calculated average period: ${avgPeriodSec}s, BPM: $bpm")
        return bpm
    }
}
