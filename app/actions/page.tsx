import type { Metadata } from "next";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";
import { FilterGrid } from "@/components/interactive";
import { domains, getActivities, type Domain } from "@/lib/content";
import { hrefOf } from "@/lib/links";

export const metadata: Metadata = { title: "Nos actions", description: "Les actions de l’ASBL Kinshasa Bomoko Forever : sport et jeunesse, solidarité et éducation, vie citoyenne." };

export default function Page() {
  const list = getActivities();
  const used = (Object.keys(domains) as Domain[]).filter((d) => list.some((a) => a.domain === d));
  return (
    <>
      <PageHero kicker="Depuis février 2025" title="Nos actions" lead="Tournois, formations, visites, marches : tout ce que l’ASBL a mené, avec ses dates et ses sources." photo={<Photo id="finale-2026-1" priority style={{ objectPosition: "50% 50%" }} />} />
      <section className="sec">
        <div className="wrap">
          <FilterGrid
            noun="action"
            filters={used.map((d) => ({ id: d, label: domains[d] }))}
            items={list.map((a) => ({ key: a.slug, href: hrefOf(a), group: a.domain, date: a.eventDateLabel, tag: a.type, title: a.title, text: a.short, photo: a.cover ? <Photo id={a.cover} sizes="(min-width:900px) 33vw, 100vw" /> : null }))}
          />
        </div>
      </section>
    </>
  );
}
