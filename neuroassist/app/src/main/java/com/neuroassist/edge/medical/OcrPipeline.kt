package com.neuroassist.edge.medical

import android.graphics.Bitmap
import android.util.Log
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume

/**
 * OcrPipeline — On-Device Text Recognition.
 *
 * Wraps Google ML Kit Text Recognition SDK to perform 100% offline text extraction
 * from rear camera photos of medicine blister packs and prescription labels.
 */
class OcrPipeline {

    companion object {
        private const val TAG = "OcrPipeline"
    }

    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    /**
     * Run offline text recognition on a bitmap image.
     */
    suspend fun recognizeText(bitmap: Bitmap): String = suspendCancellableCoroutine { continuation ->
        val image = InputImage.fromBitmap(bitmap, 0)
        
        recognizer.process(image)
            .addOnSuccessListener { visionText ->
                val resultText = visionText.text.trim()
                Log.d(TAG, "OCR Success. Found text: $resultText")
                continuation.resume(resultText)
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "OCR Failed: ${e.message}", e)
                // Resume with empty string on failure instead of throwing to prevent app crash
                continuation.resume("")
            }
    }
}
