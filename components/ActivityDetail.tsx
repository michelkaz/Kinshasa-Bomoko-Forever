import Link from "next/link";
import Photo from "./Photo";
import PageHero from "./PageHero";
import { Gallery } from "./interactive";
import { Magnetic, Reveal, SplitWords, CountUp, Flip } from "./motion";
import { domains, getActivities, type Activity } from "@/lib/content";
import { hrefOf, whatsappShare } from "@/lib/links";

/** Fiche commune aux actions et aux événements. Toute information absente des sources reste « à confirmer ». */
export default function ActivityDetail({ a }: { a: Activity }) {
  const cover = a.cover ?? "couverture-1";
  const others = getActivities().filter((x) => x.slug !== a.slug && x.cover).slice(0, 3);
  const score = a.slug === "finale-tournoi-2026";
  const share = whatsappShare(a.title, hrefOf(a));
  return (
    <>
      <style>{`.act-layout{display:grid;gap:clamp(28px,5vw,72px);grid-template-columns:minmax(0,1fr);align-items:start}.act-aside{position:static}@media(min-width:900px){.act-layout{grid-template-columns:minmax(0,1fr) 340px}.act-aside{position:sticky;top:96px}}`}</style>
      <PageHero
        tall
        kicker={`${a.isEvent ? "Événement" : "Action"} · ${domains[a.domain]}`}
        title={a.title}
        lead={a.short}
        photo={<Photo id={cover} priority sizes="100vw" style={{ objectPosition: "50% 35%" }} />}
      >
        {score && (
          <div role="img" aria-label="JSK 1, Mateta 0" style={{ display: "flex", alignItems: "center", gap: "clamp(14px,3vw,36px)", marginTop: 26, flexWrap: "wrap" }}>
            <span className="disp" style={{ fontSize: "clamp(34px,6vw,84px)" }}>JSK</span>
            <span style={{ display: "flex", gap: ".1em", font: "800 clamp(64px,11vw,150px)/1 var(--font-display)", fontStretch: "75%", color: "var(--color-coral)", fontVariantNumeric: "tabular-nums" }}>
              <Flip delay={0.4}>1</Flip><Flip delay={0.55}>–</Flip><Flip delay={0.7}>0</Flip>
            </span>
            <span className="disp" style={{ fontSize: "clamp(34px,6vw,84px)" }}>Mateta</span>
          </div>
        )}
      </PageHero>

      <section className="sec">
        <div className="wrap act-layout">
          <div style={{ minWidth: 0 }}>
            <Reveal><p style={{ fontSize: 22, fontWeight: 600, color: "var(--color-blue)", maxWidth: "52ch" }}>{a.intro}</p></Reveal>
            {a.body.map((p, i) => (
              <Reveal key={i} delay={0.05}><p style={{ fontSize: 18, maxWidth: "62ch", marginTop: 18 }}>{p}</p></Reveal>
            ))}

            {a.results.length > 0 && (
              <>
                <h2 className="disp ttl" style={{ fontSize: "clamp(34px,4vw,56px)", marginTop: 54 }}>Résultats</h2>
                <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", marginTop: 18 }}>
                  {a.results.map((r) => (
                    <Reveal key={r.label}>
                      <div style={{ background: "var(--color-mist)", borderRadius: 28, padding: "20px 24px" }}>
                        <p className="lab" style={{ color: "var(--color-red)" }}>{r.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{r.value}</p>
                        {r.note && <p style={{ color: "var(--color-slate)", fontSize: 14 }}>{r.note}</p>}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </>
            )}

            {a.prizes.length > 0 && (
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", marginTop: 22 }}>
                {a.prizes.map((p, i) => (
                  <Reveal key={p.rank} delay={i * 0.08}>
                    <div style={{ background: "var(--color-blue)", color: "#fff", borderRadius: 28, padding: "20px 22px" }}>
                      <b className="disp" style={{ fontSize: "clamp(22px,2vw,30px)", fontStretch: "75%", display: "block", whiteSpace: "nowrap" }}>
                        <CountUp to={Number(p.amount.replace(/\D/g, ""))} suffix=" FC" />
                      </b>
                      <span style={{ color: "var(--color-pale)", fontSize: 14 }}>{p.rank}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {a.press.length > 0 && (
              <>
                <h2 className="disp ttl" style={{ fontSize: "clamp(30px,3.4vw,46px)", marginTop: 48 }}>Couverture</h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                  {a.press.map((p) => <span key={p} className="pill" style={{ fontSize: 14, padding: "8px 16px" }}>{p}</span>)}
                </div>
              </>
            )}
          </div>

          <aside className="act-aside" style={{ minWidth: 0 }}>
            <dl style={{ margin: 0, borderTop: "3px solid var(--color-blue)" }}>
              {[
                ["Date de l’événement", a.eventDateLabel],
                ["Publié le", a.publishedLabel],
                ["Lieu", a.place],
                ["Domaine", domains[a.domain]],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid var(--color-line)" }}>
                  <dt className="lab" style={{ color: "var(--color-red)" }}>{k}</dt>
                  <dd style={{ margin: "2px 0 0", fontWeight: 600 }}>{v}</dd>
                </div>
              ))}
              <div style={{ padding: "14px 0" }}>
                <dt className="lab" style={{ color: "var(--color-red)" }}>Statut</dt>
                <dd style={{ margin: "6px 0 0" }}><span className="pill" style={{ background: "var(--color-blue)", color: "#fff" }}>Terminée</span></dd>
              </div>
            </dl>
            <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
              <Magnetic><a className="btn btn-wa" href={share} style={{ width: "100%" }}>Partager sur WhatsApp</a></Magnetic>
              <Link className="btn btn-red" href="/rejoindre/">Nous rejoindre</Link>
            </div>
          </aside>
        </div>
      </section>

      {a.photos.length > 0 && (
        <section style={{ background: "var(--color-night)", color: "#fff", borderRadius: "var(--radius-xl)", margin: "0 clamp(0px,1.2vw,18px)" }}>
          <div className="wrap" style={{ paddingBlock: "clamp(56px,8vw,96px)" }}>
            <SplitWords as="h2" text="Galerie" className="disp ttl ttl-light" />
            <p style={{ color: "var(--color-pale)", marginTop: 10 }}>Touchez une photo pour l’agrandir, balayez pour passer à la suivante.</p>
            <Gallery items={a.photos.map((id) => ({ id, alt: "", thumb: <Photo id={id} sizes="(min-width:760px) 25vw, 50vw" />, full: <Photo id={id} sizes="92vw" style={{ objectFit: "contain", maxHeight: "74vh", background: "#000a28" }} /> }))
              .map((g, i) => ({ ...g, alt: altOf(a.photos[i]) }))} />
          </div>
        </section>
      )}

      <section className="sec">
        <div className="wrap">
          <div style={{ background: "var(--color-mist)", borderRadius: 36, padding: "26px 30px" }}>
            <p className="lab" style={{ color: "var(--color-red)", marginBottom: 8 }}>Sources</p>
            {a.sources.map((s) => <p key={s} style={{ fontSize: 14, color: "#2a3350" }}>{s}</p>)}
            {a.toConfirm.length > 0 && (
              <div className="tbd" style={{ marginTop: 16 }}>
                <b>À confirmer</b>
                {a.toConfirm.join(" · ")}
              </div>
            )}
          </div>
          <h2 className="disp ttl" style={{ fontSize: "clamp(34px,4vw,56px)", marginTop: 64 }}>À lire aussi</h2>
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", marginTop: 22 }}>
            {others.map((o) => (
              <Reveal key={o.slug}>
                <Link href={hrefOf(o)} className="blob-host" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div className="blob" style={{ aspectRatio: "4/3", overflow: "hidden" }}><Photo id={o.cover!} sizes="320px" /></div>
                  <b style={{ display: "block", marginTop: 10 }}>{o.title}</b>
                  <span style={{ fontSize: 14, color: "var(--color-slate)" }}>{o.eventDateLabel}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { getPhoto } from "@/lib/content";
function altOf(id: string) {
  return getPhoto(id)?.alt ?? "";
}
