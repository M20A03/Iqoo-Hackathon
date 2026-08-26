import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { checkMedicationSafety } from '../utils/safetyEngine';
import { Pill, ShieldAlert, Volume2, Search, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPPORTED_INDIAN_LANGUAGES, SupportedLangCode } from '../utils/languageDict';
import { INDIAN_DRUGS_DATABASE, IndianDrugInfo, searchIndianDrugs } from '../utils/indianDrugsDatabase';

interface OCRComponentProps {
  onTextExtracted: (text: string) => void;
  speakText: (text: string, lang?: SupportedLangCode) => void;
}

export function OCRComponent({ onTextExtracted, speakText }: OCRComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<IndianDrugInfo>(INDIAN_DRUGS_DATABASE[0]);
  const [supplyMonths, setSupplyMonths] = useState(1);
  const [selectedLang, setSelectedLang] = useState<SupportedLangCode>('en');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDrugs = searchIndianDrugs(searchQuery);

  // Pre-process image on HTML canvas to boost OCR accuracy for medicine strips & labels
  const preprocessImage = (imageSrc: string | File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = typeof imageSrc === 'string' ? null : URL.createObjectURL(imageSrc);
      img.crossOrigin = 'anonymous';
      
      const cleanup = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(typeof imageSrc === 'string' ? imageSrc : '');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Grayscale + Adaptive High Contrast thresholding for blister pack text
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const thresholded = avg > 125 ? 255 : 0;
          data[i] = thresholded;
          data[i + 1] = thresholded;
          data[i + 2] = thresholded;
        }

        ctx.putImageData(imgData, 0, 0);
        cleanup();
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        cleanup();
        resolve(typeof imageSrc === 'string' ? imageSrc : '');
      };

      img.src = objectUrl || (imageSrc as string);
    });
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setSafetyAlert(null);

    try {
      const processedImageUrl = await preprocessImage(file);

      const result = await Tesseract.recognize(processedImageUrl, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(`${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const text = result.data.text.trim();
      onTextExtracted(text);

      // Check CDSCO contraindications
      const safety = await checkMedicationSafety(text);
      if (!safety.isSafe && safety.warning) {
        setSafetyAlert(safety.warning);
      }

      // Fuzzy match against 50+ NLEM Indian Drugs Database
      const lower = text.toLowerCase();
      const matched = INDIAN_DRUGS_DATABASE.find(
        (d) => lower.includes(d.brandName.toLowerCase()) || lower.includes(d.genericSalt.toLowerCase().split(' ')[0])
      );

      if (matched) {
        setSelectedDrug(matched);
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };

  const triggerVoiceGuidance = (lang: SupportedLangCode) => {
    const text = selectedDrug.voiceGuidance[lang as keyof typeof selectedDrug.voiceGuidance] || selectedDrug.voiceGuidance.en;
    speakText(text, lang);
  };

  const totalBranded = (selectedDrug.commercialPrice * supplyMonths).toFixed(2);
  const totalGeneric = (selectedDrug.janAushadhiPrice * supplyMonths).toFixed(2);
  const totalSavings = (Number(totalBranded) - Number(totalGeneric)).toFixed(2);

  return (
    <div className="space-y-5">
      {/* SCAN PRESCRIPTION BANNER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Pill className="h-4 w-4 text-sky-600" />
            Jan Aushadhi 85% Generic Price Matcher
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            50+ NLEM Essential Medicines &bull; CDSCO Safety Shield &bull; 10 Regional Languages
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold shadow hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 transition-all"
        >
          {isLoading ? `Scanning (${progress})...` : '📷 Scan Medicine Strip'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />
      </div>

      {/* CDSCO CONTRAINDICATION SAFETY SHIELD ALERT */}
      {safetyAlert && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-black text-sm">🚨 CDSCO SAFETY WARNING: DRUG CONTRAINDICATION</p>
            <p className="mt-1">{safetyAlert}</p>
          </div>
        </div>
      )}

      {/* 50+ DRUGS SEARCH & AUTOCOMPLETE BAR */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 50+ Indian medicines (e.g. Augmentin, Telma 40, Glycomet, Dolo 650, Pan 40)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
        />
      </div>

      {/* DRUG SELECTION CHIPS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredDrugs.slice(0, 8).map((drug) => (
          <button
            key={drug.id}
            onClick={() => setSelectedDrug(drug)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedDrug.id === drug.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
            }`}
          >
            {drug.brandName}
          </button>
        ))}
      </div>

      {/* SELECTED MEDICINE COMPARISON CARD */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
              {selectedDrug.category} &bull; {selectedDrug.dosageForm}
            </span>
            <h4 className="text-base font-black text-slate-900 mt-1">{selectedDrug.brandName}</h4>
            <p className="text-xs font-bold text-slate-600">
              Generic Equivalent: <span className="text-emerald-700">{selectedDrug.genericSalt}</span>
            </p>
          </div>

          <button
            onClick={() => triggerVoiceGuidance(selectedLang)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 self-start"
          >
            <Volume2 className="h-4 w-4" />
            <span>Speak in {SUPPORTED_INDIAN_LANGUAGES[selectedLang].nativeName}</span>
          </button>
        </div>

        {/* 10 REGIONAL INDIAN LANGUAGE SELECTOR */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-500">Select Audio Language (10 Regional Dialects):</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(SUPPORTED_INDIAN_LANGUAGES).map(([code, cfg]) => (
              <button
                key={code}
                onClick={() => {
                  setSelectedLang(code as SupportedLangCode);
                  triggerVoiceGuidance(code as SupportedLangCode);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedLang === code
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cfg.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE COMPARISON TILES */}
        <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Commercial MRP</p>
            <p className="text-lg font-black text-rose-600 line-through">₹{totalBranded}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Jan Aushadhi</p>
            <p className="text-lg font-black text-emerald-600">₹{totalGeneric}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Savings</p>
            <p className="text-lg font-black text-sky-600">₹{totalSavings} ({selectedDrug.savingsPct})</p>
          </div>
        </div>

        {/* PRESCRIPTION DURATION SLIDER */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Prescription Duration Supply:</span>
            <span className="text-sky-600 font-black">{supplyMonths} Month ({supplyMonths * 30} Days)</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={supplyMonths}
            onChange={(e) => setSupplyMonths(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>

        {/* CONTRAINDICATION SAFETY ADVISORY */}
        {selectedDrug.contraindicationWarning && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{selectedDrug.contraindicationWarning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
