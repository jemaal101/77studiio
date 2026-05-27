"use client";

import { Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { brand, navLinks } from "@/lib/content";
import { Wordmark } from "@/components/ui/wordmark";

// TikTok icon — lucide doesn't ship a true tiktok glyph so we render a minimal mark
function TikTokGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12.5a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg pt-20 md:pt-32">
      <div className="container-edge">
        {/* Oversized wordmark — final cinematic exhale */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-center justify-center md:mb-20"
        >
          <Wordmark className="text-[16rem] leading-[0.8] md:text-[24rem]" />
        </motion.div>

        {/* Link grid */}
        <div className="grid gap-12 border-t border-line pt-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="kicker mb-3">{brand.name}</p>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-ink-muted">
              AI-native creative studio. Done-for-you content and ads for
              brands that can't afford to guess. Based in {brand.location}.
            </p>
            <div className="mt-6 space-y-1.5">
              <a
                href={`mailto:${brand.email}`}
                className="block link-underline text-sm text-ink"
              >
                {brand.email}
              </a>
              <a
                href={`tel:${brand.phone}`}
                className="block link-underline text-sm text-ink"
              >
                {brand.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="kicker mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-ink-muted hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="kicker mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/privacy"
                  className="link-underline text-sm text-ink-muted hover:text-ink"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="link-underline text-sm text-ink-muted hover:text-ink"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="link-underline text-sm text-ink-muted hover:text-ink"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="kicker mb-4">Social</p>
            <div className="flex items-center gap-3">
              {/* TODO: owner — fill social URLs in lib/content.ts */}
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="77 Studio Co on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-all hover:border-accent hover:text-accent"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href={brand.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="77 Studio Co on TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-all hover:border-accent hover:text-accent"
              >
                <TikTokGlyph />
              </a>
              <a
                href={brand.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="77 Studio Co on LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-all hover:border-accent hover:text-accent"
              >
                <Linkedin size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-line py-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            Built different.
          </p>
        </div>
      </div>
    </footer>
  );
}
