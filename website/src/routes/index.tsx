import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { AppSection } from "@/components/sections/AppSection";
import { OriginOSShowcase } from "@/components/sections/OriginOSShowcase";
import { CaregiverHudSection } from "@/components/sections/CaregiverHudSection";
import { IqooCommunitySection } from "@/components/sections/IqooCommunitySection";
import { InteractiveSimulator } from "@/components/sections/InteractiveSimulator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhoItsFor } from "@/components/sections/WhoItsFor";
import { Footer } from "@/components/sections/Footer";

const title = "PulseEdge-OS (Sahayak) — Air-Gapped Medical Diagnostics & Zero-Touch Neuro-Accessibility | iQOO Hackathon 2026";
const description =
  "PulseEdge-OS is an air-gapped, multimodal medical diagnostic operating layer and zero-touch neuro-accessibility engine built for the Snapdragon NPU and OriginOS cross-device ecosystem.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-[#f3a027] focus:px-4 focus:py-3 focus:text-base focus:font-extrabold focus:text-[#121b14]"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        <AppSection />
        <OriginOSShowcase />
        <IqooCommunitySection />
        <CaregiverHudSection />
        <InteractiveSimulator />
        <HowItWorks />
        <WhoItsFor />
      </main>
      <Footer />
    </div>
  );
}
