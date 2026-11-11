"use client";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Reveal, Tilt } from "./motion";

/* ---------- Grille filtrable (actions, actualités) ---------- */
export type GridItem = { key: string; href: string; group: string; date: string; tag: string; title: string; text: string; photo: ReactNode | null };

export function FilterGrid({ items, filters, noun }: { items: GridItem[]; filters: { id: string; label: string }[]; noun: string }) {
  const [f, setF] = useState("all");
  const list = f === "all" ? items : items.filter((i) => i.group === f);
  return (
    <div>
      <div role="group" aria-label="Filtrer" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[{ id: "all", label: "Toutes" }, ...filters].map((x) => (
          <button
            key={x.id}
            aria-pressed={f === x.id}
            onClick={() => setF(x.id)}
            className="btn"
            style={{ minHeight: 46, padding: "0 22px", background: f === x.id ? "var(--color-blue)" : "var(--color-mist)", color: f === x.id ? "#fff" : "var(--color-blue)" }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" style={{ marginTop: 18, color: "var(--color-slate)", fontSize: 14 }}>
        {list.length} {noun}
        {list.length > 1 ? "s" : ""}
      </p>
      <m.div layout style={{ display: "grid", gap: "36px 26px", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,320px),1fr))", marginTop: 20 }}>
        <AnimatePresence mode="popLayout">
          {list.map((a, i) => (
            <m.div key={a.key} layout initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 140, damping: 18, delay: Math.min(i, 6) * 0.04 }}>
              <Tilt max={5}>
                <Link href={a.href} className="blob-host" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                  <div className="blob" style={{ aspectRatio: "4/3", overflow: "hidden", background: "var(--color-blue)", position: "relative" }}>
                    {a.photo ?? (
                      <div className="disp" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: 20, color: "#fff", fontSize: 38 }}>Affiche seule</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                    <time className="lab" style={{ color: "var(--color-red)" }}>{a.date}</time>
                    <span className="pill">{a.tag}</span>
                  </div>
                  <h3 className="disp" style={{ fontSize: "clamp(28px,2.4vw,36px)", marginTop: 8, color: "var(--color-blue)" }}>{a.title}</h3>
                  <p style={{ color: "var(--color-slate)", fontSize: 15, marginTop: 6 }}>{a.text}</p>
                </Link>
              </Tilt>
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>
    </div>
  );
}

/* ---------- Galerie en mosaïque + visionneuse plein écran (flèches, clavier, balayage) ---------- */
export type GalleryItem = { id: string; alt: string; thumb: ReactNode; full: ReactNode };

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [i, setI] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const n = items.length;
  const go = useCallback((d: number) => {
    setDir(d);
    setI((v) => (v === null ? v : (v + d + n) % n));
  }, [n]);
  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [i, go]);

  return (
    <>
      <div className="gal-grid">
        {items.map((p, k) => (
          <Reveal key={p.id} delay={(k % 4) * 0.07} y={40} className={k === 0 ? "gal-big" : ""}>
            <button className="blob gal-btn" aria-label={`Agrandir : ${p.alt}`} onClick={() => { setDir(1); setI(k); }}>
              {p.thumb}
            </button>
          </Reveal>
        ))}
      </div>
      <style>{`
        .gal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:clamp(150px,18vw,240px);gap:14px;margin-top:28px}
        .gal-big{grid-column:span 2;grid-row:span 2}
        .gal-grid>div{height:100%}
        .gal-btn{display:block;width:100%;height:100%;padding:0;border:0;cursor:zoom-in;overflow:hidden;background:var(--color-night)}
        .gal-btn img{transition:transform 1s var(--ease)}
        .gal-btn:hover img{transform:scale(1.08)}
        @media(max-width:760px){.gal-grid{grid-template-columns:1fr 1fr}}
      `}</style>
      <AnimatePresence>
        {i !== null && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo agrandie"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,10,40,.95)", display: "grid", placeItems: "center", padding: 20 }}
            onClick={() => setI(null)}
          >
            <button onClick={() => setI(null)} className="btn btn-ghost" style={{ position: "absolute", top: 16, right: 16, minHeight: 46 }}>Fermer</button>
            <button aria-label="Photo précédente" onClick={(e) => { e.stopPropagation(); go(-1); }} className="btn btn-ghost" style={{ position: "absolute", left: 14, top: "50%", width: 52, height: 52, padding: 0, fontSize: 22 }}>‹</button>
            <button aria-label="Photo suivante" onClick={(e) => { e.stopPropagation(); go(1); }} className="btn btn-ghost" style={{ position: "absolute", right: 14, top: "50%", width: 52, height: 52, padding: 0, fontSize: 22 }}>›</button>
            <AnimatePresence mode="wait" custom={dir}>
              <m.figure
                key={i}
                custom={dir}
                initial={reduce ? false : { opacity: 0, x: dir * 80, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -80 }}
                transition={{ duration: 0.35 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(1);
                  else if (info.offset.x > 70) go(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ margin: 0, width: "min(1100px,92vw)", maxHeight: "82vh", borderRadius: 32, overflow: "hidden", display: "grid" }}
              >
                <div style={{ maxHeight: "74vh", display: "grid" }}>{items[i].full}</div>
                <figcaption style={{ padding: "12px 18px", background: "var(--color-night)", color: "var(--color-pale)", fontSize: 14 }}>
                  {items[i].alt} <span style={{ opacity: 0.7 }}>· {i + 1}/{n}</span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Formulaire « Nous rejoindre » ---------- */
const KINDS = [
  { id: "adherent", title: "Adhérent", text: "Demandez à devenir membre de l’ASBL." },
  { id: "benevole", title: "Bénévole", text: "Donnez du temps pour les tournois, les visites et le terrain." },
  { id: "partenaire", title: "Partenaire", text: "Proposez un soutien ou une collaboration." },
];

export function JoinForm() {
  const [kind, setKind] = useState("adherent");
  const [v, setV] = useState({ nom: "", tel: "", com: "", mot: "", cons: false });
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const err = { nom: !v.nom.trim(), tel: !v.tel.trim(), cons: !v.cons };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (err.nom || err.tel || err.cons) return setTried(true);
    setSent(true);
  };
  const field = (id: string) => ({ border: `2px solid ${tried && (err as Record<string, boolean>)[id] ? "var(--color-red)" : "#8e97b5"}`, borderRadius: 18, padding: 14, font: "400 17px var(--font-body)", minHeight: 54, background: "#fff", width: "100%" } as const);
  return (
    <div>
      <p className="lab" style={{ color: "var(--color-red)", marginBottom: 12 }}>1. Vous êtes</p>
      <div role="group" aria-label="Type de demande" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        {KINDS.map((k) => (
          <m.button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} className="blob" style={{ textAlign: "left", padding: 22, border: "2px solid var(--color-blue)", background: kind === k.id ? "var(--color-blue)" : "#fff", color: kind === k.id ? "#fff" : "var(--color-blue)", cursor: "pointer", font: "inherit" }}>
            <span className="disp" style={{ fontSize: 38, display: "block" }}>{k.title}</span>
            <span style={{ fontSize: 15, display: "block", marginTop: 8 }}>{k.text}</span>
          </m.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sent ? (
          <m.div key="ok" role="status" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 110, damping: 15 }} style={{ background: "var(--color-mist)", borderRadius: 36, padding: "34px 34px 38px", marginTop: 40 }}>
            <p className="lab" style={{ color: "var(--color-red)" }}>Demande reçue</p>
            <h2 className="disp" style={{ fontSize: "clamp(34px,4vw,54px)", color: "var(--color-blue)", marginTop: 10 }}>Merci, votre demande est enregistrée</h2>
            <p style={{ marginTop: 12, maxWidth: "54ch" }}>L’équipe de l’ASBL va l’examiner. Une demande n’est jamais validée automatiquement. Nous vous répondrons au numéro indiqué.</p>
            <button className="btn btn-blue" style={{ marginTop: 20 }} onClick={() => { setSent(false); setTried(false); setV({ nom: "", tel: "", com: "", mot: "", cons: false }); }}>Envoyer une autre demande</button>
          </m.div>
        ) : (
          <m.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} style={{ marginTop: 40, display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            <p className="lab" style={{ color: "var(--color-red)", gridColumn: "1/-1" }}>2. Vos coordonnées · {KINDS.find((k) => k.id === kind)?.title}</p>
            <div style={{ display: "grid", gap: 6 }}>
              <label htmlFor="nom" style={{ fontWeight: 600 }}>Nom complet</label>
              <input id="nom" autoComplete="name" value={v.nom} onChange={(e) => setV({ ...v, nom: e.target.value })} aria-invalid={tried && err.nom} style={field("nom")} />
              {tried && err.nom && <span role="alert" style={{ color: "#9e0000", fontWeight: 600, fontSize: 14 }}>Indiquez votre nom.</span>}
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label htmlFor="tel" style={{ fontWeight: 600 }}>Téléphone ou WhatsApp</label>
              <input id="tel" type="tel" autoComplete="tel" value={v.tel} onChange={(e) => setV({ ...v, tel: e.target.value })} aria-invalid={tried && err.tel} style={field("tel")} />
              {tried && err.tel && <span role="alert" style={{ color: "#9e0000", fontWeight: 600, fontSize: 14 }}>Indiquez un numéro pour que l’équipe puisse vous répondre.</span>}
            </div>
            <div style={{ display: "grid", gap: 6, gridColumn: "1/-1" }}>
              <label htmlFor="com" style={{ fontWeight: 600 }}>Commune ou quartier</label>
              <input id="com" value={v.com} onChange={(e) => setV({ ...v, com: e.target.value })} style={field("com")} />
              <span style={{ fontSize: 13, color: "var(--color-slate)" }}>Exemple : Kingasani, Masina, Lukunga</span>
            </div>
            <div style={{ display: "grid", gap: 6, gridColumn: "1/-1" }}>
              <label htmlFor="mot" style={{ fontWeight: 600 }}>Pourquoi voulez-vous nous rejoindre ?</label>
              <textarea id="mot" rows={4} value={v.mot} onChange={(e) => setV({ ...v, mot: e.target.value })} style={{ ...field("mot"), minHeight: 130 }} />
              <span style={{ fontSize: 13, color: "var(--color-slate)" }}>Quelques phrases suffisent. Aucune pièce d’identité n’est demandée.</span>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <input id="cons" type="checkbox" checked={v.cons} onChange={(e) => setV({ ...v, cons: e.target.checked })} style={{ width: 24, height: 24, marginTop: 3, flex: "none" }} />
              <label htmlFor="cons">J’accepte que l’ASBL utilise ces informations pour traiter ma demande. <Link href="/mentions-legales/#confidentialite" style={{ color: "var(--color-blue)", fontWeight: 600 }}>Politique de confidentialité</Link></label>
            </div>
            {tried && err.cons && <span role="alert" style={{ gridColumn: "1/-1", color: "#9e0000", fontWeight: 600 }}>Cochez la case pour envoyer votre demande.</span>}
            <div style={{ gridColumn: "1/-1" }}>
              <button className="btn btn-red" type="submit" style={{ minHeight: 56, fontSize: 16 }}>Envoyer ma demande</button>
              <span style={{ marginLeft: 14, fontSize: 13, color: "var(--color-slate)" }}>Démonstration : l’envoi est simulé.</span>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="btn btn-blue" onClick={async () => { try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1800); } catch {} }}>
      {ok ? "Lien copié" : label}
    </button>
  );
}
