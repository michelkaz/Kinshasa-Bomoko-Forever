"use client";
/**
 * Briques d'animation du site. Toutes respectent « réduire les animations » et restent légères :
 * transformations et opacité uniquement, effets de pointeur coupés sur écran tactile.
 */
import { m, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Apparition douce au défilement. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

/** Titre révélé mot par mot, chaque mot monte depuis un masque. */
export function SplitWords({
  text,
  className,
  accent = [],
  delay = 0,
  as: Tag = "h2",
  once = true,
}: {
  text: string;
  className?: string;
  accent?: number[];
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = m[Tag];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
    >
      {words.flatMap((w, i) => [
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.08em" }}>
          <m.span
            style={{ display: "inline-block", color: accent.includes(i) ? "var(--accent, #ff6a5c)" : undefined }}
            variants={{
              hidden: reduce ? {} : { y: "115%", rotate: 6 },
              show: { y: 0, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 17 } },
            }}
          >
            {w}
          </m.span>
        </span>,
        i < words.length - 1 ? " " : null,
      ])}
    </MotionTag>
  );
}

/** Bouton ou lien qui suit légèrement le pointeur. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const reduce = useReducedMotion();
  return (
    <m.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}

/** Carte qui s'incline vers le pointeur (souris seulement). */
export function Tilt({ children, max = 9, className }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const reduce = useReducedMotion();
  return (
    <m.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: "preserve-3d" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </m.div>
  );
}

/** Décalage de parallaxe lié au défilement. */
export function Parallax({ children, speed = 60, className, style }: { children: ReactNode; speed?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [speed, -speed]);
  return (
    <m.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </m.div>
  );
}

/** Bandeau de mots qui défile, et se penche selon la vitesse du défilement. */
export function Marquee({ items, className, tone = "light" }: { items: string[]; className?: string; tone?: "light" | "dark" }) {
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(v, [-2500, 0, 2500], [-7, 0, 7]);
  const list = [...items, ...items];
  return (
    <m.div className={`marquee ${className ?? ""}`} style={{ skewX: skew, overflow: "hidden" }} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} style={{ display: "flex", flex: "none" }}>
            {list.map((t, i) => (
              <span
                key={`${k}-${i}`}
                className="disp"
                style={{ fontSize: "clamp(30px,4.6vw,64px)", padding: "0 0.5em", whiteSpace: "nowrap", color: tone === "dark" ? "var(--color-blue)" : "#fff" }}
              >
                {t}
                <span style={{ color: "var(--color-coral)", padding: "0 0.5em" }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </m.div>
  );
}

/** Compteur qui monte jusqu'à une valeur publiée (jamais un chiffre inventé). */
export function CountUp({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {n.toLocaleString("fr-FR").replace(/ /g, " ")}
      {suffix}
    </span>
  );
}

/** Chiffre du score qui se retourne à l'apparition. */
export function Flip({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <m.span
      style={{ display: "inline-block", transformPerspective: 600 }}
      initial={reduce ? false : { rotateX: 90, opacity: 0 }}
      whileInView={{ rotateX: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 90, damping: 12, delay }}
    >
      {children}
    </m.span>
  );
}

/** Image révélée par un masque arrondi qui s'ouvre. */
export function MaskReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(18% 18% 18% 18% round 120px)", scale: 1.08 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 36px)", scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
