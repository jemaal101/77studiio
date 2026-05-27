"use client";

import { motion } from "framer-motion";
import { Mail, Layers, Rocket, BarChart3, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { brand } from "@/lib/content";

const STEPS = [
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

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative border-t border-line py-16 md:py-24"
    >
      <div className="container-edge">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-5xl md:mb-20">
          <Reveal>
            <p className="kicker mb-4">— Process</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="process-heading"
              className="font-display text-display-lg font-medium tracking-tight text-balance text-ink"
            >
              How it{" "}
              <span className="font-serif font-normal italic text-accent">
                works.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-pretty text-body-lg text-ink-muted">
              Five steps. Read in order. No mystery, no slide decks, no surprises.
            </p>
          </Reveal>
        </div>

        {/* Steps — numbered cards, connected by an accent rail */}
        <div className="relative">
          {/* Rail behind the cards */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-accent/60 via-line-bright to-transparent md:left-1/2 md:block"
          />

          <ol className="space-y-5 md:space-y-7">
            {STEPS.map((s, i) => (
              <StepCard key={s.n} step={s} index={i} flipped={i % 2 === 1} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

type Step = {
  n: string;
  title: string;
  when: string;
  body: string;
  icon: React.ElementType;
  cta?: { label: string; href: string };
};

function StepCard({
  step,
  index,
  flipped,
}: {
  step: Step;
  index: number;
  flipped: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-12"
    >
      {/* Node dot */}
      <span
        aria-hidden="true"
        className="absolute left-6 top-7 hidden -translate-x-1/2 md:left-1/2 md:block"
      >
        <span className="block h-3 w-3 rounded-full bg-accent shadow-[0_0_18px_rgba(177,78,255,0.7)]" />
      </span>

      <div
        className={`group relative overflow-hidden rounded-3xl border border-line bg-bg-raised/60 p-7 transition-all duration-500 hover:border-line-bright hover:bg-bg-raised md:p-9 ${
          flipped ? "md:col-start-2" : "md:col-start-1"
        }`}
      >
        {/* Step number — huge, deco */}
        <div className="mb-6 flex items-start justify-between gap-5">
          <span className="font-display text-[5rem] font-medium leading-[0.85] tracking-tight text-ink-dim/50 transition-colors duration-500 group-hover:text-accent/60 md:text-[6.5rem]">
            {step.n}
          </span>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-bright text-ink-muted transition-all duration-500 group-hover:border-accent group-hover:bg-accent/[0.06] group-hover:text-accent md:h-12 md:w-12">
            <Icon size={20} strokeWidth={1.5} />
          </span>
        </div>

        <p className="kicker mb-2">{step.when}</p>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          {step.title}
        </h3>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-ink-muted">
          {step.body}
        </p>

        {step.cta && (
          <a
            href={step.cta.href}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(177,78,255,0.45)]"
          >
            {step.cta.label}
          </a>
        )}

        {/* Hover underline */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent via-accent/70 to-transparent transition-transform duration-700 group-hover:scale-x-100"
        />
      </div>
    </motion.li>
  );
}
