import { getPosts } from "@/features/blog/lib/api";

const BASE_URL = "https://aitaxi.ge";

export async function GET() {
  const posts = await getPosts("en");
  const recentPosts = posts.slice(0, 20);

  const lines: string[] = [
    `# aiTAXI, Robotaxi Fleet Management Platform (Tbilisi, Georgia)`,
    ``,
    `> aiTAXI is a robotaxi fleet management platform by aiNOW (Tbilisi, Georgia). It gives taxi companies the software layer to launch and operate autonomous vehicle fleets: dispatch and ride matching, real-time telemetry, remote assistance (teleoperation), depot and charging operations, safety and compliance reporting. Status: early access, pilot program for taxi operators in Georgia.`,
    ``,
    `## Key Facts`,
    ``,
    `- Product: aiTAXI, software platform for managing robotaxi (autonomous taxi) fleets`,
    `- Maker: aiNOW, AI agency in Tbilisi, Georgia (https://ainow.ge)`,
    `- Founder: Andrew Altair (https://andrewaltair.ge)`,
    `- Announced: 2026, currently in early access (pilot program, not general availability)`,
    `- Who it is for: taxi companies and fleet operators preparing to add autonomous vehicles`,
    `- Vehicle-agnostic: designed to integrate with AV platforms as they enter the Georgian market`,
    `- Languages: Georgian, English, Russian`,
    `- Region focus: Georgia and the Caucasus`,
    `- Contact: CONTACT@aiNOW.GE`,
    `- Website: ${BASE_URL}`,
    `- Full article content for LLMs: ${BASE_URL}/llms-full.txt`,
    ``,
    `## What the platform covers`,
    ``,
    `- Fleet dispatch: ride matching, routing, and utilization for driverless vehicles`,
    `- Telemetry: live vehicle state, battery, sensors, incident flags`,
    `- Remote assistance: human teleoperation escalation when an AV requests help`,
    `- Depot operations: charging schedules, cleaning, maintenance slots`,
    `- Safety and compliance: trip logs, incident reports, regulatory documentation`,
    ``,
    `## Main Pages`,
    ``,
    `### Home`,
    `${BASE_URL}`,
    `Overview of the aiTAXI platform, modules, and the early-access pilot program.`,
    ``,
    `### Blog`,
    `${BASE_URL}/blog`,
    `Guides and analysis on robotaxi technology, autonomous taxi economics, fleet operations, and the Georgian taxi market. In Georgian, English, and Russian. ${posts.length} articles published.`,
    ``,
    `### About`,
    `${BASE_URL}/about`,
    `Who builds aiTAXI: aiNOW, an AI agency in Tbilisi, Georgia.`,
    ``,
    `### Contact / Early Access`,
    `${BASE_URL}/contact`,
    `Request early access to the pilot program or ask a question. Email CONTACT@aiNOW.GE.`,
    ``,
    `### Recent Articles`,
    ``,
    ...recentPosts.flatMap((post) => [
      `- [${post.title}](${BASE_URL}/en/blog/${post.slug})`,
    ]),
    ``,
    `## Legal`,
    ``,
    `### Privacy Policy`,
    `${BASE_URL}/privacy`,
    ``,
    `### Terms of Service`,
    `${BASE_URL}/terms`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
