"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AI-agency atmosphere — large animated grid that breathes + a scanning beam
 * sweeping diagonally + edge glows. Pure CSS / transforms, no canvas.
 */
export function AnimatedGridBackground({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* Base grid */}
      <motion.div
        initial={{ opacity: 0.08 }}
        animate={
          reduced
            ? undefined
            : { opacity: [0.06, 0.14, 0.06], backgroundPosition: ["0% 0%", "80px 80px"] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(65%_55%_at_50%_38%,black,transparent)]"
      />

      {/* Brighter accent grid layer */}
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(177,78,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(177,78,255,0.10)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:radial-gradient(45%_40%_at_50%_35%,black,transparent)]" />

      {/* Diagonal scanning beam */}
      {!reduced && (
        <motion.div
          initial={{ x: "-110%", opacity: 0 }}
          animate={{ x: ["-110%", "110%"], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 4,
          }}
          className="absolute -top-[20%] left-0 h-[140%] w-[40%] -skew-x-[18deg] bg-gradient-to-r from-transparent via-accent/25 to-transparent blur-2xl"
        />
      )}

      {/* Soft corner glows */}
      <div className="absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-accent/20 blur-[170px]" />
      <div className="absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/15 blur-[160px]" />

      {/* Vignette so type stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_45%,transparent_0%,rgba(8,8,8,0.55)_75%,#080808_100%)]" />
    </div>
  );
}
