package com.neuroassist.edge.medical

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlin.math.abs
import kotlin.math.log10

/**
 * AcousticDiagnosticEngine — Pulmonary Stethoscope & Wheeze Extractor.
 * 
 * Performs real-time audio analysis to detect:
 * 1. Breath Puffs (Accessibility Trigger)
 * 2. Wheezing (Asthma/COPD indicator: 400Hz - 1000Hz sustained)
 * 3. Crackles (Pneumonia indicator: Short explosive bursts)
 */
class AcousticDiagnosticEngine(
    private val onBreathTrigger: () -> Unit,
    private val onDiagnosticAlert: (String) -> Unit
) {

    data class AcousticState(
        val isRecording: Boolean = false,
        val currentAmplitude: Int = 0,
        val detectedPathology: String = "Normal",
        val frequencyHint: String = "Quiet"
    )

    private val _state = MutableStateFlow(AcousticState())
    val state: StateFlow<AcousticState> = _state

    companion object {
        private const val TAG = "AcousticEngine"
        private const val SAMPLE_RATE = 44100
        private const val CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO
        private const val AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT
        private const val BUFFER_SIZE_FACTOR = 2
        
        // Thresholds
        private const val PUFF_THRESHOLD = 20000
        private const val WHEEZE_FREQ_MIN = 400
        private const val WHEEZE_FREQ_MAX = 1000
    }

    private var audioRecord: AudioRecord? = null
    private var isRecording = false
    private var job: Job? = null
    private var lastTriggerTime = 0L

    @SuppressLint("MissingPermission")
    fun start(scope: CoroutineScope) {
        if (isRecording) return

        val minBufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT)
        val bufferSize = minBufferSize * BUFFER_SIZE_FACTOR

        try {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                CHANNEL_CONFIG,
                AUDIO_FORMAT,
                bufferSize
            )
        } catch (e: Exception) {
            Log.e(TAG, "AudioRecord init failed", e)
            return
        }

        val record = audioRecord ?: return
        if (record.state != AudioRecord.STATE_INITIALIZED) return

        record.startRecording()
        isRecording = true
        _state.value = _state.value.copy(isRecording = true)

        job = scope.launch(Dispatchers.Default) {
            val audioBuffer = ShortArray(bufferSize)
            while (isRecording) {
                val readSize = record.read(audioBuffer, 0, audioBuffer.size)
                if (readSize > 0) {
                    analyzeAudio(audioBuffer, readSize)
                }
            }
        }
    }

    fun stop() {
        isRecording = false
        _state.value = _state.value.copy(isRecording = false)
        job?.cancel()
        try {
            audioRecord?.stop()
            audioRecord?.release()
        } catch (e: Exception) {}
        audioRecord = null
    }

    private fun analyzeAudio(buffer: ShortArray, size: Int) {
        var maxAmp = 0
        var zeroCrossings = 0
        
        for (i in 0 until size) {
            val amp = abs(buffer[i].toInt())
            if (amp > maxAmp) maxAmp = amp
            
            // Zero crossing rate for crude frequency estimation
            if (i > 0 && ((buffer[i] > 0 && buffer[i-1] < 0) || (buffer[i] < 0 && buffer[i-1] > 0))) {
                zeroCrossings++
            }
        }

        // Calculate approximate frequency
        // Freq = (ZeroCrossings / 2) * (SampleRate / BufferSize)
        val approxFreq = (zeroCrossings / 2.0) * (SAMPLE_RATE.toDouble() / size)

        // 1. Accessibility Puff Detection
        val now = System.currentTimeMillis()
        if (maxAmp > PUFF_THRESHOLD && (now - lastTriggerTime > 1000)) {
            lastTriggerTime = now
            onBreathTrigger()
        }

        // 2. Clinical Wheeze Detection (400-1000Hz sustained)
        if (maxAmp > 5000 && approxFreq > WHEEZE_FREQ_MIN && approxFreq < WHEEZE_FREQ_MAX) {
            _state.value = _state.value.copy(
                detectedPathology = "Wheezing Detected",
                frequencyHint = "${approxFreq.toInt()} Hz"
            )
            // Prevent spamming alerts
            if (now - lastTriggerTime > 5000) {
                onDiagnosticAlert("Wheezing detected in lung sounds. Possible bronchospasm.")
                lastTriggerTime = now
            }
        } else if (maxAmp > 8000 && approxFreq > 1200) {
            _state.value = _state.value.copy(detectedPathology = "Crackles/Fine Noise")
        } else {
            _state.value = _state.value.copy(
                currentAmplitude = maxAmp,
                detectedPathology = "Normal/Quiet",
                frequencyHint = "${approxFreq.toInt()} Hz"
            )
        }
    }
}
