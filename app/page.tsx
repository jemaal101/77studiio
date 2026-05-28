import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CurtainReveal } from "@/components/ui/curtain-reveal";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { Pillars } from "@/components/sections/pillars";
import { Work } from "@/components/sections/work";
import { BeforeAfter } from "@/components/sections/before-after";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { Pricing } from "@/components/sections/pricing";
import { Why } from "@/components/sections/why";
import { Manifesto } from "@/components/sections/manifesto";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { StickyCta } from "@/components/sections/sticky-cta";

export default function HomePage() {
  return (
    <main className="relative">
      <CurtainReveal />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Clients />
      <Pillars />
      <Work />
      {/* Before/After hidden on phone (heavy video section) — desktop unchanged */}
      <div className="hidden md:block">
        <BeforeAfter />
      </div>
      <Industries />
      <Process />
      <Pricing />
      <Why />
      <Manifesto />
      <Contact />
      <Footer />
      <StickyCta />
    </main>
  );
}
