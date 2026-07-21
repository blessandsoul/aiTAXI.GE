'use client';

import { useTranslations } from 'next-intl';

import {
  HeroWorkflowStory,
  type HeroWorkflowCopy,
} from '@/features/home/components/HeroWorkflowStory';

export function HeroProof(): React.ReactElement {
  const t = useTranslations('product.heroStory');
  const copy: HeroWorkflowCopy = {
    badge: t('badge'),
    inputLabel: t('inputLabel'),
    input: t('input'),
    productLabel: t('productLabel'),
    productAction: t('productAction'),
    detailOne: t('detailOne'),
    detailTwo: t('detailTwo'),
    resultLabel: t('resultLabel'),
    result: t('result'),
    businessLabel: t('businessLabel'),
    businessValue: t('businessValue'),
    replay: t('replay'),
  };

  return (
    <HeroWorkflowStory
      demoId="taxi-hero-proof"
      mode="autonomous"
      productName="aiTAXI"
      productIcon="solar:routing-2-bold-duotone"
      copy={copy}
    />
  );
}
