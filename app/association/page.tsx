import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";
import { MaskReveal, Parallax, Reveal, SplitWords } from "@/components/motion";

export const metadata: Metadata = { title: "L’association", description: "Histoire, mission, vision et organisation de l’ASBL Kinshasa Bomoko Forever, dont la sortie officielle a eu lieu le 2 mars 2025 à Kingasani." };

const Tbd = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div className="tbd" style={dark ? { background: "var(--color-blue-2)", color: "#fff", borderColor: "var(--color-coral)" } : undefined}><b>À confirmer</b>{children}</div>
);

export default function Page() {
  return (
    <>
      <PageHero kicker="Kinshasa Bomoko Forever ASBL" title="L’association" lead="Une ASBL de Kinshasa, ouverte à toutes les générations." photo={<Photo id="couverture-1" priority sizes="100vw" style={{ objectPosition: "50% 40%" }} />} />

      <section className="sec">
        <div className="wrap" style={{ display: "grid", gap: "clamp(24px,5vw,80px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", alignItems: "start" }}>
          <div><p className="lab" style={{ color: "var(--color-red)", marginBottom: 16 }}>Histoire</p><SplitWords as="h2" text="Une sortie officielle le 2 mars 2025" className="disp ttl" /></div>
          <Reveal delay={0.1}>
            <p style={{ fontSize: 18, maxWidth: "50ch" }}>L’ASBL a fait sa sortie officielle au terrain Saint Paul de Kingasani. Elle l’a préparée par une réunion stratégique le 22 février 2025, puis par une marche dans le quartier le 1er mars. Son initiateur est Me Ephraïm Mpanda.</p>
            <div style={{ marginTop: 22 }}><Tbd>Date de création, histoire détaillée et sigle officiel, à valider avec l’association.</Tbd></div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--color-mist)", borderRadius: "var(--radius-xl)", margin: "0 clamp(0px,1.2vw,18px)" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(56px,9vw,104px)" }}>
          <p className="lab" style={{ color: "var(--color-red)", marginBottom: 16 }}>Mission, vision, valeurs</p>
          <SplitWords as="h2" text="Ce qui nous guide" className="disp ttl" />
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", marginTop: 36 }}>
            {["Mission", "Vision", "Valeurs"].map((t, i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className="blob" style={{ background: "#fff", padding: 26 }}>
                  <h3 className="disp" style={{ fontSize: 40, color: "var(--color-blue)", marginBottom: 12 }}>{t}</h3>
                  <Tbd>Texte validé par l’association.</Tbd>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ marginTop: 28, maxWidth: "62ch", color: "#2a3350" }}>Slogan utilisé par l’ASBL : « La voix de l’unité et de l’espoir ».</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap" style={{ display: "grid", gap: "clamp(24px,5vw,80px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", alignItems: "center" }}>
          <div>
            <p className="lab" style={{ color: "var(--color-red)", marginBottom: 16 }}>Zone d’action</p>
            <SplitWords as="h2" text="Kinshasa et ses communes" className="disp ttl" />
            <p style={{ fontSize: 18, maxWidth: "46ch", marginTop: 20 }}>Le siège est à Kingasani, face à la commune de Kimbanseke. Les activités se tiennent aussi à Masina et à Lukunga, où l’ASBL a installé une extension le 5 juillet 2026.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {["Kingasani", "Kimbanseke", "Masina", "Lukunga"].map((z) => <span key={z} className="pill" style={{ fontSize: 15, padding: "10px 18px" }}>{z}</span>)}
            </div>
          </div>
          <Parallax speed={30}><MaskReveal><div className="blob" style={{ aspectRatio: "4/3", overflow: "hidden" }}><Photo id="lukunga-2026-2" sizes="(min-width:760px) 45vw, 100vw" /></div></MaskReveal></Parallax>
        </div>
      </section>

      <section style={{ background: "var(--color-night)", color: "#fff", borderRadius: "var(--radius-xl)", margin: "0 clamp(0px,1.2vw,18px)" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(56px,9vw,104px)", display: "grid", gap: "clamp(24px,5vw,80px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", alignItems: "center" }}>
          <div>
            <p className="lab" style={{ color: "var(--color-coral)", marginBottom: 16 }}>L’initiateur</p>
            <SplitWords as="h2" text="Me Ephraïm Mpanda" className="disp ttl ttl-light" />
            <p style={{ marginTop: 20, maxWidth: "46ch", color: "#dce5ff" }}>Initiateur de l’ASBL, surnommé « l’Infatigable » par la presse. Sa biographie et son mot restent à valider avant publication.</p>
            <div style={{ marginTop: 20 }}><Tbd dark>Nom complet, biographie, mot de l’initiateur.</Tbd></div>
          </div>
          <Reveal>
            <div className="blob" style={{ aspectRatio: "4/3", overflow: "hidden" }}><Photo id="finale-2026-5" sizes="(min-width:760px) 45vw, 100vw" /></div>
            <p style={{ fontSize: 13, color: "var(--color-pale)", marginTop: 10 }}>Finale du 5 septembre 2026, terrain Saint Paul. Identité à confirmer par l’association.</p>
          </Reveal>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="lab" style={{ color: "var(--color-red)", marginBottom: 16 }}>Organisation</p>
          <SplitWords as="h2" text="Bureau et cellules" className="disp ttl" />
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", marginTop: 32 }}>
            {["Président", "Secrétariat", "Coordination", "Cellule de communication"].map((r, i) => (
              <Reveal key={r} delay={i * 0.08}>
                <div style={{ background: "var(--color-mist)", borderRadius: 32, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "4/5", background: "#d5dae8", display: "flex", alignItems: "flex-end", padding: 14, font: "600 12px var(--font-body)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-slate)" }}>Photo à fournir</div>
                  <div style={{ padding: "14px 18px 18px" }}><b>Nom à confirmer</b><p style={{ color: "var(--color-slate)", fontSize: 14 }}>{r} · fonction à confirmer</p></div>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ marginTop: 20, color: "var(--color-slate)", maxWidth: "70ch" }}>L’organigramme sera ajouté dès que l’association aura validé le bureau et les fonctions.</p>
        </div>
      </section>

      <section style={{ background: "var(--color-mist)", borderRadius: "var(--radius-xl)", margin: "0 clamp(0px,1.2vw,18px) clamp(40px,6vw,72px)" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(48px,7vw,80px)", display: "grid", gap: 30, gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", alignItems: "center" }}>
          <div><p className="lab" style={{ color: "var(--color-red)", marginBottom: 14 }}>Statuts</p><h2 className="disp ttl" style={{ fontSize: "clamp(34px,4vw,56px)" }}>Documents officiels</h2></div>
          <div><Tbd>Statuts et numéro d’enregistrement : à fournir par l’association. Le fichier sera téléchargeable ici.</Tbd><Link href="/contact/" className="btn btn-red" style={{ marginTop: 18 }}>Demander les statuts</Link></div>
        </div>
      </section>
    </>
  );
}
