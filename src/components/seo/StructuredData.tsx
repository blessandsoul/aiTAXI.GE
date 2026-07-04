import { getTranslations } from "next-intl/server";
import { CONTACT_PHONE } from "@/lib/constants/app.constants";

// Brand node for aiTAXI. The load-bearing entity edges:
//  - parentOrganization -> https://ainow.ge#organization (matches the @id ainow.ge emits)
//  - founder -> https://andrewaltair.ge/#person (same person node andrewaltair.ge emits)
// Together they stitch aitaxi.ge into the existing aiNOW entity graph instead of
// spawning an unconnected orphan brand.
const organizationSchema = {
  "@type": "Organization",
  name: "aiTAXI",
  "@id": "https://aitaxi.ge/#organization",
  alternateName: ["aiTAXI Georgia", "aiTAXI by aiNOW"],
  disambiguatingDescription:
    "Robotaxi fleet management software platform for taxi companies in Georgia (the country), a product of the aiNOW agency. Not a ride-hailing app and not affiliated with similarly named AI projects.",
  url: "https://aitaxi.ge",
  logo: {
    "@type": "ImageObject",
    url: "https://aitaxi.ge/logo.png",
    width: 192,
    height: 192,
  },
  image: "https://aitaxi.ge/og-image.png",
  description:
    "aiTAXI is a robotaxi fleet management platform by aiNOW (Tbilisi, Georgia): dispatch, telemetry, remote assistance, depot operations, and compliance for autonomous taxi fleets.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tornike Eristavi St. 3",
    addressLocality: "Tbilisi",
    addressCountry: "GE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@ainow.ge",
    telephone: CONTACT_PHONE,
    contactType: "sales",
    availableLanguage: ["ka", "en", "ru"],
  },
  parentOrganization: {
    "@type": "Organization",
    "@id": "https://ainow.ge#organization",
    name: "aiNOW",
    url: "https://ainow.ge",
  },
  knowsAbout: [
    "Robotaxi",
    "Autonomous Vehicles",
    "Autonomous Taxi",
    "Fleet Management Software",
    "AV Teleoperation",
    "Vehicle Telemetry",
    "Taxi Dispatch Systems",
    "EV Depot Operations",
    "Transportation Compliance",
  ],
  // Reciprocal cross-domain entity edge: the founder is Andrew Altair
  // (andrewaltair.ge#person), the same person node aiNOW's site links.
  founder: {
    "@type": "Person",
    "@id": "https://andrewaltair.ge/#person",
    name: "Andrew Altair",
    url: "https://andrewaltair.ge/about",
  },
};

// The product itself. Honest early-access state: no price, no fake availability.
const softwareSchema = {
  "@type": "SoftwareApplication",
  "@id": "https://aitaxi.ge/#software",
  name: "aiTAXI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://aitaxi.ge",
  image: "https://aitaxi.ge/og-image.png",
  description:
    "Robotaxi fleet management platform: dispatch and ride matching, real-time telemetry, remote assistance (teleoperation), depot and charging operations, safety and compliance reporting for autonomous taxi fleets. Early access pilot program for taxi operators in Georgia.",
  featureList: [
    "Fleet dispatch and ride matching for autonomous vehicles",
    "Real-time vehicle telemetry and incident flags",
    "Remote assistance and teleoperation escalation",
    "Depot, charging and maintenance operations",
    "Safety, trip-log and compliance reporting",
  ],
  inLanguage: ["ka-GE", "en-US", "ru-RU"],
  provider: { "@id": "https://aitaxi.ge/#organization" },
  publisher: { "@id": "https://aitaxi.ge/#organization" },
  releaseNotes: "Early access, pilot program for taxi operators in Georgia.",
  audience: {
    "@type": "BusinessAudience",
    name: "Taxi companies and fleet operators",
  },
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://aitaxi.ge/#website",
  name: "aiTAXI",
  alternateName: "aiTAXI, Robotaxi Fleet Management",
  url: "https://aitaxi.ge",
  inLanguage: ["ka-GE", "en-US", "ru-RU"],
  publisher: { "@id": "https://aitaxi.ge/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://aitaxi.ge/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// One @graph instead of three standalone scripts: a single @context, and the nodes are linked by
// @id (WebSite.publisher -> Organization, SoftwareApplication.provider -> Organization), which is
// the form schema validators prefer.
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, softwareSchema, websiteSchema],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(siteGraph),
      }}
    />
  );
}

// Home-only FAQPage, built from the home.faq translations so the JSON-LD mirrors
// the visible FAQ accordion, per locale. Count must match the translation keys.
export const HOME_FAQ_COUNT = 10;

export async function HomeFaqSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.faq" });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: HOME_FAQ_COUNT }, (_, i) => {
      const n = i + 1;
      return {
        "@type": "Question",
        name: t.markup(`q${n}`, { brand: () => "aiTAXI" }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`a${n}`),
        },
      };
    }),
  };
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}
