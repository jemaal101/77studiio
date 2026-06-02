"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Skiper34 — sticky stacked cards.
 * Each card pins at top, then scales + rotates out as the user scrolls; the
 * inner image counter-rotates so its orientation reads correctly through the
 * exit. Source: @gurvinder-singh02 / skiper-ui. Adapted for 77 (brand crop,
 * lenis at root level, our case images).
 */

type Item = {
  src: string;
  alt?: string;
};

export function Skiper34Stack({ items }: { items: Item[] }) {
  return (
    <section className="relative flex w-full flex-col items-center gap-[10vh] px-4 pt-[20vh]">
      <div className="absolute left-1/2 top-12 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
        <span className="after:from-bg after:to-ink relative max-w-[16ch] font-mono text-[11px] uppercase tracking-[0.25em] leading-tight text-ink-muted opacity-60 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Scroll to see each piece
        </span>
      </div>

      {items.map((item, idx) => (
        <StickyCard key={idx} item={item} />
      ))}
    </section>
  );
}

function StickyCard({ item }: { item: Item }) {
  const vertMargin = 8; // tighter than the original 10vh so each card is taller on screen
  const container = useRef<HTMLDivElement>(null);
  const [maxScrollY, setMaxScrollY] = useState(Infinity);

  const filter = useMotionValue(0);
  const negateFilter = useTransform(filter, (v) => -v);

  const { scrollY } = useScroll({ target: container });
  const scale = useTransform(scrollY, [maxScrollY, maxScrollY + 10000], [1, 0]);

  const isInView = useInView(container, {
    margin: `0px 0px -${100 - vertMargin}% 0px`,
    once: true,
  });

  scrollY.on("change", (sy) => {
    let v = 1;
    if (sy > maxScrollY) {
      v = Math.max(0, 1 - (sy - maxScrollY) / 10000);
    }
    scale.set(v);
    filter.set((1 - v) * 100);
  });

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <motion.div
      ref={container}
      className="sticky w-full max-w-5xl overflow-hidden rounded-3xl border border-line bg-bg-raised shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      style={{
        scale,
        rotate: filter,
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={item.src}
        alt={item.alt ?? ""}
        style={{ rotate: negateFilter }}
        className="h-full w-full scale-110 object-contain"
        sizes="90vw"
      />
    </motion.div>
  );
}
