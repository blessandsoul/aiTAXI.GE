/**
 * THE ONE FILE THAT DIFFERS PER LANDING.
 *
 * Everything else in this repo is shared with the other aiNOW product landings and is kept in
 * sync from `landing-template/` by `python scripts/landings.py sync`. If you find yourself
 * editing a shared file to make THIS site different, stop: the difference belongs here, or in
 * src/messages/*.json, or in this site's own widgets under src/features/showcase/.
 *
 * aiTAXI IS THE EXCEPTION IN ONE RESPECT, and it is a deliberate one. Its page body is not the
 * template's Showcase + Work pair: it runs LandingHow, LandingModules and LandingRoadmap, which
 * are real product content (the five operational jobs a robotaxi fleet creates, and an honest
 * pre-launch roadmap). Those stay. The SHELL is shared: nav, hero, faq, cta, wordmark, footer,
 * brand tokens, structured data. Deleting a pre-launch platform's roadmap to make it match a
 * template would be deleting the most honest thing on the page.
 *
 * It also carries a blog, an /about, /privacy and /terms, which the six pure landings do not.
 *
 * Migrated onto this seam 2026-07-11.
 */

export const SITE = {
  /** Machine key. Lands on <html data-product> and is the deploy smoke-test hook. */
  key: "aitaxi",

  domain: "aitaxi.ge",
  baseUrl: "https://aitaxi.ge",

  /** Rendered as <prefix><mark> by the nav, hero, footer and wordmark band. */
  wordmark: { prefix: "ai", mark: "TAXI" },

  /**
   * The product colour. src/app/brand.css is generated from this; keep them in step.
   * Yellow is light, so the computed label colour on a yellow fill is near-black, not white.
   * That is what the site already did by hand; now it is derived.
   */
  brandHex: "#ffd400",

  /**
   * Three hexes the hero grainient shader interpolates: soft, BRAND, accent. The order is the
   * contract, and getting it wrong here is not cosmetic.
   *
   * The first draft copied this straight from the old hero's shader params, which happened to
   * end on the cream (#fff3d6). brand.css derives `--accent` from the THIRD stop, and the hero
   * tagline is a `background-clip: text` gradient from `--brand` to `--accent`. So the tagline
   * faded into a near-white cream and read as clipped text on a live page. Nothing threw, the
   * build was green, and only the screenshot showed it.
   *
   * An accent is a SIBLING of the brand, never a near-white: anything that paints text has to
   * survive being painted.
   */
  shader: ["#fff4b8", "#ffd400", "#b88600"] as [string, string, string],

  /**
   * `defaultLocale` is the UNPREFIXED locale (next-intl `localePrefix: "as-needed"`), so it
   * decides the URL shape. It is NOT the same question as "is this locale Georgian", which
   * stays a literal `locale === "ka"` check because it drives the Georgian font and the OG
   * locale tag. Do not find-replace one for the other.
   */
  defaultLocale: "ka",
  locales: ["ka", "en", "ru"],

  /** PWA manifest. Not locale-aware (Next metadata routes are build-time). English. */
  manifest: {
    name: "aiTAXI",
    short: "aiTAXI",
    description: "Pre-launch operations software for autonomous taxi fleets: orders, vehicle status, remote help and depot planning.",
    background: "#fbfcfc",
    theme: "#ffc400",
  },

  /**
   * The machine-readable half of the page. StructuredData.tsx turns this into the JSON-LD
   * entity graph and /llms.txt turns it into prose.
   */
  seo: {
    disambiguating:
      "aiTAXI is aiNOW's pre-launch operations platform for autonomous taxi fleets. It is planned for dispatch, vehicle status, remote assistance and depot work. It is not a passenger app and does not build self-driving cars.",
    serviceType: "Pre-launch operations platform for autonomous taxi fleets",
    audienceName: "Taxi companies and fleet operators in Georgia and the wider region",
    areaServed: "GE",
    knowsAbout: [
      "Robotaxi fleet operations",
      "Autonomous vehicle dispatch",
      "Fleet telemetry",
      "Remote assistance and teleoperation",
      "Depot operations",
      "Charging and cleaning cycles",
      "Autonomous vehicle regulation",
      "Taxi fleet economics",
    ],
    features: [
      "Planned dispatch for autonomous and human-driven vehicles",
      "Planned vehicle-status view with clear safety alerts",
      "Planned handoff to an authorised remote operator",
      "Planned charging, cleaning and maintenance schedule",
      "One reviewable incident report built from operating records",
    ],
    boundary:
      "aiTAXI is a fleet platform, not an agency service. The other aiNOW domains sell marketing, sales and back-office automation to businesses; this one sells operating software to a taxi company. If you want an AI agent answering your customers, that is aiSTAFF.ge.",
    limits: [
      "aiTAXI is pre-launch. No production fleet runs on the platform.",
      "aiNOW does not build or sell autonomous vehicles. aiTAXI would connect to a qualified vehicle platform.",
      "Any pilot requires separate legal, safety and partner review before real-world use.",
      "aiNOW does not claim operating results or fleet economics from a production aiTAXI deployment.",
    ],
    commitment:
      "aiTAXI is pre-launch. aiNOW starts with a practical fit review and provides a written pilot scope before any implementation decision.",
    summary:
      "aiTAXI is aiNOW's pre-launch operations platform for autonomous taxi fleets. The planned product brings orders, vehicle status, remote help, depot work and incident records into one operator view. It is not a passenger app, does not build autonomous vehicles and does not represent an operating production fleet.",
  },
} as const;

export type SiteConfig = typeof SITE;
