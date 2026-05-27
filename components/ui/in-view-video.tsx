"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** Render an audio toggle (defaults to false — content videos stay muted) */
  showUnmute?: boolean;
};

/**
 * Looped, muted, decorative video that ONLY plays while it's in the viewport.
 * Saves decode CPU + battery on long pages with multiple videos. Falls back to
 * a static first-frame on `prefers-reduced-motion`.
 */
export function InViewVideo({
  src,
  poster,
  className,
  showUnmute = false,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (reduced) {
      // Show first frame, don't play
      v.pause();
      try {
        v.currentTime = 0.05;
      } catch {}
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        // No `autoPlay` — IntersectionObserver controls playback
        className="h-full w-full object-cover"
      />
      {showUnmute && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-3 right-3 z-10 rounded-full border border-white/30 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:border-white"
        >
          {muted ? "Sound off" : "Sound on"}
        </button>
      )}
    </div>
  );
}
