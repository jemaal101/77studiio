"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { HoverVideo } from "@/components/ui/hover-video";

// "/case/x.mp4" -> "/case/x.jpg"
const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

type Slot = {
  src?: string;
  video?: string;
  alt?: string;
  placeholder?: string;
  // object-position when the source is cropped (e.g. "left", "center top")
  position?: string;
};

type Case = {
  id: string;
  client: string;
  niche: string;
  before: Slot;
  after: Slot;
  outcome: string;
};

const CASES: Case[] = [
  {
    id: "kinza",
    client: "Kinza",
    niche: "Beverage · short-form",
    before: { src: "/case/kinza-before.png", alt: "Kinza — before", position: "left center" },
    after: { video: "/case/kinza-after.mp4", alt: "Kinza — after" },
    outcome:
      "Flat product shots rebuilt into motion. Hook structure tuned to the first 1.2 seconds — the kind of reel that stops a thumb.",
  },
  {
    id: "ec-dress-hire",
    client: "EC Dress Hire",
    niche: "Fashion rental · campaign",
    before: { src: "/case/ec-before.png", alt: "EC Dress Hire — before", position: "left center" },
    after: { video: "/case/ec-after.mp4", alt: "EC Dress Hire — after" },
    outcome:
      "Catalogue feel replaced with editorial motion. The dress sells the occasion now, not just the size chart.",
  },
  {
    id: "euro-car-details",
    client: "Euro Car Details",
    niche: "Automotive · service",
    before: { video: "/case/euro-before.mp4", alt: "Euro Car Details — before" },
    after: { video: "/case/euro-after.mp4", alt: "Euro Car Details — after" },
    outcome:
      "Repositioned as luxury detailing — cinematic before/after, moody lighting, premium pricing supported.",
  },
];

export function BeforeAfter() {
  return (
    <section
      id="case-studies"
      aria-labelledby="ba-heading"
      className="relative border-t border-line bg-bg py-16 md:py-24"
    >
      <div className="container-edge">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <Reveal>
            <p className="kicker mb-3">— Case studies</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="ba-heading"
              className="font-display text-display-md font-medium tracking-tight text-balance text-ink md:text-display-lg"
            >
              Before{" "}
              <span className="font-serif font-normal italic text-accent">
                & after.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-body-lg text-ink-muted">
              Drag each slider. See the shift. Real client work, real direction.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <BeforeAfterCard data={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterCard({ data }: { data: Case }) {
  const [pos, setPos] = useState(50); // 0–100, % from left
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function onMove(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (draggingRef.current) onMove(e.clientX);
    }
    function onTouchMove(e: TouchEvent) {
      if (draggingRef.current && e.touches[0]) onMove(e.touches[0].clientX);
    }
    function onUp() {
      draggingRef.current = false;
      setDragging(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  function startDrag(clientX: number) {
    draggingRef.current = true;
    setDragging(true);
    onMove(clientX);
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-bg-raised/60 transition-all duration-500 hover:border-line-bright hover:shadow-[0_30px_80px_-40px_rgba(177,78,255,0.4)]"
    >
      {/* Header chip */}
      <div className="flex items-center justify-between border-b border-line p-5">
        <div>
          <p className="font-display text-lg font-medium text-ink">
            {data.client}
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            {data.niche}
          </p>
        </div>
        <span className="rounded-full border border-line-bright bg-bg px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
          Drag ⇆
        </span>
      </div>

      {/* Slider */}
      <div
        ref={containerRef}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => {
          if (e.touches[0]) startDrag(e.touches[0].clientX);
        }}
        className="relative aspect-[4/5] w-full cursor-ew-resize select-none overflow-hidden bg-black"
      >
        {/* AFTER — full layer underneath */}
        <MediaSlot slot={data.after} tone="after" active={hovered} />

        {/* BEFORE — full layer on top, clipped by clip-path so it stays aligned */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <MediaSlot slot={data.before} tone="before" active={hovered} />
        </div>

        {/* Side labels */}
        <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-accent backdrop-blur-md">
          After
        </span>

        {/* Divider handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20"
          style={{ left: `calc(${pos}% - 1px)` }}
        >
          <div className="h-full w-[2px] bg-white/85 shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
          <motion.div
            animate={{ scale: dragging ? 1.12 : 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-bg/80 text-sm text-ink backdrop-blur-md">
              ⇆
            </span>
          </motion.div>
        </div>
      </div>

      {/* Outcome */}
      <div className="border-t border-line p-5">
        <p className="text-pretty text-sm leading-relaxed text-ink-muted md:text-[15px]">
          {data.outcome}
        </p>
      </div>
    </article>
  );
}

function MediaSlot({
  slot,
  tone,
  active,
}: {
  slot: Slot;
  tone: "before" | "after";
  active?: boolean;
}) {
  // Video — plays only while the card is hovered; static poster otherwise.
  // Keeps idle decode at zero so the grid doesn't run 4 clips at once.
  if (slot.video) {
    return (
      <HoverVideo
        src={slot.video}
        poster={posterFor(slot.video)}
        active={active}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: slot.position ?? "center" }}
      />
    );
  }

  // Image
  if (slot.src) {
    return (
      <Image
        src={slot.src}
        alt={slot.alt ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
        style={{ objectPosition: slot.position ?? "center" }}
      />
    );
  }

  // Placeholder — no media yet
  const isBefore = tone === "before";
  return (
    <div
      className={`absolute inset-0 flex h-full items-center justify-center bg-gradient-to-br ${
        isBefore
          ? "from-bg-raised via-bg to-bg-raised"
          : "from-accent/[0.10] via-bg-raised to-bg-raised"
      }`}
    >
      <div className="flex flex-col items-center gap-3 px-4 text-center">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full border ${
            isBefore ? "border-line-bright text-ink-muted" : "border-accent/50 text-accent"
          }`}
        >
          <ImageIcon size={18} strokeWidth={1.5} />
        </span>
        <p className="max-w-[18ch] text-pretty text-xs leading-relaxed text-ink-dim">
          {slot.placeholder}
        </p>
      </div>
    </div>
  );
}
