"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { InViewVideo } from "@/components/ui/in-view-video";
import { pillars } from "@/lib/content";

export function Pillars() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-t border-line py-16 md:py-24"
    >
      <div className="container-edge">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker mb-6">02 — What we build</p>
            </Reveal>
            <h2
              id="services-heading"
              className="font-display text-display-lg font-medium text-balance text-ink"
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.08}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                What we build.
              </VerticalCutReveal>
            </h2>
          </div>
          <Reveal delay={0.1} className="md:max-w-xs">
            <p className="text-pretty text-lg italic text-ink-muted">
              Four pillars. One studio.
            </p>
          </Reveal>
        </div>

        {/* Alternating editorial blocks */}
        <div className="mt-20 flex flex-col gap-24 md:mt-32 md:gap-40">
          {pillars.map((p, i) => (
            <Pillar key={p.n} pillar={p} flipped={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillar({
  pillar,
  flipped,
}: {
  pillar: (typeof pillars)[number];
  flipped: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Numeral parallax — large character drifts vertically as block crosses viewport
  const numeralY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["20%", "-20%"]
  );
  // Glow shifts horizontally for atmosphere
  const glowX = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : flipped ? ["-15%", "15%"] : ["15%", "-15%"]
  );

  // 3D tilt on hover
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const tiltX = useSpring(rX, { stiffness: 150, damping: 20 });
  const tiltY = useSpring(rY, { stiffness: 150, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rX.set(-py * 5);
    rY.set(px * 6);
  }
  function onLeave() {
    rX.set(0);
    rY.set(0);
  }

  return (
    <article
      ref={ref}
      className={`grid items-start gap-8 md:grid-cols-12 md:gap-12 ${flipped ? "md:[&>*:first-child]:col-start-7" : ""}`}
    >
      {/* Text */}
      <div className={`md:col-span-6 ${flipped ? "md:col-start-7" : ""}`}>
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-accent">{pillar.n}</span>
            <span className="kicker">Pillar</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 className="mt-6 font-display text-display-lg text-balance text-ink">
            {pillar.title}
          </h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-pretty text-body-xl leading-snug text-ink-muted">
            {pillar.body}
          </p>
        </Reveal>
      </div>

      {/* Visual — looped video, still image, or atmospheric placeholder */}
      <div
        className={`md:col-span-5 ${flipped ? "md:col-start-1 md:row-start-1" : "md:col-start-8"}`}
        style={{ perspective: "1400px" }}
      >
        <Reveal delay={0.15}>
          <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d",
            }}
            className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-line bg-bg-raised shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] md:aspect-[4/5]"
          >
            {pillar.video ? (
              <>
                <InViewVideo
                  src={pillar.video}
                  className="absolute inset-0 [&_video]:scale-[1.02] [&_video]:transition-transform [&_video]:duration-[1200ms] group-hover:[&_video]:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20 mix-blend-multiply"
                />
              </>
            ) : pillar.image ? (
              <>
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                />
              </>
            ) : (
              <>
                <motion.div
                  aria-hidden="true"
                  style={{ x: glowX }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(177,78,255,0.22),transparent_60%)]"
                />
                <motion.div
                  aria-hidden="true"
                  style={{ y: numeralY }}
                  className="absolute inset-0 grid place-items-center"
                >
                  <div className="font-display text-[12rem] font-medium leading-none text-ink-dim/40 md:text-[18rem]">
                    {pillar.n}
                  </div>
                </motion.div>
              </>
            )}
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                {pillar.video || pillar.image ? "/live" : "/placeholder"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                {pillar.title}
              </span>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </article>
  );
}
