"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "./Header";

/** Site public : en-tête fixe + pied de page. L'espace /admin a son propre habillage. */
export default function Shell({ nav, footer, children }: { nav: { label: string; href: string }[]; footer: ReactNode; children: ReactNode }) {
  const admin = usePathname().startsWith("/admin");
  if (admin) return <main id="contenu">{children}</main>;
  return (
    <>
      <Header nav={nav} />
      <main id="contenu">{children}</main>
      {footer}
    </>
  );
}
