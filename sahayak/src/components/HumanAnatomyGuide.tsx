import { Stethoscope, Eye, HeartPulse, Volume2, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';

interface HumanAnatomyGuideProps {
  guideType: 'stethoscope' | 'sclera' | 'ppg';
  lang: SupportedLangCode;
  onReadyToStart: () => void;
  onClose: () => void;
}

const GUIDE_CONTENT: Record<'stethoscope' | 'sclera' | 'ppg', Record<SupportedLangCode, {
  title: string;
  step1: string;
  step2: string;
  step3: string;
  warning: string;
  voicePrompt: string;
}>> = {
  stethoscope: {
    en: {
      title: 'How to Position the Phone on Your Chest',
      step1: '1. Locate the bottom microphone hole on your phone (next to charging port).',
      step2: '2. Place the bottom microphone firmly against your bare upper chest or back (avoid thick shirts).',
      step3: '3. Sit in a quiet room, remain still, and take 3 slow, deep breaths in through your nose and out through your mouth.',
      warning: 'Do not speak or tap the screen while recording to prevent false crackle sounds.',
      voicePrompt: 'Place the phone bottom microphone against your upper chest. Take slow, deep breaths.'
    },
    hi: {
      title: 'फोन को अपनी छाती पर कैसे रखें',
      step1: '1. अपने फोन के निचले माइक (चार्जिंग पोर्ट के पास) को देखें।',
      step2: '2. फोन के निचले हिस्से को अपनी नंगी छाती के ऊपरी हिस्से पर हल्के दबाव के साथ रखें (मोटे कपड़े हटा लें)।',
      step3: '3. शांत कमरे में बैठें और नाक से 3 बार गहरी सांस लें और मुंह से छोड़ें।',
      warning: 'रिकॉर्डिंग के दौरान बोलें या फोन को हिलाएं नहीं ताकि सही आवाज रिकॉर्ड हो सके।',
      voicePrompt: 'फोन के निचले माइक को अपनी छाती पर रखें और 3 बार गहरी सांस लें।'
    },
    kn: {
      title: 'ಫೋನ್ ಅನ್ನು ನಿಮ್ಮ ಎದೆಯ ಮೇಲೆ ಹೇಗೆ ಇರಿಸಬೇಕು',
      step1: '1. ನಿಮ್ಮ ಫೋನ್‌ನ ಕೆಳಗಿನ ಮೈಕ್ರೊಫೋನ್ ರಂಧ್ರವನ್ನು ಪತ್ತೆ ಮಾಡಿ (ಚಾರ್ಜಿಂಗ್ ಪೋರ್ಟ್ ಬಳಿ).',
      step2: '2. ಫೋನ್‌ನ ಕೆಳಭಾಗವನ್ನು ನಿಮ್ಮ ಬರಿ ಎದೆಯ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಇರಿಸಿ (ದಪ್ಪ ಬಟ್ಟೆಗಳನ್ನು ತಪ್ಪಿಸಿ).',
      step3: '3. ಶಾಂತ ಕೋಣೆಯಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ ಮತ್ತು 3 ಬಾರಿ ಆಳವಾದ ಉಸಿರನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.',
      warning: 'ರೆಕಾರ್ಡಿಂಗ್ ಸಮಯದಲ್ಲಿ ಮಾತನಾಡಬೇಡಿ ಅಥವಾ ಫೋನ್ ಅಲ್ಲಾಡಿಸಬೇಡಿ.',
      voicePrompt: 'ಫೋನ್‌ನ ಕೆಳಗಿನ ಮೈಕ್ರೊಫೋನ್ ಅನ್ನು ನಿಮ್ಮ ಎದೆಯ ಮೇಲಿರಿಸಿ ಆಳವಾಗಿ ಉಸಿರಾಡಿ.'
    },
    ta: {
      title: 'போனை மார்பில் எவ்வாறு வைப்பது',
      step1: '1. போனின் கீழ் பகுதியில் உள்ள மைக்ரோஃபோனைக் கண்டறியவும்.',
      step2: '2. போனின் அடிப்பகுதியை உங்கள் மேல் மார்பில் நேரடியாக வைக்கவும்.',
      step3: '3. அமைதியான இடத்தில் அமர்ந்து 3 முறை ஆழ்ந்து மூச்சு விடவும்.',
      warning: 'பதிவு செய்யும் போது பேசவோ போனை அசைக்கவோ வேண்டாம்.',
      voicePrompt: 'போனை மார்பில் வைத்து ஆழமாக மூச்சு விடுங்கள்.'
    },
    te: {
      title: 'ఫోన్‌ను ఛాతీపై ఎలా ఉంచాలి',
      step1: '1. మీ ఫోన్ దిగువన ఉన్న మైక్రోఫోన్ రంధ్రాన్ని గుర్తించండి.',
      step2: '2. ఫోన్ దిగువ భాగాన్ని మీ పై ఛాతీపై నేరుగా ఉంచండి.',
      step3: '3. ప్రశాంతమైన గదిలో కూర్చుని 3 సార్లు లోతుగా శ్వాస తీసుకోండి.',
      warning: 'రికార్డింగ్ సమయంలో మాట్లాడకండి లేదా ఫోన్ కదపకండి.',
      voicePrompt: 'ఫోన్‌ను ఛాతీపై ఉంచి లోతుగా శ్వాస తీసుకోండి.'
    },
    bn: {
      title: 'ফোনের নিচের মাইক কীভাবে বুকে রাখবেন',
      step1: '১. ফোনের নিচের মাইকটি চিহ্নিত করুন (চার্জিং পোর্টের পাশে)।',
      step2: '২. ফোনের নিচের অংশটি আপনার খালি বুকের ওপর আলতো করে চেপে ধরুন।',
      step3: '৩. শান্ত ঘরে বসে ৩ বার ধীরে ধীরে গভীর শ্বাস নিন।',
      warning: 'রেকর্ডিং চলাকালীন কথা বলবেন না বা ফোন নাড়াবেন না।',
      voicePrompt: 'ফোনের নিচের মাইকটি বুকে রাখুন এবং গভীর শ্বাস নিন।'
    },
    mr: {
      title: 'फोन छातीवर कसा ठेवावा',
      step1: '१. फोनचा खालचा मायक्रोफोन शोधा.',
      step2: '२. फोनचा खालचा भाग छातीवर थेट लावा.',
      step3: '३. शांत ठिकाणी बसा आणि ३ वेळा दीर्घ श्वास घ्या.',
      warning: 'रेकॉर्डिंग सुरू असताना बोलू नका.',
      voicePrompt: 'फोन छातीवर ठेवा आणि दीर्घ श्वास घ्या.'
    },
    gu: {
      title: 'ફોન છાતી પર કેવી રીતે રાખવો',
      step1: '૧. ફોનના નીચેના માઇક્રોફોનને શોધો.',
      step2: '૨. ફોનનો નીચેનો ભાગ છાતી પર સીધો લગાવો.',
      step3: '૩. શાંત ઓરડામાં બેસી ૩ વાર ઊંડા શ્વાસ લો.',
      warning: 'રેકોર્ડિંગ વખતે બોલશો નહીં.',
      voicePrompt: 'ફોન છાતી પર રાખો અને ઊંડા શ્વાસ લો.'
    },
    ml: {
      title: 'ഫോൺ നെഞ്ചിൽ എങ്ങനെ വയ്ക്കണം',
      step1: '1. ഫോണിന്റെ താഴെയുള്ള മൈക്രോഫോൺ കണ്ടെത്തുക.',
      step2: '2. ഫോണിന്റെ അടിഭാഗം നെഞ്ചിൽ ഉറപ്പിച്ചു വയ്ക്കുക.',
      step3: '3. ശാന്തമായിരുന്ന് 3 തവണ ദീർഘമായി ശ്വാസമെടുക്കുക.',
      warning: 'റെക്കോർഡിംഗ് സമയത്ത് സംസാരിക്കരുത്.',
      voicePrompt: 'ഫോൺ നെഞ്ചിൽ വച്ച് ദീർഘമായി ശ്വാസമെടുക്കുക.'
    },
    pa: {
      title: 'ਫੋਨ ਛਾਤੀ ਤੇ ਕਿਵੇਂ ਰੱਖਣਾ ਹੈ',
      step1: '1. ਫੋਨ ਦੇ ਹੇਠਲੇ ਮਾਈਕ੍ਰੋਫੋਨ ਨੂੰ ਲੱਭੋ।',
      step2: '2. ਫੋਨ ਦਾ ਹੇਠਲਾ ਹਿੱਸਾ ਸਿੱਧਾ ਛਾਤੀ ਤੇ ਰੱਖੋ।',
      step3: '3. ਸ਼ਾਂਤ ਕਮਰੇ ਵਿਚ ਬੈਠ ਕੇ 3 ਵਾਰ ਲੰਮੇ ਸਾਹ ਲਓ।',
      warning: 'ਰਿਕਾਰਡਿੰਗ ਦੌਰਾਨ ਬੋਲੋ ਨਾ।',
      voicePrompt: 'ਫੋਨ ਛਾਤੀ ਤੇ ਰੱਖ ਕੇ ਲੰਮੇ ਸਾਹ ਲਓ।'
    }
  },
  sclera: {
    en: {
      title: 'How to Capture Inner-Eyelid for Anemia Check',
      step1: '1. Stand in a well-lit area or turn on room lights.',
      step2: '2. With a clean thumb, gently pull down your lower eyelid to reveal the pink/red inner conjunctiva lining.',
      step3: '3. Look slightly upward into the camera lens and hold still for 3 seconds while flash illuminates.',
      warning: 'Do not touch inside the eye or press your eyeball.',
      voicePrompt: 'Gently pull down your lower eyelid and look slightly upward into the camera.'
    },
    hi: {
      title: 'एनीमिया जांच के लिए निचली पलक कैसे दिखाएं',
      step1: '1. अच्छी रोशनी वाले कमरे में खड़े हों।',
      step2: '2. साफ अंगूठे से अपनी निचली पलक को धीरे से नीचे खींचें ताकि अंदर का गुलाबी हिस्सा दिखे।',
      step3: '3. कैमरे के लेंस की तरफ थोड़ा ऊपर देखें और 3 सेकंड तक स्थिर रहें।',
      warning: 'आंख की पुतली को न छुएं, केवल नीचे की त्वचा को हल्के से खींचें।',
      voicePrompt: 'निचली पलक को धीरे से नीचे खींचें और कैमरे में ऊपर देखें।'
    },
    kn: {
      title: 'ರಕ್ತಹೀನತೆ ಪರೀಕ್ಷೆಗಾಗಿ ಕೆಳಗಿನ ಕಣ್ಣುರೆಪ್ಪೆಯನ್ನು ಹೇಗೆ ತೋರಿಸುವುದು',
      step1: '1. ಬೆಳಕಿರುವ ಕೋಣೆಯಲ್ಲಿ ನಿಂತುಕೊಳ್ಳಿ.',
      step2: '2. ಕೆಳಗಿನ ಕಣ್ಣುರೆಪ್ಪೆಯನ್ನು ನಿಧಾನವಾಗಿ ಕೆಳಗೆ ಎಳೆದು ಗುಲಾಬಿ ಭಾಗವನ್ನು ತೋರಿಸಿ.',
      step3: '3. ಕ್ಯಾಮೆರಾ ಕಡೆಗೆ ಮೇಲಕ್ಕೆ ನೋಡಿ 3 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಸ್ಥಿರವಾಗಿರಿ.',
      warning: 'ಕಣ್ಣಿನ ಒಳಭಾಗವನ್ನು ಮುಟ್ಟಬೇಡಿ.',
      voicePrompt: 'ಕೆಳಗಿನ ಕಣ್ಣುರೆಪ್ಪೆಯನ್ನು ನಿಧಾನವಾಗಿ ಕೆಳಗೆ ಎಳೆದು ಕ್ಯಾಮೆರಾವನ್ನು ನೋಡಿ.'
    },
    ta: {
      title: 'கண் இமையை எவ்வாறு காண்பிப்பது',
      step1: '1. நல்ல வெளிச்சத்தில் நில்லுங்கள்.',
      step2: '2. கீழ் கண் இமையை மெதுவாக கீழ்நோக்கி இழுக்கவும்.',
      step3: '3. கேமராவை நோக்கி மேலே பார்த்து 3 வினாடிகள் அசையாமல் இருங்கள்.',
      warning: 'கண்ணைத் தொடாதீர்கள்.',
      voicePrompt: 'கீழ் கண் இமையை மெதுவாக இழுத்து கேமராவைப் பாருங்கள்.'
    },
    te: {
      title: 'కనురెప్పను ఎలా చూపించాలి',
      step1: '1. మంచి వెలుతురులో నిలబడండి.',
      step2: '2. క్రింది కనురెప్పను మెల్లగా క్రిందికి లాగండి.',
      step3: '3. కెమెరా వైపు పైకి చూస్తూ 3 సెకన్లు స్థిరంగా ఉండండి.',
      warning: 'కంటిని తాకవద్దు.',
      voicePrompt: 'క్రింది కనురెప్పను మెల్లగా క్రిందికి లాగి కెమెరాను చూడండి.'
    },
    bn: {
      title: 'অ্যানিমিয়া পরীক্ষার জন্য চোখের পাতা কীভাবে দেখাবেন',
      step1: '১. পর্যাপ্ত আলোযুক্ত জায়গায় দাঁড়ান।',
      step2: '২. নিচের চোখের পাতা আলতো করে নিচের দিকে টানুন।',
      step3: '৩. ক্যামেরার দিকে ওপরের দিকে তাকান এবং ৩ সেকেন্ড স্থির থাকুন।',
      warning: 'চোখের ভেতর হাত দেবেন না।',
      voicePrompt: 'নিচের চোখের পাতা আলতো করে টানুন এবং ক্যামেরার দিকে তাকান।'
    },
    mr: {
      title: 'अ‍ॅनिमिया तपासणीसाठी पापणी कशी दाखवावी',
      step1: '१. चांगल्या प्रकाशात उभे राहा.',
      step2: '२. खालची पापणी हळूच खाली ओढा.',
      step3: '३. कॅमेऱ्याकडे वर पहा आणि ३ सेकंद स्थिर राहा.',
      warning: 'डोळ्याला स्पर्श करू नका.',
      voicePrompt: 'खालची पापणी हळूच खाली ओढा आणि कॅमेऱ्याकडे पहा.'
    },
    gu: {
      title: 'એનિમિયા તપાસ માટે પોપચું કેવી રીતે બતાવવું',
      step1: '૧. સારા પ્રકાશવાળી જગ્યાએ ઊભા રહો.',
      step2: '૨. નીચેનું પોપચું ધીમેથી નીચે ખેંચો.',
      step3: '૩. કેમેરા તરફ ઉપર જુઓ અને ૩ સેકન્ડ સ્થિર રહો.',
      warning: 'આંખની અંદર અડશો નહીં.',
      voicePrompt: 'નીચેનું પોપચું ધીમેથી નીચે ખેંચો અને કેમેરા સામે જુઓ.'
    },
    ml: {
      title: 'വിളർച്ച പരിശോധനയ്ക്ക് കൺപോള എങ്ങനെ കാണിക്കണം',
      step1: '1. നല്ല വെളിച്ചമുള്ള സ്ഥലത്ത് നിൽക്കുക.',
      step2: '2. താഴത്തെ കൺപോള പതുക്കെ താഴേക്ക് വലിക്കുക.',
      step3: '3. ക്യാമറയിലേക്ക് മുകളിലേക്ക് നോക്കി 3 സെക്കൻഡ് അനങ്ങാതെ നിൽക്കുക.',
      warning: 'കണ്ണിനുള്ളിൽ തൊടരുത്.',
      voicePrompt: 'താഴത്തെ കൺപോള പതുക്കെ താഴേക്ക് വലിച്ച് ക്യാമറയിൽ നോക്കുക.'
    },
    pa: {
      title: 'ਅਨੀਮੀਆ ਜਾਂਚ ਲਈ ਅੱਖ ਕਿਵੇਂ ਦਿਖਾਉਣੀ ਹੈ',
      step1: '1. ਚੰਗੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਖੜ੍ਹੋ।',
      step2: '2. ਹੇਠਲੀ ਪਲਕ ਨੂੰ ਹੌਲੀ ਜਿਹੇ ਹੇਠਾਂ ਖਿੱਚੋ।',
      step3: '3. ਕੈਮਰੇ ਵੱਲ ਉੱਪਰ ਦੇਖੋ ਅਤੇ 3 ਸਕਿੰਟ ਸਥਿਰ ਰਹੋ।',
      warning: 'ਅੱਖ ਨੂੰ ਨਾ ਛੂਹੋ।',
      voicePrompt: 'ਹੇਠਲੀ ਪਲਕ ਹੌਲੀ ਜਿਹੇ ਹੇਠਾਂ ਖਿੱਚੋ ਅਤੇ ਕੈਮਰੇ ਵੱਲ ਦੇਖੋ।'
    }
  },
  ppg: {
    en: {
      title: 'How to Place Your Finger for Heart Rate & SpO2',
      step1: '1. Place the tip of your index finger gently over the rear camera lens & flash.',
      step2: '2. Use a feather-light touch — DO NOT press hard against the glass.',
      step3: '3. Hold steady for 10 seconds while the red light illuminates through your pulse.',
      warning: 'Pressing too hard cuts off blood flow and ruins the reading. Keep touch gentle.',
      voicePrompt: 'Place your index finger lightly over the camera lens. Do not press hard.'
    },
    hi: {
      title: 'दिल की धड़कन और ऑक्सीजन के लिए उंगली कैसे रखें',
      step1: '1. अपनी तर्जनी उंगली (पहली उंगली) के पोर को पीछे के कैमरे और फ्लैश पर हल्के से रखें।',
      step2: '2. बिल्कुल हल्का स्पर्श रखें — शीशे पर ज़ोर से न दबाएं।',
      step3: '3. 10 सेकंड तक उंगली को स्थिर रखें जब तक लाल रोशनी से नब्ज पढ़ी न जाए।',
      warning: 'ज़्यादा दबाने से खून का बहाव रुक जाता है और गलत परिणाम आता है। हल्का छुएं।',
      voicePrompt: 'उंगली को कैमरे पर बिल्कुल हल्के से रखें। ज़ोर से न दबाएं।'
    },
    kn: {
      title: 'ಹೃದಯ ಬಡಿತ ಮತ್ತು SpO2 ಗಾಗಿ ಬೆರಳನ್ನು ಹೇಗೆ ಇರಿಸಬೇಕು',
      step1: '1. ನಿಮ್ಮ ತೋರುಬೆರಳನ್ನು ಹಿಂದಿನ ಕ್ಯಾಮೆರಾ ಮತ್ತು ಫ್ಲ್ಯಾಶ್ ಮೇಲೆ ನಿಧಾನವಾಗಿ ಇರಿಸಿ.',
      step2: '2. ಹಗುರವಾದ ಸ್ಪರ್ಶವನ್ನು ಬಳಸಿ - ಬಲವಾಗಿ ಒತ್ತಬೇಡಿ.',
      step3: '3. 10 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಬೆರಳನ್ನು ಅಲ್ಲಾಡಿಸದೆ ಇರಿಸಿ.',
      warning: 'ಬಲವಾಗಿ ಒತ್ತುವುದರಿಂದ ರಕ್ತ ಪರಿಚಲನೆ ನಿಲ್ಲುತ್ತದೆ. ಹಗುರವಾಗಿ ಮುಟ್ಟಿ.',
      voicePrompt: 'ಬೆರಳನ್ನು ಕ್ಯಾಮೆರಾದ ಮೇಲೆ ಹಗುರವಾಗಿ ಇರಿಸಿ. ಬಲವಾಗಿ ಒತ್ತಬೇಡಿ.'
    },
    ta: {
      title: 'இதய துடிப்புக்கு விரலை எவ்வாறு வைப்பது',
      step1: '1. ஆள்காட்டி விரலை கேமரா மற்றும் ஃபிளாஷ் மீது மெதுவாக வைக்கவும்.',
      step2: '2. லேசாக தொடவும் - கடினமாக அழுத்த வேண்டாம்.',
      step3: '3. 10 வினாடிகள் அசையாமல் இருங்கள்.',
      warning: 'அழுத்தினால் ரத்த ஓட்டம் தடைபடும். மெதுவாகத் தொடவும்.',
      voicePrompt: 'விரலை கேமரா மீது மெதுவாக வைக்கவும். அழுத்த வேண்டாம்.'
    },
    te: {
      title: 'హృదయ స్పందన కోసం వేలిని ఎలా ఉంచాలి',
      step1: '1. మీ చూపుడు వేలిని వెనుక కెమెరా మరియు ఫ్లాష్‌పై మెల్లగా ఉంచండి.',
      step2: '2. తేలికపాటి స్పర్శను ఉపయోగించండి - గట్టిగా నొక్కవద్దు.',
      step3: '3. 10 సెకన్ల పాటు స్థిరంగా ఉంచండి.',
      warning: 'గట్టిగా నొక్కితే రక్త ప్రసరణ ఆగిపోతుంది.',
      voicePrompt: 'వేలిని కెమెరాపై తేలికగా ఉంచండి. గట్టిగా నొక్కవద్దు.'
    },
    bn: {
      title: 'হার্ট রেট ও অক্সিজেনের জন্য আঙুল কীভাবে রাখবেন',
      step1: '১. আপনার তর্জনী আঙুলটি পেছনের ক্যামেরা ও ফ্ল্যাশের ওপর আলতো করে রাখুন।',
      step2: '২. খুব হালকা চাপ দিন — বেশি জোরে চাপবেন না।',
      step3: '৩. ১০ সেকেন্ডের জন্য আঙুলটি স্থির রাখুন।',
      warning: 'বেশি জোরে চাপলে রক্তপ্রবাহ ব্যাহত হয় এবং ভুল রিডিং আসে।',
      voicePrompt: 'আঙুলটি ক্যামেরার ওপর হালকা করে রাখুন। বেশি চাপবেন না।'
    },
    mr: {
      title: 'हृदय गतीसाठी बोट कसे ठेवावे',
      step1: '१. तुमचे पहिले बोट कॅमेरा आणि फ्लॅशवर हळूच ठेवा.',
      step2: '२. खूप हलका स्पर्श ठेवा - जोरात दाबू नका.',
      step3: '३. १० सेकंद बोट स्थिर ठेवा.',
      warning: 'जास्त दाबल्यास चुकीचे रिडींग येते.',
      voicePrompt: 'बोट कॅमेऱ्यावर हलकेच ठेवा. जोरात दाबू नका.'
    },
    gu: {
      title: 'હૃદયના ધબકારા માટે આંગળી કેવી રીતે રાખવી',
      step1: '૧. તમારી પહેલી આંગળી પાછળના કેમેરા અને ફ્લેશ પર હળવેથી મૂકો.',
      step2: '૨. ખૂબ હળવો સ્પર્શ રાખો - જોરથી દબાવશો નહીં.',
      step3: '૩. ૧૦ સેકન્ડ સુધી આંગળી સ્થિર રાખો.',
      warning: 'વધારે દબાવવાથી ખોટું પરિણામ આવે છે.',
      voicePrompt: 'આંગળી કેમેરા પર હળવેથી મૂકો. જોરથી દબાવશો નહીં.'
    },
    ml: {
      title: 'ഹൃദയമിടിപ്പ് പരിശോധിക്കാൻ വിരൽ എങ്ങനെ വയ്ക്കണം',
      step1: '1. ചൂണ്ടുവിരൽ പിൻ ക്യാമറയ്ക്കും ഫ്ലാഷിനും മുകളിൽ പതുക്കെ വയ്ക്കുക.',
      step2: '2. മൃദുവായി തൊടുക - ശക്തിയായി അമർത്തരുത്.',
      step3: '3. 10 സെക്കൻഡ് വിരൽ മാറ്റാതെ വയ്ക്കുക.',
      warning: 'ശക്തിയായി അമർത്തിയാൽ തെറ്റായ ഫലം വരും.',
      voicePrompt: 'വിരൽ ക്യാമറയ്ക്ക് മുകളിൽ മൃദുവായി വയ്ക്കുക.'
    },
    pa: {
      title: 'ਦਿਲ ਦੀ ਧੜਕਣ ਲਈ ਉਂਗਲੀ ਕਿਵੇਂ ਰੱਖਣੀ ਹੈ',
      step1: '1. ਆਪਣੀ ਪਹਿਲੀ ਉਂਗਲੀ ਪਿਛਲੇ ਕੈਮਰੇ ਅਤੇ ਫਲੈਸ਼ ਤੇ ਹੌਲੀ ਜਿਹੇ ਰੱਖੋ।',
      step2: '2. ਬਿਲਕੁਲ ਹਲਕਾ ਛੂਹੋ - ਜ਼ੋਰ ਨਾਲ ਨਾ ਦਬਾਓ।',
      step3: '3. 10 ਸਕਿੰਟ ਲਈ ਉਂਗਲੀ ਸਥਿਰ ਰੱਖੋ।',
      warning: 'ਜ਼ੋਰ ਨਾਲ ਦਬਾਉਣ ਨਾਲ ਗਲਤ ਨਤੀਜਾ ਆਉਂਦਾ ਹੈ।',
      voicePrompt: 'ਉਂਗਲੀ ਕੈਮਰੇ ਤੇ ਹਲਕਾ ਜਿਹਾ ਰੱਖੋ।'
    }
  }
};

export function HumanAnatomyGuide({ guideType, lang, onReadyToStart, onClose }: HumanAnatomyGuideProps) {
  const content = GUIDE_CONTENT[guideType][lang] || GUIDE_CONTENT[guideType].en;
  const langConfig = SUPPORTED_INDIAN_LANGUAGES[lang] || SUPPORTED_INDIAN_LANGUAGES.en;

  const speakGuide = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content.voicePrompt);
    utterance.lang = langConfig.speechCode;
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="max-w-lg w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-700">
              {guideType === 'stethoscope' && <Stethoscope className="h-6 w-6" />}
              {guideType === 'sclera' && <Eye className="h-6 w-6" />}
              {guideType === 'ppg' && <HeartPulse className="h-6 w-6 text-rose-600" />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                Human Guide &bull; {langConfig.nativeName}
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug mt-0.5">{content.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 text-xl font-bold">
            <X size={20} />
          </button>
        </div>

        {/* Audio Prompt Button */}
        <button
          onClick={speakGuide}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <Volume2 className="h-4 w-4 text-sky-600" />
          <span>Listen to Voice Instructions in {langConfig.nativeName}</span>
        </button>

        {/* Steps List */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-sans leading-relaxed text-slate-800">
          <p className="font-medium flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{content.step1}</span>
          </p>
          <p className="font-medium flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{content.step2}</span>
          </p>
          <p className="font-medium flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{content.step3}</span>
          </p>
        </div>

        {/* Warning Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Important Tip:</strong> {content.warning}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onReadyToStart();
            onClose();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>I'm Ready, Start Test</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
