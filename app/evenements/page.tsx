import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";
import { Magnetic, Reveal } from "@/components/motion";
import { getActivities, getUpcomingEvents, site } from "@/lib/content";
import { hrefOf } from "@/lib/links";

export const metadata: Metadata = { title: "Événements", description: "Tournois, marches et rassemblements de l’ASBL Kinshasa Bomoko Forever : à venir et archives." };

export default function Page() {
  const upcoming = getUpcomingEvents();
  const all = getActivities({ events: true });
  const years = [...new Set(all.map((a) => (a.eventDate ?? "").slice(0, 4)))].filter(Boolean).sort().reverse();
  return (
    <>
      <PageHero kicker="Tournois, marches, rassemblements" title="Événements" lead="Les rendez-vous de l’ASBL, avec leurs dates, leurs résultats et leurs photos." photo={<Photo id="coup-envoi-2025-1" priority style={{ objectPosition: "50% 50%" }} />} />
      <section className="sec">
        <div className="wrap">
          <p className="lab" style={{ color: "var(--color-red)", marginBottom: 14 }}>À venir</p>
          {upcoming.length === 0 ? (
            <Reveal>
              <div style={{ position: "relative", overflow: "hidden", background: "var(--color-mist)", borderRadius: "var(--radius-xl)", padding: "clamp(28px,5vw,64px)", display: "grid", gap: 30, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", alignItems: "center" }}>
                <div>
                  <h2 className="disp ttl" style={{ fontSize: "clamp(36px,5vw,68px)" }}>Prochain rendez-vous bientôt annoncé</h2>
                  <p style={{ marginTop: 14, maxWidth: "44ch", color: "#2a3350" }}>Aucun événement n’est confirmé. Une date n’est affichée qu’après sa publication officielle sur la page Facebook de l’ASBL.</p>
                  <Magnetic><a className="btn btn-red" style={{ marginTop: 22 }} href={site.facebook}>Suivre sur Facebook</a></Magnetic>
                </div>
                <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#001E6B" strokeWidth="2" aria-hidden="true" style={{ width: "100%", maxWidth: 300, justifySelf: "center" }}>
                  <circle cx="200" cy="200" r="40" /><circle cx="200" cy="200" r="90" /><circle cx="200" cy="200" r="140" /><circle cx="200" cy="200" r="190" stroke="#C50100" />
                </svg>
              </div>
            </Reveal>
          ) : null}

          <p className="lab" style={{ color: "var(--color-red)", marginTop: 72 }}>Archives</p>
          {years.map((y) => (
            <div key={y}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18, margin: "44px 0 12px", borderBottom: "3px solid var(--color-blue)", paddingBottom: 6 }}>
                <b className="disp" style={{ fontSize: 64, color: "var(--color-blue)", fontStretch: "70%" }}>{y}</b>
                <span style={{ color: "var(--color-slate)" }}>{all.filter((a) => a.eventDate?.startsWith(y)).length} événements</span>
              </div>
              {all.filter((a) => a.eventDate?.startsWith(y)).map((a) => (
                <Reveal key={a.slug} y={24}>
                  <Link href={hrefOf(a)} className="ev-row">
                    <time className="disp" style={{ fontSize: 30, color: "var(--color-red)", fontStretch: "70%" }}>{a.eventDateLabel.replace(/^\w+ /, "")}</time>
                    <div>
                      <h3 style={{ font: "700 22px/1.25 var(--font-body)" }}>{a.title}</h3>
                      <p style={{ color: "var(--color-slate)", fontSize: 15 }}>{a.place}</p>
                      <span className="pill" style={{ marginTop: 6 }}>{a.type}</span>
                    </div>
                    <div className="ev-thumb">{a.cover && <Photo id={a.cover} sizes="300px" />}</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          .ev-row{display:grid;grid-template-columns:200px 1fr 280px;gap:24px;align-items:center;padding:20px 14px;border-bottom:1px solid var(--color-line);text-decoration:none;color:inherit;border-radius:28px;transition:background .3s,transform .4s var(--ease)}
          .ev-row:hover{background:var(--color-mist);transform:translateX(10px)}
          .ev-thumb{aspect-ratio:16/9;border-radius:24px;overflow:hidden;background:var(--color-mist);transition:border-radius .8s var(--ease)}
          .ev-row:hover .ev-thumb{border-radius:46px 16px 46px 16px}
          @media(max-width:900px){.ev-row{grid-template-columns:1fr;gap:10px}}
        `}</style>
      </section>
    </>
  );
}
