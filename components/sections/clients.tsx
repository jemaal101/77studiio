"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { clients } from "@/lib/content";

export function Clients() {
  return (
    <section
      aria-labelledby="clients-heading"
      className="relative border-t border-line py-14 md:py-20"
    >
      <div className="container-edge mb-10 md:mb-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="kicker mb-4">— Trusted by</p>
            <h2
              id="clients-heading"
              className="font-display text-display-md text-balance text-ink md:text-display-lg"
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.06}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                Brands building with us.
              </VerticalCutReveal>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:max-w-sm">
            <p className="text-body-lg text-ink-muted">
              Food, beverage, retail, fashion, automotive — each one handled in
              full.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Buttery-smooth logo train */}
      <div className="relative">
        <InfiniteSlider
          className="w-full"
          duration={28}
          durationOnHover={60}
          gap={96}
        >
          {clients.map((c) => (
            <div
              key={c.name}
              className="group flex h-24 w-44 shrink-0 items-center justify-center md:h-32 md:w-64"
            >
              <span className="sr-only">{c.name}</span>
              <div className="relative h-full w-full">
                <Image
                  src={c.logo}
                  alt=""
                  fill
                  sizes="256px"
                  className="object-contain opacity-70 transition-all duration-500 [filter:grayscale(1)_brightness(0)_invert(1)] group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </InfiniteSlider>

        <ProgressiveBlur
          direction="left"
          blurLayers={3}
          blurIntensity={0.5}
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[10%]"
        />
        <ProgressiveBlur
          direction="right"
          blurLayers={3}
          blurIntensity={0.5}
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[10%]"
        />
      </div>
    </section>
  );
}
