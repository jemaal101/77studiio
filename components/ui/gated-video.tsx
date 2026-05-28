"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Plain (un-wrapped) <video> that plays ONLY while in the viewport and pauses
 * the moment it scrolls away. Use for full-bleed background video so it stops
 * burning GPU once the user scrolls past. Shows the poster frame when paused.
 */
export function GatedVideo({ src, poster, className, style }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      style={style}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
