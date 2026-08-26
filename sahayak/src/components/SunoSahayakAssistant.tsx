import { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  User,
  Send,
} from 'lucide-react';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  advice?: {
    severity: 'normal' | 'caution' | 'urgent';
    steps: string[];
    medAdvice?: string;
  };
}

const COMMON_QUERIES: Record<SupportedLangCode, { label: string; query: string; response: string; steps: string[] }[]> = {
  hi: [
    {
      label: '🫁 सीने में जकड़न व सांस फूलना',
      query: 'सीने में जकड़न है और सांस लेने में घरघराहट हो रही है।',
      response: 'यह ब्रोंकियल स्पैस्म या अस्थमा का लक्षण हो सकता है। शांत रहें और मरीज को सीधा बैठाएं।',
      steps: [
        '1. यदि डॉक्टर ने इनहेलर (Asthalin / Budecort) दिया है, तो तुरंत 2 पफ लें।',
        '2. गर्दन और छाती के कपड़े ढीले करें और ताजी हवा आने दें।',
        '3. यदि 15 मिनट में आराम न मिले या होंठ नीले पड़ें, तुरंत 108 पर कॉल करें।',
      ],
    },
    {
      label: '💊 बीपी व शुगर की सस्ती जेनरिक दवा',
      query: 'डायबिटीज और ब्लड प्रेशर की सस्ती जन औषधि दवा बताएं।',
      response: 'पीएम जन औषधि केंद्रों पर ब्रांडेड दवाओं के मुकाबले 80-90% कम कीमत पर उच्च गुणवत्ता वाली जेनरिक दवाएं उपलब्ध हैं।',
      steps: [
        '1. Glycomet 500mg का जेनरिक: Metformin 500mg (मात्र ₹7 प्रति 10 टैबलेट)।',
        '2. Telma 40mg का जेनरिक: Telmisartan 40mg (मात्र ₹12 प्रति 10 टैबलेट)।',
        '3. डॉक्टर के पर्चे के साथ नजदीकी जन औषधि केंद्र पर जाएं।',
      ],
    },
    {
      label: '👁️ आंखें पीली व कमजोरी (पीलिया/एनीमिया)',
      query: 'आंखों में पीलापन है और बहुत ज्यादा चक्कर आ रहे हैं।',
      response: 'यह बिलीरुबिन बढ़ने (पीलिया/Jaundice) या हीमोग्लोबिन की भारी कमी (एनीमिया) का संकेत हो सकता है।',
      steps: [
        '1. ऐप के "Vitals & Steth" सेक्शन में जाकर Sclera Eye Scan करें।',
        '2. तैलीय व गरिष्ठ भोजन से बचें और उबला हुआ पानी व नारियल पानी पिएं।',
        '3. प्राथमिक स्वास्थ्य केंद्र (PHC) जाकर LFT (Liver Function Test) और CBC कराएं।',
      ],
    },
  ],
  en: [
    {
      label: '🫁 Breathlessness & Wheeze',
      query: 'I have chest tightness and difficulty breathing.',
      response: 'This may indicate bronchial wheeze or asthma. Stay calm and sit upright.',
      steps: [
        '1. Administer 2 puffs of prescribed inhaler (e.g. Salbutamol) if available.',
        '2. Loosen tight clothing around chest and ensure good ventilation.',
        '3. If symptoms persist beyond 15 minutes or lips turn pale/blue, call 108/112 immediately.',
      ],
    },
    {
      label: '💊 Affordable Generic Medicines',
      query: 'What are affordable generic substitutes for BP and Diabetes?',
      response: 'Government PM Jan Aushadhi Kendras provide certified generic salts at 80–90% lower prices.',
      steps: [
        '1. Metformin 500mg replaces Glycomet 500mg for ₹7/strip.',
        '2. Telmisartan 40mg replaces Telma 40mg for ₹12/strip.',
        '3. Present your prescription at any Jan Aushadhi Kendra.',
      ],
    },
    {
      label: '👁️ Yellowish Eyes & Fatigue',
      query: 'My eyes look pale/yellow and I feel dizzy.',
      response: 'This indicates possible elevated bilirubin (Jaundice) or low hemoglobin (Anemia).',
      steps: [
        '1. Use our Sclera Optical Scanner in the Vitals tab for colorimetry screening.',
        '2. Avoid fatty meals; stay well hydrated with boiled water and electrolytes.',
        '3. Visit your nearest PHC for a formal CBC and Liver Function Test (LFT).',
      ],
    },
  ],
  kn: [
    {
      label: '🫁 ಉಸಿರಾಟದ ತೊಂದರೆ ಮತ್ತು ಎದೆ ಬಿಗಿತ',
      query: 'ಎದೆಯಲ್ಲಿ ಬಿಗಿತ ಮತ್ತು ಉಸಿರಾಟದಲ್ಲಿ ತೊಂದರೆ ಇದೆ.',
      response: 'ಇದು ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ಆಸ್ತಮಾದ ಲಕ್ಷಣವಾಗಿರಬಹುದು. ನೆಟ್ಟಗೆ ಕುಳಿತುಕೊಳ್ಳಿ.',
      steps: [
        '1. ವೈದ್ಯರು ಸೂಚಿಸಿದ ಇನ್ಹೇಲರ್ ಇದ್ದರೆ 2 ಪಫ್ ತೆಗೆದುಕೊಳ್ಳಿ.',
        '2. ಎದೆಯ ಬಟ್ಟೆಯನ್ನು ಸಡಿಲಗೊಳಿಸಿ.',
        '3. 15 ನಿಮಿಷಗಳಲ್ಲಿ ಸುಧಾರಿಸದಿದ್ದರೆ 108 ಗೆ ಕರೆ ಮಾಡಿ.',
      ],
    },
    {
      label: '💊 ಬಿಪಿ ಮತ್ತು ಸಕ್ಕರೆ ಕಾಯಿಲೆಗೆ ಜೆನೆರಿಕ್ ಔಷಧಿ',
      query: 'ಬಿಪಿ ಮತ್ತು ಮಧುಮೇಹಕ್ಕೆ ಜನೌಷಧಿ ಜೆನೆರಿಕ್ ಔಷಧಿ ತಿಳಿಸಿ.',
      response: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನೌಷಧಿ ಕೇಂದ್ರಗಳಲ್ಲಿ 80-90% ಕಡಿಮೆ ದರದಲ್ಲಿ ಔಷಧಿಗಳು ಲಭ್ಯವಿವೆ.',
      steps: [
        '1. ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg ₹7 ಕ್ಕೆ ಲಭ್ಯ.',
        '2. ಟೆಲ್ಮಿಸಾರ್ಟನ್ 40mg ₹12 ಕ್ಕೆ ಲಭ್ಯ.',
        '3. ವೈದ್ಯರ ಚೀಟಿಯೊಂದಿಗೆ ಹತ್ತಿರದ ಜನೌಷಧಿ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
      ],
    },
    {
      label: '👁️ ಕಣ್ಣುಗಳು ಹಳದಿಯಾಗುವುದು ಮತ್ತು ಆಯಾಸ',
      query: 'ಕಣ್ಣುಗಳು ಹಳದಿಯಾಗಿವೆ ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆ ಇದೆ.',
      response: 'ಇದು ಜಾಂಡೀಸ್ ಅಥವಾ ರಕ್ತಹೀನತೆಯ ಲಕ್ಷಣವಾಗಿರಬಹುದು.',
      steps: [
        '1. ಸ್ಕ್ಲೆರಾ ಸ್ಕ್ಯಾನ್ ಮೂಲಕ ಕಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾಡಿ.',
        '2. ಶುದ್ಧ ಕುದಿಸಿದ ನೀರನ್ನು ಕುಡಿಯಿರಿ.',
        '3. ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
      ],
    },
  ],
  ta: [
    {
      label: '🫁 மூச்சுத் திணறல் & நெஞ்சு இறுக்கம்',
      query: 'நெஞ்சு இறுக்கம் மற்றும் மூச்சு திணறல் உள்ளது.',
      response: 'இது ஆஸ்துமா அல்லது மூச்சுக்குழாய் அழற்சியின் அறிகுறியாக இருக்கலாம்.',
      steps: [
        '1. மருத்துவர் பரிந்துரைத்த இன்ஹேலரை உடனே பயன்படுத்தவும்.',
        '2. இறுக்கமான ஆடைகளைத் தளர்த்தவும்.',
        '3. நிலைமை தொடர்ந்தால் உடனடியாக 108 அழைக்கவும்.',
      ],
    },
    {
      label: '💊 மலிவு விலை ஜெனரிக் மருந்துகள்',
      query: 'சர்க்கரை மற்றும் ரத்த அழுத்தத்திற்கான குறைந்த விலை மருந்துகள் எவை?',
      response: 'ஜன் அவுஷதி மையங்களில் 80-90% வரை மலிவாக மருந்துகள் கிடைக்கின்றன.',
      steps: [
        '1. மெட்பார்மின் 500 மிகி வெறும் ₹7 மட்டுமே.',
        '2. டெல்மிசார்டன் 40 மிகி வெறும் ₹12 மட்டுமே.',
        '3. உங்கள் மருத்துவரின் மருந்துச் சீட்டைக் கொண்டு செல்லுங்கள்.',
      ],
    },
    {
      label: '👁️ கண்கள் மஞ்சள் & சோர்வு',
      query: 'கண்கள் மஞ்சளாக உள்ளன மற்றும் மயக்கம் வருகிறது.',
      response: 'இது மஞ்சள் காமாலை அல்லது இரத்த சோகையின் அறிகுறியாக இருக்கலாம்.',
      steps: [
        '1. பயன்பாட்டின் கண் ஸ்கேன் மூலம் பரிசோதிக்கவும்.',
        '2. எண்ணெய் உணவுகளைத் தவிர்த்து நீர்ச்சத்து அதிகம் உட்கொள்ளவும்.',
        '3. அரசு மருத்துவமனைக்குச் சென்று ரத்தப் பரிசோதனை செய்யவும்.',
      ],
    },
  ],
  te: [
    {
      label: '🫁 శ్వాస తీసుకోవడంలో ఇబ్బంది',
      query: 'ఛాతీలో బిగుతుగా ఉండి శ్వాస ఆడటం లేదు.',
      response: 'ఇది ఆస్తమా లేదా శ్వాసకోశ సమస్య కావచ్చు. నిటారుగా కూర్చోండి.',
      steps: [
        '1. డాక్టర్ సూచించిన ఇన్హేలర్ ఉంటే 2 పఫ్స్ తీసుకోండి.',
        '2. వదులుగా ఉండే బట్టలు ధరించండి.',
        '3. వెంటనే 108 కు కాల్ చేయండి.',
      ],
    },
    {
      label: '💊 తక్కువ ధరకే జెనరిక్ మందులు',
      query: 'బీపీ మరియు షుగర్ కోసం చవకైన మందులు ఏమిటి?',
      response: 'జన్ ఔషధి కేంద్రాల్లో 80-90% తక్కువ ధరకే మందులు లభిస్తాయి.',
      steps: [
        '1. మెట్‌ఫార్మిన్ 500mg కేవలం ₹7.',
        '2. టెల్మిసార్టన్ 40mg కేవలం ₹12.',
        '3. ప్రిస్క్రిప్షన్‌తో జన్ ఔషధి కేంద్రాన్ని సందర్శించండి.',
      ],
    },
    {
      label: '👁️ కళ్ళు పసుపు రంగు & నీరసం',
      query: 'కళ్ళు పసుపుగా మారి కళ్ళు తిరుగుతున్నాయి.',
      response: 'ఇది కామెర్లు లేదా రక్తహీనత లక్షణం కావచ్చు.',
      steps: [
        '1. యాప్‌లోని కంటి స్కాన్ ద్వారా తనిఖీ చేయండి.',
        '2. ఉడికించిన నీరు త్రాగండి.',
        '3. ప్రభుత్వ ఆసుపత్రికి వెళ్లి ఎల్‌ఎఫ్‌టీ పరీక్ష చేయించుకోండి.',
      ],
    },
  ],
  bn: [
    {
      label: '🫁 শ্বাসকষ্ট ও বুকে চাপ',
      query: 'বুকে চাপ এবং শ্বাস নিতে কষ্ট হচ্ছে।',
      response: 'এটি ব্রঙ্কিয়াল হাঁপানির লক্ষণ হতে পারে। রোগীকে সোজা করে বসান।',
      steps: [
        '1. ডাক্তারের দেওয়া ইনহেলার অবিলম্বে ব্যবহার করুন।',
        '2. গলার কাপড় আলগা করে দিন।',
        '3. উপশম না হলে ১০৮ নম্বরে ফোন করুন।',
      ],
    },
    {
      label: '💊 কম দামের জেনেরিক ওষুধ',
      query: 'ডায়াবেটিস এবং রক্তচাপের সস্তা ওষুধ কি?',
      response: 'জন ঔষধি কেন্দ্রে ৮০-৯০% কম দামে জেনেরিক ওষুধ পাওয়া যায়।',
      steps: [
        '1. মেটফর্মিন ৫০০ মিগ্রা মাত্র ₹৭।',
        '2. টেলমিসারটান ৪০ মিগ্রা মাত্র ₹১২।',
        '3. ডাক্তারের প্রেসক্রিপশন নিয়ে জন ঔষধি কেন্দ্রে যান।',
      ],
    },
    {
      label: '👁️ চোখ হলুদ ও দুর্বলতা',
      query: 'চোখ হলুদ লাগছে এবং মাথা ঘুরছে।',
      response: 'এটি জন্ডিস বা রক্তস্বল্পতার লক্ষণ হতে পারে।',
      steps: [
        '1. অ্যাপের স্ক্লেরা স্ক্যান ব্যবহার করুন।',
        '2. প্রচুর জল এবং তরল খাবার খান।',
        '3. নিকটস্থ স্বাস্থ্যকেন্দ্রে গিয়ে রক্ত পরীক্ষা করান।',
      ],
    },
  ],
  mr: [
    {
      label: '🫁 छातीत जडपणा आणि दम लागणे',
      query: 'छातीत जडपणा आहे आणि श्वास घ्यायला त्रास होतोय.',
      response: 'हे दम्याचे किंवा ब्रोन्कियल इन्फेक्शनचे लक्षण असू शकते. सरळ बसा.',
      steps: [
        '1. डॉक्टरांनी दिलेला इनहेलर लगेच वापरा.',
        '2. गळ्याभोवतीचे कपडे सैल करा.',
        '3. आराम न पडल्यास १०८ वर कॉल करा.',
      ],
    },
    {
      label: '💊 स्वस्त जेनेरिक औषधे',
      query: 'बीपी आणि मधुमेहाची स्वस्त औषधे कोणती?',
      response: 'जन औषधी केंद्रांवर ८०-९0% कमी किमतीत जेनेरिक औषधे उपलब्ध आहेत.',
      steps: [
        '1. मेटफॉर्मिन ५०० मिग्रॅ फक्त ₹७ ला.',
        '2. टेल्मिसार्टन ४० मिग्रॅ फक्त ₹१२ ला.',
        '3. डॉक्टरांच्या चिठ्ठीसह जन औषधी केंद्राला भेट द्या.',
      ],
    },
    {
      label: '👁️ डोळे पिवळे आणि अशक्तपणा',
      query: 'डोळे पिवळे झाले आहेत आणि चक्कर येत आहे.',
      response: 'हे कावीळ किंवा ॲनिमियाचे लक्षण असू शकते.',
      steps: [
        '1. ॲपमध्ये डोळ्यांचे स्कॅनिंग करा.',
        '2. उकळलेले पाणी प्या आणि तेलकट अन्न टाळा.',
        '3. प्राथमिक आरोग्य केंद्रात जाऊन तपासणी करा.',
      ],
    },
  ],
  gu: [
    {
      label: '🫁 શ્વાસ લેવામાં તકલીફ',
      query: 'છાતીમાં ભાર લાગે છે અને શ્વાસ ચડે છે.',
      response: 'આ અસ્થમા અથવા શ્વાસનળીની સમસ્યા હોઈ શકે છે. સીધા બેસો.',
      steps: [
        '1. ડોક્ટરે આપેલ ઇન્હેલર તાત્કાલિક લો.',
        '2. ગળાના કપડાં ઢીલા કરો.',
        '3. તરત જ ૧૦૮ પર કોલ કરો.',
      ],
    },
    {
      label: '💊 સસ્તી જેનેરિક દવાઓ',
      query: 'બીપી અને ડાયાબિટીસની સસ્તી જેનેરિક દવા જણાવો.',
      response: 'જન ઔષધિ કેન્દ્રો પર ૮૦-૯૦% ઓછા ભાવે જેનેરિક દવાઓ મળે છે.',
      steps: [
        '1. મેટફોર્મિન ૫૦૦ એમજી માત્ર ₹૭ માં.',
        '2. ટેલ્મિસાર્ટન ૪૦ એમજી માત્ર ₹૧૨ માં.',
        '3. પ્રિસ્ક્રિપ્શન સાથે જન ઔષધિ કેન્દ્રની મુલાકાત લો.',
      ],
    },
    {
      label: '👁️ આંખો પીળી અને ચક્કર',
      query: 'આંખો પીળી દેખાય છે અને ચક્કર આવે છે.',
      response: 'આ કમળો અથવા એનિમિયાનું લક્ષણ હોઈ શકે છે.',
      steps: [
        '1. સ્ક્લેરા સ્કેન વડે તપાસ કરો.',
        '2. ઉકાળેલું પાણી પીવો.',
        '3. નજીકના પ્રાથમિક આરોગ્ય કેન્દ્રમાં તપાસ કરાવો.',
      ],
    },
  ],
  ml: [
    {
      label: '🫁 ശ്വാസതടസ്സവും നെഞ്ചുവേദനയും',
      query: 'ശ്വാസമെടുക്കാൻ ബുദ്ധിമുട്ടും നെഞ്ചിൽ ഭാരവും തോന്നുന്നു.',
      response: 'ഇത് ആസ്ത്മയുടെ ലക്ഷണമാകാം. നേരെ ഇരിക്കുക.',
      steps: [
        '1. ഡോക്ടർ നിർദ്ദേശിച്ച ഇൻഹേലർ ഉപയോഗിക്കുക.',
        '2. ഇറുകിയ വസ്ത്രങ്ങൾ അയക്കുക.',
        '3. ഉടൻ 108 വിളിക്കുക.',
      ],
    },
    {
      label: '💊 വിലകുറഞ്ഞ ജനറിക് മരുന്നുകൾ',
      query: 'പ്രമേഹത്തിനും പ്രഷറിനും കുറഞ്ഞ വിലയ്ക്കുള്ള മരുന്നുകൾ ഏതാണ്?',
      response: 'ജൻ ഔഷധി കേന്ദ്രങ്ങളിൽ 80-90% വിലക്കുറവിൽ മരുന്നുകൾ ലഭിക്കും.',
      steps: [
        '1. മെറ്റ്ഫോർമിൻ 500mg വെറും ₹7.',
        '2. ടെൽമിസാർട്ടൻ 40mg വെറും ₹12.',
        '3. ഡോക്ടറുടെ കുറിപ്പടിയുമായി ജൻ ഔഷധി കേന്ദ്രത്തിൽ പോകുക.',
      ],
    },
    {
      label: '👁️ കണ്ണുകൾ മഞ്ഞനിറമാകലും ക്ഷീണവും',
      query: 'കണ്ണുകളിൽ മഞ്ഞനിറവും തലകറക്കവും തോന്നുന്നു.',
      response: 'ഇത് മഞ്ഞപ്പിത്തത്തിന്റെയോ അനീമിയയുടെയോ ലക്ഷണമാകാം.',
      steps: [
        '1. ആപ്പിൽ കണ്ണ് സ്കാൻ ചെയ്യുക.',
        '2. തിളപ്പിച്ചാറിയ വെള്ളം കുടിക്കുക.',
        '3. അടുത്തുള്ള പ്രാഥമികാരോഗ്യ കേന്ദ്രത്തിൽ പരിശോധിക്കുക.',
      ],
    },
  ],
  pa: [
    {
      label: '🫁 ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼',
      query: 'ਛਾਤੀ ਵਿੱਚ ਭਾਰਾਪਣ ਹੈ ਅਤੇ ਸਾਹ ਚੜ੍ਹ ਰਿਹਾ ਹੈ।',
      response: 'ਇਹ ਅਸਥਮਾ ਦਾ ਲੱਛਣ ਹੋ ਸਕਦਾ ਹੈ। ਮਰੀਜ਼ ਨੂੰ ਸਿੱਧਾ ਬਿਠਾਓ।',
      steps: [
        '1. ਡਾਕਟਰ ਵੱਲੋਂ ਦੱਸਿਆ ਇਨਹੇਲਰ ਲਓ।',
        '2. ਕੱਪੜੇ ਢਿੱਲੇ ਕਰੋ ਅਤੇ ਤਾਜ਼ੀ ਹਵਾ ਆਉਣ ਦਿਓ।',
        '3. ਤੁਰੰਤ 108 ਤੇ ਕਾਲ ਕਰੋ।',
      ],
    },
    {
      label: '💊 ਸਸਤੀਆਂ ਜੈਨਰਿਕ ਦਵਾਈਆਂ',
      query: 'ਸ਼ੂਗਰ ਅਤੇ ਬੀਪੀ ਦੀਆਂ ਸਸਤੀਆਂ ਦਵਾਈਆਂ ਕਿਹੜੀਆਂ ਹਨ?',
      response: 'ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰਾਂ ਤੇ 80-90% ਸਸਤੀਆਂ ਦਵਾਈਆਂ ਉਪਲਬਧ ਹਨ।',
      steps: [
        '1. ਮੈਟਫਾਰਮਿਨ 500mg ਸਿਰਫ਼ ₹7 ਵਿੱਚ।',
        '2. ਟੈਲਮੀਸਾਰਟਨ 40mg ਸਿਰਫ਼ ₹12 ਵਿੱਚ।',
        '3. ਨੇੜਲੇ ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਜਾਓ।',
      ],
    },
    {
      label: '👁️ ਅੱਖਾਂ ਪੀਲੀਆਂ ਅਤੇ ਕਮਜ਼ੋਰੀ',
      query: 'ਅੱਖਾਂ ਪੀਲੀਆਂ ਹਨ ਅਤੇ ਚੱਕਰ ਆ ਰਹੇ ਹਨ।',
      response: 'ਇਹ ਪੀਲੀਆ ਜਾਂ ਅਨੀਮੀਆ ਦਾ ਲੱਛਣ ਹੋ ਸਕਦਾ ਹੈ।',
      steps: [
        '1. ਐਪ ਵਿੱਚ ਅੱਖਾਂ ਦਾ ਸਕੈਨ ਕਰੋ।',
        '2. ਉਬਲਿਆ ਪਾਣੀ ਪੀਓ।',
        '3. ਹਸਪਤਾਲ ਜਾ ਕੇ ਖੂਨ ਦੀ ਜਾਂਚ ਕਰਵਾਓ।',
      ],
    },
  ],
};

export function SunoSahayakAssistant() {
  const [activeLang, setActiveLang] = useState<SupportedLangCode>('hi');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: 'नमस्ते! मैं "सुनो सहायक" (Suno Sahayak) हूँ — आपकी मातृभाषा में आपका व्यक्तिगत स्वास्थ्य साथी। आप किसी भी लक्षण या दवा के बारे में पूछ सकते हैं।',
      advice: {
        severity: 'normal',
        steps: [
          '🗣️ बोलकर पूछें (Tap mic to speak)',
          '⚡ नीचे दिए गए सामान्य प्रश्नों पर टैप करें',
          '🔊 किसी भी उत्तर को अपनी भाषा में सुनें',
        ],
      },
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const currentQueries = COMMON_QUERIES[activeLang] || COMMON_QUERIES.hi;
  const currentLangConfig = SUPPORTED_INDIAN_LANGUAGES[activeLang] || SUPPORTED_INDIAN_LANGUAGES.hi;

  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLangConfig.speechCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleQueryClick = (q: { query: string; response: string; steps: string[] }) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q.query,
    };
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      sender: 'assistant',
      text: q.response,
      advice: {
        severity: 'caution',
        steps: q.steps,
      },
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    speakMessage(`${q.response}. ${q.steps.join('. ')}`);
    confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputVal,
    };

    const replyText = activeLang === 'hi' 
      ? `मैंने आपकी समस्या समझी: "${inputVal}". कृपया शांत रहें, पर्याप्त पानी पिएं और यदि लक्षण गंभीर हैं तो तुरंत 108 या नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) से संपर्क करें।`
      : `I have received your query: "${inputVal}". Please stay calm, hydrate well, and visit your nearest PHC or call 108 if acute distress occurs.`;

    const botMsg: Message = {
      id: `b-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      advice: {
        severity: 'normal',
        steps: [
          '1. Monitor vitals using our Stethoscope & PPG scanner.',
          '2. Avoid unprescribed antibiotics.',
          '3. Seek formal doctor triage if symptoms worsen.',
        ],
      },
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    speakMessage(replyText);
    setInputVal('');
  };

  return (
    <div className="flex flex-col gap-5 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-md backdrop-blur-xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 text-sky-600 rounded-2xl">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                10 Indian Languages &bull; 100% Offline AI
              </span>
              <span className="text-[10px] font-mono text-slate-400">Zero Cloud Wait</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-display mt-0.5">
              Suno Sahayak — Multilingual Health Companion
            </h2>
          </div>
        </div>

        {/* Language Picker */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {Object.entries(SUPPORTED_INDIAN_LANGUAGES).map(([code, l]) => (
            <button
              key={code}
              onClick={() => setActiveLang(code as SupportedLangCode)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                activeLang === code
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {l.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quick Audio Health Queries */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          Tap to ask in {currentLangConfig.name} ({currentLangConfig.nativeName}):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {currentQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryClick(q)}
              className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-left hover:bg-sky-100 hover:border-sky-300 transition-all text-xs font-bold text-sky-950 group shadow-sm flex flex-col justify-between"
            >
              <span>{q.label}</span>
              <span className="text-[10px] text-sky-600 font-normal mt-1 block">Tap to ask &rarr;</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat / Audio Dialogue Feed */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 p-2 bg-slate-50 rounded-2xl border border-slate-200">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'assistant' && (
              <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0 h-8 w-8 flex items-center justify-center">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 space-y-2 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[11px] opacity-75">
                  {m.sender === 'user' ? 'You' : 'Suno Sahayak AI'}
                </span>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakMessage(m.text + (m.advice ? `. ${m.advice.steps.join('. ')}` : ''))}
                    className="p-1 text-sky-600 hover:text-sky-800 rounded-md hover:bg-sky-50"
                    title="Listen aloud in native language"
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>

              <p className="leading-relaxed">{m.text}</p>

              {m.advice && (
                <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <p className="font-black uppercase tracking-wider text-sky-900">Recommended Steps:</p>
                  <ul className="space-y-1 text-slate-700">
                    {m.advice.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="p-2 rounded-xl bg-slate-800 text-white shrink-0 h-8 w-8 flex items-center justify-center">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input / Voice Bar */}
      <form onSubmit={handleCustomSend} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsListening(!isListening);
            if (!isListening) {
              setInputVal(activeLang === 'hi' ? 'मुझे सांस लेने में तकलीफ हो रही है' : 'I have shortness of breath');
            }
          }}
          className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
          }`}
          title="Voice input"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          placeholder={`Type or speak symptoms in ${currentLangConfig.nativeName}...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />

        <button
          type="submit"
          className="p-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
          title="Send query"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
