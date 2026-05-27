"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  speed?: number; // seconds for one full loop — lower = faster
  className?: string;
  separator?: string;
};

export function Marquee({
  items,
  speed = 40,
  className,
  separator = "·",
}: Props) {
  const reduced = useReducedMotion();
  // Triple the list so the loop has enough content to feel continuous at any width
  const repeated = [...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden border-y border-line bg-bg-raised/40 py-6",
        className
      )}
    >
      {/* Edge masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-raised to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-raised to-transparent" />

      <div
        className="flex w-max items-center gap-10"
        style={
          reduced
            ? undefined
            : {
                animation: `marquee ${speed}s linear infinite`,
              }
        }
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-10 font-display text-4xl italic text-ink/90 md:text-6xl"
          >
            {item}
            <span className="text-accent" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
