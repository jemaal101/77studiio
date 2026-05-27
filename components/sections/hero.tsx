"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROTATING_WORDS = ["evolved.", "automated.", "managed.", "ahead.", "yours."];

export function Hero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const words = useMemo(() => ROTATING_WORDS, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((i) => (i === words.length - 1 ? 0 : i + 1));
    }, 2400);
    return () => clearTimeout(t);
  }, [index, words.length]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden bg-bg pb-20 pt-32 md:pb-28 md:pt-40"
    >
      {/* Background video — full bleed, behind everything */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster=""
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.55]"
      >
        <source src="/pillars/pillar-03.mp4" type="video/mp4" />
      </video>

      {/* Layered overlays — vignette + bottom darken + brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/60 via-bg/40 to-bg"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,transparent_0%,rgba(8,8,8,0.65)_85%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-accent/20 blur-[180px]"
      />

      <div className="container-edge relative grid w-full gap-12 md:grid-cols-12 md:items-end">
        {/* Left: headline + hook */}
        <div className="md:col-span-8">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="kicker mb-8"
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent align-middle" />
            Melbourne · Australia-wide · V1 cohort open
          </motion.p>

          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.025em] text-ink">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="block"
            >
              Marketing,
            </motion.span>
            <span className="relative mt-1 inline-flex h-[1.05em] w-full max-w-[9ch] overflow-hidden align-bottom md:max-w-[10ch]">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="absolute font-serif font-normal italic text-accent"
                  initial={{ y: "-110%", opacity: 0, filter: "blur(8px)" }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  animate={
                    index === i
                      ? { y: 0, opacity: 1, filter: "blur(0px)" }
                      : {
                          y: index > i ? "-150%" : "150%",
                          opacity: 0,
                          filter: "blur(6px)",
                        }
                  }
                >
                  {reduced ? words[0] : w}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Hook */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="mt-10 max-w-2xl text-pretty text-lg font-medium leading-snug text-ink md:text-xl"
          >
            You bring the market.{" "}
            <span className="font-serif italic text-accent">
              We bring the winning creative system.
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-3 max-w-xl text-pretty text-body-lg leading-relaxed text-ink-muted"
          >
            AI-powered, human-directed ads for brands that can't afford to guess
            — in any niche.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" variant="default">
              <a href="#pricing">
                See Pricing
                <ArrowDownRight size={18} strokeWidth={1.75} className="ml-2" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact">
                Book a Call
                <PhoneCall size={16} strokeWidth={1.75} className="ml-2" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Right: editorial meta column */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="md:col-span-4 md:pl-6"
        >
          <div className="flex flex-col gap-7 border-l border-line-bright pl-6 md:gap-9">
            <div>
              <p className="kicker mb-2">Operator</p>
              <p className="font-display text-lg text-ink">One studio. End-to-end.</p>
            </div>
            <div>
              <p className="kicker mb-2">Tempo</p>
              <p className="font-display text-lg text-ink">48-hour briefs.</p>
            </div>
            <div>
              <p className="kicker mb-2">Terms</p>
              <p className="font-display text-lg text-ink">
                Month-to-month. You own everything.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
