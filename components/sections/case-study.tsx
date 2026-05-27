"use client";

import { Reveal } from "@/components/ui/reveal";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

// Real Evolvejem case-study slides — these are our own brand work,
// showing the system end-to-end (assets, mockups, repurposing, infographics).
const FRAMES = [
  { src: "/case/01.png", alt: "Print-ready marketing assets" },
  { src: "/case/02.png", alt: "Mockup testing for packaging variants" },
  { src: "/case/03.png", alt: "Editing and repurposing existing materials" },
  { src: "/case/04.png", alt: "Infographics and explanatory content" },
  // Loop the first three for the back-half of the parallax so the grid stays full
  { src: "/case/01.png", alt: "Print-ready marketing assets" },
  { src: "/case/02.png", alt: "Mockup testing for packaging variants" },
  { src: "/case/03.png", alt: "Editing and repurposing existing materials" },
];

export function CaseStudy() {
  return (
    <section
      id="case-study"
      aria-labelledby="case-heading"
      className="relative isolate overflow-hidden bg-bg"
    >
      {/* Intro panel */}
      <div className="relative border-t border-line py-16 md:py-24">
        <div className="container-edge mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="kicker mb-6">— Case in point</p>
          </Reveal>
          <h2
            id="case-heading"
            className="font-display text-display-lg font-semibold tracking-tight text-balance text-ink"
          >
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.07}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              containerClassName="justify-center"
            >
              One brand. The full system.
            </VerticalCutReveal>
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-body-lg leading-relaxed text-ink-muted">
              Scroll. Watch how a single brief turns into print-ready assets,
              packaging mockups, repurposed cuts, and explanatory infographics —
              all from one studio.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
              Scroll ↓
            </p>
          </Reveal>
        </div>
      </div>

      <ZoomParallax images={FRAMES} />
    </section>
  );
}
