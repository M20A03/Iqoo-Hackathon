// src/utils/safetyEngine.ts
import { Medication, findMedication } from './drugDatabase';
import { getAllItems } from './storage';

export interface SafetyCheckResult {
  isSafe: boolean;
  medication: Medication | null;
  warning?: string;
  hindiWarning?: string;
  kannadaWarning?: string;
}

export async function checkMedicationSafety(ocrText: string): Promise<SafetyCheckResult> {
  const med = findMedication(ocrText);
  if (!med) {
    return { isSafe: true, medication: null };
  }

  // Get user's medication history from last 24 hours
  const history = await getAllItems();
  const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
  const recentMedNames = history
    .filter(item => item.type === 'scan' && item.timestamp > dayAgo)
    .map(item => item.content.toLowerCase());

  // Check for duplicate dose
  const alreadyTaken = recentMedNames.some(name => name.includes(med.name.toLowerCase()));
  if (alreadyTaken) {
    return {
      isSafe: false,
      medication: med,
      warning: `Stop! You already scanned or took ${med.name} recently.`,
      hindiWarning: `Rukye! Aapne ${med.name} abhi kuch der pehle li hai.`,
      kannadaWarning: `ನಿಲ್ಲಿಸಿ! ನೀವು ಇತ್ತೀಚೆಗೆ ${med.name} ಅನ್ನು ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ.`
    };
  }

  // Check for contraindications
  for (const recentName of recentMedNames) {
    for (const contraindicated of med.contraindications) {
      if (recentName.includes(contraindicated)) {
        return {
          isSafe: false,
          medication: med,
          warning: `Danger! ${med.name} should not be taken with medications containing ${contraindicated}.`,
          hindiWarning: `Khatra! ${med.name} ko ${contraindicated} ke saath nahi lena chahiye.`,
          kannadaWarning: `ಅಪಾಯ! ${med.name} ಅನ್ನು ${contraindicated} ಹೊಂದಿರುವ ಔಷಧಿಗಳೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಬಾರದು.`
        };
      }
    }
  }

  return { isSafe: true, medication: med };
}
