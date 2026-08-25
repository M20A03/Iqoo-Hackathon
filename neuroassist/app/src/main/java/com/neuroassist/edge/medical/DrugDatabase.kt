package com.neuroassist.edge.medical

import java.util.Locale

data class Medication(
    val name: String,
    val category: String,
    val salt: String, // Active chemical formulation
    val brandedPrice: Int, // Approx price in INR
    val janAushadhiPrice: Int, // Generic price in INR
    val contraindications: List<String>,
    val sideEffects: String,
    val warning: String,
    val hindiAlert: String,
    val kannadaAlert: String
)

/**
 * DrugDatabase — CDSCO Indian Drug Database with PM Jan Aushadhi Mapping.
 */
object DrugDatabase {

    private val database = mapOf(
        "paracetamol" to Medication(
            name = "Paracetamol",
            category = "Analgesic / Antipyretic",
            salt = "Paracetamol 500mg",
            brandedPrice = 40,
            janAushadhiPrice = 12,
            contraindications = listOf("warfarin", "alcohol"),
            sideEffects = "Liver strain if overdosed",
            warning = "Paracetamol detected. Warning: Do not exceed 4g in 24 hours.",
            hindiAlert = "Paracetamol detected. Din mein 4g se zyada na lein.",
            kannadaAlert = "ಪ್ಯಾರಸಿಟಮಾಲ್ ಪತ್ತೆಯಾಗಿದೆ. ದಿನಕ್ಕೆ 4g ಗಿಂತ ಹೆಚ್ಚು ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ."
        ),
        "aspirin" to Medication(
            name = "Aspirin",
            category = "NSAID / Blood Thinner",
            salt = "Acetylsalicylic Acid 75mg",
            brandedPrice = 35,
            janAushadhiPrice = 8,
            contraindications = listOf("warfarin", "ibuprofen", "clopidogrel"),
            sideEffects = "Stomach irritation, bleeding risk",
            warning = "Aspirin detected. Blood thinner. Do not take before surgeries.",
            hindiAlert = "Aspirin detected. Yeh khoon patla karti hai.",
            kannadaAlert = "ಆಸ್ಪಿರಿನ್ ಪತ್ತೆಯಾಗಿದೆ. ಇದು ರಕ್ತವನ್ನು ತೆಳುಗೊಳಿಸುತ್ತದೆ."
        ),
        "metformin" to Medication(
            name = "Metformin",
            category = "Anti-diabetic",
            salt = "Metformin Hydrochloride 500mg",
            brandedPrice = 60,
            janAushadhiPrice = 14,
            contraindications = listOf("alcohol"),
            sideEffects = "Stomach upset",
            warning = "Take with food.",
            hindiAlert = "Sugar ki dawai hai. Khane ke saath lein.",
            kannadaAlert = "ಸಕ್ಕರೆ ಕಾಯಿಲೆ ಔಷಧ. ಆಹಾರದೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಿ."
        ),
        "amlodipine" to Medication(
            name = "Amlodipine",
            category = "Blood Pressure",
            salt = "Amlodipine 5mg",
            brandedPrice = 75,
            janAushadhiPrice = 10,
            contraindications = listOf("simvastatin"),
            sideEffects = "Swelling",
            warning = "BP medication.",
            hindiAlert = "BP ki dawai hai.",
            kannadaAlert = "ಬಿಪಿ ಔಷಧ."
        )
    )

    /**
     * Search the OCR text for matches in the CDSCO drug database.
     */
    fun findMedication(ocrText: String): Medication? {
        val cleanText = ocrText.lowercase(Locale.getDefault())
        // Split by non-word characters
        val words = cleanText.split(Regex("[^a-zA-Z0-9]+"))
        for (key in database.keys) {
            if (words.contains(key) || cleanText.contains(key)) {
                return database[key]
            }
        }
        return null
    }
}
