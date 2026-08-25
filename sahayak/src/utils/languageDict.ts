export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
}

export const SUPPORTED_INDIAN_LANGUAGES: Record<string, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English (India)', speechCode: 'en-IN', flag: '🇮🇳' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🇮🇳' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', flag: '🇮🇳' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🇮🇳' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🇮🇳' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', flag: '🇮🇳' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', flag: '🇮🇳' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', flag: '🇮🇳' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', flag: '🇮🇳' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN', flag: '🇮🇳' },
};

export type SupportedLangCode = keyof typeof SUPPORTED_INDIAN_LANGUAGES;

export interface DrugTranslation {
  genericVoice: Record<SupportedLangCode, string>;
  warningVoice?: Record<SupportedLangCode, string>;
}

export const MULTILINGUAL_DRUG_DATABASE: Record<string, DrugTranslation> = {
  augmentin: {
    genericVoice: {
      en: "Augmentin 625 generic equivalent Amoxicillin with Clavulanic Acid is available at Jan Aushadhi for Rs 32, saving 84%.",
      hi: "ऑगमेंटिन 625 के बदले जन औषधि एमोक्सिसिलिन केवल बत्तीस रुपये में उपलब्ध है। चौरासी प्रतिशत की बचत।",
      kn: "ಆಗ್ಮೆಂಟಿನ್ 625 ಬದಲಿಗೆ ಜನ ಔಷಧಿ ಅಮೋಕ್ಸಿಸಿಲಿನ್ ಕೇವಲ ಮೂವತ್ತೆರಡು ರೂಪಾಯಿ. ಎಂಬತ್ನಾಲ್ಕು ಶೇಕಡಾ ಉಳಿತಾಯ.",
      ta: "ஆக்மென்டின் 625 க்கு பதிலாக மக்கள் மருந்தகத்தில் அமோக்சிசிலின் வெறும் முப்பத்திரண்டு ரூபாய்க்கு கிடைக்கிறது.",
      te: "ఆగ్మెంటిన్ 625 కు బదులుగా జన ఔషధిలో అమోక్సిసిలిన్ కేవలం ముప్పై రెండు రూపాయలకే లభిస్తుంది.",
      bn: "অগমেন্টিন ৬২৫ এর পরিবর্তে জন ঔষধি অ্যামোক্সিসিলিন মাত্র বত্রিশ টাকায় পাওয়া যায়। চুরাশি শতাংশ সাশ্রয়।",
      mr: "ऑगमेंटिन ६२५ ऐवजी जन औषधी अमोक्सिसिलिन फक्त बत्तीस रुपयांत उपलब्ध आहे. चौऱ्यांशी टक्के बचत.",
      gu: "ઓગમેન્ટિન 625 ના બદલે જન ઔષધિ એમોક્સિસિલિન ફક્ત બત્રીસ રૂપિયામાં ઉપલબ્ધ છે. ચોર્યાસી ટકા બચત.",
      ml: "ഓഗ്മെന്റിൻ 625 ന് പകരം ജൻ ഔഷധി അമോക്സിസിലിൻ വെറും മുപ്പത്തിരണ്ട് രൂപയ്ക്ക് ലഭ്യമാണ്.",
      pa: "ਔਗਮੈਂਟਿਨ 625 ਦੀ ਥਾਂ ਜਨ ਔਸ਼ਧੀ ਅਮੋਕਸੀਸਿਲਿਨ ਸਿਰਫ਼ ਬੱਤੀ ਰੁਪਏ ਵਿੱਚ ਮਿਲਦੀ ਹੈ। ਚੁਰਾਸੀ ਫ਼ੀਸਦੀ ਬੱਚਤ।"
    }
  },
  lipitor: {
    genericVoice: {
      en: "Lipitor generic equivalent Atorvastatin 20mg is available at Jan Aushadhi for Rs 38, saving 85%.",
      hi: "एटोरवास्टेटिन 20mg जन औषधि केंद्र पर अड़तीस रुपये में उपलब्ध है। पिचासी प्रतिशत बचत।",
      kn: "ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್ 20mg ಜನ ಔಷಧಿ ಕೇಂದ್ರದಲ್ಲಿ ಮೂವತ್ತೆಂಟು ರೂಪಾಯಿಗೆ ಲಭ್ಯವಿದೆ. ಎಂಬತ್ತೈದು ಶೇಕಡಾ ಉಳಿತಾಯ.",
      ta: "அடோர்வாஸ்டேடின் 20mg மக்கள் மருந்தகத்தில் முப்பத்தெட்டு ரூபாய்க்கு கிடைக்கிறது.",
      te: "అటోర్వాస్టాటిన్ 20mg జన ఔషధి కేంద్రంలో ముప్పై ఎనిమిది రూపాయలకే లభిస్తుంది.",
      bn: "অ্যাটোর্বাস্ট্যাটিন ২০mg জন ঔষধি কেন্দ্রে মাত্র আটত্রিশ টাকায় পাওয়া যায়।",
      mr: "अ‍ॅटोरव्हास्टॅटिन २०mg जन औषधी केंद्रावर अडतीस रुपयांत उपलब्ध आहे.",
      gu: "એટોરવાસ્ટેટિન 20mg જન ઔષધિ કેન્દ્ર પર અડત્રીસ રૂપિયામાં ઉપલબ્ધ છે.",
      ml: "അറ്റോർവാസ്റ്റാറ്റിൻ 20mg ജൻ ഔഷധി കേന്ദ്രത്തിൽ മുപ്പത്തിയെട്ട് രൂപയ്ക്ക് ലഭ്യമാണ്.",
      pa: "ਐਟੋਰਵਾਸਟੈਟਿਨ 20mg ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ 'ਤੇ ਅਠੱਤੀ ਰੁਪਏ ਵਿੱਚ ਉਪਲਬਧ ਹੈ।"
    }
  },
  glycomet: {
    genericVoice: {
      en: "Glycomet generic Metformin 500mg is available at Jan Aushadhi for Rs 9.50, saving 85%.",
      hi: "मेटफॉर्मिन 500mg जन औषधि पर केवल नौ रुपये पचास पैसे में उपलब्ध है।",
      kn: "ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg ಕೇವಲ ಒಂಬತ್ತು ರೂಪಾಯಿ ಐವತ್ತು ಪೈಸೆ.",
      ta: "மெட்பார்மின் 500mg மக்கள் மருந்தகத்தில் வெறும் ஒன்பது ரூபாய் ஐம்பது காசுகளுக்கு கிடைக்கிறது.",
      te: "మెట్‌ఫార్మిన్ 500mg కేవలం తొమ్మిది రూపాయల యాభై పైసలకే లభిస్తుంది.",
      bn: "মেটফর্মিন ৫০০mg জন ঔষধি কেন্দ্রে মাত্র সাড়ে নয় টাকায় পাওয়া যায়।",
      mr: "मेटफॉर्मिन ५००mg जन औषधी केंद्रावर फक्त साडेनऊ रुपयांत उपलब्ध आहे.",
      gu: "મેટફોર્મિન 500mg જન ઔષધિ પર ફક્ત સાડા નવ રૂપિયામાં ઉપલબ્ધ છે.",
      ml: "മെറ്റ്ഫോർമിൻ 500mg ജൻ ഔഷധിയിൽ വെറും ഒമ്പത് രൂപ അമ്പത് പൈസയ്ക്ക് ലഭിക്കും.",
      pa: "ਮੈਟਫੋਰਮਿਨ 500mg ਜਨ ਔਸ਼ਧੀ 'ਤੇ ਸਿਰਫ਼ ਸਾਢੇ ਨੌਂ ਰੁਪਏ ਵਿੱਚ ਮਿਲਦਾ ਹੈ।"
    }
  },
  aspirin_warfarin: {
    genericVoice: {
      en: "Warning! Aspirin and Warfarin combination increases internal bleeding risk. Consult doctor immediately.",
      hi: "चेतावनी! एस्पिरिन और वारफारिन एक साथ लेने से आंतरिक रक्तस्राव का गंभीर खतरा है। डॉक्टर से संपर्क करें।",
      kn: "ಎಚ್ಚರಿಕೆ! ಆಸ್ಪಿರಿನ್ ಮತ್ತು ವಾರ್ಫಾರಿನ್ ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ರಕ್ತಸ್ರಾವಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      ta: "எச்சரிக்கை! ஆஸ்பிரின் மற்றும் வார்ஃபரின் ஒன்றாக உட்கொள்வது உள் இரத்தப்போக்கு அபாயத்தை அதிகரிக்கும்.",
      te: "హెచ్చరిక! ఆస్పిరిన్ మరియు వార్ఫరిన్ కలిసి తీసుకోవడం తీవ్ర రక్తస్రావానికి దారితీయవచ్చు.",
      bn: "সতর্কতা! অ্যাসপিরিন এবং ওয়ারফারিন একসাথে গ্রহণ করলে অভ্যন্তরীণ রক্তপাতের ঝুঁকি বাড়ে।",
      mr: "धोका! अ‍ॅस्पिरिन आणि वॉरफेरिन एकत्र घेतल्यास अंतर्गत रक्तस्त्रावाचा मोठा धोका संभवतो.",
      gu: "ચેતવણી! એસ્પિરિન અને વૉરફેરિન સાથે લેવાથી આંતરિક રક્તસ્રાવનું ગંભીર જોખમ છે.",
      ml: "മുന്നറിയിപ്പ്! ആസ്പിരിനും വാർഫാരിനും ഒന്നിച്ച് കഴിക്കുന്നത് ആന്തരിക രക്തസ്രാവത്തിന് കാരണമാകും.",
      pa: "ਚੇਤਾਵਨੀ! ਐਸਪਰੀਨ ਅਤੇ ਵਾਰਫਰੀਨ ਇਕੱਠੇ ਲੈਣ ਨਾਲ ਅੰਦਰੂਨੀ ਖੂਨ ਵਹਿਣ ਦਾ ਖ਼ਤਰਾ ਵਧਦਾ ਹੈ।"
    }
  }
};
