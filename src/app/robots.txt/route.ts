// Raw-text robots.txt route handler (replaces the former app/robots.ts MetadataRoute).
// MetadataRoute.Robots cannot emit `Content-Signal:` directives, so we render the body
// by hand. Behaviour is otherwise identical to the previous robots.ts: the `*` group
// plus one allow-group per AI crawler, the same disallow list, and the sitemap line.
// Host canonicalization stays at the Cloudflare edge (no `Host:` directive here).

const AI_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "OAI-SearchBot",
  "ChatGPT-User",
  "cohere-ai",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
];

const DISALLOW = ["/api/"];

// Content Signals (contentsignals.org / IETF draft): aiTAXI WANTS maximum AI visibility,
// the whole point of this site is being cited by search and AI answers:
// search indexing yes, training yes, AI grounding/RAG input yes.
const CONTENT_SIGNAL = "search=yes, ai-train=yes, ai-input=yes";

function group(userAgent: string): string {
  return [
    `User-Agent: ${userAgent}`,
    "Allow: /",
    ...DISALLOW.map((path) => `Disallow: ${path}`),
    `Content-Signal: ${CONTENT_SIGNAL}`,
  ].join("\n");
}

export async function GET(): Promise<Response> {
  const groups = ["*", ...AI_CRAWLERS].map(group);
  const body = `${groups.join("\n\n")}\n\nSitemap: https://aitaxi.ge/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
