package com.neuroassist.edge.medical

/**
 * TriageEngine — Offline WHO/ICMR Clinical Symptom Triage.
 * 
 * Implements decision trees for respiratory and common acute conditions
 * to guide rural patients on whether to stay home or transit to a hospital.
 */
class TriageEngine {

    enum class Urgency {
        GREEN,  // Home management
        YELLOW, // Visit PHC within 24h
        RED     // Emergency - Hospital Now
    }

    data class TriageResult(
        val urgency: Urgency,
        val recommendation: String,
        val hindiAdvice: String,
        val kannadaAdvice: String,
        val actionRequired: String
    )

    fun evaluateRespiratory(
        fastBreathing: Boolean,
        chestIndrawing: Boolean,
        unableToDrink: Boolean,
        stridor: Boolean,
        wheeze: Boolean
    ): TriageResult {
        return when {
            unableToDrink || stridor || chestIndrawing -> TriageResult(
                urgency = Urgency.RED,
                recommendation = "Severe Pneumonia / Airway Obstruction suspected.",
                hindiAdvice = "Ghabraiye nahi, par turant hospital jayein. Saans lene mein takleef zyada hai.",
                kannadaAdvice = "ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ. ಉಸಿರಾಟದ ತೀವ್ರ ತೊಂದರೆ ಕಂಡುಬಂದಿದೆ.",
                actionRequired = "CALL EMERGENCY SOS"
            )
            fastBreathing -> TriageResult(
                urgency = Urgency.YELLOW,
                recommendation = "Pneumonia likely. Needs antibiotic treatment.",
                hindiAdvice = "PHC jayein aur antibiotic lein. Tez saans chal rahi hai.",
                kannadaAdvice = "ಪಿಎಚ್‌ಸಿಗೆ ಹೋಗಿ ಮತ್ತು ಆಂಟಿಬಯೋಟಿಕ್ ತೆಗೆದುಕೊಳ್ಳಿ. ಉಸಿರಾಟ ವೇಗವಾಗಿದೆ.",
                actionRequired = "VISIT CLINIC"
            )
            wheeze -> TriageResult(
                urgency = Urgency.YELLOW,
                recommendation = "Wheeze detected. May need bronchodilator.",
                hindiAdvice = "Wheeze (seeti ki awaaz) hai. Inhaler ya dawai ki zaroorat ho sakti hai.",
                kannadaAdvice = "ಉಸಿರಾಟದಲ್ಲಿ ಶಬ್ದ ಕೇಳಿಸುತ್ತಿದೆ. ಇನ್ಹೇಲರ್ ಅಗತ್ಯವಿರಬಹುದು.",
                actionRequired = "CONSULT DOCTOR"
            )
            else -> TriageResult(
                urgency = Urgency.GREEN,
                recommendation = "Cough/Cold. No signs of pneumonia.",
                hindiAdvice = "Ghar par aaram karein aur garam paani peiyein.",
                kannadaAdvice = "ಮನೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಬಿಸಿ ನೀರು ಕುಡಿಯಿರಿ.",
                actionRequired = "HOME CARE"
            )
        }
    }
}
