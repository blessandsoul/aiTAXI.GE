#!/usr/bin/env node
/**
 * IndexNow ping — submit fresh/changed URLs to search engines.
 *
 * The aiNOW blog is MDX-file driven (committed to git, deployed via CI/Coolify),
 * so there is no server-side "publish" event to hook. Run this after a deploy
 * that added or changed pages:
 *
 *   node scripts/indexnow-ping.mjs /blog/my-new-slug
 *   node scripts/indexnow-ping.mjs /blog/a /blog/b https://ainow.ge/pricing
 *   node scripts/indexnow-ping.mjs            # no args → homepage + main pages
 *
 * Key is hosted at https://ainow.ge/d6d665619226455ca703b94c0060ed45.txt
 */

const KEY = process.env.INDEXNOW_KEY || "d6d665619226455ca703b94c0060ed45";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ainow.ge";
const HOST = new URL(BASE_URL).host;
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

const MAIN_PAGES = [
  "/",
  "/services",
  "/pricing",
  "/blog",
  "/projects",
  "/ai-chatboti",
  "/ai-agenti",
  "/ai-konteni",
  "/ai-biznesistvis",
  "/vibe-marketing",
  "/contact",
];

const args = process.argv.slice(2);
const inputs = args.length ? args : MAIN_PAGES;
const urlList = inputs.map((u) =>
  u.startsWith("http") ? u : `${BASE_URL}${u.startsWith("/") ? "" : "/"}${u}`,
);

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
