import { AlertCircle, Zap, ShieldAlert, Cpu, HeartPulse, Stethoscope, Eye, DollarSign } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const gaps = [
  {
    icon: Stethoscope,
    title: "Expensive, Bulky Point-of-Care Hardware",
    desc: "Rural Primary Health Centers and families cannot afford multi-thousand dollar digital stethoscopes, optical jaundice meters, and dedicated pulse oximeters.",
  },
  {
    icon: Eye,
    title: "Touch Barriers for Motor-Impaired Patients",
    desc: "Patients with ALS, severe Parkinson’s, and Cerebral Palsy are completely locked out of modern smartphones due to lack of real-time hands-free gaze interfaces.",
  },
  {
    icon: DollarSign,
    title: "Crushing Branded Medication Costs",
    desc: "Patients routinely overpay 70% to 85% for branded pharmaceuticals without knowing identical Jan Aushadhi generic salts exist, risking toxic drug contraindications.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative overflow-hidden py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1 text-xs font-black uppercase text-rose-700">
              <AlertCircle className="h-3.5 w-3.5" /> The Healthcare &amp; Accessibility Divide
            </span>
            <h2 className="mt-3 font-sans text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Why Physical Medical Diagnostics &amp; Neuro-Access are Broken
            </h2>
            <p className="mt-3 font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
              Diagnostic delays in rural clinics and motor-barriers for disabled individuals create unnecessary human suffering and severe economic burden.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {gaps.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="glass-panel p-6 sm:p-7 flex flex-col justify-between h-full hover:border-rose-300 transition-all">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-sans text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  Critical Healthcare Gap 0{i + 1}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
