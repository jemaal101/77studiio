"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string };

/**
 * Sliding-cursor nav. A white pill follows the hovered tab and the hovered
 * tab's text flips to black so it stays legible against the pill.
 */
export function NavPill({ items }: { items: Item[] }) {
  const [pos, setPos] = useState({ left: 0, width: 0, opacity: 0 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-line-bright bg-bg-raised/60 p-1 backdrop-blur-md"
      onMouseLeave={() => {
        setPos((p) => ({ ...p, opacity: 0 }));
        setHovered(null);
      }}
    >
      {items.map((it, i) => (
        <Tab
          key={it.href}
          item={it}
          index={i}
          isActive={hovered === i}
          onEnter={(rect) => {
            setHovered(i);
            setPos({ left: rect.left, width: rect.width, opacity: 1 });
          }}
        />
      ))}
      <Cursor pos={pos} />
    </ul>
  );
}

function Tab({
  item,
  isActive,
  onEnter,
}: {
  item: Item;
  index: number;
  isActive: boolean;
  onEnter: (rect: { left: number; width: number }) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        onEnter({ left: ref.current.offsetLeft, width });
      }}
      className="relative z-10 block"
    >
      <a
        href={item.href}
        className={cn(
          "block cursor-pointer rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-150 md:px-5 md:py-2.5",
          isActive ? "text-black" : "text-ink/80 hover:text-ink"
        )}
      >
        {item.label}
      </a>
    </li>
  );
}

function Cursor({
  pos,
}: {
  pos: { left: number; width: number; opacity: number };
}) {
  return (
    <motion.li
      animate={pos}
      transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.6 }}
      className="absolute inset-y-1 z-0 rounded-full bg-ink shadow-[0_4px_18px_rgba(245,245,245,0.18)]"
    />
  );
}
