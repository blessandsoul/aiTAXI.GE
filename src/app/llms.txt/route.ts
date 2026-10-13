import { getPosts } from "@/features/blog/lib/api";
import { AITAXI_BASE_URL, AITAXI_FACTS } from "@/lib/aitaxi-public-facts";

function articleUrl(locale: string, slug: string): string {
  return locale === "ka" ? `${AITAXI_BASE_URL}/blog/${slug}` : `${AITAXI_BASE_URL}/${locale}/blog/${slug}`;
}

export async function GET(): Promise<Response> {
  const locales = ["ka", "en", "ru"];
  const entries = await Promise.all(locales.map(async (locale) => ({ locale, posts: await getPosts(locale) })));
  const lines = [
    `# ${AITAXI_FACTS.product} by ${AITAXI_FACTS.provider}`,
    "",
    `> ${AITAXI_FACTS.purpose}`,
    "",
    "## Status",
    "",
    "- Pre-launch / early access; no production fleet is operated by aiNOW.",
    "- This product prepares a planned operator workflow; it is not a live taxi-booking service.",
    "",
    "## Inputs and planned outputs",
    "",
    ...AITAXI_FACTS.input.map((item) => `- Input: ${item}`),
    ...AITAXI_FACTS.output.map((item) => `- Planned output: ${item}`),
    "",
    "## Pricing",
    "",
    "- No public package amount, currency, cadence or capacity is confirmed.",
    "- Price is fixed in a written proposal after scope and pilot approval.",
    "",
    "## Boundaries",
    "",
    ...AITAXI_FACTS.boundaries.map((item) => `- ${item}`),
    "",
    "## Routes",
    "",
    ...["/", "/pricing", "/contact", "/integrations", "/security", "/privacy", "/terms", "/blog", "/llms.txt", "/llms-full.txt", "/ai/summary.json", "/ai/service.json", "/ai/faq.json"].map((path) => `- ${AITAXI_BASE_URL}${path}`),
    "",
    "## Articles",
    "",
    ...entries.flatMap(({ locale, posts }) => [
      `### ${locale.toUpperCase()} (${posts.length})`,
      ...posts.map((post) => `- ${post.title}: ${articleUrl(locale, post.slug)}`),
      "",
    ]),
  ];
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" } });
}
