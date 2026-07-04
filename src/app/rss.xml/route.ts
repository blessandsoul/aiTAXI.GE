import { getPosts } from "@/features/blog/lib/api";

const BASE_URL = "https://aitaxi.ge";
const SITE_TITLE = "aiTAXI, Robotaxi Fleet Management";
const SITE_DESC =
  "Articles on robotaxi technology, autonomous taxi economics, fleet operations, and the Georgian taxi market from aiTAXI by aiNOW (Tbilisi, Georgia).";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPosts("en");
  const recent = posts.slice(0, 50);
  const lastBuild = recent[0]?.date
    ? new Date(recent[0].date).toUTCString()
    : new Date().toUTCString();

  const items = recent
    .map((p) => {
      const link = `${BASE_URL}/en/blog/${p.slug}`;
      const pubDate = p.date ? new Date(p.date).toUTCString() : lastBuild;
      const desc = (p as { excerpt?: string; description?: string }).excerpt
        ?? (p as { excerpt?: string; description?: string }).description
        ?? "";
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escape(desc)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escape(SITE_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
