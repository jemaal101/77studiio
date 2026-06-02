"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Mail, Layers, Rocket, BarChart3, Sparkles } from "lucide-react";
import { brand } from "@/lib/content";

type Step = {
  n: string;
  title: string;
  when: string;
  body: string;
  icon: React.ElementType;
  cta?: { label: string; href: string };
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Contact",
    when: "Today",
    body: `Send a quick email, DM, or text — whatever's fastest. Tell us your business and what you need. We reply within hours and book a 15-min Google Meet or Zoom on the spot.`,
    icon: Mail,
    cta: { label: `Email ${brand.email}`, href: `mailto:${brand.email}` },
  },
  {
    n: "02",
    title: "Bundle",
    when: "Within 48h",
    body: "Pick Spark, Pulse, Engine, or Custom. First month upfront. Start date locked. No long contracts, no setup fees.",
    icon: Layers,
  },
  {
    n: "03",
    title: "Build",
    when: "Week 1 onward",
    body: "We brief, generate, edit, caption. We schedule every post for peak-window publishing. Content lands weekly in your Drive — ready to go.",
    icon: Rocket,
  },
  {
    n: "04",
    title: "Review",
    when: "Every month",
    body: "Monthly strategy call where we open the analytics together — every ad, every reel, every story. We show you which hooks scrolled, which retention curves dipped, which creatives we're killing, and which we're scaling.",
    icon: BarChart3,
  },
  {
    n: "05",
    title: "Scale",
    when: "Quarterly",
    body: "Channels expanded. Ad spend optimized off the data. New pillars unlocked. The compounding kicks in — that's when growth gets unfair.",
    icon: Sparkles,
  },
];

const N = STEPS.length;
// Section height tuned so each step gets a FULL viewport of scroll dwell.
// Pin duration = section_height - 100vh (viewport). We want per-step = 100vh,
// so section_height = N * 100vh + 100vh (extra viewport so the last step
// also dwells for a full screen before unpinning).
const VH_PER_STEP = 100 + 100 / N; // For N=5 → 120vh per step, total 600vh.

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Lenis already smooths the scroll value globally — using scrollYProgress
  // directly avoids the double-smoothing lag we had with useSpring on top.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N + 0.0001)));
    if (i !== active) setActive(i);
  });

  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const current = STEPS[active];
  const Icon = current.icon;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      ref={ref}
      style={{ height: `${N * VH_PER_STEP}vh` }}
      className="relative border-t border-line"
    >
      {/* Pinned stage */}
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="container-edge grid w-full gap-10 md:grid-cols-12 md:gap-12">
          {/* LEFT — heading + step list rail */}
          <div className="md:col-span-5">
            <p className="kicker mb-4">— Process</p>
            <h2
              id="process-heading"
              className="font-display text-display-lg font-medium tracking-tight text-balance text-ink"
            >
              How it{" "}
              <span className="font-serif font-normal italic text-accent">
                works.
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-body-lg text-ink-muted">
              Scroll. One step at a time.
            </p>

            {/* Vertical step rail */}
            <ol className="mt-10 space-y-3 border-l border-line pl-6 md:mt-14">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <li
                    key={s.n}
                    className="relative flex items-center gap-3 transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : isPast ? 0.6 : 0.35 }}
                  >
                    {/* Node dot on the rail */}
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[31px] inline-block h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                        isActive
                          ? "scale-150 bg-accent shadow-[0_0_18px_rgba(177,78,255,0.8)]"
                          : isPast
                            ? "bg-accent/70"
                            : "bg-line-bright"
                      }`}
                    />
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                        isActive ? "text-accent" : "text-ink-muted"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`font-display text-base transition-colors ${
                        isActive ? "text-ink" : "text-ink-muted"
                      }`}
                    >
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* RIGHT — animated step display */}
          <div className="md:col-span-7">
            {/* Relative + min-height container lets the article live as
                `absolute inset-0`, which means the outgoing + incoming steps
                can overlap during transitions (no mode="wait" pause). */}
            <div className="relative min-h-[440px] md:min-h-[480px]">
              <AnimatePresence initial={false}>
                <motion.article
                  key={current.n}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 rounded-3xl border border-line bg-bg-raised/60 p-7 md:p-10"
                >
                <div className="flex items-start justify-between gap-5">
                  <span className="font-display text-[5.5rem] font-medium leading-[0.85] tracking-tight text-ink md:text-[8rem]">
                    {current.n}
                  </span>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/[0.06] text-accent md:h-14 md:w-14">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                </div>

                <p className="kicker mt-4">{current.when}</p>
                <h3 className="mt-2 font-display text-display-md font-medium tracking-tight text-balance text-ink">
                  {current.title}
                </h3>
                <p className="mt-5 max-w-xl text-pretty text-body-lg leading-relaxed text-ink-muted">
                  {current.body}
                </p>

                {current.cta && (
                  <a
                    href={current.cta.href}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(177,78,255,0.45)]"
                  >
                    {current.cta.label}
                  </a>
                )}
              </motion.article>
            </AnimatePresence>
            </div>

            {/* Step counter + scroll hint */}
            <div className="mt-6 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
                Scroll ↓
              </p>
            </div>

            {/* Bottom progress rail (full section) */}
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
              <motion.span
                style={{ width: railFill }}
                className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
