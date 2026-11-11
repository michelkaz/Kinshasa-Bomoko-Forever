import type { Metadata } from "next";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Mentions légales et confidentialité", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHero kicker="Modèles à compléter" title="Mentions légales" photo={<Photo id="finale-2026-1" priority />} />
      <section className="sec">
        <div className="wrap" style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))" }}>
          <div className="blob" style={{ background: "var(--color-mist)", padding: 30 }}>
            <h2 className="disp" style={{ fontSize: 38, color: "var(--color-blue)" }}>Mentions légales</h2>
            <p style={{ marginTop: 12 }}>Modèle à compléter : dénomination, siège, numéro d’enregistrement, responsable de publication, hébergeur.</p>
            <div className="tbd" style={{ marginTop: 14 }}><b>À compléter</b>Par l’association.</div>
          </div>
          <div id="confidentialite" className="blob" style={{ background: "var(--color-mist)", padding: 30 }}>
            <h2 className="disp" style={{ fontSize: 38, color: "var(--color-blue)" }}>Politique de confidentialité</h2>
            <p style={{ marginTop: 12 }}>Modèle à compléter : données collectées (nom, téléphone, quartier, motivation), durée de conservation, droits des personnes.</p>
            <div className="tbd" style={{ marginTop: 14 }}><b>À compléter</b>Par l’association.</div>
          </div>
        </div>
      </section>
    </>
  );
}
