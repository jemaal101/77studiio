import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center px-6">
      <div className="container-edge text-center">
        <p className="kicker mb-6">404 — Lost in the noise</p>
        <h1 className="font-display text-display-xl text-balance text-ink">
          That page doesn't <span className="italic text-accent">exist</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
          Either it never did, or it's been evolved into something better. Head
          home and see what we've shipped.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_40px_rgba(177,78,255,0.45)]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
