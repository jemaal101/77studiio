import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${brand.name} collects, uses, and protects your data.`,
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: {updated}</p>
      </header>

      <article className="prose-77 mt-12 max-w-3xl space-y-8 text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Who we are
          </h2>
          <p>
            {brand.name} is a creative studio based in {brand.location}. You
            can reach us at{" "}
            <a className="text-accent hover:underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            What we collect
          </h2>
          <p>
            When you contact us by email, phone, or Instagram, we receive the
            information you choose to share — typically your name, business
            name, contact details, and a brief about what you need. We do not
            run third-party tracking pixels or sell your data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            How we use it
          </h2>
          <p>
            We use what you send us to reply to your enquiry, scope a project,
            and stay in touch about ongoing work. We don't use your data to
            train models or share it with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            How we store it
          </h2>
          <p>
            Email lives in our inbox. Project files live in Google Drive (or
            equivalent), restricted to people working on your project. We keep
            data only as long as it's useful, then delete it on request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Your rights
          </h2>
          <p>
            You can ask us at any time to show you what we have on file, correct
            it, or delete it. Email{" "}
            <a className="text-accent hover:underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>{" "}
            and we'll respond within 7 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
            Updates to this policy
          </h2>
          <p>
            If we change anything material we'll update the date at the top of
            this page. If you've worked with us before, we may also email you
            about significant changes.
          </p>
        </section>
      </article>
    </main>
  );
}
