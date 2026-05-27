"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Instagram } from "lucide-react";
import { brand } from "@/lib/content";

/**
 * Mobile-only sticky CTA bar pinned to the bottom. Three quick contacts.
 * Hides itself when the user is on top of the actual #contact section so it
 * doesn't double up.
 */
export function StickyCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "-30% 0px -30% 0px" }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-bg/85 backdrop-blur-xl transition-all duration-500 md:hidden ${
        hidden ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="grid grid-cols-3 divide-x divide-line">
        <a
          href={`mailto:${brand.email}`}
          className="flex flex-col items-center justify-center gap-1 py-3 text-ink-muted transition-colors active:text-accent"
        >
          <Mail size={18} strokeWidth={1.6} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Email
          </span>
        </a>
        <a
          href={`tel:${brand.phone}`}
          className="flex flex-col items-center justify-center gap-1 py-3 text-ink-muted transition-colors active:text-accent"
        >
          <Phone size={18} strokeWidth={1.6} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Call
          </span>
        </a>
        <a
          href={brand.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-3 text-ink-muted transition-colors active:text-accent"
        >
          <Instagram size={18} strokeWidth={1.6} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            DM
          </span>
        </a>
      </div>
    </div>
  );
}
