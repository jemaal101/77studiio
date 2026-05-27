"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function Lab() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");

    // TODO (Lab waitlist):
    // Connect to a Google Sheet via Formspree, or a Resend transactional
    // email + Supabase row insert. Endpoint stub:
    //
    //   await fetch("/api/lab-waitlist", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email }),
    //   });
    //
    // For now, log + simulate.
    // eslint-disable-next-line no-console
    console.log("[lab] waitlist signup:", { email });

    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
  }

  return (
    <section
      id="lab"
      aria-labelledby="lab-heading"
      className="relative border-t border-line py-16 md:py-24"
    >
      {/* Subtle sub-brand atmosphere — slightly different palette accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(177,78,255,0.06), transparent 60%)",
        }}
      />

      <div className="container-edge">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-bg-raised/60 p-8 backdrop-blur-sm md:p-16">
          <Reveal>
            <p className="kicker mb-8">— A sub-brand</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="lab-heading"
              className="font-display text-display-md text-ink"
            >
              Evolve<span className="italic text-accent">jem</span>
              <span className="text-ink-muted">.lab</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 font-display text-2xl italic text-ink-muted md:text-3xl">
              Learn to build agencies like ours.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
              Course. One-on-one mentorship. Private community. Limited intake —
              applications only. Built for the operator who wants to do what we
              do, not just hire it done.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 rounded-full border border-accent/50 bg-accent/[0.06] px-5 py-3 text-sm text-ink"
                    role="status"
                    aria-live="polite"
                  >
                    <Check size={16} strokeWidth={2} className="text-accent" />
                    <span>You're on the list. We'll be in touch.</span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    className="flex w-full max-w-md items-center gap-2 rounded-full border border-line-bright bg-bg p-1.5 transition-colors focus-within:border-accent"
                  >
                    <label htmlFor="lab-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="lab-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@business.com"
                      autoComplete="email"
                      disabled={status === "submitting"}
                      className="flex-1 bg-transparent px-4 py-2 text-sm text-ink placeholder:text-ink-dim focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-accent-hover disabled:opacity-50"
                    >
                      {status === "submitting" ? "..." : "Join waitlist"}
                      {status !== "submitting" && (
                        <ArrowRight size={14} strokeWidth={2} />
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
                Limited spots per batch. Pricing varies. Applications open soon.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
