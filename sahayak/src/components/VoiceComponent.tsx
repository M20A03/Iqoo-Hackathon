import { useState, useEffect } from 'react';
import { Mic, MicOff, Command, Globe } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';

interface VoiceComponentProps {
  onCommandParsed: (transcript: string) => void;
}

const LANGUAGE_EXAMPLES: Record<SupportedLangCode, string[]> = {
  en: ['"Open WhatsApp"', '"Call Doctor"', '"Read Screen"'],
  hi: ['"व्हाट्सएप खोलो"', '"डॉक्टर को फोन करो"', '"स्क्रीन पढ़ो"'],
  kn: ['"ವಾಟ್ಸಾಪ್ ತೆರೆಯಿರಿ"', '"ವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ"', '"ಸ್ಕ್ರೀನ್ ಓದಿ"'],
  ta: ['"வாட்ஸ்அப்பைத் திற"', '"மருத்துவரை அழைக்கவும்"', '"திரையைப் படிக்கவும்"'],
  te: ['"వాట్సాప్ తెరవండి"', '"వైద్యుడికి కాల్ చేయండి"', '"స్క్రీన్ చదవండి"'],
  bn: ['"হোয়াটসঅ্যাপ খুলুন"', '"ডাক্তারকে ফোন করুন"', '"পর্দা পড়ুন"'],
  mr: ['"व्हॉट्सअॅप उघडा"', '"डॉक्टरांना फोन करा"', '"स्क्रीन वाचा"'],
  gu: ['"વોટ્સએપ ખોલો"', '"ડોક્ટરને કોલ કરો"', '"સ્ક્રીન વાંચો"'],
  ml: ['"വാട്ട്‌സ്ആപ്പ് തുറക്കുക"', '"ഡോക്ടറെ വിളിക്കുക"', '"സ്ക്രീൻ വായിക്കുക"'],
  pa: ['"ਵਟਸਐਪ ਖੋਲ੍ਹੋ"', '"ਡਾਕਟਰ ਨੂੰ ਕਾਲ ਕਰੋ"', '"ਸਕ੍ਰੀਨ ਪੜ੍ਹੋ"'],
};

export function VoiceComponent({ onCommandParsed }: VoiceComponentProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedLangCode>('en');
  const { isListening, transcript, error, startListening, resetTranscript } = useSpeechRecognition(selectedLang);

  useEffect(() => {
    if (transcript && !isListening) {
      onCommandParsed(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onCommandParsed, resetTranscript]);

  return (
    <div className="flex flex-col gap-5 w-full bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-md backdrop-blur-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-100 rounded-xl text-sky-600">
            <Command size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              Multilingual Voice Control
            </h2>
            <p className="text-[11px] font-bold text-sky-700">
              10 Indian Regional Languages Supported
            </p>
          </div>
        </div>

        {isListening && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
             <span className="text-[10px] font-black text-rose-700 uppercase">Listening ({SUPPORTED_INDIAN_LANGUAGES[selectedLang].name})</span>
          </div>
        )}
      </div>

      {/* Language Pills Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <Globe className="h-3.5 w-3.5 text-sky-600" />
          <span>Select Input Language:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
          {Object.entries(SUPPORTED_INDIAN_LANGUAGES).map(([code, config]) => (
            <button
              key={code}
              onClick={() => setSelectedLang(code as SupportedLangCode)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                selectedLang === code
                  ? 'bg-sky-500 text-white shadow-sm scale-105'
                  : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              <span>{config.flag}</span>
              <span>{config.nativeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Native Examples */}
      <div className="rounded-2xl bg-sky-50/70 p-3 border border-sky-100 text-xs text-slate-700">
        <span className="font-bold text-sky-900">Try saying in {SUPPORTED_INDIAN_LANGUAGES[selectedLang].name}: </span>
        <span className="font-medium text-slate-600">
          {LANGUAGE_EXAMPLES[selectedLang].join(', ')}
        </span>
      </div>

      {/* Primary Voice Mic Button */}
      <button
        onClick={startListening}
        disabled={isListening}
        className={`w-full py-8 flex flex-col items-center justify-center gap-3 rounded-2xl font-black text-lg shadow-md transition-all active:scale-95 ${
          isListening 
            ? 'bg-rose-50 text-rose-600 border-2 border-rose-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-sky-500/20'
        }`}
        aria-label={isListening ? "Listening..." : "Activate voice control"}
      >
        <div className={`p-3.5 rounded-full ${isListening ? 'bg-rose-100' : 'bg-white/20'}`}>
          {isListening ? (
            <MicOff size={36} className="text-rose-600 animate-pulse" />
          ) : (
            <Mic size={36} className="text-white" />
          )}
        </div>
        <span className={isListening ? 'animate-pulse text-sm' : 'text-sm'}>
          {isListening ? `Listening in ${SUPPORTED_INDIAN_LANGUAGES[selectedLang].nativeName}...` : `Tap to Speak (${SUPPORTED_INDIAN_LANGUAGES[selectedLang].nativeName})`}
        </span>
      </button>
      
      {error && (
        <div className="text-rose-700 text-xs text-center font-bold p-3 bg-rose-50 rounded-xl border border-rose-200" role="alert">
          {error}
        </div>
      )}

      {transcript && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in zoom-in-95">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1">Detected Intent:</span>
          <p className="text-base font-serif font-bold text-sky-900">"{transcript}"</p>
        </div>
      )}
    </div>
  );
}
