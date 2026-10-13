import type { ProductPagesConfig } from '@/features/product-pages/types';

export const PRODUCT_PAGES = {
  pricing: { status: 'public', mode: 'pilot' },
  contact: { status: 'public' },
  blog: { status: 'off' },
  integrations: {
    status: 'public',
    records: [
      { id: 'maps', name: 'Maps', icon: 'solar:map-point-bold-duotone', category: 'operations', connection: 'planned', status: 'planned', dataFlow: 'routingData' },
      { id: 'vehicle-platform', name: 'Vehicle platform', icon: 'solar:wheel-bold-duotone', category: 'operations', connection: 'planned', status: 'planned', dataFlow: 'fleetCommands' },
      { id: 'charging', name: 'Charging and depot', icon: 'solar:battery-charge-bold-duotone', category: 'operations', connection: 'planned', status: 'planned', dataFlow: 'depotSchedule' },
      { id: 'telemetry', name: 'Vehicle telemetry', icon: 'solar:radar-2-bold-duotone', category: 'operations', connection: 'planned', status: 'planned', dataFlow: 'telemetry' },
      {
        id: 'tiktok-trip-leads',
        name: 'TikTok Ads trip leads',
        icon: 'solar:videocamera-record-bold-duotone',
        category: 'contentAndAdvertising',
        connection: 'planned',
        status: 'planned',
        dataFlow: 'customerRecords',
        machineDescription:
          'Receiving eligible trip or fleet enquiries from TikTok Ads through aiADS is on the roadmap. TikTok is not part of autonomous dispatch and this workflow is not currently available.',
        requirements: [
          'TikTok Marketing API approval',
          'Advertiser authorization and approved scopes',
          'Regional availability',
        ],
        officialSources: ['https://business-api.tiktok.com/portal'],
      },
    ],
  },
  security: { status: 'public' },
  privacy: { status: 'public' },
  terms: { status: 'public' },
  cookies: { status: 'off' },
  solutions: { status: 'off', slugs: [] },
  localeNamespaces: {
    ka: ['productPages.common', 'productPages.pricing', 'productPages.contact', 'productPages.integrations', 'productPages.security', 'productPages.privacy', 'productPages.terms'],
    en: ['productPages.common', 'productPages.pricing', 'productPages.contact', 'productPages.integrations', 'productPages.security', 'productPages.privacy', 'productPages.terms'],
    ru: ['productPages.common', 'productPages.pricing', 'productPages.contact', 'productPages.integrations', 'productPages.security', 'productPages.privacy', 'productPages.terms'],
  },
} as const satisfies ProductPagesConfig;
