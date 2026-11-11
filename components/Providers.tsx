"use client";
import Lenis from "lenis";
import { LazyMotion, domMax, m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, type ReactNode } from "react";

/** Défilement fluide et barre de progression. */
export default function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  return (
    <LazyMotion features={domMax} strict={false}>
      <m.div
        aria-hidden="true"
        style={{ scaleX: progress, transformOrigin: "0 50%", position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "var(--color-coral)", zIndex: 90 }}
      />
      {children}
    </LazyMotion>
  );
}
