package com.neuroassist.edge.medical

import android.graphics.Bitmap
import android.graphics.Color
import androidx.core.graphics.get
import java.util.Locale

/**
 * OpticalBiomarkerEngine — Non-invasive Sclera & Eyelid Analyzer.
 * 
 * Uses colorimetry to detect:
 * 1. Palpebral Conjunctiva Pallor (Anemia Indicator)
 * 2. Scleral Icterus (Jaundice Indicator)
 */
class OpticalBiomarkerEngine {

    data class BiomarkerResult(
        val type: String,
        val probability: Float, // 0.0 to 1.0
        val indicator: String,
        val recommendation: String,
        val hindiWarning: String,
        val kannadaWarning: String
    )

    /**
     * Analyzes a crop of the lower eyelid (conjunctiva) for anemia.
     */
    fun analyzeConjunctiva(bitmap: Bitmap): BiomarkerResult {
        var totalRed = 0L
        var totalGreen = 0L
        var totalBlue = 0L
        val pixelCount = bitmap.width * bitmap.height

        for (x in 0 until bitmap.width) {
            for (y in 0 until bitmap.height) {
                val pixel = bitmap[x, y]
                totalRed += Color.red(pixel)
                totalGreen += Color.green(pixel)
                totalBlue += Color.blue(pixel)
            }
        }

        val avgR = totalRed / pixelCount.toFloat()
        val avgG = totalGreen / pixelCount.toFloat()
        
        // Redness Index (R / G ratio) - Higher is healthier/redder
        val rednessRatio = avgR / (avgG + 1)

        return if (rednessRatio < 1.4f) {
            BiomarkerResult(
                type = "Anemia Screening",
                probability = 0.8f,
                indicator = "Conjunctival Pallor Detected",
                recommendation = "Low hemoglobin suspected. Please consult a doctor for a CBC test.",
                hindiWarning = "Aankhon mein safedi dikhi hai. Khoon ki kami ho sakti hai. Doctor se milien.",
                kannadaWarning = "ಕಣ್ಣುಗಳಲ್ಲಿ ಬಿಳುಪು ಕಂಡುಬಂದಿದೆ. ರಕ್ತಹೀನತೆಯ ಲಕ್ಷಣವಿರಬಹುದು. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
            )
        } else {
            BiomarkerResult(
                type = "Anemia Screening",
                probability = 0.1f,
                indicator = "Healthy Redness",
                recommendation = "Eyelid color appears normal.",
                hindiWarning = "Aankhon ka rang sahi hai.",
                kannadaWarning = "ಕಣ್ಣಿನ ಬಣ್ಣ ಸಾಮಾನ್ಯವಾಗಿದೆ."
            )
        }
    }

    /**
     * Analyzes a crop of the eye white (sclera) for jaundice.
     */
    fun analyzeSclera(bitmap: Bitmap): BiomarkerResult {
        var yellowPixels = 0
        val pixelCount = bitmap.width * bitmap.height

        for (x in 0 until bitmap.width) {
            for (y in 0 until bitmap.height) {
                val pixel = bitmap[x, y]
                val r = Color.red(pixel)
                val g = Color.green(pixel)
                val b = Color.blue(pixel)

                // Simple Yellow Detection (High R & G, Low B)
                if (r > 150 && g > 150 && b < 100) {
                    yellowPixels++
                }
            }
        }

        val yellownessScore = yellowPixels / pixelCount.toFloat()

        return if (yellownessScore > 0.15f) {
            BiomarkerResult(
                type = "Jaundice Screening",
                probability = 0.9f,
                indicator = "Scleral Icterus Detected",
                recommendation = "Bilirubin level may be high. Immediate liver function test recommended.",
                hindiWarning = "Aankhon mein peelapan dikha hai. Jaundice (Piliya) ho sakta hai.",
                kannadaWarning = "ಕಣ್ಣುಗಳಲ್ಲಿ ಹಳದಿ ಬಣ್ಣ ಕಂಡುಬಂದಿದೆ. ಕಾಮಾಲೆ ರೋಗದ ಲಕ್ಷಣವಿರಬಹುದು."
            )
        } else {
            BiomarkerResult(
                type = "Jaundice Screening",
                probability = 0.05f,
                indicator = "Normal Sclera",
                recommendation = "Sclera appears white.",
                hindiWarning = "Aankhein sahi hain.",
                kannadaWarning = "ಕಣ್ಣುಗಳು ಸರಿಯಾಗಿವೆ."
            )
        }
    }
}
