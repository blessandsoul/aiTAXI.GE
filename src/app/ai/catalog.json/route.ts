import { buildAiTaxiSummary, serializeAiTaxi } from "@/lib/aitaxi-public-facts";

export const revalidate = 86400;

export function GET(): Response {
  return new Response(serializeAiTaxi(buildAiTaxiSummary()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
