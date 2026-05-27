"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin accent progress bar pinned to the top of the viewport.
 * Fills as the user scrolls down the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    mass: 0.4,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[80] h-[2px] bg-accent shadow-[0_0_18px_rgba(177,78,255,0.55)]"
    />
  );
}
