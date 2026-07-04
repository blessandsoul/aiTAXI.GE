/**
 * IndexNow helper, submit URLs to search engines for instant indexing.
 *
 * Key verification: the key is hosted as a static file at
 *   https://aitaxi.ge/4a0aaf8575561707dedc7833c5ca1c0b.txt
 * (file lives at public/4a0aaf8575561707dedc7833c5ca1c0b.txt).
 * The filename and the file body are BOTH the key, if you rotate the key,
 * rename the file AND update its contents AND update INDEXNOW_KEY below.
 *
 * Mirrors the ainow.ge / andrewaltair.ge pattern.
 */

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "4a0aaf8575561707dedc7833c5ca1c0b";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aitaxi.ge";
const HOST = new URL(BASE_URL).host; // "aitaxi.ge"
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

// IndexNow is a shared protocol, pinging any one endpoint propagates to all
// participating engines, but submitting to the main hubs directly is belt-and-braces.
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
] as const;

export interface IndexNowResult {
  success: boolean;
  submitted: number;
  endpoints: number;
  errors?: string[];
}

/**
 * Submit one or more URLs (or root-relative paths) to IndexNow.
 * Paths are normalized to absolute URLs against BASE_URL.
 */
export async function submitToIndexNow(
  urls: string[],
): Promise<IndexNowResult> {
  if (!urls || urls.length === 0) {
    return { success: true, submitted: 0, endpoints: 0 };
  }

  const urlList = urls.map((u) =>
    u.startsWith("http") ? u : `${BASE_URL}${u.startsWith("/") ? "" : "/"}${u}`,
  );

  const errors: string[] = [];
  let successCount = 0;

  const results = await Promise.allSettled(
    ENDPOINTS.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: KEY_LOCATION,
          urlList,
        }),
      });
      if (res.ok || res.status === 202) {
        successCount++;
        return;
      }
      errors.push(`${endpoint}: ${res.status}`);
    }),
  );

  for (const r of results) {
    if (r.status === "rejected") {
      errors.push(
        r.reason instanceof Error ? r.reason.message : String(r.reason),
      );
    }
  }

  console.log(
    `[IndexNow] ${urlList.length} URL(s) → ${successCount}/${ENDPOINTS.length} endpoints`,
  );

  return {
    success: successCount > 0,
    submitted: urlList.length,
    endpoints: successCount,
    errors: errors.length ? errors : undefined,
  };
}

/** Submit a single blog post (Georgian original lives at /blog/<slug>). */
export function indexBlogPost(slug: string): Promise<IndexNowResult> {
  return submitToIndexNow([`/blog/${slug}`]);
}

/** Submit the homepage + primary landing pages. Call after a major site update. */
export function indexMainPages(): Promise<IndexNowResult> {
  return submitToIndexNow([
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
  ]);
}
