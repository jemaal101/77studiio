import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${brand.name} uses cookies.`,
};

export default function CookiesPage() {
  const updated = new Date().toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="container-edge py-32 md:py-40">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} /> Back to home
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="kicker mb-3">— Legal</p>
        <h1 className="font-display text-display-lg font-medium tracking-tight text-balance text-ink">
          Cookie Policy
        </h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: {updated}</p>
      </header>

      <article className="prose-77 mt-12 max-w-3xl space-y-8 text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Short version
          </h2>
          <p>
            This site doesn't set tracking cookies. We don't run third-party
            advertising trackers, fingerprinting scripts, or analytics that
            identify you personally.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            What we do use
          </h2>
          <p>
            The site runs on Vercel, which may set minimal first-party cookies
            for site security and performance (for example, to protect against
            bot abuse). These are essential, not advertising.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            If that changes
          </h2>
          <p>
            If we ever add analytics, a chat widget, or anything else that sets
            cookies, we'll list them here and add a consent prompt.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Questions
          </h2>
          <p>
            Email{" "}
            <a className="text-accent hover:underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
