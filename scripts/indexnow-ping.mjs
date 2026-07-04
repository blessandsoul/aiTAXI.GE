#!/usr/bin/env node
/**
 * IndexNow ping — submit fresh/changed URLs to search engines.
 *
 * The aiTAXI blog is MDX-file driven (committed to git, deployed via Coolify),
 * so there is no server-side "publish" event to hook. Run this after a deploy
 * that added or changed pages:
 *
 *   node scripts/indexnow-ping.mjs /blog/my-new-slug
 *   node scripts/indexnow-ping.mjs /blog/a /blog/b https://aitaxi.ge/contact
 *   node scripts/indexnow-ping.mjs            # no args → every indexed page
 *
 * Key is hosted at https://aitaxi.ge/4a0aaf8575561707dedc7833c5ca1c0b.txt
 */

const KEY = process.env.INDEXNOW_KEY || "4a0aaf8575561707dedc7833c5ca1c0b";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aitaxi.ge";
const HOST = new URL(BASE_URL).host;
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

// Locale-expanded page list (ka unprefixed, en/ru prefixed), mirrors sitemap.ts.
const STATIC_PATHS = ["", "/blog", "/about", "/contact", "/privacy", "/terms"];
const ARTICLE_SLUGS = [
  "what-is-a-robotaxi",
  "robotaxi-fleet-management-software",
  "integrate-autonomous-vehicles-existing-taxi-fleet",
  "robotaxi-economics-cost-per-km",
  "global-robotaxi-market-2026",
  "robotaxis-in-georgia-when",
  "autonomous-taxi-safety-regulation",
  "robotaxi-depot-operations",
  "remote-assistance-teleoperation",
  "taxi-business-digitalization-georgia",
];
const LOCALES = ["", "/en", "/ru"]; // "" = ka default

const MAIN_PAGES = [
  ...STATIC_PATHS.flatMap((p) => LOCALES.map((l) => `${l}${p}` || "/")),
  ...ARTICLE_SLUGS.flatMap((s) => LOCALES.map((l) => `${l}/blog/${s}`)),
];

const args = process.argv.slice(2);
const inputs = args.length ? args : MAIN_PAGES;
const urlList = [...new Set(
  inputs.map((u) =>
    u.startsWith("http") ? u : `${BASE_URL}${u.startsWith("/") ? "" : "/"}${u}`,
  ),
)];

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });

let ok = 0;
for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    const tag = res.ok || res.status === 202 ? "OK" : "FAIL";
    if (tag === "OK") ok++;
    console.log(`  ${tag.padEnd(4)} ${res.status}  ${endpoint}`);
  } catch (err) {
    console.log(`  FAIL  ---  ${endpoint}  (${err.message})`);
  }
}

console.log(
  `\n[IndexNow] ${urlList.length} URL(s) → ${ok}/${ENDPOINTS.length} endpoints accepted`,
);
process.exit(ok > 0 ? 0 : 1);
