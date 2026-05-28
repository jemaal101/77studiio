"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * External play control. When provided, the video plays while `active` is
   * true (e.g. a parent card is hovered) and ignores its own hover. When
   * omitted, the video manages its own hover state.
   */
  active?: boolean;
};

/**
 * Poster-first video that only decodes on demand. Idle = static poster frame
 * (cheap). Plays on hover (or when `active`), pauses + resets on leave. This is
 * the key to killing multi-video decode lag in galleries and comparison grids:
 * instead of every clip playing at once, at most the one you're looking at runs.
 */
export function HoverVideo({ src, poster, className, style, active }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [selfHover, setSelfHover] = useState(false);

  const shouldPlay = (active ?? selfHover) && !reduced;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldPlay]);

  const handlers =
    active === undefined
      ? {
          onMouseEnter: () => setSelfHover(true),
          onMouseLeave: () => setSelfHover(false),
        }
      : {};

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
      {...handlers}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
