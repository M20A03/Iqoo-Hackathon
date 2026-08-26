// src/utils/safetyEngine.ts
import { IndianDrugInfo, searchIndianDrugs } from './indianDrugsDatabase';
import { getAllItems } from './storage';

export interface SafetyCheckResult {
  isSafe: boolean;
  medication: IndianDrugInfo | null;
  warning?: string;
  hindiWarning?: string;
  kannadaWarning?: string;
}

export async function checkMedicationSafety(ocrText: string): Promise<SafetyCheckResult> {
  const matches = searchIndianDrugs(ocrText);
  const med = matches.length > 0 ? matches[0] : null;

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
  const alreadyTaken = recentMedNames.some(name => name.includes(med.brandName.toLowerCase()));
  if (alreadyTaken) {
    return {
      isSafe: false,
      medication: med,
      warning: `Stop! You already scanned or took ${med.brandName} recently.`,
      hindiWarning: `रुकिए! आपने ${med.brandName} अभी कुछ देर पहले ली है।`,
      kannadaWarning: `ನಿಲ್ಲಿಸಿ! ನೀವು ಇತ್ತೀಚೆಗೆ ${med.brandName} ಅನ್ನು ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ.`
    };
  }

  // Check for contraindications
  if (med.contraindicationWarning) {
    return {
      isSafe: false,
      medication: med,
      warning: `Caution: ${med.contraindicationWarning}`,
      hindiWarning: `सावधानी: ${med.contraindicationWarning}`,
      kannadaWarning: `ಎಚ್ಚರಿಕೆ: ${med.contraindicationWarning}`
    };
  }

  return { isSafe: true, medication: med };
}
