"use client";

import Image from "next/image";
import { HoverVideo } from "@/components/ui/hover-video";
import type { WorkSample } from "@/lib/content";
import { cn } from "@/lib/utils";

// "/work/x.mp4" -> "/work/x.jpg"
const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

type Props = {
  items: WorkSample[];
  className?: string;
};

/**
 * Hover-expand horizontal gallery. Each strip starts narrow; whichever the
 * user hovers grows to fill the row, the others shrink. Pure CSS — no JS state.
 */
export function ImageGallery({ items, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-[420px] w-full items-stretch gap-2 md:h-[560px]",
        className
      )}
    >
      {items.map((s, idx) => (
        <div
          key={s.n}
          className="group relative h-full w-24 flex-grow overflow-hidden rounded-2xl border border-line bg-bg-raised transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-full md:w-36"
        >
          {/* Media — poster when idle, plays on hover (kills multi-video lag) */}
          {s.video ? (
            <HoverVideo
              src={s.video}
              poster={posterFor(s.video)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : s.image ? (
            <Image
              src={s.image}
              alt={`${s.title} — ${s.client}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
              className="object-cover object-center"
              priority={idx < 2}
            />
          ) : null}

          {/* Dark wash for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Vertical label — visible when collapsed */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-end p-4 transition-opacity duration-300 group-hover:opacity-0">
            <p className="origin-bottom-left rotate-[-90deg] whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
              {s.n} · {s.client}
            </p>
          </div>

          {/* Horizontal title block — visible when expanded */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-7">
            <p className="kicker mb-2 text-white/80">{s.client}</p>
            <h4 className="font-display text-xl font-semibold text-balance text-white md:text-2xl">
              {s.title}
            </h4>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-white/80 md:text-sm">
              {s.note}
            </p>
          </div>

          {/* Discipline chip top-right when expanded */}
          <div className="pointer-events-none absolute right-4 top-4 translate-y-[-4px] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
              {s.discipline}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
