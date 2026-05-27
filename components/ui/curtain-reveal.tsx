"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/ui/wordmark";

/**
 * Full-screen black curtain that slides off on first load. Sets the tone
 * immediately. Only runs once per session.
 */
export function CurtainReveal() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Honour reduced-motion preferences — skip entirely.
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setShow(false);
        return;
      }
    }
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <Wordmark className="text-[10rem] md:text-[14rem]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-muted">
              77 Studio Co
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
