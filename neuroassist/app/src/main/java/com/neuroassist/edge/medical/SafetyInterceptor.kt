package com.neuroassist.edge.medical

import com.neuroassist.edge.data.MedicationLogDao
import java.util.Locale

data class SafetyCheckResult(
    val isSafe: Boolean,
    val medication: Medication?,
    val warning: String? = null,
    val hindiWarning: String? = null,
    val kannadaWarning: String? = null
)

/**
 * SafetyInterceptor — CDSCO Medication Safety Checker.
 *
 * Intercepts scanned medications, checks for:
 * 1. Duplicate dosing within 24 hours.
 * 2. Contraindications / conflicts with recent medications in Room DB.
 */
class SafetyInterceptor(private val logDao: MedicationLogDao) {

    companion object {
        private const val ONEDAY_MS = 24 * 60 * 60 * 1000L
    }

    /**
     * Scans the extracted OCR text and runs safety validation checks.
     */
    suspend fun checkSafety(ocrText: String): SafetyCheckResult {
        val med = DrugDatabase.findMedication(ocrText) ?: return SafetyCheckResult(isSafe = true, medication = null)

        val sinceTime = System.currentTimeMillis() - ONEDAY_MS
        val recentLogs = logDao.getRecent(sinceTime)

        val cleanMedName = med.name.lowercase(Locale.getDefault())

        // 1. Check for duplicate dose
        val isDuplicate = recentLogs.any { log ->
            log.isSafe && log.name.lowercase(Locale.getDefault()) == cleanMedName
        }

        if (isDuplicate) {
            return SafetyCheckResult(
                isSafe = false,
                medication = med,
                warning = "Stop! You already scanned or took ${med.name} recently.",
                hindiWarning = "Rukye! Aapne ${med.name} abhi kuch der pehle li hai.",
                kannadaWarning = "ನಿಲ್ಲಿಸಿ! ನೀವು ಇತ್ತೀಚೆಗೆ ${med.name} ಅನ್ನು ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ."
            )
        }

        // 2. Check for contraindications with recently taken drugs
        for (recentLog in recentLogs) {
            if (!recentLog.isSafe) continue
            val recentName = recentLog.name.lowercase(Locale.getDefault())

            // Check if the scanned drug is contraindicated with the recent drug
            if (med.contraindications.contains(recentName)) {
                return SafetyCheckResult(
                    isSafe = false,
                    medication = med,
                    warning = "Danger! ${med.name} should not be taken with ${recentLog.name}.",
                    hindiWarning = "Khatra! ${med.name} ko ${recentLog.name} ke saath nahi lena chahiye.",
                    kannadaWarning = "ಅಪಾಯ! ${med.name} ಅನ್ನು ${recentLog.name} ಜೊತೆಗೆ ತೆಗೆದುಕೊಳ್ಳಬಾರದು."
                )
            }

            // Also check the reverse: if the recent drug is contraindicated with the scanned drug
            val recentMed = DrugDatabase.findMedication(recentName)
            if (recentMed != null && recentMed.contraindications.contains(cleanMedName)) {
                return SafetyCheckResult(
                    isSafe = false,
                    medication = med,
                    warning = "Danger! ${med.name} should not be taken with ${recentLog.name}.",
                    hindiWarning = "Khatra! ${med.name} ko ${recentLog.name} ke saath nahi lena chahiye.",
                    kannadaWarning = "ಅಪಾಯ! ${med.name} ಅನ್ನು ${recentLog.name} ಜೊತೆಗೆ ತೆಗೆದುಕೊಳ್ಳಬಾರದು."
                )
            }
        }

        return SafetyCheckResult(isSafe = true, medication = med)
    }
}
