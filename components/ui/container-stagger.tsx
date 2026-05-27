"use client";

import * as React from "react";
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

type AnimateT = "left" | "right" | "top" | "bottom" | "z" | "blur" | undefined;

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
};

const useAnimationVariants = (animate: AnimateT) =>
  React.useMemo(
    () => ({
      hidden: {
        x: animate === "left" ? "-100%" : animate === "right" ? "100%" : 0,
        y: animate === "top" ? "-100%" : animate === "bottom" ? "100%" : 0,
        scale: animate === "z" ? 0 : 1,
        filter: animate === "blur" ? "blur(10px)" : "blur(0px)",
        opacity: 0,
      },
      visible: {
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        opacity: 1,
      },
    }),
    [animate]
  );

export const ContainerStagger = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      className={cn("relative", className)}
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, ...props.viewport }}
      transition={{
        staggerChildren: props.transition?.staggerChildren ?? 0.2,
        ...props.transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
ContainerStagger.displayName = "ContainerStagger";

interface ContainerAnimatedProps extends HTMLMotionProps<"div"> {
  animation?: AnimateT;
}

interface ContainerScrollValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<
  ContainerScrollValue | undefined
>(undefined);

function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx) {
    throw new Error(
      "useContainerScrollContext must be used within <ScrollClipContainer>"
    );
  }
  return ctx;
}

/**
 * Renamed from the original `ContainerScroll` to `ScrollClipContainer` so it
 * doesn't collide with the perspective ContainerScroll exported from
 * `container-scroll.tsx`.
 */
export const ScrollClipContainer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <section
        ref={scrollRef}
        className={cn("relative min-h-[120vh] w-full pb-[30%] pt-8", className)}
        {...props}
      >
        {children}
      </section>
    </ContainerScrollContext.Provider>
  );
};
ScrollClipContainer.displayName = "ScrollClipContainer";

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  ContainerAnimatedProps
>(({ animation, children, className, ...props }, ref) => {
  const variants = useAnimationVariants(animation);

  return (
    <motion.div
      transition={SPRING_CONFIG}
      ref={ref}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
ContainerAnimated.displayName = "ContainerAnimated";

interface ContainerInsetProps extends HTMLMotionProps<"div"> {
  translateYRange?: [string, string];
  insetYRange?: [number, number];
  insetXRange?: [number, number];
  roundednessRange?: [number, number];
}

export const ContainerInset = React.forwardRef<
  HTMLDivElement,
  ContainerInsetProps
>(
  (
    {
      translateYRange = ["-25%", "50%"],
      insetYRange = [35, 0],
      insetXRange = [42, 0],
      roundednessRange = [1000, 16],
      children,
      className,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();
    const y = useTransform(scrollYProgress, [0, 1], translateYRange);
    const insetY = useTransform(scrollYProgress, [0, 1], insetYRange);
    const insetX = useTransform(scrollYProgress, [0, 1], insetXRange);
    const roundedness = useTransform(scrollYProgress, [0, 1], roundednessRange);
    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    const style = React.useMemo(
      () => ({ y, clipPath, ...props.style }),
      [y, clipPath, props.style]
    );

    return (
      <motion.div
        transition={SPRING_CONFIG}
        ref={ref}
        className={cn("origin-top overflow-hidden", className)}
        style={style}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
ContainerInset.displayName = "ContainerInset";
