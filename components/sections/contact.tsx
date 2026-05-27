"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Instagram, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { brand } from "@/lib/content";

const METHODS = [
  {
    id: "email",
    label: "Email",
    Icon: Mail,
    value: brand.email,
    sub: "Fastest reply — usually under an hour.",
    href: `mailto:${brand.email}?subject=${encodeURIComponent("New enquiry — 77 Studio Co")}&body=${encodeURIComponent(
      "Hey 77,\n\nMy business: \nWhat I need: \nWhere I am: \n\n— "
    )}`,
    cta: "Send email",
  },
  {
    id: "phone",
    label: "Call or text",
    Icon: Phone,
    value: brand.phoneDisplay,
    sub: "Mon–Sat, 8am–8pm AEST.",
    href: `tel:${brand.phone}`,
    cta: `Call ${brand.phoneDisplay}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: Instagram,
    value: brand.social.instagramHandle,
    sub: "DM us — same response time.",
    href: brand.social.instagram,
    cta: "Open Instagram",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-t border-line bg-bg py-14 md:py-20"
    >
      <div className="container-edge">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <Reveal>
            <p className="kicker mb-4">— Contact</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="contact-heading"
              className="font-display text-display-md font-medium tracking-tight text-balance text-ink md:text-display-lg"
            >
              Tell us what you're{" "}
              <span className="font-serif font-normal italic text-accent">
                building.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-body-lg text-ink-muted">
              Pick whichever's easiest. We reply within hours and book a 15-min
              Google Meet or Zoom on the spot.
            </p>
          </Reveal>
        </div>

        {/* Three big tappable cards */}
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:gap-5">
          {METHODS.map((m, i) => (
            <motion.a
              key={m.id}
              href={m.href}
              target={m.id === "instagram" ? "_blank" : undefined}
              rel={m.id === "instagram" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-line bg-bg-raised/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:bg-bg-raised md:p-9"
            >
              {/* Top — icon + arrow */}
              <div className="flex items-start justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-bright bg-bg text-ink transition-all duration-500 group-hover:border-accent group-hover:bg-accent/[0.08] group-hover:text-accent">
                  <m.Icon size={18} strokeWidth={1.5} />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-ink-muted transition-all duration-500 group-hover:rotate-12 group-hover:text-accent"
                />
              </div>

              {/* Middle — value + sub */}
              <div>
                <p className="kicker mb-2">{m.label}</p>
                <p className="break-words font-display text-xl font-semibold leading-tight text-ink md:text-2xl">
                  {m.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {m.sub}
                </p>
              </div>

              {/* Bottom — CTA hint */}
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-colors group-hover:text-accent">
                {m.cta}
                <ArrowUpRight size={12} />
              </span>

              {/* Bottom accent line */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent via-accent/70 to-transparent transition-transform duration-700 group-hover:scale-x-100"
              />
            </motion.a>
          ))}
        </div>

        {/* Bottom meta line */}
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-2xl text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            Based in {brand.location} · Working Australia-wide
          </p>
        </Reveal>
      </div>
    </section>
  );
}
