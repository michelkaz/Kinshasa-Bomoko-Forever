import type { Metadata } from "next";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";
import { JoinForm } from "@/components/interactive";

export const metadata: Metadata = { title: "Nous rejoindre", description: "Devenez adhérent, bénévole ou partenaire de l’ASBL Kinshasa Bomoko Forever." };

export default function Page() {
  return (
    <>
      <PageHero kicker="Adhérent, bénévole ou partenaire" title="Nous rejoindre" lead="Quelques informations suffisent. L’équipe examine chaque demande." photo={<Photo id="sortie-2025-2" priority style={{ objectPosition: "50% 50%" }} />} />
      <section className="sec">
        <div className="wrap" style={{ display: "grid", gap: "clamp(24px,5vw,72px)", gridTemplateColumns: "minmax(0,1fr) minmax(260px,340px)", alignItems: "start" }} id="join-layout">
          <JoinForm />
          <aside className="blob" style={{ background: "var(--color-night)", color: "#fff", padding: 30, position: "sticky", top: 96 }}>
            <p className="lab" style={{ color: "var(--color-coral)", marginBottom: 10 }}>Ce que nous demandons</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Nom, téléphone ou WhatsApp", "Commune ou quartier", "Une courte motivation", "Votre accord pour le traitement des données"].map((t) => (
                <li key={t} style={{ padding: "12px 0", borderBottom: "1px solid #1d3a9a", color: "#dce5ff", fontSize: 15 }}>{t}</li>
              ))}
            </ul>
            <p style={{ marginTop: 18, color: "var(--color-pale)", fontSize: 14 }}>Conditions d’adhésion, de bénévolat et de partenariat : à confirmer avec l’association.</p>
          </aside>
        </div>
        <style>{`@media(max-width:900px){#join-layout{grid-template-columns:1fr!important}#join-layout aside{position:static!important}}`}</style>
      </section>
    </>
  );
}
