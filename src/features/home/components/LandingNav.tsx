'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Ico } from '@/components/common/Ico';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import './landing-nav.css';

/* Floating glass navbar, ported from the aiNOW site and slimmed down to the
   aiTAXI IA: Platform (#products), Blog, About, FAQ (#faq), Contact, plus the
   early-access CTA (#cta). Section links smooth-scroll on home and navigate
   to the home section from other pages. */

// In-page sections (ids live on the home landing components).
const SECTIONS = {
  products: 'products',
  faq: 'faq',
  cta: 'cta',
} as const;

// Locale switcher entries, derived from routing.locales so the pill stays in
// sync when locales are added/removed. Labels = native names.
const LOCALE_LABELS: Record<string, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
};
const LOCALES = routing.locales.map((code) => ({
  code,
  label: LOCALE_LABELS[code] ?? code.toUpperCase(),
}));

function Wordmark() {
  return (
    <div className="wordmark-3d text-lg leading-none">
      <span className="wm-prefix">ai</span>
      <span className="wm-mark">TAXI</span>
      <span className="wm-accent" aria-hidden="true" />
    </div>
  );
}

function Chevron({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

export function LandingNav() {
  const t = useTranslations('landingNav');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname(); // locale-stripped, so "/" === home
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Home section target as a next-intl Link href. The object form keeps the
  // locale prefix correct (`/#faq` for ka, `/en#faq` for en) and lets <Link>
  // navigate client-side from other pages (no full reload). Smooth-scroll on
  // home is handled in handleSection below.
  const sectionHref = (id: string) => ({ pathname: '/', hash: id });

  // Glass + nav-logo fade in once scrolled past 30px, but ONLY on the home
  // page, where the hero shows its own big wordmark. On other pages the nav
  // always shows the glass + logo.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll lock + ESC-to-close while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  // Smooth-scroll on home; on other pages let <Link> navigate client-side to /#id.
  const handleSection = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  const atTop = isHome && !scrolled;
  const navClassName = ['glass-nav', atTop && 'is-top', menuOpen && 'menu-open']
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navClassName}>
      <div className="glass-nav-bg" />

      <div className="glass-nav-inner">
        <button
          type="button"
          className="nav-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="landing-nav-drawer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link href="/" className="nav-logo" aria-label="aiTAXI, home">
          <Wordmark />
        </Link>

        <ul className="nav-menu">
          <li>
            <Link
              href={sectionHref(SECTIONS.products)}
              className="nav-link"
              onClick={(e) => handleSection(e, SECTIONS.products)}
            >
              {t('products')}
            </Link>
          </li>
          <li>
            <Link href="/blog" className="nav-link">
              {tNav('blog')}
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-link">
              {tNav('about')}
            </Link>
          </li>
          <li>
            <Link
              href={sectionHref(SECTIONS.faq)}
              className="nav-link"
              onClick={(e) => handleSection(e, SECTIONS.faq)}
            >
              {t('faq')}
            </Link>
          </li>
          <li>
            <Link href="/contact" className="nav-link">
              {tNav('contact')}
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          {/* Language switcher, visible at every breakpoint (the mobile drawer
              sits under the bar, so this one pill serves desktop AND mobile).
              Opens on hover/focus-within; locale links keep the current path. */}
          <div className="nav-lang">
            <button type="button" className="nav-lang-trigger" aria-haspopup="true" aria-label="Switch language">
              <Ico name="solar:global-bold-duotone" className="nav-lang-globe" />
              {locale.toUpperCase()}
              <Chevron className="nav-lang-chevron" />
            </button>
            <ul className="nav-dropdown nav-lang-dropdown">
              {LOCALES.map((l) => (
                <li key={l.code}>
                  <Link
                    href={pathname}
                    locale={l.code}
                    className={`nav-dd-link${l.code === locale ? ' is-current' : ''}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href={sectionHref(SECTIONS.cta)} className="glass-cta" onClick={(e) => handleSection(e, SECTIONS.cta)}>
            {t('cta')}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="nav-drawer" id="landing-nav-drawer">
        <div className="nav-drawer-bg" />
        <ul className="nav-drawer-menu">
          <li>
            <Link href={sectionHref(SECTIONS.products)} className="nav-drawer-link" data-i="1" onClick={(e) => handleSection(e, SECTIONS.products)}>
              {t('products')}
            </Link>
          </li>
          <li>
            <Link href="/blog" className="nav-drawer-link" data-i="2" onClick={closeMenu}>
              {tNav('blog')}
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-drawer-link" data-i="3" onClick={closeMenu}>
              {tNav('about')}
            </Link>
          </li>
          <li>
            <Link href={sectionHref(SECTIONS.faq)} className="nav-drawer-link" data-i="4" onClick={(e) => handleSection(e, SECTIONS.faq)}>
              {t('faq')}
            </Link>
          </li>
          <li>
            <Link href="/contact" className="nav-drawer-link" data-i="5" onClick={closeMenu}>
              {tNav('contact')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
