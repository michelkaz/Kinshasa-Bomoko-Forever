"use client";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Magnetic } from "./motion";

type NavItem = { label: string; href: string };

/**
 * Barre de navigation fixe : transparente et claire sur la photo d'ouverture,
 * puis fond blanc et texte foncé dès qu'on quitte la première section.
 */
export default function Header({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 90 : 40;
      setSolid(window.scrollY > limit);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const fg = solid || open ? "var(--color-ink)" : "#fff";

  return (
    <>
      <m.header
        initial={reduce ? false : { y: -90 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 18 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          height: "var(--hh)",
          borderRadius: 0,
          padding: "0 var(--gutter)",
          color: fg,
          background: solid || open ? "#ffffff" : "var(--color-blue)",
          boxShadow: solid ? "0 10px 34px rgba(0,15,58,.16)" : "none",
          transition: "background .45s var(--ease), color .45s var(--ease), box-shadow .45s var(--ease)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/" aria-label="Kinshasa Bomoko Forever, accueil" style={{ background: "#fff", padding: "6px 12px", borderRadius: 999, display: "inline-flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/kbf-logo.png" alt="Logo Kinshasa Bomoko Forever ASBL" width={180} height={94} style={{ height: 38, width: "auto", display: "block" }} />
        </Link>
        <nav aria-label="Navigation principale" className="hidden lg:flex" style={{ gap: 4, alignItems: "center" }}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className="navlink"
              style={{ color: "inherit", position: "relative", padding: "10px 14px", font: "600 14px var(--font-body)", textDecoration: "none", borderRadius: 999 }}
            >
              {n.label}
              {active(n.href) && (
                <m.span layoutId="nav-dot" style={{ position: "absolute", left: "50%", bottom: 3, width: 6, height: 6, marginLeft: -3, borderRadius: 99, background: "var(--color-coral)" }} />
              )}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="hidden sm:inline-block">
            <Magnetic strength={0.25}>
              <Link href="/rejoindre/" className={`btn ${solid ? "btn-red" : "btn-coral"}`} style={{ minHeight: 44, padding: "0 22px" }}>
                Nous rejoindre
              </Link>
            </Magnetic>
          </span>
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden"
            style={{ width: 46, height: 46, borderRadius: 999, border: "1.5px solid currentColor", background: "transparent", color: "inherit", display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <m.path animate={{ d: open ? "M5 5L19 19" : "M3 7h18" }} />
              <m.path animate={{ opacity: open ? 0 : 1 }} d="M3 12h18" />
              <m.path animate={{ d: open ? "M19 5L5 19" : "M3 17h12" }} />
            </svg>
          </button>
        </div>
        </div>
      </m.header>
      <div aria-hidden="true" style={{ height: "var(--hh)" }} />

      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            style={{ position: "fixed", inset: 0, zIndex: 70, background: "var(--color-blue)", color: "#fff", display: "flex", flexDirection: "column", padding: "110px var(--gutter) 28px", overflow: "hidden" }}
          >
            <svg className="arcs" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true" style={{ position: "absolute", right: -180, bottom: -120, width: 560, opacity: 0.25 }}>
              <circle cx="200" cy="200" r="60" /><circle cx="200" cy="200" r="110" /><circle cx="200" cy="200" r="160" /><circle cx="200" cy="200" r="198" />
            </svg>
            <nav aria-label="Menu mobile" style={{ position: "relative", display: "grid" }}>
              {nav.map((n, i) => (
                <m.div key={n.href} initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07, type: "spring", stiffness: 120, damping: 16 }}>
                  <Link href={n.href} className="disp" style={{ display: "flex", alignItems: "baseline", gap: 14, fontSize: "clamp(52px,15vw,84px)", padding: "4px 0", borderBottom: "1px solid #1d3a9a", textDecoration: "none", color: active(n.href) ? "var(--color-coral)" : "#fff" }}>
                    <small className="lab" style={{ color: "var(--color-coral)" }}>0{i + 1}</small>
                    {n.label}
                  </Link>
                </m.div>
              ))}
            </nav>
            <m.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} style={{ marginTop: "auto", position: "relative" }}>
              <Link href="/rejoindre/" className="btn btn-coral" style={{ width: "100%", minHeight: 58, fontSize: 17 }}>
                Nous rejoindre
              </Link>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
