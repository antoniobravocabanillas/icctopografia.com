"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { announcement, languages, mainNavigation, siteLinks } from "../lib/site-data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setLanguageOpen(false);
  };

  return (
    <header className={`site-header${mobileOpen ? " is-mobile-open" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <Link className="brand" href="/" aria-label="ICC Topografia inicio" onClick={closeMenus}>
        <Image src="/brand/icc-topografia-logo.png" alt="ICC Topografia" width={206} height={43} priority />
      </Link>

      <button
        className="mobile-nav-toggle"
        type="button"
        aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={mobileOpen}
        aria-controls="site-navigation"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="site-navigation" aria-label="Navegacion principal">
        {mainNavigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMenus}>
            {item.label}
          </Link>
        ))}

        <Link className="career-link" href={siteLinks.careers} onClick={closeMenus}>
          Trabaja con nosotros
        </Link>

        <Link className="account-link" href={siteLinks.account} aria-label="Cuenta cliente" onClick={closeMenus}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
          </svg>
          <span>Cuenta cliente</span>
        </Link>

        <Link className="header-cta" href={siteLinks.quote} onClick={closeMenus}>
          Cotizar proyecto
        </Link>

        <div className={`language-switch${languageOpen ? " is-open" : ""}`}>
          <button
            type="button"
            aria-label="Cambiar idioma"
            aria-expanded={languageOpen}
            onClick={() => setLanguageOpen((open) => !open)}
          >
            ES
          </button>
          <div className="language-menu" aria-label="Idiomas disponibles">
            {languages.slice(1).map((language) => (
              <Link key={language.label} href={language.href} lang={language.label.toLowerCase()} onClick={closeMenus}>
                {language.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <aside className="announcement-strip" aria-label="Novedades ICC Topografia">
        <span>{announcement.badge}</span>
        <strong>{announcement.text}</strong>
        <Link href={announcement.href}>{announcement.cta}</Link>
      </aside>
    </header>
  );
}
