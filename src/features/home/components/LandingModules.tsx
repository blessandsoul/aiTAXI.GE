import { useTranslations } from 'next-intl';

import { ProductCapabilities } from './ProductCapabilities';

const CAPABILITIES = [
  { key: 'dispatch', icon: 'solar:routing-2-bold-duotone' },
  { key: 'telemetry', icon: 'solar:radar-2-bold-duotone' },
  { key: 'assistance', icon: 'solar:headphones-round-sound-bold-duotone' },
  { key: 'depot', icon: 'solar:battery-charge-bold-duotone' },
  { key: 'safety', icon: 'solar:document-text-bold-duotone' },
] as const;

export function LandingModules(): React.ReactElement {
  const t = useTranslations('product.capabilities');
  const translate = (key: string): string => t(key as never);

  return (
    <ProductCapabilities
      eyebrow={t('eyebrow')}
      title={t('title')}
      intro={t('intro')}
      outcomeLabel={t('outcomeLabel')}
      items={CAPABILITIES.map(({ key, icon }) => ({
        icon,
        title: translate(`${key}.title`),
        description: translate(`${key}.description`),
        result: translate(`${key}.result`),
      }))}
    />
  );
}
