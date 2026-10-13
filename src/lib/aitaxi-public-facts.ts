import { getAiNowHomeCopy } from "@/features/home/components/ainow/AiNowHomeCopy";

export const AITAXI_BASE_URL = "https://aitaxi.ge";
export const AITAXI_FACTS = {
  product: "aiTAXI",
  provider: "aiNOW",
  providerUrl: "https://ainow.ge",
  status: "prelaunch",
  purpose: "Planned AI dispatcher for taxi companies and fleets: receives ride requests, checks fleet fit and prepares a visible operator decision.",
  input: ["Ride request and pickup/destination", "Passenger requirements", "Fleet, charging and telemetry data where connected", "Operator approval rules and pilot access"],
  output: ["Suitable vehicle recommendation", "Prepared route and expected arrival", "Visible ride status and decision context", "Operator-approved assignment or human assistance"],
  boundaries: ["aiTAXI is pre-launch and does not operate a real fleet today.", "Illustrative logic is not a completed ride, live vehicle location, ETA, tariff, earnings or passenger result.", "Maps, fleet, charging and telemetry connections require a written scope and approved access.", "Any real-world pilot requires separate partner, legal and safety review."],
  pricing: { status: "written_scope_only", amount: null, currency: null, cadence: null, effectiveDate: "UNKNOWN", conditions: ["Price is written before work starts and fixed in the approved proposal.", "Third-party fees and paid licences are separate unless listed.", "No public package amount or capacity was found."] },
} as const;

export function buildAiTaxiSummary(): Record<string, unknown> {
  return { name: AITAXI_FACTS.product, provider: { name: AITAXI_FACTS.provider, url: AITAXI_FACTS.providerUrl }, providerUrl: AITAXI_FACTS.providerUrl, url: AITAXI_BASE_URL, status: AITAXI_FACTS.status, purpose: AITAXI_FACTS.purpose, input: AITAXI_FACTS.input, output: AITAXI_FACTS.output, boundaries: AITAXI_FACTS.boundaries, pricing: AITAXI_FACTS.pricing, lastUpdated: "2026-10-07" };
}
export function buildAiTaxiService(): Record<string, unknown> { return { name: AITAXI_FACTS.product, description: AITAXI_FACTS.purpose, url: AITAXI_BASE_URL, provider: { name: AITAXI_FACTS.provider, url: AITAXI_FACTS.providerUrl }, status: AITAXI_FACTS.status, input: AITAXI_FACTS.input, output: AITAXI_FACTS.output, boundaries: AITAXI_FACTS.boundaries, pricing: AITAXI_FACTS.pricing, lastUpdated: "2026-10-07" }; }
export function buildAiTaxiFaq(): Record<string, unknown> { const copy = getAiNowHomeCopy("en"); return { name: AITAXI_FACTS.product, url: AITAXI_BASE_URL, lastUpdated: "2026-10-07", faqs: Object.entries(copy.faq.items).map(([id, item]) => ({ id, question: item.question, answer: item.answer })) }; }
export function buildAiTaxiIntegrations(): Record<string, unknown> { return { name: AITAXI_FACTS.product, url: AITAXI_BASE_URL, status: "prelaunch", integrations: { maps: "planned_connection_scope_not_live", fleet: "planned_connection_scope_not_live", charging: "planned_connection_scope_not_live", telemetry: "planned_connection_scope_not_live" }, lastUpdated: "2026-10-07" }; }
export function serializeAiTaxi(value: unknown): string { return `${JSON.stringify(value, null, 2)}\n`; }
