import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";
import { FilterGrid } from "@/components/interactive";
import { Reveal } from "@/components/motion";
import { getActivity, getNews } from "@/lib/content";
import { hrefOf } from "@/lib/links";

export const metadata: Metadata = { title: "Actualités et communiqués", description: "Comptes rendus et communiqués officiels de l’ASBL Kinshasa Bomoko Forever, du plus récent au plus ancien." };

export default function Page() {
  const news = getNews();
  const top = news[0];
  const topAct = top.activity ? getActivity(top.activity) : null;
  const rows = news.map((n) => {
    const a = n.activity ? getActivity(n.activity) : null;
    return { key: n.slug, href: a ? hrefOf(a) : "/actualites/", group: n.kind, date: n.publishedLabel, tag: n.kind === "communique" ? "Communiqué" : "Compte rendu", title: n.title, text: n.summary, photo: a?.cover ? <Photo id={a.cover} sizes="(min-width:900px) 33vw, 100vw" /> : null };
  });
  return (
    <>
      <PageHero kicker="Du plus récent au plus ancien" title="Actualités et communiqués" photo={<Photo id="lukunga-2026-7" priority style={{ objectPosition: "50% 40%" }} />} />
      <section className="sec">
        <div className="wrap">
          {topAct && (
            <Reveal>
              <Link href={hrefOf(topAct)} className="blob-host" style={{ display: "grid", gap: "clamp(20px,4vw,56px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                <div className="blob" style={{ aspectRatio: "3/2", overflow: "hidden" }}>{topAct.cover && <Photo id={topAct.cover} sizes="(min-width:760px) 55vw, 100vw" />}</div>
                <div>
                  <p className="lab" style={{ color: "var(--color-red)" }}>À la une · {top.publishedLabel}</p>
                  <h2 className="disp" style={{ fontSize: "clamp(34px,4.6vw,64px)", color: "var(--color-blue)", marginTop: 10 }}>{top.title}</h2>
                  <p style={{ marginTop: 14, color: "#2a3350", maxWidth: "46ch" }}>{top.summary}</p>
                  <span className="link-more" style={{ marginTop: 18, color: "var(--color-blue)" }}>Lire l’article</span>
                </div>
              </Link>
            </Reveal>
          )}
          <div style={{ marginTop: 64 }}>
            <FilterGrid noun="publication" filters={[{ id: "communique", label: "Communiqués" }, { id: "compte-rendu", label: "Comptes rendus" }]} items={rows} />
          </div>
        </div>
      </section>
    </>
  );
}
