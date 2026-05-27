"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  ariaLabel?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.25, y: y * 0.4 });
  }

  function onLeave() {
    setPos({ x: 0, y: 0 });
  }

  const inner = (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  );

  const classes = cn(
    variant === "primary" ? "btn-primary" : "btn-ghost",
    className
  );

  if (href) {
    return (
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.4 }}
        className="inline-block"
      >
        <a href={href} aria-label={ariaLabel} className={classes}>
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.4 }}
      className="inline-block"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={classes}
      >
        {inner}
      </button>
    </motion.div>
  );
}
