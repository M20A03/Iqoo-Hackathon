// src/utils/drugDatabase.ts

export interface Medication {
  name: string;
  category: string;
  contraindications: string[]; // List of drug names it should NOT be taken with
  sideEffects: string;
  hindiAlert: string;
  kannadaAlert: string;
}

// Simulated CDSCO Indian Drug Database
export const INDIAN_DRUG_DB: Record<string, Medication> = {
  "paracetamol": {
    name: "Paracetamol",
    category: "Analgesic",
    contraindications: ["warfarin", "alcohol"],
    sideEffects: "Liver strain if overdosed",
    hindiAlert: "Paracetamol detected. Kripya dhyan dein: din mein 4 se zyada na lein.",
    kannadaAlert: "ಪ್ಯಾರಸಿಟಮಾಲ್ ಪತ್ತೆಯಾಗಿದೆ. ಗಮನಿಸಿ: ದಿನಕ್ಕೆ 4 ಕ್ಕಿಂತ ಹೆಚ್ಚು ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ."
  },
  "aspirin": {
    name: "Aspirin",
    category: "Blood Thinner",
    contraindications: ["warfarin", "ibuprofen", "clopidogrel"],
    sideEffects: "Stomach irritation, bleeding risk",
    hindiAlert: "Aspirin detected. Yeh khoon patla karti hai. Surgery se pehle na lein.",
    kannadaAlert: "ಆಸ್ಪಿರಿನ್ ಪತ್ತೆಯಾಗಿದೆ. ಇದು ರಕ್ತವನ್ನು ತೆಳುಗೊಳಿಸುತ್ತದೆ. ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ಮೊದಲು ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ."
  },
  "metformin": {
    name: "Metformin",
    category: "Anti-diabetic",
    contraindications: ["contrast dye", "alcohol"],
    sideEffects: "Gastrointestinal upset",
    hindiAlert: "Metformin detected. Sugar ki dawai hai. Khane ke baad lein.",
    kannadaAlert: "ಮೆಟ್ಫಾರ್ಮಿನ್ ಪತ್ತೆಯಾಗಿದೆ. ಸಕ್ಕರೆ ಕಾಯಿಲೆಗೆ ಔಷಧ. ಊಟದ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಿ."
  },
  "amlodipine": {
    name: "Amlodipine",
    category: "Blood Pressure",
    contraindications: ["simvastatin"],
    sideEffects: "Dizziness, swelling",
    hindiAlert: "Amlodipine detected. BP ki dawai hai. Rozana ek hi samay par lein.",
    kannadaAlert: "ಅಮ್ಲೋಡಿಪೈನ್ ಪತ್ತೆಯಾಗಿದೆ. ಬಿಪಿ ಔಷಧ. ಪ್ರತಿದಿನ ಒಂದೇ ಸಮಯದಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಿ."
  }
};

export function findMedication(ocrText: string): Medication | null {
  const words = ocrText.toLowerCase().split(/[\s,.-]+/);
  for (const key of Object.keys(INDIAN_DRUG_DB)) {
    if (words.includes(key)) {
      return INDIAN_DRUG_DB[key];
    }
  }
  return null;
}
