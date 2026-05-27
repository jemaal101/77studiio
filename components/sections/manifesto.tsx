"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image moves slower than scroll (classic parallax — image is the "background")
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-12%", "12%"]
  );
  // Image scales slightly as the section enters and leaves
  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduced ? [1, 1, 1] : [1.08, 1, 1.08]
  );
  // Text floats opposite to the image — small magnitude so it doesn't feel stunty
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["12%", "-12%"]
  );

  return (
    <section
      ref={ref}
      aria-labelledby="manifesto-heading"
      className="relative isolate overflow-hidden border-t border-line"
    >
      {/* Background image — chat1.png (fractured rock, gold energy) */}
      <motion.div
        aria-hidden="true"
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/hero/manifesto.png"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover opacity-[0.45]"
        />
        {/* Tonal mask — purple-shift highlights so the gold flecks read as brand-adjacent, not foreign */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(177,78,255,0.10), transparent 70%), linear-gradient(180deg, rgba(8,8,8,0.55), rgba(8,8,8,0.85))",
          }}
        />
      </motion.div>

      {/* Content — single tall column, vertically centered */}
      <motion.div
        style={{ y: textY }}
        className="container-edge relative grid min-h-[90vh] place-items-center py-16 md:py-24"
      >
        <div className="max-w-3xl text-center">
          <p className="kicker mb-6">— Manifesto</p>
          <h2
            id="manifesto-heading"
            className="font-display text-display-lg font-medium tracking-tight text-balance text-ink md:text-display-xl"
          >
            Old agencies break.
            <br />
            <span className="font-serif font-normal italic text-accent">
              New studios run.
            </span>
          </h2>
          <p className="mx-auto mt-10 max-w-2xl text-pretty text-body-xl leading-snug text-ink-muted">
            Same brief. A tenth of the time. A fraction of the cost. None of the
            shortcuts.
          </p>
        </div>
      </motion.div>

      {/* Hairline accents top + bottom — frame the moment */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-bright to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-bright to-transparent" />
    </section>
  );
}
