"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { industries } from "@/lib/content";

export function Industries() {
  return (
    <section
      id="who"
      aria-labelledby="who-heading"
      className="relative border-t border-line py-14 md:py-20"
    >
      <div className="container-edge">
        {/* Full-width header — no empty side column */}
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="kicker mb-6">01 — Who it's for</p>
          </Reveal>
          <h2
            id="who-heading"
            className="font-display text-display-lg font-semibold tracking-tight text-balance text-ink"
          >
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.06}
              transition={{ type: "spring", stiffness: 200, damping: 32 }}
            >
              Built for businesses that don't have time for marketing.
            </VerticalCutReveal>
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-pretty text-body-xl leading-snug text-ink-muted">
              If you make great food, fix great cars, train great clients, or
              sell great products — your time belongs there. Not in Canva at
              11pm.
            </p>
          </Reveal>
        </div>

        {/* Industry grid — 3D tilt cards with cursor sheen */}
        <div
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-24 md:grid-cols-4"
          style={{ perspective: "1200px" }}
        >
          {industries.map((item, i) => (
            <IndustryTile
              key={item.label}
              index={i}
              label={item.label}
              sub={item.sub}
              Icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryTile({
  index,
  label,
  sub,
  Icon,
}: {
  index: number;
  label: string;
  sub?: string;
  Icon: LucideIcon;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  const tiltX = useSpring(rX, { stiffness: 200, damping: 22, mass: 0.5 });
  const tiltY = useSpring(rY, { stiffness: 200, damping: 22, mass: 0.5 });

  const sheen = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(177,78,255,0.20), transparent 55%)`;
  const z = useTransform(tiltX, [-8, 8], [10, -10]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rX.set(-(py - 0.5) * 8);
    rY.set((px - 0.5) * 10);
    mx.set(px * 100);
    my.set(py * 100);
  }
  function onLeave() {
    rX.set(0);
    rY.set(0);
    mx.set(50);
    my.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
        z,
      }}
      className="group relative flex min-h-[240px] flex-col justify-between gap-8 bg-bg p-7 transition-colors duration-500 hover:bg-bg-raised md:min-h-[280px] md:p-9"
    >
      <motion.div
        aria-hidden="true"
        style={{ background: sheen }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between">
        <div className="relative">
          <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-accent/0 blur-2xl transition-all duration-700 group-hover:bg-accent/30" />
          <Icon
            size={36}
            strokeWidth={1.4}
            className="text-ink-muted transition-all duration-500 group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:text-accent md:size-12"
          />
        </div>
        <span className="font-mono text-[11px] tracking-widest text-ink-dim transition-colors group-hover:text-accent">
          0{index + 1}
        </span>
      </div>

      <div className="relative">
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink transition-transform duration-500 group-hover:-translate-y-1 md:text-2xl">
          {label}
        </h3>
        {sub && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted md:text-base">
            {sub}
          </p>
        )}
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent via-accent/80 to-transparent transition-transform duration-700 group-hover:scale-x-100"
      />
    </motion.div>
  );
}
