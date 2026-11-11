import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Shell from "@/components/Shell";
import Providers from "@/components/Providers";
import { site } from "@/lib/content";

// Polices hébergées localement par Next au moment de la compilation, sous-ensemble latin.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.slogan}`, template: `%s · ${site.name}` },
  description:
    "Kinshasa Bomoko Forever, ASBL de Kinshasa : tournois, formations gratuites, visites aux aînés, marches et rassemblements. Retrouvez ses actions, ses événements et ses actualités.",
  openGraph: {
    type: "website",
    locale: "fr_CD",
    siteName: site.name,
    title: `${site.name} · ${site.slogan}`,
    description: "Grandir, partager, s’entraider, s’unir. Ensemble, faisons avancer Kinshasa.",
    images: [{ url: "/img/finale-2026-5-1200.webp", width: 1200, height: 799, alt: "Poignée de main avec les joueurs avant la finale du tournoi" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#001e6b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    slogan: site.slogan,
    url: site.url,
    sameAs: [site.facebook],
    address: { "@type": "PostalAddress", addressLocality: "Kingasani, Kinshasa", addressCountry: "CD" },
  };
  return (
    <html lang="fr" className={`${archivo.variable} ${publicSans.variable}`}>
      <body>
        <a href="#contenu" className="skip">Aller au contenu</a>
        <Providers>
          <Shell nav={site.nav} footer={<Footer />}>{children}</Shell>
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </body>
    </html>
  );
}
