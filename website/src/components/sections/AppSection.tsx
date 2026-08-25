import { Stethoscope, Eye, HeartPulse, ScanFace, Activity, Pill, ShieldAlert, Sparkles, Download, ShieldCheck, Smartphone, Volume2, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import appShot from "@/assets/sahayak-app-screenshot-1.jpg";
import {
  StethoscopeFftIllustration,
  ScleraBiomarkerIllustration,
  VitalsPpgIllustration,
  FaceTrackIllustration,
  GazeDwellIllustration,
  TremorFilterIllustration,
  JanAushadhiIllustration,
  ScanCameraIllustration,
} from "@/components/Illustrations";

const masterModules = [
  {
    pillar: "BIOPHYSICAL DIAGNOSTICS",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Stethoscope,
    title: "Acoustic Stethoscope (Audio FFT)",
    blurb: "Captures respiratory audio (200 Hz–1000 Hz) via microphone array and runs on-device Fast Fourier Transform.",
    illustration: StethoscopeFftIllustration,
    points: [
      "Distinguishes dry crackles (pneumonia) from high-pitch wheezing (asthma)",
      "Real-time 16-bit PCM 44.1 kHz sampling with on-device spectral binning",
      "Air-gapped triage without sending sensitive patient audio to the cloud",
    ],
  },
  {
    pillar: "BIOPHYSICAL DIAGNOSTICS",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: Eye,
    title: "Sclera & Inner-Eyelid Optical Scanner",
    blurb: "Uses calibrated camera flash optics to analyze palpebral conjunctiva color density and scleral yellow shifts.",
    illustration: ScleraBiomarkerIllustration,
    points: [
      "Colorimetric RGB/HSV density mapping for acute Anemia screening",
      "Scleral yellow-shift chromaticity delta for Jaundice & Hepatitis risk",
      "Non-invasive point-of-care diagnostics for rural Primary Health Centers",
    ],
  },
  {
    pillar: "BIOPHYSICAL DIAGNOSTICS",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    icon: HeartPulse,
    title: "Contactless Camera PPG (Pulse & SpO2)",
    blurb: "Measures microscopic blood volume pulse variations across fingertips or facial feeds completely offline.",
    illustration: VitalsPpgIllustration,
    points: [
      "Calculates resting Heart Rate (BPM) with ±2 BPM clinical consistency",
      "Extracts peripheral blood oxygen saturation (SpO2) and HRV stress index",
      "Instant tachycardia alert triggers automated caregiver notification",
    ],
  },
  {
    pillar: "NEURO-ACCESSIBILITY",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ScanFace,
    title: "60 FPS Head & Iris Gaze Tracking",
    blurb: "Maps normalized iris and nose-bridge vectors to screen pointer locations via MediaPipe Face Mesh.",
    illustration: FaceTrackIllustration,
    points: [
      "468 facial landmark mesh accelerated on Snapdragon NPU at 60 FPS",
      "Adaptive iris calibration with smooth eye-gaze cursor navigation",
      "Zero-touch navigation for quadriplegia, cerebral palsy, and ALS",
    ],
  },
  {
    pillar: "NEURO-ACCESSIBILITY",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Volume2,
    title: "Micro-Gestures & Sub-Vocal Puff Triggers",
    blurb: "Triggers actions via intentional blinks, smiles, and high-energy acoustic breath/puff clicks.",
    illustration: GazeDwellIllustration,
    points: [
      "Smile and double-blink listeners trigger primary system clicks",
      "Mouth-aspect-ratio expansion dispatches smooth downward page scrolling",
      "Acoustic threshold detection for breath clicks supports vocal paralysis",
    ],
  },
  {
    pillar: "NEURO-ACCESSIBILITY",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    icon: Activity,
    title: "Parkinson’s Motor Tremor Filter",
    blurb: "Applies a software low-pass filter over high-sampling touch inputs to smooth erratic hand jitters.",
    illustration: TremorFilterIllustration,
    points: [
      "Weighted velocity kernel eliminates unintended taps and jittery trails",
      "Stabilizes touchscreen interactions for Parkinson's & essential tremors",
      "Seamless integration into Android OS MotionEvent dispatch pipeline",
    ],
  },
  {
    pillar: "RURAL PHARMA & TELEMETRY",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Pill,
    title: "Pradhan Mantri Jan Aushadhi Match",
    blurb: "Scans branded medicine blister packs using offline OCR to identify chemical salts and generic alternatives.",
    illustration: JanAushadhiIllustration,
    points: [
      "Maps expensive branded drugs (e.g., Augmentin) to generic chemical salts",
      "Displays government Jan Aushadhi generic equivalents with up to 85% savings",
      "Works 100% offline with local SQLite Room database",
    ],
  },
  {
    pillar: "RURAL PHARMA & TELEMETRY",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ShieldAlert,
    title: "Offline CDSCO Drug Conflict Checker",
    blurb: "Cross-checks scanned medicines against local patient history to flag double-dosing and harmful interactions.",
    illustration: ScanCameraIllustration,
    points: [
      "Evaluates CDSCO contraindication matrices for high-risk combinations",
      "Speaks immediate audio warning alerts in Hindi, Kannada, and English",
      "Protects non-literate and elderly patients from fatal dosing mistakes",
    ],
  },
];

export function AppSection() {
  return (
    <section id="app" className="relative overflow-hidden py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1 text-xs font-black uppercase text-sky-700">
                <Sparkles className="h-3.5 w-3.5 text-sky-500" /> PulseEdge-OS Master Modules
              </span>
              <h2 className="mt-3 font-sans text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Clinical &amp; Neural Capabilities
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              ✦ 8 Air-Gapped Clinical &amp; Assistive Engines
            </div>
          </div>

          <p className="mt-4 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-slate-600">
            From acoustic respiratory stethoscopes to 60 FPS gaze tracking and Jan Aushadhi generic mapping, every engine executes 100% locally on the device's Snapdragon NPU.
          </p>
        </Reveal>

        {/* 8 Feature Cards Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {masterModules.map(({ pillar, badgeColor, icon: Icon, title, blurb, points, illustration: Illustration }, i) => (
              <Reveal key={title} delay={i * 0.04}>
                <article className="glass-panel p-6 flex flex-col justify-between h-full group hover:border-sky-300">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider border ${badgeColor}`}>
                        {pillar}
                      </span>
                    </div>

                    <h3 className="mt-4 font-sans text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-1.5 font-sans text-xs sm:text-sm leading-relaxed text-slate-600">{blurb}</p>

                    {/* Vector Illustration Block */}
                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-950">
                      <Illustration className="w-full h-auto max-h-40 object-contain" />
                    </div>
                  </div>

                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {points.map((p) => (
                      <li key={p} className="flex gap-2 text-xs text-slate-600">
                        <span className="text-sky-500 font-bold text-sm">✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Download & Live App Card */}
          <Reveal delay={0.1} className="lg:col-span-4">
            <div className="sticky top-28 glass-panel p-6 shadow-xl border-sky-200/80">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-950 p-2 shadow-inner">
                <ImageWithSkeleton
                  src={appShot}
                  alt="PulseEdge-OS Sahayak app mobile interface"
                  width={912}
                  height={1104}
                  className="w-full rounded-xl object-cover max-h-96"
                />
              </div>

              <div className="mt-6">
                <a
                  href="/PulseEdge-OS.apk"
                  download="PulseEdge-OS.apk"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3.5 text-sm font-black text-white hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-sky-500/25 transition-all shadow-md"
                >
                  <Download className="h-4 w-4" />
                  Download PulseEdge OS APK
                </a>
                <p className="mt-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Smartphone className="h-4 w-4" />
                  Snapdragon NPU &bull; OriginOS Ready
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
