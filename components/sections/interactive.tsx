"use client";

import { SplineScene } from "@/components/ui/spline-scene";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Reveal } from "@/components/ui/reveal";

export function Interactive() {
  return (
    <section
      id="ai"
      aria-labelledby="ai-heading"
      className="relative border-t border-line py-16 md:py-24"
    >
      <div className="container-edge">
        <Card className="relative h-[640px] w-full overflow-hidden border-line-bright bg-black/[0.96] md:h-[560px]">
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="rgba(177,78,255,0.55)"
          />

          <div className="flex h-full flex-col md:flex-row">
            {/* Left content */}
            <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-14">
              <p className="kicker mb-6">— AI-native studio</p>
              <h2
                id="ai-heading"
                className="bg-gradient-to-b from-white to-white/50 bg-clip-text font-display text-4xl font-bold tracking-tight text-transparent md:text-6xl"
              >
                <VerticalCutReveal
                  splitBy="words"
                  staggerDuration={0.08}
                  staggerFrom="first"
                  transition={{ type: "spring", stiffness: 200, damping: 32 }}
                >
                  Interactive. Intelligent. Instant.
                </VerticalCutReveal>
              </h2>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
                  We don't just use AI — we orchestrate it. Generate cinematic
                  spots in hours. Iterate visuals in seconds. Ship work that
                  agencies need three weeks for.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line-bright pt-6 md:max-w-md">
                  <div>
                    <p className="font-display text-3xl text-ink md:text-4xl">
                      48h
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Brief to delivery
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-3xl text-ink md:text-4xl">
                      10×
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Faster iteration
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-3xl text-ink md:text-4xl">
                      4K
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Cinematic output
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Spline 3D scene */}
            <div className="relative flex-1">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full"
              />
              {/* Subtle edge fade so it integrates with the card */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 to-transparent md:w-32" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
