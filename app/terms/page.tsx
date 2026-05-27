import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern work and engagements with ${brand.name}.`,
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: {updated}</p>
      </header>

      <article className="prose-77 mt-12 max-w-3xl space-y-8 text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Engagement
          </h2>
          <p>
            By starting a project with {brand.name} you agree to these terms.
            Each engagement is confirmed in writing — via email, SMS, or DM —
            specifying scope, deliverables, start date, and bundle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Payment
          </h2>
          <p>
            Bundles are billed monthly, in advance. The first month is paid
            upfront. We accept bank transfer, Stripe, or other agreed methods.
            Late payments may pause active work.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Cancellation
          </h2>
          <p>
            All bundles are month-to-month with a 30-day cancellation notice.
            No long-term contracts, no early-termination fees. If a month has
            already started, work for that period is completed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Ownership
          </h2>
          <p>
            You own everything we produce for your brand — final deliverables,
            raw files, project files. We retain the right to feature work in
            our portfolio and case studies unless otherwise agreed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Revisions
          </h2>
          <p>
            Each deliverable includes reasonable revisions to reach the agreed
            brief. Out-of-scope revisions or pivots are quoted separately.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Liability
          </h2>
          <p>
            {brand.name} is not liable for outcomes outside our control —
            platform algorithm changes, ad-account suspensions, or third-party
            tool downtime. We deliver creative work; performance depends on
            many factors.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Questions
          </h2>
          <p>
            Anything unclear, email{" "}
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
