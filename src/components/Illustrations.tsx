export function StethoscopeFftIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#0B301B" stroke="#2CA470" strokeWidth="3" />
      {/* Background frequency grid */}
      <path d="M40 50H360M40 90H360M40 130H360M40 170H360M100 30V180M180 30V180M260 30V180M340 30V180" stroke="#4ADE80" strokeOpacity="0.1" strokeWidth="1" />

      {/* FFT Spectrum Bars (200 Hz - 1000 Hz) */}
      <rect x="50" y="135" width="10" height="35" rx="4" fill="#4ADE80" opacity="0.6" />
      <rect x="65" y="115" width="10" height="55" rx="4" fill="#4ADE80" opacity="0.7" />
      <rect x="80" y="85" width="10" height="85" rx="4" fill="#4ADE80" opacity="0.8" />
      <rect x="95" y="60" width="10" height="110" rx="4" fill="#FFB800" />
      <rect x="110" y="45" width="10" height="125" rx="4" fill="#FFB800" />
      <rect x="125" y="70" width="10" height="100" rx="4" fill="#FFB800" />
      <rect x="140" y="95" width="10" height="75" rx="4" fill="#4ADE80" opacity="0.8" />
      <rect x="155" y="120" width="10" height="50" rx="4" fill="#4ADE80" opacity="0.7" />
      <rect x="170" y="140" width="10" height="30" rx="4" fill="#4ADE80" opacity="0.6" />

      {/* Continuous Wheeze Curve Overlay */}
      <path
        d="M50 140 Q 110 30 170 145 T 290 80 T 360 150"
        stroke="#FFB800"
        strokeWidth="3"
        strokeDasharray="4 3"
        fill="none"
      />

      {/* Audio Stethoscope Sensor Badge */}
      <rect x="210" y="40" width="160" height="55" rx="14" fill="#16442C" stroke="#4ADE80" strokeWidth="1.5" />
      <text x="290" y="60" fill="#4ADE80" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">ACOUSTIC FFT STETHOSCOPE</text>
      <text x="290" y="80" fill="#FFB800" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">Wheeze Detected (450Hz)</text>

      {/* Clinical Diagnostic Indicator */}
      <rect x="210" y="110" width="160" height="60" rx="14" fill="#141414" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="225" y="132" fill="#9CA3AF" fontSize="10" fontWeight="700" fontFamily="sans-serif">FREQUENCY RANGE:</text>
      <text x="225" y="152" fill="#E2E3DF" fontSize="12" fontWeight="800" fontFamily="sans-serif">200 Hz – 1000 Hz (Air-Gapped)</text>
    </svg>
  );
}

export function ScleraBiomarkerIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#121b14" stroke="#f3a027" strokeWidth="3" />

      {/* Stylized Macro Eye Outline */}
      <path d="M50 110 Q 130 40 210 110 Q 130 180 50 110 Z" fill="#1b2e22" stroke="#f6f2e9" strokeWidth="2.5" />
      <circle cx="130" cy="110" r="35" fill="#0B301B" stroke="#f3a027" strokeWidth="3" />
      <circle cx="130" cy="110" r="16" fill="#0A0A0A" />

      {/* Sclera & Conjunctiva Scan Reticles */}
      {/* Sclera Zone (Jaundice Shift) */}
      <circle cx="85" cy="110" r="12" fill="#FFB800" opacity="0.35" stroke="#FFB800" strokeWidth="2" strokeDasharray="3 2" />
      <path d="M85 85 L 85 95" stroke="#FFB800" strokeWidth="2" />
      <text x="85" y="75" fill="#FFB800" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Sclera (Jaundice)</text>

      {/* Palpebral Conjunctiva Zone (Anemia Pallor) */}
      <path d="M80 145 Q 130 165 180 145" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
      <text x="130" y="185" fill="#EF4444" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Inner-Eyelid Conjunctiva (Anemia)</text>

      {/* Colorimetric Density Readout Box */}
      <rect x="235" y="35" width="140" height="150" rx="16" fill="#1b2e22" stroke="#f6f2e9" strokeOpacity="0.2" strokeWidth="1.5" />
      <text x="305" y="58" fill="#f3a027" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">OPTICAL BIOMARKERS</text>

      <rect x="245" y="70" width="120" height="42" rx="10" fill="#203325" />
      <text x="255" y="86" fill="#9CA3AF" fontSize="8" fontWeight="700" fontFamily="sans-serif">CONJUNCTIVA PALLOR</text>
      <text x="255" y="103" fill="#EF4444" fontSize="12" fontWeight="900" fontFamily="sans-serif">Severe Anemia Risk</text>

      <rect x="245" y="122" width="120" height="42" rx="10" fill="#203325" />
      <text x="255" y="138" fill="#9CA3AF" fontSize="8" fontWeight="700" fontFamily="sans-serif">SCLERAL YELLOW SHIFT</text>
      <text x="255" y="155" fill="#4ADE80" fontSize="12" fontWeight="900" fontFamily="sans-serif">Normal (No Jaundice)</text>
    </svg>
  );
}

export function JanAushadhiIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#f6f2e9" stroke="#121b14" strokeWidth="4" />

      {/* Branded Medicine Box (Left) */}
      <rect x="30" y="35" width="150" height="150" rx="16" fill="#203325" stroke="#121b14" strokeWidth="2" />
      <rect x="42" y="48" width="80" height="18" rx="6" fill="#f3a027" />
      <text x="82" y="61" fill="#121b14" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">BRANDED Rx</text>
      <text x="42" y="88" fill="#f6f2e9" fontSize="14" fontWeight="800" fontFamily="sans-serif">Augmentin 625</text>
      <text x="42" y="105" fill="#f6f2e9" opacity="0.75" fontSize="10" fontFamily="sans-serif">Amoxicillin + Clavulanate</text>
      <div className="mt-4">
        <text x="42" y="145" fill="#9CA3AF" fontSize="10" fontFamily="sans-serif">MRP Price:</text>
        <text x="42" y="168" fill="#EF4444" fontSize="20" fontWeight="900" fontFamily="sans-serif">₹210.50</text>
      </div>

      {/* Arrow / Conversion Node */}
      <circle cx="200" cy="110" r="18" fill="#f3a027" stroke="#121b14" strokeWidth="2.5" />
      <path d="M195 110L205 110M201 106L205 110L201 114" stroke="#121b14" strokeWidth="2.5" strokeLinecap="round" />

      {/* Jan Aushadhi Generic Match Box (Right) */}
      <rect x="220" y="35" width="150" height="150" rx="16" fill="#0B301B" stroke="#2CA470" strokeWidth="3" />
      <rect x="232" y="48" width="115" height="18" rx="6" fill="#4ADE80" />
      <text x="290" y="61" fill="#0B301B" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">JAN AUSHADHI GENERIC</text>
      <text x="232" y="88" fill="#4ADE80" fontSize="14" fontWeight="800" fontFamily="sans-serif">Amoxy-Clav 625</text>
      <text x="232" y="105" fill="#E2E3DF" opacity="0.8" fontSize="10" fontFamily="sans-serif">Identical Chemical Salt</text>
      <div className="mt-4">
        <text x="232" y="145" fill="#4ADE80" fontSize="10" fontWeight="700" fontFamily="sans-serif">Jan Aushadhi Price:</text>
        <text x="232" y="168" fill="#FFB800" fontSize="20" fontWeight="900" fontFamily="sans-serif">₹48.00 <tspan fontSize="11" fill="#4ADE80">(-77%)</tspan></text>
      </div>
    </svg>
  );
}

export function VoiceWaveIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="200" rx="24" fill="#1b2e22" stroke="#f3a027" strokeWidth="3" />
      {/* Background Grid Accent */}
      <path d="M0 50H400M0 100H400M0 150H400M100 0V200M200 0V200M300 0V200" stroke="#f6f2e9" strokeOpacity="0.05" strokeWidth="1.5" />

      {/* Voice Wave Spectrum Bars */}
      <g opacity="0.95">
        <rect x="60" y="85" width="12" height="30" rx="6" fill="#f3a027" />
        <rect x="84" y="65" width="12" height="70" rx="6" fill="#f6f2e9" />
        <rect x="108" y="40" width="12" height="120" rx="6" fill="#f3a027" />
        <rect x="132" y="25" width="12" height="150" rx="6" fill="#f6f2e9" />
        <rect x="156" y="55" width="12" height="90" rx="6" fill="#f3a027" />
        <rect x="180" y="15" width="14" height="170" rx="7" fill="#f3a027" />
        <rect x="206" y="35" width="12" height="130" rx="6" fill="#f6f2e9" />
        <rect x="230" y="60" width="12" height="80" rx="6" fill="#f3a027" />
        <rect x="254" y="45" width="12" height="110" rx="6" fill="#f6f2e9" />
        <rect x="278" y="70" width="12" height="60" rx="6" fill="#f3a027" />
        <rect x="302" y="85" width="12" height="30" rx="6" fill="#f6f2e9" />
      </g>

      {/* Spoken Text Overlay */}
      <rect x="80" y="145" width="240" height="36" rx="18" fill="#f3a027" stroke="#121b14" strokeWidth="2" />
      <text x="200" y="168" fill="#121b14" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        "Breath Click: Read Prescription Out Loud"
      </text>
    </svg>
  );
}

export function ScanCameraIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#f6f2e9" stroke="#121b14" strokeWidth="4" />

      {/* Prescription Document Mockup */}
      <rect x="50" y="30" width="300" height="160" rx="16" fill="#203325" stroke="#121b14" strokeWidth="2" />
      <rect x="70" y="55" width="140" height="12" rx="6" fill="#f3a027" />
      <rect x="70" y="76" width="220" height="8" rx="4" fill="#f6f2e9" opacity="0.8" />
      <rect x="70" y="90" width="180" height="8" rx="4" fill="#f6f2e9" opacity="0.8" />
      <rect x="70" y="104" width="240" height="8" rx="4" fill="#f6f2e9" opacity="0.8" />

      {/* Multilingual CDSCO Warning Tag */}
      <rect x="70" y="124" width="210" height="24" rx="6" fill="#EF4444" opacity="0.95" />
      <text x="80" y="140" fill="#ffffff" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
        ⚠️ CDSCO ALERT: Double-Dosing Flag
      </text>

      {/* Camera Reticle Corners */}
      <path d="M40 50V35H55" stroke="#f3a027" strokeWidth="5" strokeLinecap="round" />
      <path d="M360 50V35H345" stroke="#f3a027" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 170V185H55" stroke="#f3a027" strokeWidth="5" strokeLinecap="round" />
      <path d="M360 170V185H345" stroke="#f3a027" strokeWidth="5" strokeLinecap="round" />

      {/* Laser Scanning Line */}
      <line x1="40" y1="95" x2="360" y2="95" stroke="#f3a027" strokeWidth="3" strokeDasharray="8 6" />

      {/* Offline Badge */}
      <rect x="250" y="152" width="120" height="26" rx="13" fill="#f3a027" />
      <text x="310" y="169" fill="#121b14" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        ✦ OFFLINE OCR
      </text>
    </svg>
  );
}

export function FaceTrackIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#203325" stroke="#f3a027" strokeWidth="3" />

      {/* Head mesh outline */}
      <ellipse cx="200" cy="105" rx="65" ry="80" stroke="#f6f2e9" strokeWidth="3" strokeDasharray="4 4" fill="#1b2e22" />

      {/* Eye Tracking Points */}
      <circle cx="175" cy="90" r="10" stroke="#f3a027" strokeWidth="3" fill="#121b14" />
      <circle cx="175" cy="90" r="3" fill="#f3a027" />

      <circle cx="225" cy="90" r="10" stroke="#f3a027" strokeWidth="3" fill="#121b14" />
      <circle cx="225" cy="90" r="3" fill="#f3a027" />

      {/* Smile Track Arc */}
      <path d="M175 135 Q200 155 225 135" stroke="#f3a027" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Cursor position indicator */}
      <circle cx="315" cy="70" r="16" fill="#f3a027" />
      <path d="M309 70L321 70M315 64L315 76" stroke="#121b14" strokeWidth="3" strokeLinecap="round" />
      <text x="315" y="105" fill="#f6f2e9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
        SMILE TO CLICK
      </text>

      {/* NPU Badge */}
      <rect x="25" y="25" width="135" height="26" rx="13" fill="#1b2e22" stroke="#f3a027" strokeWidth="1.5" />
      <text x="92" y="42" fill="#f3a027" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        ✦ 468 LANDMARK NPU MESH
      </text>
    </svg>
  );
}

export function GazeDwellIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#1b2e22" stroke="#f3a027" strokeWidth="3" />

      {/* Target Button UI */}
      <rect x="60" y="45" width="120" height="60" rx="16" fill="#203325" stroke="#f6f2e9" strokeWidth="2" strokeOpacity="0.4" />
      <text x="120" y="80" fill="#f6f2e9" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Call Caregiver</text>

      <rect x="220" y="45" width="120" height="60" rx="16" fill="#203325" stroke="#f6f2e9" strokeWidth="2" strokeOpacity="0.4" />
      <text x="280" y="80" fill="#f6f2e9" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Check Vitals</text>

      {/* Gaze Target Active with Dwell Progress Ring */}
      <rect x="140" y="125" width="120" height="60" rx="16" fill="#f3a027" stroke="#121b14" strokeWidth="3" />
      <text x="200" y="160" fill="#121b14" fontSize="14" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Read Screen</text>

      {/* Gaze Reticle & Dwell Timer Ring */}
      <circle cx="200" cy="155" r="28" stroke="#121b14" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="45" />
      <circle cx="200" cy="155" r="5" fill="#EF4444" />

      {/* Label */}
      <rect x="280" y="170" width="105" height="24" rx="12" fill="#203325" stroke="#f3a027" strokeWidth="1" />
      <text x="332" y="186" fill="#f3a027" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        GAZE DWELL (800ms)
      </text>
    </svg>
  );
}

export function VitalsPpgIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#0B301B" stroke="#2CA470" strokeWidth="3" />

      {/* Camera Lens Indicator */}
      <circle cx="70" cy="70" r="35" fill="#16442C" stroke="#2CA470" strokeWidth="2" />
      <circle cx="70" cy="70" r="20" fill="#0A0A0A" />
      <circle cx="70" cy="70" r="8" fill="#4ADE80" opacity="0.8" />
      <text x="70" y="125" fill="#4ADE80" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Camera PPG</text>

      {/* Live ECG / PPG Waveform */}
      <path
        d="M130 90 L160 90 L170 70 L180 110 L190 40 L200 120 L210 85 L220 90 L250 90 L260 75 L270 105 L280 45 L290 120 L300 85 L330 90 L360 90"
        stroke="#4ADE80"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Vital Metrics Pill */}
      <rect x="130" y="140" width="115" height="50" rx="14" fill="#16442C" stroke="#4ADE80" strokeWidth="1.5" />
      <text x="187" y="160" fill="#9CA3AF" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">HEART RATE</text>
      <text x="187" y="180" fill="#4ADE80" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">72 <tspan fontSize="11" fontWeight="500">BPM</tspan></text>

      <rect x="255" y="140" width="115" height="50" rx="14" fill="#16442C" stroke="#4ADE80" strokeWidth="1.5" />
      <text x="312" y="160" fill="#9CA3AF" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">BLOOD OXYGEN (SpO2)</text>
      <text x="312" y="180" fill="#FFB800" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">98% <tspan fontSize="11" fontWeight="500">Normal</tspan></text>
    </svg>
  );
}

export function TremorFilterIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#203325" stroke="#f3a027" strokeWidth="3" />

      {/* Raw Jittery Input Path */}
      <path
        d="M40 70 Q60 55 80 85 T120 60 T160 90 T200 55 T240 85 T280 60 T320 85 T360 70"
        stroke="#EF4444"
        strokeWidth="2.5"
        strokeDasharray="4 4"
        fill="none"
      />
      <rect x="40" y="25" width="180" height="24" rx="12" fill="#EF4444" opacity="0.2" />
      <text x="130" y="41" fill="#EF4444" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        RAW JITTERY TOUCH (Parkinson's)
      </text>

      {/* Filtered Smooth Output Path */}
      <path
        d="M40 155 Q120 130 200 155 T360 155"
        stroke="#f3a027"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="40" y="175" width="200" height="26" rx="13" fill="#f3a027" />
      <text x="140" y="192" fill="#121b14" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        ✦ LOW-PASS KINETIC DAMPING
      </text>

      {/* Algorithm Damping Node */}
      <circle cx="200" cy="155" r="10" fill="#f6f2e9" stroke="#121b14" strokeWidth="3" />
    </svg>
  );
}

export function OriginOSOfficeSyncIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#121b14" stroke="#f3a027" strokeWidth="3" />

      {/* Doctor / Caregiver PC / Tablet Box */}
      <rect x="30" y="40" width="130" height="120" rx="16" fill="#1b2e22" stroke="#f6f2e9" strokeWidth="2" strokeOpacity="0.3" />
      <text x="95" y="65" fill="#f3a027" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">DOCTOR / CLINIC PC</text>
      <rect x="45" y="80" width="100" height="16" rx="6" fill="#203325" />
      <text x="95" y="92" fill="#f6f2e9" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">Rx: Amoxy-Clav 625</text>
      <rect x="45" y="105" width="100" height="24" rx="8" fill="#f3a027" />
      <text x="95" y="121" fill="#121b14" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Super Clipboard Sync</text>

      {/* OriginOS Office Kit Cloud Bridge */}
      <path d="M170 100 H230" stroke="#f3a027" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="200" cy="100" r="16" fill="#f3a027" />
      <path d="M195 100L205 100M201 96L205 100L201 104" stroke="#121b14" strokeWidth="2.5" strokeLinecap="round" />
      <text x="200" y="130" fill="#f6f2e9" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Office Kit Multi-Window</text>

      {/* iQOO Mobile Phone Box */}
      <rect x="240" y="40" width="130" height="120" rx="16" fill="#203325" stroke="#f3a027" strokeWidth="2" />
      <text x="305" y="65" fill="#4ADE80" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">iQOO DEVICE</text>
      <rect x="255" y="80" width="100" height="28" rx="8" fill="#16442C" stroke="#4ADE80" strokeWidth="1" />
      <text x="305" y="98" fill="#4ADE80" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">✓ Rx Injected to SQLite</text>
      <text x="305" y="135" fill="#f6f2e9" fontSize="8.5" opacity="0.8" textAnchor="middle" fontFamily="sans-serif">Auto Schedule Alert</text>

      {/* Bottom Tag */}
      <rect x="70" y="178" width="260" height="26" rx="13" fill="#1b2e22" stroke="#f3a027" strokeWidth="1" />
      <text x="200" y="195" fill="#f3a027" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        ✦ ORIGINOS SUPER CLIPBOARD BRIDGE &bull; ZERO TOUCH
      </text>
    </svg>
  );
}

export function UniversalAccessibilityIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="400" height="220" rx="24" fill="#203325" stroke="#f3a027" strokeWidth="3" />

      {/* Central Dispatcher Node */}
      <circle cx="200" cy="110" r="32" fill="#f3a027" stroke="#121b14" strokeWidth="3" />
      <text x="200" y="107" fill="#121b14" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">PULSEEDGE</text>
      <text x="200" y="120" fill="#121b14" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Accessibility Service</text>

      {/* Connecting App Nodes */}
      <line x1="200" y1="110" x2="80" y2="55" stroke="#4ADE80" strokeWidth="2.5" strokeDasharray="4 3" />
      <circle cx="80" cy="55" r="24" fill="#16442C" stroke="#4ADE80" strokeWidth="2" />
      <text x="80" y="59" fill="#4ADE80" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">WhatsApp</text>

      <line x1="200" y1="110" x2="320" y2="55" stroke="#1DB954" strokeWidth="2.5" strokeDasharray="4 3" />
      <circle cx="320" cy="55" r="24" fill="#0A0A0A" stroke="#1DB954" strokeWidth="2" />
      <text x="320" y="59" fill="#1DB954" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Spotify</text>

      <line x1="200" y1="110" x2="80" y2="165" stroke="#f3a027" strokeWidth="2.5" strokeDasharray="4 3" />
      <circle cx="80" cy="165" r="24" fill="#1b2e22" stroke="#f3a027" strokeWidth="2" />
      <text x="80" y="169" fill="#f3a027" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Maps/SOS</text>

      <line x1="200" y1="110" x2="320" y2="165" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 3" />
      <circle cx="320" cy="165" r="24" fill="#1b2e22" stroke="#EF4444" strokeWidth="2" />
      <text x="320" y="169" fill="#EF4444" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">YouTube</text>

      <rect x="100" y="10" width="200" height="22" rx="11" fill="#121b14" stroke="#f3a027" strokeWidth="1" />
      <text x="200" y="25" fill="#f3a027" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
        HANDS-FREE APP DISPATCH
      </text>
    </svg>
  );
}
