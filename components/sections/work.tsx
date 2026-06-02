"use client";

import { Reveal } from "@/components/ui/reveal";
import { ImageGallery } from "@/components/ui/image-gallery";
import { Skiper34Stack } from "@/components/v1/skiper34";
import {
  workSamplesFeatured,
  workSamplesGallery,
} from "@/lib/content";

export function Work() {
  const stackItems = workSamplesFeatured
    .filter((s) => !!s.image)
    .map((s) => ({ src: s.image as string, alt: `${s.title} — ${s.client}` }));

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative border-t border-line"
    >
      {/* Section header (above the stack) */}
      <div className="container-edge pt-14 md:pt-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker mb-3">— Selected output</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="work-heading"
                className="font-display text-display-md font-medium tracking-tight text-balance text-ink md:text-display-lg"
              >
                Work that{" "}
                <span className="font-serif font-normal italic text-accent">
                  performs.
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="md:max-w-xs">
            <p className="text-body-lg text-ink-muted">
              Scroll. Each piece stacks. Real briefs, real outputs.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── SKIPER34 STACK — sticky cards that scale + rotate out as you scroll ── */}
      <Skiper34Stack items={stackItems} />

      {/* ── HOVER-EXPAND GALLERY (desktop only) ── */}
      <div className="container-edge pb-14 md:pb-20">
        <Reveal delay={0.15} className="hidden md:block">
          <div className="mt-8 md:mt-12">
            <div className="mb-6 flex items-end justify-between gap-6">
              <h3 className="font-display text-display-sm font-medium tracking-tight text-ink">
                More from the studio.
              </h3>
              <p className="hidden text-sm text-ink-muted md:block">
                Hover any strip to expand it.
              </p>
            </div>
            <ImageGallery items={workSamplesGallery} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
