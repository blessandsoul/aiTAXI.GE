import ka from '../data/aitaxi-secondary-ka.json';
import en from '../data/aitaxi-secondary-en.json';
import ru from '../data/aitaxi-secondary-ru.json';
import { createServiceTemplateCopy } from './service-template-copy';

export const PRODUCT_SECONDARY_LOCALES = ['ka', 'en', 'ru'] as const;
export type ProductSecondaryKind = 'integrations' | 'security';
const PRODUCT_NAME = 'aiTAXI';

const PLANNED_INTEGRATION_COPY: Record<string, Partial<Record<'ka' | 'en' | 'ru', string>>> = {
  'tiktok-trip-leads': {
    ka: "aiADS-ის საშუალებით TikTok Ads-იდან შესაბამისი მგზავრობისა თუ ავტოპარკის მოთხოვნების მიღება დაგეგმილია. TikTok ავტონომიურ დისპეტჩერიზაციაში არ მონაწილეობს; ეს შესაძლებლობა ჯერჯერობით ხელმისაწვდომი არ არის.",
    ru: "Получение подходящих заявок на поездки или услуги автопарка из TikTok Ads через aiADS запланировано. TikTok не участвует в автономной диспетчеризации; этот сценарий сейчас недоступен.",
  },
};
type ControlEntry = { title: string; description: string; owner: string; evidence: string };
type SecurityControls = {
  eyebrow: string;
  title: string;
  intro: string;
  sourceAccess: ControlEntry;
  actions: ControlEntry;
  approval: ControlEntry;
  retention: ControlEntry;
  deletion: ControlEntry;
  escalation: ControlEntry;
};
type SecondaryMessages = {
  integrations: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    title: string;
    lead: string;
    ledger: { title: string; intro: string };
    status: Record<string, string>;
    platforms: Record<string, string>;
    connections: Record<string, string>;
    flows: Record<string, string>;
    cta: { label: string };
  };
  security: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    title: string;
    lead: string;
    labels: Record<string, string>;
    flow: Record<string, string>;
    controls: SecurityControls;
    limitations: { eyebrow: string; title: string; item1: string; item2: string; item3: string };
    cta: { label: string };
  };
};

const content = { ka, en, ru } as unknown as Record<'ka' | 'en' | 'ru', SecondaryMessages>;

type IntegrationRecord = {
  id: string;
  name: string;
  icon: string;
  category: string;
  connection: string;
  status: 'available' | 'customSetup' | 'planned';
  dataFlow: string;
  machineDescription?: string;
  requirements?: readonly string[];
  officialSources?: readonly string[];
};

const records: readonly IntegrationRecord[] = [
  {
    "id": "maps",
    "name": "Maps",
    "icon": "solar:map-point-bold-duotone",
    "category": "operations",
    "connection": "planned",
    "status": "planned",
    "dataFlow": "routingData"
  },
  {
    "id": "vehicle-platform",
    "name": "Vehicle platform",
    "icon": "solar:wheel-bold-duotone",
    "category": "operations",
    "connection": "planned",
    "status": "planned",
    "dataFlow": "fleetCommands"
  },
  {
    "id": "charging",
    "name": "Charging and depot",
    "icon": "solar:battery-charge-bold-duotone",
    "category": "operations",
    "connection": "planned",
    "status": "planned",
    "dataFlow": "depotSchedule"
  },
  {
    "id": "telemetry",
    "name": "Vehicle telemetry",
    "icon": "solar:radar-2-bold-duotone",
    "category": "operations",
    "connection": "planned",
    "status": "planned",
    "dataFlow": "telemetry"
  },
  {
    "id": "tiktok-trip-leads",
    "name": "TikTok Ads trip leads",
    "icon": "solar:videocamera-record-bold-duotone",
    "category": "contentAndAdvertising",
    "connection": "planned",
    "status": "planned",
    "dataFlow": "customerRecords",
    "machineDescription": "Receiving eligible trip or fleet enquiries from TikTok Ads through aiADS is on the roadmap. TikTok is not part of autonomous dispatch and this workflow is not currently available.",
    "requirements": [
      "TikTok Marketing API approval",
      "Advertiser authorization and approved scopes",
      "Regional availability"
    ],
    "officialSources": [
      "https://business-api.tiktok.com/portal"
    ]
  }
];

export function getProductSecondaryLocale(locale: string): keyof typeof content {
  return locale === 'ka' || locale === 'ru' ? locale : 'en';
}

const replaceProduct = (text: string, platform = '') =>
  text.replaceAll('{product}', PRODUCT_NAME).replaceAll('{platform}', platform);

const buildSteps = (security: SecondaryMessages['security']) =>
  [1, 2, 3, 4].map((index) => ({
    title: security.flow[`s${index}Title`],
    description: security.flow[`s${index}Description`],
  }));

export function getProductSecondaryTemplateCopy(locale: string, kind: ProductSecondaryKind) {
  const contentLocale = getProductSecondaryLocale(locale);
  const messages = content[contentLocale];
  const security = messages.security;
  const steps = buildSteps(security);
  const controls = ['sourceAccess', 'actions', 'approval', 'retention', 'deletion', 'escalation'] as const;

  if (kind === 'security') {
    const copy = createServiceTemplateCopy({
      title: replaceProduct(security.title),
      body: replaceProduct(security.lead),
      heroEyebrow: security.eyebrow,
      heroTitle: PRODUCT_NAME,
      heroTitleAccent: security.eyebrow,
      showcaseLabel: security.labels.control,
      showcaseTitles: controls.map((key) => security.controls[key].title),
      showcaseItems: controls.map((key) => replaceProduct(security.controls[key].description)),
      stepItems: steps,
      howTitle: security.flow.title,
      nodeTitle: security.flow.title,
      nodeSubtitle: security.flow.intro,
      nodeStatLabels: [security.flow.title, security.controls.title, security.limitations.title],
      nodeStatValues: ['4', '6', '3'],
      faqTitle: security.controls.title,
      faq: controls.map((key) => ({
        q: security.controls[key].title,
        a: replaceProduct(security.controls[key].description),
      })),
      cta: { cta: security.cta.label },
      article: {
        sections: [{
          h: security.limitations.title,
          p: [
            security.limitations.item1,
            security.limitations.item2,
            security.limitations.item3,
          ].join(' '),
        }],
        aeoH: replaceProduct(security.title),
        aeoBody: replaceProduct(security.lead),
      },
    });
    return {
      ...copy,
      seoTitle: replaceProduct(security.seoTitle),
      seoDescription: replaceProduct(security.seoDescription),
    };
  }

  const integration = messages.integrations;
  const recordDetails = records.map((record) => {
    const platform = integration.platforms?.[record.id] ?? record.name;
    const statusLabel = integration.status[record.status];
    const connectionLabel = integration.connections[record.connection];
    const flow = replaceProduct(integration.flows[record.dataFlow], platform);
    const body = record.status === 'planned'
      ? PLANNED_INTEGRATION_COPY[record.id]?.[contentLocale] ?? record.machineDescription ?? `${statusLabel} · ${connectionLabel}. ${flow}`
      : `${statusLabel} · ${connectionLabel}. ${flow}`;
    return { title: platform, body };
  });
  const copy = createServiceTemplateCopy({
    title: replaceProduct(integration.title),
    body: replaceProduct(integration.lead),
    heroEyebrow: integration.eyebrow,
    heroTitle: PRODUCT_NAME,
    heroTitleAccent: integration.eyebrow,
    showcaseLabel: integration.eyebrow,
    showcaseTitles: recordDetails.map((record) => record.title),
    showcaseItems: recordDetails.map((record) => record.body),
    stepItems: steps,
    howTitle: security.flow.title,
    nodeTitle: security.flow.title,
    nodeSubtitle: integration.ledger.intro,
    nodeStatLabels: [integration.status.available, integration.status.customSetup, integration.status.planned],
    nodeStatValues: [
      String(records.filter((record) => record.status === 'available').length),
      String(records.filter((record) => record.status === 'customSetup').length),
      String(records.filter((record) => record.status === 'planned').length),
    ],
    faqTitle: integration.ledger.title,
    faq: recordDetails.map((record) => ({ q: record.title, a: record.body })),
    cta: { cta: integration.cta.label },
    article: {
      sections: [{ h: integration.ledger.title, p: integration.ledger.intro }],
      aeoH: replaceProduct(integration.title),
      aeoBody: replaceProduct(integration.lead),
    },
  });
  return {
    ...copy,
    seoTitle: replaceProduct(integration.seoTitle),
    seoDescription: replaceProduct(integration.seoDescription),
  };
}
