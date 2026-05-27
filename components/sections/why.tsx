"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { whyTabs } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Why() {
  const [activeId, setActiveId] = useState(whyTabs[0].id);
  const active = whyTabs.find((t) => t.id === activeId) ?? whyTabs[0];

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="relative border-t border-line bg-bg py-14 md:py-20"
    >
      <div className="container-edge">
        {/* Header — concise */}
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
          <Reveal>
            <p className="kicker mb-3">— Why 77</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="why-heading"
              className="font-display text-display-md font-medium tracking-tight text-balance text-ink md:text-display-lg"
            >
              <span className="text-ink">77 Studio Co</span>
              <span className="mx-3 text-ink-muted">vs.</span>
              <span className="font-serif font-normal italic text-ink-muted">
                a traditional agency.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-body-lg text-ink-muted">
              Pick a category. Watch the gap.
            </p>
          </Reveal>
        </div>

        {/* Tab strip */}
        <Reveal delay={0.15}>
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
            {whyTabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    "relative rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all md:px-5 md:py-2.5 md:text-[11px]",
                    isActive
                      ? "border-accent bg-accent text-black shadow-[0_0_24px_rgba(177,78,255,0.45)]"
                      : "border-line-bright bg-bg-raised/50 text-ink-muted hover:border-ink/40 hover:text-ink"
                  )}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Comparison */}
        <div className="mx-auto mt-8 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Active headline */}
              <h3 className="mx-auto mb-8 max-w-3xl text-center font-display text-2xl font-semibold text-balance text-ink md:text-3xl">
                {active.headline}
              </h3>

              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                {/* 77 column */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/[0.10] via-bg-raised/60 to-bg-raised p-7 md:p-9"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                      77 Studio Co
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black shadow-[0_0_24px_rgba(177,78,255,0.5)]">
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-medium tracking-tight text-balance text-ink md:text-[2.5rem]">
                    {active.us.value}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-ink-muted">
                    {active.us.detail}
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-70"
                  />
                </motion.div>

                {/* Traditional column */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.16 }}
                  className="relative overflow-hidden rounded-2xl border border-line bg-bg-raised/40 p-7 md:p-9"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                      Traditional agency
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-bright text-ink-muted">
                      <X size={16} strokeWidth={2} />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-semibold tracking-tight text-balance text-ink-muted/80 line-through decoration-line-bright decoration-[2px] md:text-[2.5rem]">
                    {active.them.value}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-ink-muted">
                    {active.them.detail}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
