import { AlertOctagon, PhoneCall, Volume2, MapPin, X } from 'lucide-react';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';

interface EmergencySosModalProps {
  lang: SupportedLangCode;
  onClose: () => void;
}

const EMERGENCY_ADVICE: Record<SupportedLangCode, {
  sirenText: string;
  step1: string;
  step2: string;
  step3: string;
}> = {
  en: {
    sirenText: 'Emergency Mode Active. Stay calm. Keep patient sitting upright and loosen tight clothing around the neck.',
    step1: '1. If patient has chest pain or breathlessness, keep them seated upright.',
    step2: '2. Call 108 (National Ambulance) or 112 (Emergency Services) immediately.',
    step3: '3. If prescribed, administer Sorbitrate / Aspirin or Asthalin Inhaler as directed by doctor.',
  },
  hi: {
    sirenText: 'आपातकालीन मोड सक्रिय है। शांत रहें। मरीज को सीधा बैठाएं और गर्दन के कपड़े ढीले करें।',
    step1: '1. यदि मरीज को सीने में दर्द या सांस लेने में तकलीफ है, तो उन्हें सीधा बैठाकर रखें।',
    step2: '2. तुरंत 108 (एम्बुलेंस) या 112 (आपातकालीन नंबर) पर कॉल करें।',
    step3: '3. डॉक्टर द्वारा बताई गई आपातकालीन दवा (एस्पिरिन या इनहेलर) तुरंत दें।',
  },
  kn: {
    sirenText: 'ತುರ್ತು ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ. ರೋಗಿಯನ್ನು ನೆಟ್ಟಗೆ ಕುಳಿತುಕೊಳ್ಳಲು ಹೇಳಿ.',
    step1: '1. ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದ್ದರೆ, ರೋಗಿಯನ್ನು ನೆಟ್ಟಗೆ ಕುಳ್ಳಿರಿಸಿ.',
    step2: '2. ತಕ್ಷಣ 108 (ಆಂಬ್ಯುಲೆನ್ಸ್) ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
    step3: '3. ವೈದ್ಯರು ಸೂಚಿಸಿದ ಇನ್ಹೇಲರ್ ಅಥವಾ ತುರ್ತು ಔಷಧಿಯನ್ನು ನೀಡಿ.',
  },
  ta: {
    sirenText: 'அவசர நிலை முறை இயக்கப்பட்டது. நோயாளி நேராக உட்கார வைக்கவும்.',
    step1: '1. நெஞ்சு வலி இருந்தால், நோயாளியை நேராக உட்கார வைக்கவும்.',
    step2: '2. உடனடியாக 108 அல்லது 112 ஐ அழைக்கவும்.',
    step3: '3. மருத்துவர் பரிந்துரைத்த அவசர மருந்துகளை வழங்கவும்.',
  },
  te: {
    sirenText: 'ఎమర్జెన్సీ మోడ్ ప్రారంభించబడింది. రోగిని నిటారుగా కూర్చోబెట్టండి.',
    step1: '1. ఛాతీ నొప్పి ఉంటే రోగిని నిటారుగా కూర్చోబెట్టండి.',
    step2: '2. వెంటనే 108 లేదా 112 కు కాల్ చేయండి.',
    step3: '3. డాక్టర్ సూచించిన అత్యవసర మందులను అందించండి.',
  },
  bn: {
    sirenText: 'জরুরি অবস্থা সক্রিয়। রোগীকে সোজা করে বসিয়ে রাখুন।',
    step1: '১. বুকে ব্যথা বা শ্বাসকষ্ট হলে রোগীকে সোজা করে বসান।',
    step2: '২. অবিলম্বে ১০৮ (অ্যাম্বুলেন্স) বা ১১২ নম্বরে ফোন করুন।',
    step3: '৩. ডাক্তারের পরামর্শ অনুযায়ী ইনহেলার বা ওষুধ দিন।',
  },
  mr: {
    sirenText: 'आपत्कालीन मोड सक्रिय आहे. रुग्णाला सरळ बसवा.',
    step1: '१. छातीत दुखत असल्यास रुग्णाला सरळ बसवून ठेवा.',
    step2: '२. लगेच १०८ किंवा ११२ वर कॉल करा.',
    step3: '३. डॉक्टरांच्या सल्ल्यानुसार आपत्कालीन औषध द्या.',
  },
  gu: {
    sirenText: 'ઇમરજન્સી મોડ સક્રિય છે. દર્દીને સીધા બેસાડો.',
    step1: '૧. છાતીમાં દુખાવો હોય તો દર્દીને સીધા બેસાડી રાખો.',
    step2: '૨. તરત જ ૧૦૮ અથવા ૧૧૨ પર કોલ કરો.',
    step3: '૩. ડોક્ટરની સલાહ મુજબ ઇન્હેલર કે દવા આપો.',
  },
  ml: {
    sirenText: 'അടിയന്തിര മോഡ് സജീവമാണ്. രോഗിയെ നേരെ ഇരുത്തുക.',
    step1: '1. നെഞ്ചുവേദനയുണ്ടെങ്കിൽ രോഗിയെ നേരെ ഇരുത്തുക.',
    step2: '2. ഉടൻ 108 അല്ലെങ്കിൽ 112 എന്ന നമ്പറിലേക്ക് വിളിക്കുക.',
    step3: '3. ഡോക്ടർ നിർദ്ദേശിച്ച മരുന്നുകൾ നൽകുക.',
  },
  pa: {
    sirenText: 'ਐਮਰਜੈਂਸੀ ਮੋਡ ਚਾਲੂ ਹੈ। ਮਰੀਜ਼ ਨੂੰ ਸਿੱਧਾ ਬਿਠਾਓ।',
    step1: '1. ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਹੋਣ ਤੇ ਮਰੀਜ਼ ਨੂੰ ਸਿੱਧਾ ਬਿਠਾ ਕੇ ਰੱਖੋ।',
    step2: '2. ਤੁਰੰਤ 108 ਜਾਂ 112 ਤੇ ਕਾਲ ਕਰੋ।',
    step3: '3. ਡਾਕਟਰ ਦੀ ਦੱਸੀ ਐਮਰਜੈਂਸੀ ਦਵਾਈ ਦਿਓ।',
  }
};

export function EmergencySosModal({ lang, onClose }: EmergencySosModalProps) {
  const advice = EMERGENCY_ADVICE[lang] || EMERGENCY_ADVICE.en;
  const langConfig = SUPPORTED_INDIAN_LANGUAGES[lang] || SUPPORTED_INDIAN_LANGUAGES.en;

  const playVoiceInstruction = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(advice.sirenText);
    utterance.lang = langConfig.speechCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/80 backdrop-blur-lg p-4 animate-in zoom-in-95 duration-200">
      <div className="max-w-md w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-rose-500 space-y-5 text-slate-900">
        {/* Urgent Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-2xl animate-pulse">
              <AlertOctagon className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                1-Tap Emergency SOS
              </span>
              <h2 className="text-xl font-black text-rose-600 font-display leading-tight mt-0.5">
                Medical Distress Protocol
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1">
            <X size={20} />
          </button>
        </div>

        {/* Siren / Voice Assistance */}
        <button
          onClick={playVoiceInstruction}
          className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <Volume2 className="h-4 w-4 text-rose-600 animate-bounce" />
          <span>Speak Emergency Guidance ({langConfig.nativeName})</span>
        </button>

        {/* Immediate First-Aid Steps */}
        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 space-y-2 text-xs sm:text-sm text-rose-950 font-sans leading-relaxed">
          <p className="font-bold">{advice.step1}</p>
          <p className="font-bold">{advice.step2}</p>
          <p className="font-bold">{advice.step3}</p>
        </div>

        {/* Speed Dial Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:108"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 active:scale-95 transition-all text-center"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Call 108</span>
          </a>

          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center"
          >
            <PhoneCall className="h-4 w-4 text-emerald-400" />
            <span>Call 112</span>
          </a>
        </div>

        {/* GPS Location & Medical Info */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-rose-500" /> GPS: 12.9716° N, 77.5946° E
          </span>
          <span className="font-bold text-slate-800">Blood Group: B+</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          Dismiss SOS
        </button>
      </div>
    </div>
  );
}
