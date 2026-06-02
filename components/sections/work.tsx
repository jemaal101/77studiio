"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { InViewVideo } from "@/components/ui/in-view-video";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  workSamplesFeatured,
  workSamplesGallery,
} from "@/lib/content";

const FEATURED_TOTAL = workSamplesFeatured.length;
// Same dwell formula as Process — each slide gets a full viewport of scroll.
// section_height = N * VH_PER_SLIDE, pin_duration = section_height - 100vh,
// per-slide = 100vh, so VH_PER_SLIDE = 100 + 100/N.
const VH_PER_SLIDE = 100 + 100 / FEATURED_TOTAL; // For N=4 → 125vh, total 500vh.

export function Work() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(
      FEATURED_TOTAL - 1,
      Math.max(0, Math.floor(v * FEATURED_TOTAL + 0.0001))
    );
    if (i !== active) setActive(i);
  });

  // Smooth fill width for the progress rail
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const sample = workSamplesFeatured[active];

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative border-t border-line"
    >
      {/* Section header (above the pin) */}
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
              Scroll to advance — every slide a step deeper into the system.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── PINNED FEATURED STAGE — scroll drives the active slide ── */}
      <div
        ref={pinRef}
        style={{ height: `${FEATURED_TOTAL * VH_PER_SLIDE}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          <div className="container-edge mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-12 md:gap-10">
            {/* Metadata column */}
            <div className="md:col-span-6 md:order-1">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                  {sample.n} / {String(FEATURED_TOTAL).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {sample.discipline}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={sample.n}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 flex flex-col gap-3"
                >
                  <p className="kicker text-accent/90">{sample.client}</p>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-balance text-ink md:text-3xl">
                    {sample.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-ink-muted md:text-base">
                    {sample.note}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Slide list — visual progress (active highlighted) */}
              <ul className="mt-7 space-y-2.5">
                {workSamplesFeatured.map((s, i) => {
                  const isActive = i === active;
                  const isPast = i < active;
                  return (
                    <li
                      key={s.n}
                      className="flex items-center gap-3 transition-opacity duration-500"
                      style={{ opacity: isActive ? 1 : isPast ? 0.7 : 0.4 }}
                    >
                      <span
                        className={`inline-block h-1 transition-all duration-500 ${
                          isActive ? "w-10 bg-accent" : "w-6 bg-line-bright"
                        }`}
                      />
                      <span
                        className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                          isActive ? "text-accent" : "text-ink-muted"
                        }`}
                      >
                        {s.n}
                      </span>
                      <span
                        className={`text-sm ${
                          isActive ? "text-ink" : "text-ink-muted"
                        }`}
                      >
                        {s.title}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Hint + progress rail */}
              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
                Scroll ↓
              </p>
              <div className="mt-3 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line">
                <motion.span
                  style={{ width: railFill }}
                  className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
                />
              </div>
            </div>

            {/* Stage — 9:16 phone-shape, comfortably sized */}
            <div className="md:col-span-6 md:order-2">
              <div className="relative mx-auto w-full max-w-[420px]">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[28px] border border-line bg-bg-raised shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                  {/* Soft inner glow */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(177,78,255,0.08),transparent_70%)]" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sample.n + "-img"}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-3 md:p-4"
                    >
                      {sample.video ? (
                        <InViewVideo src={sample.video} className="h-full w-full" />
                      ) : sample.image ? (
                        <Image
                          src={sample.image}
                          alt={`${sample.title} — ${sample.client}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          quality={100}
                          className="!relative object-contain"
                          priority
                        />
                      ) : null}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOVER-EXPAND GALLERY (desktop only, hidden on phone) ── */}
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
