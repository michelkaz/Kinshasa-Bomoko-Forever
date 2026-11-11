"use client";
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CountUp, Flip, Magnetic, MaskReveal, Parallax, Reveal, SplitWords, Tilt } from "./motion";
import Wave from "./Wave";

const Arcs = ({ style }: { style?: React.CSSProperties }) => (
  <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true" style={style}>
    <circle cx="200" cy="200" r="60" /><circle cx="200" cy="200" r="110" /><circle cx="200" cy="200" r="160" /><circle cx="200" cy="200" r="198" />
  </svg>
);

/* ---------- Héros de l'accueil ---------- */
export function HomeHero({ photo, kicker, title, sub }: { photo: ReactNode; kicker: string; title: string; sub: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "24%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const by = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const words = title.split(" ");
  return (
    <section
      ref={ref}
      data-hero
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        bx.set(e.clientX - r.left);
        by.set(e.clientY - r.top);
      }}
      style={{ position: "relative", isolation: "isolate", overflow: "hidden", minHeight: "min(calc(100svh - var(--hh)), 900px)", display: "flex", alignItems: "flex-end", color: "#fff", background: "var(--color-blue)", }}
    >
      <m.div style={{ position: "absolute", inset: 0, zIndex: -3, y, scale }}>{photo}</m.div>
      <div className="veil" style={{ position: "absolute", inset: 0, zIndex: -2, background: "linear-gradient(180deg,rgba(0,30,107,.6) 0%,rgba(0,30,107,.22) 38%,rgba(0,15,58,.96) 100%)" }} />
      <m.div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, x: bx, y: by, width: 520, height: 520, marginLeft: -260, marginTop: -260, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,106,92,.42), rgba(255,106,92,0) 65%)", zIndex: -1, pointerEvents: "none" }} />
      <Arcs style={{ position: "absolute", right: "-14%", top: "-20%", width: "78%", maxWidth: 1000, opacity: 0.3, zIndex: -1 }} />
      <m.div className="wrap" style={{ opacity: fade, paddingTop: 64, paddingBottom: 96 }}>
        <m.p className="lab" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ color: "var(--color-pale)", marginBottom: 20 }}>
          {kicker}
        </m.p>
        <h1 className="disp" style={{ fontSize: "clamp(54px,10.6vw,168px)", maxWidth: "11ch" }}>
          {words.flatMap((w, i) => [
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.06em" }}>
              <span className="hw" style={{ display: "inline-block", animationDelay: `${0.02 + i * 0.05}s`, color: i === words.length - 1 ? "var(--color-coral)" : "#fff" }}>
                {w}
              </span>
            </span>,
            i < words.length - 1 ? " " : null,
          ])}
        </h1>
        <m.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }} style={{ marginTop: 26, maxWidth: "40ch", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: 1.45, color: "#e6ecff" }}>
          {sub}
        </m.p>
        <m.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.9 }} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
          <Magnetic><Link href="/rejoindre/" className="btn btn-coral">Nous rejoindre</Link></Magnetic>
          <Magnetic><Link href="/evenements/finale-tournoi-2026/" className="btn btn-ghost">Revivre la finale</Link></Magnetic>
        </m.div>
      </m.div>
      <div aria-hidden="true" className="hidden md:flex" style={{ position: "absolute", right: "var(--gutter)", bottom: 40, writingMode: "vertical-rl", alignItems: "center", gap: 12, color: "var(--color-pale)", font: "600 11px var(--font-body)", letterSpacing: ".2em", textTransform: "uppercase" }}>
        <m.i animate={{ scaleY: [0, 1, 1], originY: 0 }} transition={{ duration: 2.2, repeat: Infinity }} style={{ display: "block", width: 2, height: 56, background: "var(--color-coral)" }} />
        Défiler
      </div>
    </section>
  );
}

/* ---------- Domaines : escalier de cartes qui s'inclinent ---------- */
export type DomainCard = { href: string; title: string; text: string; photo: ReactNode };
export function DomainCards({ items }: { items: DomainCard[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3" style={{ marginTop: 56, alignItems: "start" }}>
      {items.map((d, i) => (
        <Reveal key={d.href + i} delay={i * 0.12} y={70} className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : ""}>
          <Tilt className="blob-host">
            <Link href={d.href} style={{ position: "relative", display: "block", color: "#fff", textDecoration: "none", aspectRatio: i === 1 ? "4/5.2" : "3/4", background: "var(--color-night)" }} className="blob">
              <div className="blob" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>{d.photo}</div>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,15,58,0) 35%,rgba(0,15,58,.95) 100%)" }} />
                <div style={{ position: "absolute", left: 26, right: 26, bottom: 26 }}>
                  <h3 className="disp" style={{ fontSize: "clamp(36px,3.4vw,52px)" }}>{d.title}</h3>
                  <p style={{ color: "#dce5ff", fontSize: 15, marginTop: 10, maxWidth: "30ch" }}>{d.text}</p>
                </div>
              </div>
            </Link>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- Moment fort : tableau de score ---------- */
export function ScoreBoard({ photos, prizes }: { photos: ReactNode[]; prizes: { rank: string; value: number }[] }) {
  return (
    <section style={{ position: "relative", background: "var(--color-night)", color: "#fff", overflow: "hidden" }} aria-labelledby="moment-fort">
      <Wave fill="#ffffff" flip height={80} />
      <Arcs style={{ position: "absolute", left: -180, top: 80, width: 620, opacity: 0.18, animationDirection: "reverse" }} />
      <div className="wrap" style={{ position: "relative", paddingBlock: "24px clamp(56px,9vw,110px)" }}>
        <p className="lab" style={{ color: "var(--color-coral)", marginBottom: 14 }}>Moment fort</p>
        <h2 id="moment-fort" className="lab" style={{ color: "var(--color-pale)", fontSize: 14 }}>
          Finale du Tournoi Doudou Fwamba, 2e édition · aussi appelé Tournoi de la Paix
        </h2>
        <div role="img" aria-label="JSK 1, Mateta 0" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "clamp(10px,3vw,40px)", textAlign: "center", margin: "34px 0 12px" }}>
          <SplitWords text="JSK" as="p" className="disp score-t" />
          <span style={{ display: "flex", gap: ".12em", font: "800 clamp(68px,13vw,200px)/1 var(--font-display)", fontStretch: "75%", color: "var(--color-coral)", fontVariantNumeric: "tabular-nums" }}>
            <Flip delay={0.1}>1</Flip><Flip delay={0.25}>–</Flip><Flip delay={0.4}>0</Flip>
          </span>
          <SplitWords text="Mateta" as="p" className="disp score-t" delay={0.2} />
        </div>
        <style>{`.score-t{font-size:clamp(36px,7vw,104px)}`}</style>
        <p style={{ textAlign: "center", color: "var(--color-pale)" }}>Samedi 5 septembre 2026 · 10h30 · terrain Saint Paul, Kingasani</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginTop: 40 }}>
          {prizes.map((p, i) => (
            <Reveal key={p.rank} delay={i * 0.1} y={30}>
              <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 28, padding: "20px 22px", border: "1px solid rgba(255,255,255,.12)" }}>
                <b className="disp" style={{ display: "block", fontSize: "clamp(26px,2.6vw,38px)", fontStretch: "75%" }}><CountUp to={p.value} suffix=" FC" /></b>
                <span style={{ color: "var(--color-pale)", fontSize: 14 }}>{p.rank}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 54, alignItems: "center" }}>
          {photos.map((p, i) => (
            <Parallax key={i} speed={i === 1 ? 50 : 24} style={{ rotate: i === 0 ? "-2.2deg" : i === 1 ? "1.6deg" : "-1deg" }}>
              <MaskReveal delay={i * 0.12}>
                <div className="blob" style={{ aspectRatio: i === 1 ? "4/5" : "5/4", overflow: "hidden" }}>{p}</div>
              </MaskReveal>
            </Parallax>
          ))}
        </div>
        <Reveal><Link href="/evenements/finale-tournoi-2026/" className="btn btn-coral" style={{ marginTop: 44 }}>Voir toute la finale</Link></Reveal>
      </div>
      <Wave fill="#ffffff" height={80} variant={2} />
    </section>
  );
}

/* ---------- Carrousel d'actions : on le fait glisser ---------- */
export type ActionCard = { href: string; date: string; title: string; text: string; tag: string; photo: ReactNode | null };
export function ActionsCarousel({ items }: { items: ActionCard[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);
  useEffect(() => {
    const calc = () => setMax(Math.max(0, (track.current?.scrollWidth ?? 0) - (wrap.current?.clientWidth ?? 0)));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [items.length]);
  return (
    <div ref={wrap} style={{ overflow: "hidden", marginTop: 44, cursor: "grab", padding: "10px 0 24px" }}>
      <m.div ref={track} drag="x" dragConstraints={{ left: -max, right: 0 }} dragElastic={0.12} whileTap={{ cursor: "grabbing" }} style={{ display: "flex", gap: 22, width: "max-content" }}>
        {items.map((a, i) => (
          <Tilt key={a.href} max={6}>
            <m.div initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 15 }} style={{ width: "min(78vw,380px)" }}>
              <Link href={a.href} draggable={false} style={{ display: "block", textDecoration: "none", color: "inherit" }} className="blob-host">
                <div className="blob" style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--color-blue)", position: "relative" }}>
                  {a.photo ?? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: 22, color: "#fff" }} className="disp"><span style={{ fontSize: 44 }}>Affiche seule</span></div>}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16 }}>
                  <time className="lab" style={{ color: "var(--color-red)" }}>{a.date}</time><span className="pill">{a.tag}</span>
                </div>
                <h3 className="disp" style={{ fontSize: "clamp(28px,2.6vw,36px)", marginTop: 8, color: "var(--color-blue)" }}>{a.title}</h3>
                <p style={{ color: "var(--color-slate)", fontSize: 15, marginTop: 6 }}>{a.text}</p>
              </Link>
            </m.div>
          </Tilt>
        ))}
      </m.div>
    </div>
  );
}

/* ---------- Frise : bande à défilement horizontal, flèches et balayage ---------- */
export type Step = { date: string; title: string; sub: string; href: string };
export function Timeline({ steps, header }: { steps: Step[]; header: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const by = (d: number) => ref.current?.scrollBy({ left: d * Math.min(340, (ref.current?.clientWidth ?? 340) * 0.8), behavior: "smooth" });
  return (
    <div style={{ padding: "clamp(56px,9vw,100px) 0 clamp(40px,6vw,72px)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        {header}
        <div style={{ display: "flex", gap: 10, paddingBottom: 36 }}>
          <button className="btn btn-blue" aria-label="Étapes précédentes" onClick={() => by(-1)} style={{ width: 52, padding: 0, fontSize: 22 }}>‹</button>
          <button className="btn btn-blue" aria-label="Étapes suivantes" onClick={() => by(1)} style={{ width: 52, padding: 0, fontSize: 22 }}>›</button>
        </div>
      </div>
      <div ref={ref} className="track" tabIndex={0} aria-label="Frise des étapes, défilement horizontal" style={{ paddingInline: "var(--gutter)", position: "relative" }}>
        {steps.map((s, i) => (
          <Link key={s.href + i} href={s.href} className="blob-host step" style={{ flex: "0 0 auto", width: "min(76vw,300px)", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 18, height: 18, borderRadius: 99, background: "var(--color-red)", boxShadow: "0 0 0 8px rgba(197,1,0,.14)", marginBottom: 20 }} />
            <div className="blob" style={{ background: "#fff", padding: "22px 24px 26px", minHeight: 190 }}>
              <time className="disp" style={{ display: "block", fontSize: 36, color: "var(--color-blue)", fontStretch: "70%" }}>{s.date}</time>
              <b style={{ display: "block", marginTop: 12, fontSize: 18 }}>{s.title}</b>
              <span style={{ color: "var(--color-slate)", fontSize: 14 }}>{s.sub}</span>
            </div>
          </Link>
        ))}
      </div>
      <style>{`.track{border-top:0}.step:hover .blob{box-shadow:0 14px 34px rgba(0,30,107,.16)}.step .blob{transition:box-shadow .3s}`}</style>
    </div>
  );
}

/* ---------- Actualités : la miniature apparaît au survol ---------- */
export type NewsRow = { href: string; date: string; title: string; kind: string; photo: ReactNode | null };
export function NewsRows({ items }: { items: NewsRow[] }) {
  return (
    <div style={{ marginTop: 40, borderTop: "3px solid var(--color-blue)" }}>
      {items.map((n, i) => (
        <Reveal key={n.href} delay={i * 0.06} y={24}>
          <Link href={n.href} className="news-row" style={{ display: "grid", gridTemplateColumns: "140px 1fr auto 150px", gap: 22, alignItems: "center", padding: "22px 0", borderBottom: "1px solid var(--color-line)", textDecoration: "none", color: "inherit", position: "relative" }}>
            <time style={{ font: "600 13px var(--font-body)", color: "var(--color-slate)" }}>{n.date}</time>
            <h3 style={{ font: "700 clamp(20px,2vw,26px)/1.25 var(--font-body)" }}>{n.title}</h3>
            <span className="pill">{n.kind}</span>
            <div className="news-thumb" aria-hidden="true">{n.photo}</div>
          </Link>
        </Reveal>
      ))}
      <style>{`
        .news-row h3{transition:transform .4s var(--ease),color .3s}
        .news-row:hover h3{transform:translateX(14px);color:var(--color-red)}
        .news-thumb{width:150px;height:96px;border-radius:24px;overflow:hidden;transform:scale(.6) rotate(-6deg);opacity:0;transition:transform .5s var(--ease),opacity .4s}
        .news-row:hover .news-thumb{transform:scale(1) rotate(0);opacity:1}
        .news-thumb img{width:100%;height:100%;object-fit:cover;display:block}
        @media(max-width:820px){.news-row{grid-template-columns:1fr!important;gap:6px!important}.news-thumb{display:none}}
      `}</style>
    </div>
  );
}

/* ---------- Appel à rejoindre ---------- */
export function JoinCards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18, marginTop: 44 }}>
      {items.map((it, i) => (
        <Reveal key={it.title} delay={i * 0.1} y={50}>
          <Tilt>
            <Link href="/rejoindre/" className="join-card blob" style={{ display: "block", background: "var(--color-blue-2)", padding: "30px 28px 34px", textDecoration: "none", color: "#fff", minHeight: 230, borderRadius: i % 2 ? "56px 28px 56px 28px" : "28px 56px 28px 56px" }}>
              <span className="lab" style={{ color: "var(--color-coral)" }}>0{i + 1}</span>
              <h3 className="disp" style={{ fontSize: 46, marginTop: 14 }}>{it.title}</h3>
              <p style={{ color: "#e6ecff", marginTop: 12 }}>{it.text}</p>
            </Link>
          </Tilt>
        </Reveal>
      ))}
      <style>{`.join-card{transition:background .35s,border-radius .9s var(--ease)}.join-card:hover{background:var(--color-red)}`}</style>
    </div>
  );
}

export { Arcs };
