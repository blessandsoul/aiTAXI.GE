import type { MetadataRoute } from "next";
import { getPosts, getAvailableLocales } from "@/features/blog/lib/api";
import { INDEXED_LOCALES } from "@/i18n/seo-locales";

const BASE_URL = "https://aitaxi.ge";
// Sitemap advertises only indexed locales. Single source of truth: src/i18n/seo-locales.ts.
const STATIC_LOCALES = INDEXED_LOCALES;

// Build-time stable lastModified, avoids noisy per-request invalidation that Google ignores.
// Override via BUILD_DATE env (CI-provided git commit timestamp) for content-changed builds.
const BUILD_DATE = new Date(process.env.BUILD_DATE ?? Date.now());

type StaticPriority = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

const STATIC_PAGES: StaticPriority[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

function buildLanguageAlternates(path: string): Record<string, string> {
  const base: Record<string, string> = Object.fromEntries(
    STATIC_LOCALES.map((loc) => [
      loc,
      loc === "ka" ? `${BASE_URL}${path}` : `${BASE_URL}/${loc}${path}`,
    ]),
  );
  // x-default = Georgian (primary market)
  base["x-default"] = `${BASE_URL}${path}`;
  return base;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.flatMap(({ path, priority, changeFrequency }) =>
    STATIC_LOCALES.map((loc) => ({
      url: loc === "ka" ? `${BASE_URL}${path}` : `${BASE_URL}/${loc}${path}`,
      lastModified: BUILD_DATE,
      changeFrequency,
      priority,
      alternates: { languages: buildLanguageAlternates(path) },
    })),
  );

  const posts = await getPosts("ka");
  const blogPages: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const locales = getAvailableLocales(post.slug);
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[loc] =
        loc === "ka"
          ? `${BASE_URL}/blog/${post.slug}`
          : `${BASE_URL}/${loc}/blog/${post.slug}`;
    }
    // x-default points to Georgian original
    if (locales.includes("ka")) {
      languages["x-default"] = `${BASE_URL}/blog/${post.slug}`;
    }

    return locales.map((loc) => ({
      url:
        loc === "ka"
          ? `${BASE_URL}/blog/${post.slug}`
          : `${BASE_URL}/${loc}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : BUILD_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages },
    }));
  });

  // Tag pages are intentionally excluded from the sitemap: they are thin,
  // locale-specific aggregation pages marked noindex.
  return [...staticPages, ...blogPages];
}
