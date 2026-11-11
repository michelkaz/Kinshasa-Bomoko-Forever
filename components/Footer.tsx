import Link from "next/link";
import { site } from "@/lib/content";

/** Pied de page sobre : fond bleu nuit, arcs du logo en rotation lente. */
export default function Footer() {
  const tbd = { background: "transparent", border: "1.5px dashed var(--color-coral)", color: "var(--color-coral)" };
  return (
    <footer style={{ background: "var(--color-night)", color: "var(--color-pale)", position: "relative", overflow: "hidden" }}>
      <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true" style={{ position: "absolute", right: -140, bottom: -200, width: 520, opacity: 0.28 }}>
        <circle cx="200" cy="200" r="60" /><circle cx="200" cy="200" r="110" /><circle cx="200" cy="200" r="160" /><circle cx="200" cy="200" r="198" />
      </svg>
      <div className="wrap" style={{ position: "relative", display: "grid", gap: 40, gridTemplateColumns: "1.3fr 1fr 1fr 1fr", padding: "64px var(--gutter) 28px" }} id="ft-grid">
        <div>
          <Link href="/" aria-label="Accueil" style={{ background: "#fff", padding: "7px 12px", borderRadius: 999, display: "inline-flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/kbf-logo.png" alt="Logo Kinshasa Bomoko Forever ASBL" width={180} height={94} style={{ height: 46, width: "auto" }} />
          </Link>
          <p className="disp" style={{ marginTop: 22, fontSize: "clamp(34px,4vw,54px)", color: "#fff", maxWidth: "12ch" }}>{site.slogan}</p>
        </div>
        <Col title="Le site">
          {site.nav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}
          <li><Link href="/rejoindre/">Nous rejoindre</Link></li>
        </Col>
        <Col title="Nous trouver">
          <li>Siège : {site.contact.siege}</li>
          <li>WhatsApp : <span className="pill" style={tbd}>à confirmer</span></li>
          <li>Téléphone : <span className="pill" style={tbd}>à confirmer</span></li>
          <li>Courriel : <span className="pill" style={tbd}>à confirmer</span></li>
        </Col>
        <Col title="Suivre">
          <li><a href={site.facebook}>Page Facebook officielle</a></li>
          <li><Link href="/contact/">Écrire à l’ASBL</Link></li>
        </Col>
      </div>
      <div className="wrap" style={{ position: "relative", padding: "18px var(--gutter) 32px", borderTop: "1px solid #1d3a9a", fontSize: 13, display: "flex", flexWrap: "wrap", gap: "12px 28px", justifyContent: "space-between" }}>
        <span>© {site.legalName}. Maquette de démonstration.</span>
        <span><Link href="/mentions-legales/">Mentions légales</Link> · <Link href="/mentions-legales/#confidentialite">Confidentialité</Link></span>
      </div>
      <style>{`#ft-grid a:hover{color:#fff}#ft-grid li{margin-bottom:0}@media(max-width:900px){#ft-grid{grid-template-columns:1fr 1fr!important}#ft-grid>div:first-child{grid-column:1/-1}}@media(max-width:520px){#ft-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="lab" style={{ color: "#fff", marginBottom: 14 }}>{title}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>{children}</ul>
    </div>
  );
}
