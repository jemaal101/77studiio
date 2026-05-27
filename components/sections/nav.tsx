"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/content";
import { NavPill } from "@/components/ui/nav-pill";
import { Wordmark } from "@/components/ui/wordmark";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-line/60 bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="container-edge flex h-28 items-center justify-between md:h-32">
          {/* Logo — text-rendered, always sharp */}
          <a
            href="#top"
            className="group flex items-center transition-opacity hover:opacity-80"
            aria-label="77 Studio Co — home"
          >
            <Wordmark className="text-6xl md:text-7xl" />
          </a>

          {/* Sliding-cursor pill nav (desktop) */}
          <nav className="hidden md:block" aria-label="Primary">
            <NavPill items={navLinks} />
          </nav>

          {/* CTA + mobile trigger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-line-bright bg-bg-raised/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink backdrop-blur-md transition-all hover:border-accent hover:text-accent"
            >
              Get a Quote
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="md:hidden -mr-2 rounded p-2 text-ink transition-colors hover:text-accent"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-bg md:hidden"
          >
            <div className="container-edge flex h-24 items-center justify-between">
              <Wordmark className="text-5xl" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="-mr-2 rounded p-2 text-ink transition-colors hover:text-accent"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav
              aria-label="Mobile primary"
              className="container-edge mt-8 flex flex-1 flex-col justify-center gap-2"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.1 + i * 0.06,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block py-3 font-display text-display-md tracking-tight text-ink"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="btn-primary mt-10 self-start"
              >
                Get a Quote
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
