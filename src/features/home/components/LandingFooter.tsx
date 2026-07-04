import type React from 'react';

import { useTranslations } from 'next-intl';

import { SocialLinks } from '@/components/layout/SocialLinks';
import { Link } from '@/i18n/navigation';
import { FooterLanguageSwitcher } from './FooterLanguageSwitcher';
import './landing-footer.css';

/* =========================================================================
   LandingFooter, the global aiTAXI footer. Left column carries the big
   wordmark plus the sitemap columns (Product, Company, aiNOW family, Legal,
   Social, Language). The signature is the giant rounded-full brand-gradient
   CTA to /contact (early access). Colors travel via the oklch --primary /
   --accent tokens (globals.css); dark text on the yellow gradient per the
   TAXI GOLD contrast law.
   ========================================================================= */

// Real aiNOW family surfaces: the entity edge aitaxi.ge deliberately shows.
const FAMILY = [
  { href: 'https://ainow.ge', label: 'aiNOW.ge' },
  { href: 'https://aistaff.ge', label: 'aiSTAFF.ge' },
  { href: 'https://aicontent.ge', label: 'aiCONTENT.ge' },
  { href: 'https://iai.ge', label: 'iAI.ge' },
] as const;

export function LandingFooter(): React.ReactElement {
  const t = useTranslations('landingFooter');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  const copyright = (
    <span className="block whitespace-nowrap text-[12px] uppercase tracking-wide text-neutral-900/40">
      {t('company')} · © {year}
    </span>
  );

  return (
    <footer className="landing-footer border-t border-[#e5e5e5]/60 bg-white px-6 pb-8 pt-12 text-neutral-900 md:px-10 md:py-16">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(520px,640px)_1fr] lg:gap-16">
          {/* LEFT, wordmark + sitemap columns */}
          <div>
            <Link href="/" aria-label="aiTAXI" className="inline-flex">
              <span className="wordmark-3d footer-wordmark text-[40px] leading-none md:text-[52px]">
                <span className="wm-prefix">ai</span>
                <span className="wm-mark">TAXI</span>
                <span className="wm-accent" aria-hidden="true" />
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-900/60">
              {t('tagline')}
            </p>

            {/* Sitemap columns, up to 4 across at md+ */}
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:mt-16">
              <FooterColumn title={t('productsHeading')}>
                <FooterRouteLink href="/">{tNav('home')}</FooterRouteLink>
                <FooterRouteLink href="/blog">{t('blog')}</FooterRouteLink>
                <FooterRouteLink href="/contact">{t('earlyAccess')}</FooterRouteLink>
              </FooterColumn>

              <FooterColumn title={t('companyHeading')}>
                <FooterRouteLink href="/about">{t('about')}</FooterRouteLink>
                <FooterRouteLink href="/contact">{t('contact')}</FooterRouteLink>
              </FooterColumn>

              <FooterColumn title={t('familyHeading')}>
                {FAMILY.map((link) => (
                  <FooterExternalLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterExternalLink>
                ))}
              </FooterColumn>

              <div>
                <span className="whitespace-nowrap text-[12px] uppercase tracking-wide text-neutral-900/40">
                  {t('legalHeading')}
                </span>
                <ul className="mt-5 flex flex-col items-start gap-3 sm:mt-4">
                  <FooterRouteLink href="/privacy">{tNav('privacy')}</FooterRouteLink>
                  <FooterRouteLink href="/terms">{tNav('terms')}</FooterRouteLink>
                </ul>

                <div className="mt-8">
                  <span className="whitespace-nowrap text-[12px] uppercase tracking-wide text-neutral-900/40">
                    {t('socialHeading')}
                  </span>
                  <SocialLinks className="mt-5 flex-wrap gap-3 sm:mt-4" size={18} round />
                </div>
              </div>
            </div>

            {/* Language row */}
            <div className="mt-10">
              <span className="whitespace-nowrap text-[12px] uppercase tracking-wide text-neutral-900/40">
                {t('languageHeading')}
              </span>
              <div className="mt-4 text-sm">
                <FooterLanguageSwitcher />
              </div>
            </div>
          </div>

          {/* RIGHT, copyright (desktop) */}
          <div className="hidden w-full flex-col justify-end lg:flex">
            <span className="self-end">{copyright}</span>
          </div>
          <div className="lg:hidden">{copyright}</div>
        </div>

        {/* GIANT BRAND CTA, the early-access conversion route */}
        <div className="mt-12 sm:mt-20 md:mt-24">
          <Link
            href="/contact"
            className="flex h-[100px] w-full items-center justify-center whitespace-nowrap rounded-full px-5 text-center text-sm font-bold uppercase leading-5 tracking-[0.02em] text-neutral-950 [transition:transform_.18s_cubic-bezier(.2,.8,.2,1)] will-change-transform active:scale-[0.99] md:h-[120px] md:text-base 2xl:h-[140px]"
            style={{ background: 'linear-gradient(135deg, #ffd54f, #ffc400 55%, #ff8f00)' }}
          >
            {t('ctaHuge')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps): React.ReactElement {
  return (
    <div>
      <span className="whitespace-nowrap text-[12px] uppercase tracking-wide text-neutral-900/40">
        {title}
      </span>
      <ul className="mt-5 flex flex-col items-start gap-3 sm:mt-4">{children}</ul>
    </div>
  );
}

const LINK_CLASS =
  'text-sm text-neutral-900/70 transition-colors duration-150 active:opacity-70 md:hover:text-neutral-900';

function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }): React.ReactElement {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${LINK_CLASS} font-medium`}>
        {children}
      </a>
    </li>
  );
}

function FooterRouteLink({ href, children }: { href: string; children: React.ReactNode }): React.ReactElement {
  return (
    <li>
      <Link href={href} className={LINK_CLASS}>
        {children}
      </Link>
    </li>
  );
}
