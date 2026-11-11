import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";
import { CopyButton } from "@/components/interactive";
import { Magnetic, Reveal } from "@/components/motion";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Contacter l’ASBL Kinshasa Bomoko Forever : siège à Kingasani, page Facebook officielle." };
const Tbd = ({ t }: { t: string }) => <span className="tbd" style={{ display: "inline-block", padding: "3px 12px", borderRadius: 999, fontWeight: 600, fontSize: 14 }}>{t}</span>;

export default function Page() {
  return (
    <>
      <PageHero kicker="Kingasani, Kinshasa" title="Contact" lead="Écrivez-nous, ou venez nous voir à Kingasani." photo={<Photo id="hospice-2026-7" priority style={{ objectPosition: "50% 50%" }} />} />
      <section className="sec">
        <div className="wrap" style={{ display: "grid", gap: "clamp(24px,5vw,72px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))" }}>
          <Reveal>
            <dl style={{ margin: 0, borderTop: "3px solid var(--color-blue)" }}>
              {[
                ["Siège", <>Kingasani, face à la commune de Kimbanseke, Kinshasa. <Tbd key="a" t="Adresse précise à confirmer" /></>],
                ["WhatsApp", <Tbd key="b" t="Numéro à confirmer" />],
                ["Téléphone", <Tbd key="c" t="Numéro à confirmer" />],
                ["Courriel", <Tbd key="d" t="Adresse à confirmer" />],
                ["Facebook", <a key="e" href={site.facebook} style={{ color: "var(--color-blue)", fontWeight: 600 }}>Kinshasa Bomoko Forever, page officielle</a>],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--color-line)" }}>
                  <dt className="lab" style={{ color: "var(--color-red)", paddingTop: 3 }}>{k}</dt><dd style={{ margin: 0 }}>{v}</dd>
                </div>
              ))}
            </dl>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
              <Magnetic><a className="btn btn-blue" href={site.facebook}>Ouvrir Facebook</a></Magnetic>
              <CopyButton text={site.facebook} label="Copier le lien Facebook" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="blob" style={{ position: "relative", minHeight: 420, background: "var(--color-mist)", overflow: "hidden" }} role="img" aria-label="Plan schématique : le siège de l’ASBL à Kingasani, face à la commune de Kimbanseke">
              <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path d="M-10 300 C150 260 260 330 400 250 S560 150 620 170" stroke="#fff" strokeWidth="26" fill="none" />
                <path d="M300 -10 C320 120 270 210 330 440" stroke="#fff" strokeWidth="20" fill="none" />
                <g className="arcs" style={{ transformOrigin: "312px 200px" }} stroke="#001E6B" fill="none" strokeOpacity=".22"><circle cx="312" cy="200" r="60" /><circle cx="312" cy="200" r="110" /><circle cx="312" cy="200" r="170" /></g>
                <rect x="90" y="70" width="70" height="46" rx="14" fill="#D5DAE8" /><rect x="430" y="300" width="90" height="56" rx="16" fill="#D5DAE8" /><rect x="460" y="60" width="60" height="70" rx="16" fill="#D5DAE8" />
              </svg>
              <span style={{ position: "absolute", left: "52%", top: "46%", width: 24, height: 24, background: "var(--color-red)", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", animation: "pulse 2s ease-out infinite" }} aria-hidden="true" />
              <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, background: "#fff", padding: "14px 18px", borderRadius: 24, fontSize: 14 }}><b>Siège de l’ASBL</b><br />Face à la commune de Kimbanseke. Carte interactive à ajouter après confirmation de l’adresse.</div>
            </div>
          </Reveal>
        </div>
      </section>
      <section style={{ background: "var(--color-mist)", borderRadius: "var(--radius-xl)", margin: "0 clamp(0px,1.2vw,18px) 56px" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(44px,7vw,72px)", textAlign: "left" }}>
          <p className="lab" style={{ color: "var(--color-red)", marginBottom: 12 }}>Rejoindre l’ASBL</p>
          <h2 className="disp ttl" style={{ fontSize: "clamp(34px,4vw,56px)" }}>Une question avant de vous engager ?</h2>
          <Link href="/rejoindre/" className="btn btn-red" style={{ marginTop: 22 }}>Voir comment nous rejoindre</Link>
        </div>
      </section>
    </>
  );
}
