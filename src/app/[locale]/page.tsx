import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/i18n/seo-locales';
import { HomeFaqSchema } from '@/components/seo/StructuredData';
import { LandingHero } from '@/features/home/components/LandingHero';
import { LandingBody } from '@/features/home/components/LandingBody';
import { LandingFaq } from '@/features/home/components/LandingFaq';
import { LandingCta } from '@/features/home/components/LandingCta';
import { LandingWordmark } from '@/features/home/components/LandingWordmark';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });

  const ogImageUrl = 'https://aitaxi.ge/og-image.png';

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('', locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'aiTAXI' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <HomeFaqSchema locale={locale} />
      <div className="landing-page">
        <LandingHero />
        <LandingBody />
        <LandingFaq />
        <LandingCta />
        <LandingWordmark />
      </div>
    </>
  );
}
