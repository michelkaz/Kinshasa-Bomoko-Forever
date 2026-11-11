import Link from "next/link";
import Photo from "@/components/Photo";
import Wave from "@/components/Wave";
import { ActionsCarousel, DomainCards, HomeHero, JoinCards, NewsRows, ScoreBoard, Timeline } from "@/components/home";
import { Marquee, Reveal, SplitWords, Magnetic } from "@/components/motion";
import { getActivities, getActivity, getNews, getUpcomingEvents, site } from "@/lib/content";
import { hrefOf } from "@/lib/links";

export default function Home() {
  const h = site.home;
  const upcoming = getUpcomingEvents();
  const recent = getActivities().filter((a) => a.cover).slice(0, 6);
  const news = getNews().slice(0, 4);

  const steps = [
    { date: "22 fév. 2025", title: "Première réunion stratégique", sub: "Préparation de la Sortie officielle", slug: "sortie-officielle-2025" },
    { date: "2 mars 2025", title: "Sortie officielle", sub: "Terrain Saint Paul, Kingasani", slug: "sortie-officielle-2025" },
    { date: "27 juil. 2025", title: "Finale du Play Off", sub: "Avec la FECOFA", slug: "tournoi-play-off-2025" },
    { date: "12 août 2025", title: "Coup d'envoi du tournoi", sub: "1re édition, terrain Saint Paul", slug: "tournoi-doudou-fwamba-2025" },
    { date: "9 mars 2026", title: "Visite à l'hospice", sub: "Kingasani Saint Marc", slug: "geste-de-coeur-hospice-2026" },
    { date: "5 juil. 2026", title: "Extension à Lukunga", sub: "Installation de la coordination", slug: "extension-lukunga-2026" },
    { date: "8 août 2026", title: "Rassemblement à Masina", sub: "Terrain municipal", slug: "rassemblement-masina-2026" },
    { date: "5 sept. 2026", title: "Finale, 2e édition", sub: "JSK 1 – 0 Mateta", slug: "finale-tournoi-2026" },
  ].map((s) => {
    const a = getActivity(s.slug)!;
    return { date: s.date, title: s.title, sub: s.sub, href: hrefOf(a) };
  });

  return (
    <>
      <HomeHero
        photo={<Photo id="finale-2026-5" priority sizes="100vw" alt="Ephraïm Mpanda serre la main des joueurs en maillot jaune et bleu avant la finale du tournoi, au terrain Saint Paul" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />}
        kicker={h.heroKicker}
        title={h.heroTitle}
        sub={h.heroSub}
      />

      <div style={{ marginTop: 28 }}>
        <Marquee items={["Grandir", "Partager", "S’entraider", "S’unir"]} tone="dark" />
      </div>

      <section className="sec" aria-labelledby="qui">
        <div className="wrap" style={{ display: "grid", gap: "clamp(24px,5vw,80px)", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", alignItems: "start" }}>
          <div>
            <Reveal><p className="lab" style={{ color: "var(--color-red)", marginBottom: 18 }}>{h.introKicker}</p></Reveal>
            <SplitWords as="h2" text={h.introTitle} className="disp ttl" accent={[2, 3]} />
          </div>
          <Reveal delay={0.15}>
            <p style={{ fontSize: 19, maxWidth: "44ch" }}>{h.introText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
              {["Kingasani", "Kimbanseke", "Masina", "Lukunga"].map((z) => (
                <span key={z} className="pill" style={{ fontSize: 14, padding: "8px 16px" }}>{z}</span>
              ))}
            </div>
            <Magnetic><Link href="/association/" className="link-more" style={{ marginTop: 28, color: "var(--color-blue)" }}>Découvrir l'association</Link></Magnetic>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--color-night)", color: "#fff", position: "relative" }} aria-labelledby="dom">
        <Wave fill="#ffffff" flip height={70} />
        <div className="wrap" style={{ paddingBlock: "20px clamp(80px,10vw,130px)" }}>
          <Reveal><p className="lab" style={{ color: "var(--color-coral)", marginBottom: 18 }}>Ce que nous faisons</p></Reveal>
          <SplitWords as="h2" text={h.domainsTitle} className="disp ttl ttl-light" />
          <DomainCards
            items={[
              { href: "/actions/", title: "Sport et jeunesse", text: "Play Off, Tournoi Doudou Fwamba : des finales au terrain Saint Paul.", photo: <Photo id="finale-2026-3" sizes="(min-width:768px) 33vw, 100vw" /> },
              { href: "/actions/", title: "Solidarité et éducation", text: "Visite à l'hospice de Kingasani, formations gratuites des vacances.", photo: <Photo id="hospice-2026-7" sizes="(min-width:768px) 33vw, 100vw" /> },
              { href: "/actions/", title: "Vie citoyenne", text: "Marches, rassemblements, dons et extensions de l'ASBL.", photo: <Photo id="sortie-2025-2" sizes="(min-width:768px) 33vw, 100vw" /> },
            ]}
          />
        </div>
        <Wave fill="#ffffff" height={70} variant={2} />
      </section>

      <section className="sec" aria-labelledby="next" style={{ paddingTop: "clamp(40px,6vw,72px)" }}>
        <div className="wrap">
          <Reveal><p className="lab" style={{ color: "var(--color-red)", marginBottom: 18 }}>Prochain événement</p></Reveal>
          {upcoming.length === 0 ? (
            <Reveal>
              <div style={{ position: "relative", overflow: "hidden", background: "var(--color-mist)", borderRadius: "var(--radius-xl)", padding: "clamp(30px,6vw,72px)", display: "grid", gap: 30, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", alignItems: "center" }}>
                <div>
                  <h2 id="next" className="disp" style={{ fontSize: "clamp(36px,5vw,68px)", color: "var(--color-blue)" }}>Prochain rendez-vous bientôt annoncé</h2>
                  <p style={{ marginTop: 16, maxWidth: "42ch", color: "#2a3350" }}>Aucun événement n'est confirmé pour le moment. Les dates sont publiées d'abord sur notre page Facebook.</p>
                  <Magnetic><a className="btn btn-red" style={{ marginTop: 24 }} href={site.facebook}>Suivre sur Facebook</a></Magnetic>
                </div>
                <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#001E6B" strokeWidth="2" aria-hidden="true" style={{ width: "100%", maxWidth: 320, justifySelf: "center" }}>
                  <circle cx="200" cy="200" r="40" /><circle cx="200" cy="200" r="90" /><circle cx="200" cy="200" r="140" /><circle cx="200" cy="200" r="190" stroke="#C50100" />
                </svg>
              </div>
            </Reveal>
          ) : (
            <h2 id="next" className="disp ttl">{upcoming[0].title}</h2>
          )}
        </div>
      </section>

      <ScoreBoard
        photos={[
          <Photo key="a" id="finale-2026-7" sizes="(min-width:768px) 33vw, 100vw" />,
          <Photo key="b" id="finale-2026-4" sizes="(min-width:768px) 33vw, 100vw" />,
          <Photo key="c" id="finale-2026-2" sizes="(min-width:768px) 33vw, 100vw" />,
        ]}
        prizes={[
          { rank: "1re place", value: 24000000 },
          { rank: "2e place", value: 16500000 },
          { rank: "3e place", value: 12500000 },
          { rank: "4e place", value: 8000000 },
        ]}
      />

      <section className="sec" aria-labelledby="ar">
        <div className="wrap">
          <Reveal><p className="lab" style={{ color: "var(--color-red)", marginBottom: 18 }}>Actions récentes</p></Reveal>
          <SplitWords as="h2" text="Sur le terrain" className="disp ttl" />
          <p style={{ color: "var(--color-slate)", marginTop: 12 }}>Faites glisser les cartes pour les parcourir.</p>
        </div>
        <div className="wrap">
          <ActionsCarousel
            items={recent.map((a) => ({ href: hrefOf(a), date: a.eventDateLabel.replace(/^\w+ /, ""), title: a.title, text: a.short, tag: a.type, photo: a.cover ? <Photo id={a.cover} sizes="380px" /> : null }))}
          />
          <Magnetic><Link href="/actions/" className="link-more" style={{ marginTop: 8, color: "var(--color-blue)" }}>Toutes nos actions</Link></Magnetic>
        </div>
      </section>

      <section style={{ background: "var(--color-mist)", borderRadius: "var(--radius-xl)", margin: "0 clamp(0px,1.2vw,18px)" }} aria-labelledby="fr">
        <Timeline
          steps={steps}
          header={
            <div className="wrap" style={{ paddingBottom: 36 }}>
              <p className="lab" style={{ color: "var(--color-red)", marginBottom: 14 }}>Depuis février 2025</p>
              <h2 className="disp ttl">Les étapes</h2>
            </div>
          }
        />
      </section>

      <section className="sec" aria-labelledby="ac">
        <div className="wrap">
          <Reveal><p className="lab" style={{ color: "var(--color-red)", marginBottom: 18 }}>Actualités</p></Reveal>
          <SplitWords as="h2" text="Dernières nouvelles" className="disp ttl" />
          <NewsRows
            items={news.map((n) => {
              const a = n.activity ? getActivity(n.activity) : null;
              return { href: "/actualites/", date: n.publishedLabel, title: n.title, kind: n.kind === "communique" ? "Communiqué" : "Compte rendu", photo: a?.cover ? <Photo id={a.cover} sizes="150px" /> : null };
            })}
          />
          <Magnetic><Link href="/actualites/" className="link-more" style={{ marginTop: 30, color: "var(--color-blue)" }}>Toutes les actualités</Link></Magnetic>
        </div>
      </section>

      <section style={{ background: "var(--color-blue)", color: "#fff", position: "relative", overflow: "hidden", borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }} aria-labelledby="jn">
        <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true" style={{ position: "absolute", right: -120, top: -120, width: 560, opacity: 0.22 }}>
          <circle cx="200" cy="200" r="60" /><circle cx="200" cy="200" r="110" /><circle cx="200" cy="200" r="160" /><circle cx="200" cy="200" r="198" />
        </svg>
        <div className="wrap" style={{ position: "relative", paddingBlock: "clamp(64px,10vw,120px) clamp(72px,10vw,130px)" }}>
          <Reveal><p className="lab" style={{ color: "var(--color-coral)", marginBottom: 18 }}>Nous rejoindre</p></Reveal>
          <SplitWords as="h2" text="Agir avec nous" className="disp ttl ttl-light" />
          <JoinCards
            items={[
              { title: "Adhérent", text: "Demandez à devenir membre. L'équipe examine chaque demande." },
              { title: "Bénévole", text: "Donnez du temps pour les tournois, les visites et le terrain." },
              { title: "Partenaire", text: "Proposez un soutien ou une collaboration à l'ASBL." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
