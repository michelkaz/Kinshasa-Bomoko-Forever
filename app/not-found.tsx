import Link from "next/link";
import Photo from "@/components/Photo";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero kicker="Erreur 404" title="Page introuvable" lead="Cette page n’existe pas ou a été déplacée." photo={<Photo id="coup-envoi-2025-1" priority />}>
      <Link href="/" className="btn btn-coral" style={{ marginTop: 26 }}>Retour à l’accueil</Link>
    </PageHero>
  );
}
