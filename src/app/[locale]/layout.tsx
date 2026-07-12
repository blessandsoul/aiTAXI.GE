import { Bricolage_Grotesque, DM_Sans, Noto_Sans_Georgian, Space_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isIndexedLocale } from "@/i18n/seo-locales";
import { Providers } from "@/app/providers";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Toaster } from "sonner";
import { DevTools } from "@/components/dev/DevTools";
import { StructuredData } from "@/components/seo/StructuredData";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import "@/app/globals.css";
import "@/app/site-new.css";
import "@/app/brand.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

const BASE_URL = "https://aitaxi.ge";

const OG_LOCALE_MAP: Record<string, string> = {
  ka: "ka_GE",
  en: "en_US",
  ru: "ru_RU",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });

  const ogImageUrl = `${BASE_URL}/og-image.png`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t("title"),
      template: "%s | aiTAXI",
    },
    description: t("description"),
    openGraph: {
      type: "website",
      locale: OG_LOCALE_MAP[locale] ?? "ka_GE",
      alternateLocale: Object.values(OG_LOCALE_MAP).filter(
        (l) => l !== (OG_LOCALE_MAP[locale] ?? "ka_GE"),
      ),
      url: locale === "ka" ? BASE_URL : `${BASE_URL}/${locale}`,
      siteName: "aiTAXI",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "aiTAXI, robotaxi fleet management platform by aiNOW",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImageUrl],
    },
    // No `alternates` here: this layout has no path context, so a hardcoded map injected the
    // HOMEPAGE hreflang/canonical into every page that lacks its own (the source of the audit's
    // hreflang conflicts + duplicate canonicals). Each page sets its own via buildAlternates().
    robots: {
      // Only ka/en/ru are indexed. de/tr/fa/zh are machine-translated drafts kept out of the index
      // until QA + blog translation, which also removes their cross-locale hreflang conflicts.
      index: isIndexedLocale(locale),
      follow: true,
      googleBot: {
        index: isIndexedLocale(locale),
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const notoGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-noto-georgian",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${dmSans.variable} ${notoGeorgian.variable} ${spaceMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        {/* Exact font block copied verbatim from ainow_handoff/index.html <head>
            so the aiNOW wordmark renders with the source's variable Bricolage
            Grotesque (opsz,wght axis) + Space Mono, not next/font's static cuts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800;12..96,900&family=DM+Sans:wght@400;500;700&family=Noto+Sans+Georgian:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="application/rss+xml" title="aiTAXI Blog RSS" href={`${BASE_URL}/rss.xml`} />
        <link rel="llms" type="text/plain" href={`${BASE_URL}/llms.txt`} />
        <link rel="llms-full" type="text/plain" href={`${BASE_URL}/llms-full.txt`} />
        <StructuredData />
      </head>
      <body
        className={
          locale === "ka"
            ? "font-[family-name:var(--font-noto-georgian)]"
            : "font-[family-name:var(--font-dm-sans)]"
        }
      >
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <LayoutShell>{children}</LayoutShell>
            <ScrollToTop />
            <Toaster position="top-right" richColors theme="dark" />
            <DevTools />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
