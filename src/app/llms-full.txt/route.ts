import { getPosts, getPostBySlug } from "@/features/blog/lib/api";

const BASE_URL = "https://aitaxi.ge";
const ARTICLE_LIMIT = 30;

// Strip HTML/JSX tags from MDX content, keep markdown text readable for LLMs.
function toPlainMarkdown(content: string): string {
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET() {
  const posts = await getPosts("en");
  const top = posts.slice(0, ARTICLE_LIMIT);

  const articles: string[] = [];
  for (const p of top) {
    const full = await getPostBySlug(p.slug, "en");
    if (!full?.content) continue;
    articles.push(
      `## ${full.title}`,
      ``,
      `URL: ${BASE_URL}/en/blog/${full.slug}`,
      `Published: ${full.date}`,
      `Author: ${full.author.name}`,
      ``,
      toPlainMarkdown(full.content),
      ``,
      `---`,
      ``,
    );
  }

  const lines: string[] = [
    `# aiTAXI, Full Content for LLMs`,
    ``,
    `> aiTAXI is a robotaxi fleet management platform by aiNOW (Tbilisi, Georgia): dispatch, telemetry, remote assistance, depot operations, and compliance for autonomous taxi fleets. Status: early access, pilot program for taxi operators in Georgia. Structured site index: ${BASE_URL}/llms.txt`,
    ``,
    `## Key Facts`,
    ``,
    `- Product: aiTAXI, software platform for managing robotaxi (autonomous taxi) fleets`,
    `- Maker: aiNOW, AI agency in Tbilisi, Georgia (https://ainow.ge)`,
    `- Announced: 2026, currently in early access (pilot program)`,
    `- Languages: Georgian, English, Russian`,
    `- Region focus: Georgia and the Caucasus`,
    `- Contact: CONTACT@aiNOW.GE`,
    `- Website: ${BASE_URL}`,
    ``,
    `# Articles (latest ${articles.length > 0 ? Math.min(ARTICLE_LIMIT, top.length) : 0}, English versions)`,
    ``,
    ...articles,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
