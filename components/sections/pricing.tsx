"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { tiers } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative border-t border-line bg-bg py-14 md:py-20"
    >
      {/* Subtle bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[420px] w-[60%] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]"
      />

      <div className="container-edge">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <Reveal>
            <p className="kicker mb-3">— Pricing</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="pricing-heading"
              className="font-display text-display-md font-medium tracking-tight text-balance text-ink md:text-display-lg"
            >
              Three bundles.{" "}
              <span className="font-serif font-normal italic text-accent">
                Monthly.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-body-lg text-ink-muted">
              No setup fees. No contracts. Cancel anytime.
            </p>
          </Reveal>
        </div>

        {/* Tier cards — compact grid */}
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-bg-raised/60 p-7 transition-all duration-500",
                tier.popular
                  ? "border-accent shadow-[0_0_60px_-20px_rgba(177,78,255,0.5)] md:scale-[1.02]"
                  : "border-line hover:-translate-y-1 hover:border-line-bright"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-accent bg-bg px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Most Popular
                </div>
              )}

              {/* Name + price */}
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {tier.name}
                </h3>
                <span className="font-mono text-xs text-ink-muted">
                  /month
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-mono text-sm text-ink-muted">$</span>
                <span className="font-display text-5xl font-medium tracking-tight text-ink">
                  {tier.price}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {tier.bestFor}
              </p>

              <div className="my-5 h-px w-full bg-line" />

              {/* Compact features */}
              <ul className="space-y-2.5 text-sm" aria-label={`${tier.name} features`}>
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-ink">
                    <Check
                      size={14}
                      strokeWidth={2.2}
                      className={cn(
                        "mt-1 shrink-0",
                        tier.popular ? "text-accent" : "text-ink-muted"
                      )}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.checkoutHref}
                className={cn(
                  "mt-7 inline-flex items-center justify-between rounded-full px-5 py-3 text-sm font-medium transition-all duration-300",
                  tier.popular
                    ? "bg-accent text-black hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(177,78,255,0.45)]"
                    : "border border-line-bright text-ink hover:border-ink hover:bg-ink/[0.04]"
                )}
              >
                <span>Get Started</span>
                <ArrowUpRight size={15} strokeWidth={1.75} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Custom — single line */}
        <Reveal delay={0.15}>
          <a
            href="#contact"
            className="mx-auto mt-5 flex max-w-5xl items-center justify-between gap-4 rounded-2xl border border-line bg-bg-raised/40 px-7 py-5 transition-all hover:border-line-bright"
          >
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                Need something bigger?{" "}
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  Custom · $1,497+
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Multi-product shoots, 3D, multi-channel rollouts.
              </p>
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-ink-muted" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
