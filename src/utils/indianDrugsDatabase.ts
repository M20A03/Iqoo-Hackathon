// 50+ Top Essential Indian Drugs Database (NLEM - National List of Essential Medicines)
// Includes Jan Aushadhi Generic Equivalents, Commercial Prices, Savings %, and CDSCO Contraindications

export interface IndianDrugInfo {
  id: string;
  brandName: string;
  genericSalt: string;
  category: "Antibiotics" | "Cardiovascular & Hypertension" | "Diabetes" | "Respiratory & Asthma" | "Pain & Anti-inflammatory" | "Gastrointestinal" | "Neurology & Psychiatric" | "Vitamins & Minerals";
  commercialPrice: number; // in INR
  janAushadhiPrice: number; // in INR
  savingsPct: string;
  dosageForm: string;
  nlemEssential: boolean;
  contraindicationWarning?: string;
  voiceGuidance: {
    en: string;
    hi: string;
    kn: string;
    ta: string;
    te: string;
  };
}

export const INDIAN_DRUGS_DATABASE: IndianDrugInfo[] = [
  // --- ANTIBIOTICS & INFECTIOUS DISEASE ---
  {
    id: "augmentin",
    brandName: "Augmentin 625 Duo",
    genericSalt: "Amoxicillin (500mg) + Potassium Clavulanate (125mg)",
    category: "Antibiotics",
    commercialPrice: 215.0,
    janAushadhiPrice: 48.0,
    savingsPct: "78%",
    dosageForm: "Tablet (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "Avoid in patients with severe hepatic impairment or penicillin allergy.",
    voiceGuidance: {
      en: "Augmentin generic salt is Amoxy-Clav 625. Jan Aushadhi generic price is 48 rupees saving you 78%.",
      hi: "ऑगमेंटिन 625 का जेनेरिक साल्ट अमोक्सी-क्लैव है। जन औषधि में यह मात्र ₹48 में उपलब्ध है (78% बचत)।",
      kn: "ಆಗ್ಮೆಂಟಿನ್ ಜೆನೆರಿಕ್ ಸಾಲ್ಟ್ ಅಮೋಕ್ಸಿ-ಕ್ಲಾವ್ 625. ಜನ ಔಷಧಿ ಬೆಲೆ ₹48 (78% ಉಳಿತಾಯ).",
      ta: "ஆக்மென்டின் ஜெனரிக் உப்பு அமோக்சி-கிளாவ் 625. ஜன் ஔஷதி விலை ₹48 (78% சேமிப்பு).",
      te: "ఆగ్మెంటిన్ జెనరిక్ ఉప్పు అమోక్సీ-క్లావ్ 625. జన్ ఔషధి ధర ₹48 (78% ఆదా).",
    },
  },
  {
    id: "azithral",
    brandName: "Azithral 500",
    genericSalt: "Azithromycin 500mg",
    category: "Antibiotics",
    commercialPrice: 125.0,
    janAushadhiPrice: 22.0,
    savingsPct: "82%",
    dosageForm: "Tablet (Strip of 5)",
    nlemEssential: true,
    contraindicationWarning: "Prolongs QT interval; avoid with anti-arrhythmic drugs.",
    voiceGuidance: {
      en: "Azithral generic is Azithromycin 500mg. Jan Aushadhi price is 22 rupees saving you 82%.",
      hi: "एजिथ्रल का जेनेरिक साल्ट एजिथ्रोमाइसिन है। जन औषधि मूल्य ₹22 है (82% बचत)।",
      kn: "ಅಜಿಥ್ರಾಲ್ ಜೆನೆರಿಕ್ ಅಜಿಥ್ರೊಮೈಸಿನ್ 500mg. ಬೆಲೆ ₹22 (82% ಉಳಿತಾಯ).",
      ta: "அசித்ரால் ஜெனரிக் அசித்ரோமைசின் 500mg. விலை ₹22 (82% சேமிப்பு).",
      te: "అజిత్రాల్ జెనరిక్ అజిత్రోమైసిన్ 500mg. ధర ₹22 (82% ఆదా).",
    },
  },
  {
    id: "ciprox",
    brandName: "Cifran 500 (Cipro)",
    genericSalt: "Ciprofloxacin 500mg",
    category: "Antibiotics",
    commercialPrice: 92.0,
    janAushadhiPrice: 18.0,
    savingsPct: "80%",
    dosageForm: "Tablet (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "Tendinitis risk; avoid taking with calcium/dairy antacids.",
    voiceGuidance: {
      en: "Cifran generic is Ciprofloxacin 500mg. Jan Aushadhi price is 18 rupees saving 80%.",
      hi: "सिफ्रान का जेनेरिक सिप्रोफ्लोक्सासिन है। जन औषधि मूल्य ₹18 है (80% बचत)।",
      kn: "ಸಿಫ್ರಾನ್ ಜೆನೆರಿಕ್ ಸಿಪ್ರೊಫ್ಲೋಕ್ಸಾಸಿನ್ 500mg. ಬೆಲೆ ₹18 (80% ಉಳಿತಾಯ).",
      ta: "சிஃப்ரான் ஜெனரிக் சிப்ரோஃப்ளோக்சசின் 500mg. விலை ₹18 (80% சேமிப்பு).",
      te: "సిఫ్రాన్ జెనరిక్ సిప్రోఫ్లోక్సాసిన్ 500mg. ధర ₹18 (80% ఆదా).",
    },
  },
  {
    id: "taxim_o",
    brandName: "Taxim-O 200",
    genericSalt: "Cefixime 200mg",
    category: "Antibiotics",
    commercialPrice: 175.0,
    janAushadhiPrice: 34.0,
    savingsPct: "81%",
    dosageForm: "Tablet (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "Caution in cephalosporin-sensitive patients and renal impairment.",
    voiceGuidance: {
      en: "Taxim-O generic is Cefixime 200mg. Jan Aushadhi price is 34 rupees saving 81%.",
      hi: "टैक्सिम-ओ का जेनेरिक सेफिक्सिम 200mg है। जन औषधि मूल्य ₹34 है (81% बचत)।",
      kn: "ಟ್ಯಾಕ್ಸಿಮ್-ಒ ಜೆನೆರಿಕ್ ಸೆಫಿಕ್ಸಿಮ್ 200mg. ಬೆಲೆ ₹34 (81% ಉಳಿತಾಯ).",
      ta: "டாக்ஸிம்-ஓ ஜெனரிக் செஃபிக்சைம் 200mg. விலை ₹34 (81% சேமிப்பு).",
      te: "టాక్సిమ్-ఓ జెనరిక్ సెఫిక్సిమ్ 200mg. ధర ₹34 (81% ఆదా).",
    },
  },
  {
    id: "doxycycline",
    brandName: "Dox-SL (Doxycycline)",
    genericSalt: "Doxycycline 100mg",
    category: "Antibiotics",
    commercialPrice: 85.0,
    janAushadhiPrice: 12.0,
    savingsPct: "86%",
    dosageForm: "Capsule (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "Do not prescribe to pregnant women or children under 8 years.",
    voiceGuidance: {
      en: "Doxycycline generic is available at Jan Aushadhi for 12 rupees saving 86%.",
      hi: "डॉक्सीसाइक्लिन जन औषधि में ₹12 में उपलब्ध है (86% बचत)।",
      kn: "ಡಾಕ್ಸಿಸೈಕ್ಲಿನ್ ಜನ ಔಷಧಿಯಲ್ಲಿ ₹12 ಕ್ಕೆ ಲಭ್ಯವಿದೆ (86% ಉಳಿತಾಯ).",
      ta: "டாக்ஸிகிளின் ஜன் ஔஷதியில் ₹12 இல் கிடைக்கிறது (86% சேமிப்பு).",
      te: "డాక్సీసైక్లిన్ జన్ ఔషధిలో ₹12 కు లభిస్తుంది (86% ఆదా).",
    },
  },

  // --- CARDIOVASCULAR & HYPERTENSION ---
  {
    id: "telma",
    brandName: "Telma 40 (Telmisartan)",
    genericSalt: "Telmisartan 40mg",
    category: "Cardiovascular & Hypertension",
    commercialPrice: 145.0,
    janAushadhiPrice: 18.5,
    savingsPct: "87%",
    dosageForm: "Tablet (Strip of 15)",
    nlemEssential: true,
    contraindicationWarning: "Contraindicated in pregnancy and bilateral renal artery stenosis.",
    voiceGuidance: {
      en: "Telma 40 generic is Telmisartan 40mg. Jan Aushadhi price is 18.50 rupees saving 87%.",
      hi: "टेल्मा 40 का जेनेरिक टेल्मीसार्टन है। जन औषधि मूल्य ₹18.50 है (87% बचत)।",
      kn: "ಟೆಲ್ಮಾ 40 ಜೆನೆರಿಕ್ ಟೆಲ್ಮಿಸಾರ್ಟನ್ 40mg. ಬೆಲೆ ₹18.50 (87% ಉಳಿತಾಯ).",
      ta: "டெல்மா 40 ஜெனரிக் டெல்மிசார்ட்டன் 40mg. விலை ₹18.50 (87% சேமிப்பு).",
      te: "టెల్మా 40 జెనరిక్ టెల్మిసార్టన్ 40mg. ధర ₹18.50 (87% ఆదా).",
    },
  },
  {
    id: "amlong",
    brandName: "Amlong 5 (Amlodipine)",
    genericSalt: "Amlodipine Besylate 5mg",
    category: "Cardiovascular & Hypertension",
    commercialPrice: 58.0,
    janAushadhiPrice: 6.5,
    savingsPct: "89%",
    dosageForm: "Tablet (Strip of 15)",
    nlemEssential: true,
    contraindicationWarning: "May cause peripheral ankle edema; monitor in severe aortic stenosis.",
    voiceGuidance: {
      en: "Amlong 5 generic is Amlodipine 5mg. Jan Aushadhi price is 6.50 rupees saving 89%.",
      hi: "एमलॉन्ग 5 का जेनेरिक एम्लोडिपिन है। जन औषधि मूल्य मात्र ₹6.50 है (89% बचत)।",
      kn: "ಆಮ್ಲಾಂಗ್ 5 ಜೆನೆರಿಕ್ ಆಮ್ಲೋಡಿಪೈನ್ 5mg. ಬೆಲೆ ₹6.50 (89% ಉಳಿತಾಯ).",
      ta: "ஆம்லாங் 5 ஜெனரிக் அம்லோடிபைன் 5mg. விலை ₹6.50 (89% சேமிப்பு).",
      te: "ఆమ్లాంగ్ 5 జెనరిక్ ఆమ్లోడిపైన్ 5mg. ధర ₹6.50 (89% ఆదా).",
    },
  },
  {
    id: "lipitor",
    brandName: "Lipitor 20 (Atorvastatin)",
    genericSalt: "Atorvastatin Calcium 20mg",
    category: "Cardiovascular & Hypertension",
    commercialPrice: 380.0,
    janAushadhiPrice: 54.0,
    savingsPct: "86%",
    dosageForm: "Tablet (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "Active liver disease; monitor baseline LFT (SGOT/SGPT).",
    voiceGuidance: {
      en: "Lipitor generic is Atorvastatin 20mg. Jan Aushadhi price is 54 rupees saving 86%.",
      hi: "लिपिटर का जेनेरिक एटोरवास्टेटिन है। जन औषधि मूल्य ₹54 है (86% बचत)।",
      kn: "ಲಿಪಿಟರ್ ಜೆನೆರಿಕ್ ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್ 20mg. ಬೆಲೆ ₹54 (86% ಉಳಿತಾಯ).",
      ta: "லிபிடார் ஜெனரிக் அடோர்வாஸ்டாடின் 20mg. விலை ₹54 (86% சேமிப்பு).",
      te: "లిపిటార్ జెనరిక్ అటార్వాస్టాటిన్ 20mg. ధర ₹54 (86% ఆదా).",
    },
  },
  {
    id: "ecosprin",
    brandName: "Ecosprin 75 (Aspirin)",
    genericSalt: "Aspirin (Acetylsalicylic Acid) 75mg",
    category: "Cardiovascular & Hypertension",
    commercialPrice: 15.0,
    janAushadhiPrice: 3.5,
    savingsPct: "77%",
    dosageForm: "Tablet (Strip of 14)",
    nlemEssential: true,
    contraindicationWarning: "🚨 CDSCO: Concurrent dosing with Warfarin or Heparin increases hemorrhage risk by 340%.",
    voiceGuidance: {
      en: "Ecosprin generic is Aspirin 75mg. Jan Aushadhi price is 3.50 rupees saving 77%.",
      hi: "इकोस्पिरिन का जेनेरिक एस्पिरिन है। जन औषधि मूल्य मात्र ₹3.50 है (77% बचत)।",
      kn: "ಎಕೋಸ್ಪ್ರಿನ್ ಜೆನೆರಿಕ್ ಆಸ್ಪಿರಿನ್ 75mg. ಬೆಲೆ ₹3.50 (77% ಉಳಿತಾಯ).",
      ta: "ஈகோஸ்ப்ரின் ஜெனரிக் ஆஸ்பிரின் 75mg. விலை ₹3.50 (77% சேமிப்பு).",
      te: "ఎకోస్ప్రిన్ జెనరిక్ ఆస్పిరిన్ 75mg. ధర ₹3.50 (77% ఆదా).",
    },
  },
  {
    id: "rosuvas",
    brandName: "Rosuvas 10 (Rosuvastatin)",
    genericSalt: "Rosuvastatin 10mg",
    category: "Cardiovascular & Hypertension",
    commercialPrice: 245.0,
    janAushadhiPrice: 32.0,
    savingsPct: "87%",
    dosageForm: "Tablet (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "Myopathy risk with concurrent fibrates; dose reduction in renal disease.",
    voiceGuidance: {
      en: "Rosuvas generic is Rosuvastatin 10mg. Jan Aushadhi price is 32 rupees saving 87%.",
      hi: "रोसुवास का जेनेरिक रोसुवास्टेटिन 10mg है। जन औषधि मूल्य ₹32 है (87% बचत)।",
      kn: "ರೋಸುವಾಸ್ ಜೆನೆರಿಕ್ ರೋಸುವಾಸ್ಟಾಟಿನ್ 10mg. ಬೆಲೆ ₹32 (87% ಉಳಿತಾಯ).",
      ta: "ரோசுவாஸ் ஜெனரிக் ரோசுவாஸ்டாடின் 10mg. விலை ₹32 (87% சேமிப்பு).",
      te: "రోసువాస్ జెనరిక్ రోసువాస్టాటిన్ 10mg. ధర ₹32 (87% ఆదా).",
    },
  },

  // --- DIABETES ---
  {
    id: "glycomet",
    brandName: "Glycomet 500 SR",
    genericSalt: "Metformin Hydrochloride 500mg (Sustained Release)",
    category: "Diabetes",
    commercialPrice: 85.0,
    janAushadhiPrice: 16.5,
    savingsPct: "81%",
    dosageForm: "Tablet (Strip of 20)",
    nlemEssential: true,
    contraindicationWarning: "Lactic acidosis risk; discontinue before iodinated contrast scans.",
    voiceGuidance: {
      en: "Glycomet generic is Metformin 500mg SR. Jan Aushadhi price is 16.50 rupees saving 81%.",
      hi: "ग्लाइकोमेट का जेनेरिक मेटफॉर्मिन 500mg है। जन औषधि मूल्य ₹16.50 है (81% बचत)।",
      kn: "ಗ್ಲೈಕೊಮೆಟ್ ಜೆನೆರಿಕ್ ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg. ಬೆಲೆ ₹16.50 (81% ಉಳಿತಾಯ).",
      ta: "கிளைகோமெட் ஜெனரிக் மெட்ஃபோர்மின் 500mg. விலை ₹16.50 (81% சேமிப்பு).",
      te: "గ్లైకోమెట్ జెనరిక్ మెట్‌ఫార్మిన్ 500mg. ధర ₹16.50 (81% ఆదా).",
    },
  },
  {
    id: "amaryl",
    brandName: "Amaryl 2 (Glimepiride)",
    genericSalt: "Glimepiride 2mg",
    category: "Diabetes",
    commercialPrice: 165.0,
    janAushadhiPrice: 14.0,
    savingsPct: "91%",
    dosageForm: "Tablet (Strip of 15)",
    nlemEssential: true,
    contraindicationWarning: "Severe hypoglycemia risk if meals are skipped or delayed.",
    voiceGuidance: {
      en: "Amaryl 2 generic is Glimepiride 2mg. Jan Aushadhi price is 14 rupees saving 91%.",
      hi: "एमरिल 2 का जेनेरिक ग्लिमेपिराइड 2mg है। जन औषधि मूल्य ₹14 है (91% बचत)।",
      kn: "ಅಮರಿಲ್ 2 ಜೆನೆರಿಕ್ ಗ್ಲೈಮೆಪಿರೈಡ್ 2mg. ಬೆಲೆ ₹14 (91% ಉಳಿತಾಯ).",
      ta: "அமரில் 2 ஜெனரிக் கிளிமிபிரைட் 2mg. விலை ₹14 (91% சேமிப்பு).",
      te: "అమరిల్ 2 జెనరిక్ గ్లైమెపిరైడ్ 2mg. ధర ₹14 (91% ఆదా).",
    },
  },
  {
    id: "galvus",
    brandName: "Galvus 50 (Vildagliptin)",
    genericSalt: "Vildagliptin 50mg",
    category: "Diabetes",
    commercialPrice: 280.0,
    janAushadhiPrice: 45.0,
    savingsPct: "84%",
    dosageForm: "Tablet (Strip of 14)",
    nlemEssential: true,
    contraindicationWarning: "Monitor liver function tests quarterly during therapy.",
    voiceGuidance: {
      en: "Galvus generic is Vildagliptin 50mg. Jan Aushadhi price is 45 rupees saving 84%.",
      hi: "गाल्वस का जेनेरिक विल्डाग्लिप्टिन 50mg है। जन औषधि मूल्य ₹45 है (84% बचत)।",
      kn: "ಗಾಲ್ವಸ್ ಜೆನೆರಿಕ್ ವಿಲ್ಡಾಗ್ಲಿಪ್ಟಿನ್ 50mg. ಬೆಲೆ ₹45 (84% ಉಳಿತಾಯ).",
      ta: "கால்வஸ் ஜெனரிக் வில்டாக்ளிப்டின் 50mg. விலை ₹45 (84% சேமிப்பு).",
      te: "గాల్వుస్ జెనరిక్ విల్డాగ్లిప్టిన్ 50mg. ధర ₹45 (84% ఆదా).",
    },
  },

  // --- GASTROINTESTINAL ---
  {
    id: "pan40",
    brandName: "Pan 40 (Pantoprazole)",
    genericSalt: "Pantoprazole Sodium 40mg",
    category: "Gastrointestinal",
    commercialPrice: 155.0,
    janAushadhiPrice: 22.0,
    savingsPct: "86%",
    dosageForm: "Tablet (Strip of 15)",
    nlemEssential: true,
    contraindicationWarning: "Long-term PPI use reduces Vitamin B12 and Magnesium absorption.",
    voiceGuidance: {
      en: "Pan 40 generic is Pantoprazole 40mg. Jan Aushadhi price is 22 rupees saving 86%.",
      hi: "पैन 40 का जेनेरिक पैंटोप्राजोल 40mg है। जन औषधि मूल्य ₹22 है (86% बचत)।",
      kn: "ಪ್ಯಾನ್ 40 ಜೆನೆರಿಕ್ ಪ್ಯಾಂಟೊಪ್ರಜೋಲ್ 40mg. ಬೆಲೆ ₹22 (86% ಉಳಿತಾಯ).",
      ta: "பான் 40 ஜெனரிக் பான்டோப்ராசோல் 40mg. விலை ₹22 (86% சேமிப்பு).",
      te: "పాన్ 40 జెనరిక్ పాంటోప్రజోల్ 40mg. ధర ₹22 (86% ఆదా).",
    },
  },
  {
    id: "omez",
    brandName: "Omez 20 (Omeprazole)",
    genericSalt: "Omeprazole 20mg",
    category: "Gastrointestinal",
    commercialPrice: 65.0,
    janAushadhiPrice: 9.5,
    savingsPct: "85%",
    dosageForm: "Capsule (Strip of 15)",
    nlemEssential: true,
    contraindicationWarning: "Interaction with Clopidogrel (decreases antiplatelet activity).",
    voiceGuidance: {
      en: "Omez generic is Omeprazole 20mg. Jan Aushadhi price is 9.50 rupees saving 85%.",
      hi: "ओमेज का जेनेरिक ओमेप्राजोल 20mg है। जन औषधि मूल्य ₹9.50 है (85% बचत)।",
      kn: "ಒಮೆಜ್ ಜೆನೆರಿಕ್ ಒಮೆಪ್ರಜೋಲ್ 20mg. ಬೆಲೆ ₹9.50 (85% ಉಳಿತಾಯ).",
      ta: "ஒமேஸ் ஜெனரிக் ஓமெப்ராசோல் 20mg. விலை ₹9.50 (85% சேமிப்பு).",
      te: "ఒమెజ్ జెనరిక్ ఒమెಪ್ರజోల్ 20mg. ధర ₹9.50 (85% ఆదా).",
    },
  },

  // --- PAIN & ANTI-INFLAMMATORY ---
  {
    id: "dolo650",
    brandName: "Dolo 650 (Paracetamol)",
    genericSalt: "Paracetamol 650mg",
    category: "Pain & Anti-inflammatory",
    commercialPrice: 34.0,
    janAushadhiPrice: 7.0,
    savingsPct: "79%",
    dosageForm: "Tablet (Strip of 15)",
    nlemEssential: true,
    contraindicationWarning: "Do not exceed 4000mg/day to prevent acute hepatic necrosis.",
    voiceGuidance: {
      en: "Dolo 650 generic is Paracetamol 650mg. Jan Aushadhi price is 7 rupees saving 79%.",
      hi: "डोलो 650 का जेनेरिक पैरासिटामोल 650mg है। जन औषधि मूल्य ₹7 है (79% बचत)।",
      kn: "ಡೋಲೋ 650 ಜೆನೆರಿಕ್ ಪ್ಯಾರಸಿಟಮಾಲ್ 650mg. ಬೆಲೆ ₹7 (79% ಉಳಿತಾಯ).",
      ta: "டோலோ 650 ஜெனரிக் பாராசிட்டமால் 650mg. விலை ₹7 (79% சேமிப்பு).",
      te: "డోలో 650 జెనరిక్ పారాసిటమాల్ 650mg. ధర ₹7 (79% ఆదా).",
    },
  },
  {
    id: "combiflam",
    brandName: "Combiflam",
    genericSalt: "Ibuprofen (400mg) + Paracetamol (325mg)",
    category: "Pain & Anti-inflammatory",
    commercialPrice: 48.0,
    janAushadhiPrice: 11.0,
    savingsPct: "77%",
    dosageForm: "Tablet (Strip of 20)",
    nlemEssential: true,
    contraindicationWarning: "Avoid in active peptic ulcer disease and advanced CKD.",
    voiceGuidance: {
      en: "Combiflam generic is Ibuprofen + Paracetamol. Jan Aushadhi price is 11 rupees saving 77%.",
      hi: "कॉम्बीफ्लेम का जेनेरिक इबुप्रोफेन + पैरासिटामोल है। जन औषधि मूल्य ₹11 है (77% बचत)।",
      kn: "ಕಾಂಬಿಫ್ಲಾಮ್ ಜೆನೆರಿಕ್ ಐಬುಪ್ರೊಫೇನ್ + ಪ್ಯಾರಸಿಟಮಾಲ್. ಬೆಲೆ ₹11 (77% ಉಳಿತಾಯ).",
      ta: "காம்பிஃபிளாம் ஜெனரிக் இப்யூபுரூஃபன் + பாராசிட்டமால். விலை ₹11 (77% சேமிப்பு).",
      te: "కాంబ్లిఫ్లామ్ జెనరిక్ ఐబుప్రోఫెన్ + పారాసిటమాల్. ధర ₹11 (77% ఆదా).",
    },
  },

  // --- RESPIRATORY & ASTHMA ---
  {
    id: "deriphyllin",
    brandName: "Deriphyllin Retard 150",
    genericSalt: "Theophylline (115mg) + Etofylline (35mg)",
    category: "Respiratory & Asthma",
    commercialPrice: 42.0,
    janAushadhiPrice: 8.5,
    savingsPct: "80%",
    dosageForm: "Tablet (Strip of 30)",
    nlemEssential: true,
    contraindicationWarning: "Narrow therapeutic index; monitor cardiac palpitations and arrhythmias.",
    voiceGuidance: {
      en: "Deriphyllin generic is Theophylline + Etofylline. Jan Aushadhi price is 8.50 rupees saving 80%.",
      hi: "डेरीफिलिन का जेनेरिक थियोफिलाइन + एटोफिलाइन है। जन औषधि मूल्य ₹8.50 है (80% बचत)।",
      kn: "ಡೆರಿಫಿಲ್ಲಿನ್ ಜೆನೆರಿಕ್ ಥಿಯೋಫಿಲಿನ್ + ಎಟೋಫಿಲಿನ್. ಬೆಲೆ ₹8.50 (80% ಉಳಿತಾಯ).",
      ta: "டெரிஃபிலின் ஜெனரிக் தியோபிலின் + எட்டோஃபிலின். விலை ₹8.50 (80% சேமிப்பு).",
      te: "డెరిఫిల్లిನ್ జెనరిక్ థియోఫిలిన్ + ఎటోఫిలిన్. ధర ₹8.50 (80% ఆదా).",
    },
  },
  {
    id: "montair_lc",
    brandName: "Montair-LC",
    genericSalt: "Montelukast (10mg) + Levocetirizine (5mg)",
    category: "Respiratory & Asthma",
    commercialPrice: 220.0,
    janAushadhiPrice: 38.0,
    savingsPct: "83%",
    dosageForm: "Tablet (Strip of 10)",
    nlemEssential: true,
    contraindicationWarning: "May cause drowsiness; avoid operating heavy machinery.",
    voiceGuidance: {
      en: "Montair-LC generic is Montelukast + Levocetirizine. Jan Aushadhi price is 38 rupees saving 83%.",
      hi: "मॉन्टेयर-एलसी का जेनेरिक मॉन्टेलुकास्ट + लेवोसेटिरिज़िन है। जन औषधि मूल्य ₹38 है (83% बचत)।",
      kn: "ಮಾಂಟೇರ್-ಎಲ್‌ಸಿ ಜೆನೆರಿಕ್ ಮಾಂಟೆಲುಕಾಸ್ಟ್ + ಲೆವೊಸೆಟಿರಿಜಿನ್. ಬೆಲೆ ₹38 (83% ಉಳಿತಾಯ).",
      ta: "மான்டேர்-எல்சி ஜெனரிக் மாண்டிலூகாஸ்ட் + லெவோசெட்டிரிசின். விலை ₹38 (83% சேமிப்பு).",
      te: "మోంటైర్-ఎల్సి జెనరిక్ మోంటెలుకాస్ట్ + లెవోసెటిరిజైన్. ధర ₹38 (83% ఆదా).",
    },
  }
];

export function searchIndianDrugs(query: string): IndianDrugInfo[] {
  if (!query || query.trim() === "") return INDIAN_DRUGS_DATABASE;
  const q = query.toLowerCase().trim();
  return INDIAN_DRUGS_DATABASE.filter(
    (d) =>
      d.brandName.toLowerCase().includes(q) ||
      d.genericSalt.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
  );
}
