import { Heart, Activity, Stethoscope, Users, Building, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const audiences = [
  {
    icon: Activity,
    title: "Patients with Motor Impairments",
    desc: "Provides total digital autonomy for individuals living with ALS, severe Parkinson's, and Cerebral Palsy through zero-touch gaze and micro-gestures.",
  },
  {
    icon: Stethoscope,
    title: "Rural Primary Healthcare Centers (PHCs)",
    desc: "Enables village health workers and ASHA workers to perform point-of-care respiratory triage, anemia screening, and vital tracking on a single phone.",
  },
  {
    icon: Heart,
    title: "Elderly & Chronic Disease Caregivers",
    desc: "Protects seniors with automated tremor smoothing, audio drug schedules, and instant Jan Aushadhi generic pharmaceutical savings.",
  },
];

export function WhoItsFor() {
  return (
    <section id="who" className="relative overflow-hidden py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-700">
              ✦ Target Impact
            </span>
            <h2 className="mt-3 font-sans text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Who PulseEdge-OS Serves
            </h2>
            <p className="mt-3 font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
              Designed for clinical-grade reliability at the point of care and uncompromising digital accessibility.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {audiences.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="glass-panel p-6 sm:p-7 flex flex-col justify-between h-full hover:border-sky-300 transition-all">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-sans text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                  ✦ Primary Impact Group 0{i + 1}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
