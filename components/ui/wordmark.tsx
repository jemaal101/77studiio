import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** When true, adds a soft glow halo (matches the brand source image). */
  glow?: boolean;
};

/**
 * Brand wordmark — "77" rendered in Anton (heavy condensed display).
 * Always sharp because it's text, not a raster.
 */
export function Wordmark({ className, glow = true }: Props) {
  return (
    <span
      className={cn(
        "relative inline-block font-mark leading-[0.85] tracking-[-0.04em] text-ink",
        className
      )}
      style={{ transform: "skewX(-5deg)" }}
      aria-hidden="true"
    >
      {glow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 select-none text-white/35 blur-2xl"
        >
          77
        </span>
      )}
      77
    </span>
  );
}
