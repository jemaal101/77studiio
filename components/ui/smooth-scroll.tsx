"use client";

import { ReactLenis } from "lenis/react";

/**
 * Wraps the page in a Lenis smooth-scroll engine at the root.
 * Replaces the browser's snappy default scroll with eased interpolation —
 * everything (sticky pins, useScroll-driven transforms, anchor jumps) gets a
 * much calmer feel without per-component tuning.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        // gentle but not laggy
        lerp: 0.085,
        wheelMultiplier: 1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
