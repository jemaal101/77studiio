"use client";

import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Cinematic scroll-reveal: title lifts up, framed card pivots from a deep
 * perspective into the viewer with a glow ramp and subtle parallax.
 */
export function ContainerScroll({
  titleComponent,
  children,
  frameClassName,
  className,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  frameClassName?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth raw scroll into a buttery spring
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.6,
  });

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Title lifts up while card opens
  const titleY = useTransform(progress, [0, 0.5], reduced ? [0, 0] : [60, -90]);
  const titleOpacity = useTransform(progress, [0, 0.2, 0.5], [0.4, 1, 1]);

  // Card animation — deeper rotation, smaller starting scale, longer reveal
  const rotate = useTransform(
    progress,
    [0, 0.6],
    reduced ? [0, 0] : [32, 0]
  );
  const scale = useTransform(
    progress,
    [0, 0.6],
    isMobile ? [0.74, 1] : [0.84, 1]
  );
  const translate = useTransform(
    progress,
    [0, 0.6],
    reduced ? [0, 0] : [80, -40]
  );
  // Light parallax inside the card
  const inner = useTransform(progress, [0, 1], reduced ? [0, 0] : [-30, 30]);
  // Glow intensity ramps as the card flattens
  const glow = useTransform(progress, [0, 0.6], [0.08, 0.32]);

  return (
    <div
      ref={containerRef}
      className={`relative flex h-[100vh] items-center justify-center md:h-[140vh] ${className ?? ""}`}
    >
      {/* Atmosphere glow that grows with the reveal */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/40 blur-[200px]"
      />

      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-2 md:px-10">
        <div
          className="relative w-full"
          style={{ perspective: "1400px" }}
        >
          <Header translate={titleY} opacity={titleOpacity}>
            {titleComponent}
          </Header>
          <Card
            rotate={rotate}
            scale={scale}
            cardTranslate={translate}
            innerParallax={inner}
            frameClassName={frameClassName}
          >
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Header({
  translate,
  opacity,
  children,
}: {
  translate: MotionValue<number>;
  opacity: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ y: translate, opacity }}
      className="mx-auto max-w-6xl text-center"
    >
      {children}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  cardTranslate,
  innerParallax,
  frameClassName,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  cardTranslate: MotionValue<number>;
  innerParallax: MotionValue<number>;
  frameClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        y: cardTranslate,
        boxShadow:
          "0 0 0 1px rgba(177,78,255,0.18), 0 40px 100px rgba(0,0,0,0.7), 0 100px 180px rgba(177,78,255,0.22)",
        transformStyle: "preserve-3d",
      }}
      className={`mx-auto mt-8 h-[26rem] w-full max-w-6xl rounded-[30px] border border-line-bright bg-bg-raised p-2 md:h-[42rem] md:p-4 ${frameClassName ?? ""}`}
    >
      {/* Browser-chrome dots — adds the "real screen" feel */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
      </div>

      <motion.div
        style={{ y: innerParallax }}
        className="h-full w-full overflow-hidden rounded-2xl bg-bg md:rounded-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
