import { getPostBySlug, getPosts } from "@/features/blog/lib/api";
import { AITAXI_BASE_URL, AITAXI_FACTS } from "@/lib/aitaxi-public-facts";

function plain(value: string): string { return value.replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim(); }
export async function GET(): Promise<Response> {
  const lines = [`# ${AITAXI_FACTS.product} by ${AITAXI_FACTS.provider} — full content`, "", `Product URL: ${AITAXI_BASE_URL}`, `Provider: ${AITAXI_FACTS.provider}`, "Provider URL: https://ainow.ge", "", AITAXI_FACTS.purpose, "", "Status: pre-launch; no operating fleet or completed ride is claimed.", "", ...AITAXI_FACTS.boundaries, "", "## Authored articles", ""];
  for (const locale of ["ka", "en", "ru"]) { const posts = await getPosts(locale); lines.push(`### ${locale.toUpperCase()}`, ""); for (const post of posts) { const full = await getPostBySlug(post.slug, locale); if (!full?.content) continue; lines.push(`#### ${full.title}`, "", `URL: ${locale === "ka" ? `${AITAXI_BASE_URL}/blog/${full.slug}` : `${AITAXI_BASE_URL}/${locale}/blog/${full.slug}`}`, "", plain(full.content), "", "---", ""); } }
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" } });
}
