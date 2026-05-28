"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { InViewVideo } from "@/components/ui/in-view-video";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  workSamplesFeatured,
  workSamplesGallery,
} from "@/lib/content";
import { cn } from "@/lib/utils";

const FEATURED_TOTAL = workSamplesFeatured.length;
const AUTOPLAY_MS = 5000;

export function Work() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // progress 0 → 1 within the current slot
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sample = workSamplesFeatured[active];

  function next() {
    setActive((a) => (a + 1) % FEATURED_TOTAL);
    setTick(0);
  }
  function prev() {
    setActive((a) => (a - 1 + FEATURED_TOTAL) % FEATURED_TOTAL);
    setTick(0);
  }
  function jumpTo(i: number) {
    setActive(i);
    setTick(0);
  }

  // Autoplay loop — ticks ~30fps, advances when full
  useEffect(() => {
    if (paused) return;
    const step = 1 / (AUTOPLAY_MS / 33);
    intervalRef.current = setInterval(() => {
      setTick((t) => {
        if (t + step >= 1) {
          setActive((a) => (a + 1) % FEATURED_TOTAL);
          return 0;
        }
        return t + step;
      });
    }, 33);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative border-t border-line bg-bg py-14 md:py-20"
    >
      <div className="container-edge">
        {/* Section header */}
        <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
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
              A live campaign system, slide by slide. Hit pause if you want to
              dwell.
            </p>
          </Reveal>
        </div>

        {/* === FEATURED STAGE === */}
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-12 md:gap-10">
          {/* Side metadata */}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

            {/* Slide picker — small numbered chips */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              {workSamplesFeatured.map((s, i) => (
                <button
                  key={s.n}
                  onClick={() => jumpTo(i)}
                  aria-label={`Show ${s.title}`}
                  aria-pressed={active === i}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border transition-all",
                    active === i
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-line hover:border-ink/40"
                  )}
                >
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="80px"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        active === i ? "opacity-100" : "opacity-55 hover:opacity-85"
                      )}
                    />
                  ) : null}
                  <span className="absolute bottom-1 left-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/90">
                    {s.n}
                  </span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                className="grid h-10 w-10 place-items-center rounded-full border border-line-bright text-ink transition-all hover:border-accent hover:text-accent"
              >
                {paused ? (
                  <Play size={14} strokeWidth={1.5} />
                ) : (
                  <Pause size={14} strokeWidth={1.5} />
                )}
              </button>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-bright text-ink transition-all hover:border-accent hover:text-accent"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-bright text-ink transition-all hover:border-accent hover:text-accent"
              >
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                {paused ? "Paused" : "Auto"}
              </span>
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

              {/* Progress bar that fills as autoplay ticks */}
              <div className="mt-3 flex gap-1.5">
                {workSamplesFeatured.map((s, i) => {
                  const isActive = active === i;
                  const isPast = i < active;
                  const fill = isActive ? tick : isPast ? 1 : 0;
                  return (
                    <button
                      key={s.n}
                      onClick={() => jumpTo(i)}
                      aria-label={`Jump to ${s.title}`}
                      className="group h-1 flex-1 overflow-hidden rounded-full bg-line-bright"
                    >
                      <span
                        className="block h-full rounded-full bg-accent transition-all duration-100 ease-linear"
                        style={{ width: `${fill * 100}%` }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* === HOVER-EXPAND GALLERY for the rest === */}
        {/* Hidden on phone (heavy multi-video strip) — desktop unchanged */}
        <Reveal delay={0.15} className="hidden md:block">
          <div className="mt-16 md:mt-20">
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
