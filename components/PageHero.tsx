"use client";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { SplitWords } from "./motion";

/**
 * Première section de chaque page, comme l'accueil : photo pleine largeur, rectangulaire, titre dessus.
 * Hauteur proche de l'écran entier pour que la photo soit très peu recadrée (les têtes restent visibles).
 */
export default function PageHero({
  kicker,
  title,
  photo,
  lead,
  children,
  accent = [],
}: {
  kicker: string;
  title: string;
  photo: ReactNode;
  lead?: string;
  children?: ReactNode;
  tall?: boolean;
  accent?: number[];
}) {
  return (
    <section data-hero className="page-hero">
      <div className="hero-photo">{photo}</div>
      <div className="hero-veil" />
      <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true" style={{ position: "absolute", right: "-12%", top: "-22%", width: "70%", maxWidth: 900, opacity: 0.2 }}>
        <circle cx="200" cy="200" r="60" /><circle cx="200" cy="200" r="110" /><circle cx="200" cy="200" r="160" /><circle cx="200" cy="200" r="198" />
      </svg>
      <div className="wrap hero-content">
        <m.p className="lab" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ color: "var(--color-coral)", marginBottom: 14, display: "inline-block", background: "rgba(0,15,58,.72)", padding: "8px 14px", borderRadius: 999 }}>
          {kicker}
        </m.p>
        <SplitWords as="h1" text={title} accent={accent} delay={0.2} className={`disp ${title.length > 24 ? "long" : ""}`} />
        {lead && (
          <m.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} style={{ marginTop: 18, maxWidth: "52ch", fontSize: "clamp(17px,1.5vw,20px)", color: "#e6ecff" }}>
            {lead}
          </m.p>
        )}
        {children}
      </div>
      <style>{`
        .page-hero{position:relative;isolation:isolate;overflow:hidden;display:flex;align-items:flex-end;color:#fff;background:var(--color-blue);border-radius:0;min-height:min(calc(100svh - var(--hh)),900px)}
        .hero-photo{position:absolute;inset:0;z-index:-3}
        .hero-photo img{width:100%;height:100%;object-fit:cover}
        .hero-veil{position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,rgba(0,30,107,0) 0%,rgba(0,30,107,0) 38%,rgba(0,15,58,.9) 100%)}
        .hero-content{padding-top:56px;padding-bottom:clamp(40px,6vw,72px)}
        .page-hero h1{font-size:clamp(44px,7.4vw,112px);max-width:14ch;color:#fff;text-shadow:0 2px 24px rgba(0,15,58,.45)}
        .page-hero h1.long{font-size:clamp(38px,5.4vw,84px);max-width:20ch}
        @media(max-width:700px){.page-hero{min-height:min(calc(100svh - var(--hh)),720px)}}
      `}</style>
    </section>
  );
}
