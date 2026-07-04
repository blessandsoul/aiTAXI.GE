// Single source of truth for which locales are production-ready to INDEX and advertise in hreflang.
//
// aiTAXI ships three human-grade locales: ka (default, unprefixed), en, ru.
// Georgian-fallback blog posts still render noindex automatically (per-post
// index:!isFallback in blog/[slug]/page.tsx), so only real translations get
// indexed, never the fallback.
//
// To promote a locale: add it here (and to routing.ts). hreflang, sitemap and
// canonical all read from this list, so the locale lights up everywhere automatically.
export const INDEXED_LOCALES = ["ka", "en", "ru"] as const;

const BASE_URL = "https://aitaxi.ge";

export function isIndexedLocale(locale: string): boolean {
  return (INDEXED_LOCALES as readonly string[]).includes(locale);
}

// Absolute URL for a locale + path. Georgian (default locale) is unprefixed to match
// next-intl localePrefix "as-needed".
export function localeUrl(locale: string, path = ""): string {
  return locale === "ka" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
}

// hreflang + canonical block for a static page at `path` (no locale prefix, e.g. "/services/seo").
// languages = indexed locales + x-default (ka). canonical = the page's own URL for an indexed
// locale, or the Georgian equivalent for a non-indexed locale (consolidates the fallback render
// onto the original instead of self-canonicalizing a noindex page).
export function buildAlternates(path: string, locale: string) {
  const languages: Record<string, string> = {};
  for (const loc of INDEXED_LOCALES) {
    languages[loc] = localeUrl(loc, path);
  }
  languages["x-default"] = localeUrl("ka", path);

  return {
    canonical: isIndexedLocale(locale) ? localeUrl(locale, path) : localeUrl("ka", path),
    languages,
  };
}
