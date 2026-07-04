import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/layout/SectionContainer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.privacy" });

  const path = "/privacy";
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "ka" ? `https://aitaxi.ge${path}` : `https://aitaxi.ge/${locale}${path}`,
      languages: {
        ka: `https://aitaxi.ge${path}`,
        en: `https://aitaxi.ge/en${path}`,
        ru: `https://aitaxi.ge/ru${path}`,
        'x-default': `https://aitaxi.ge${path}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

const SECTIONS = [
  "section1",
  "section2",
  "section3",
  "section4",
  "section5",
  "section6",
  "section7",
  "section8",
  "section9",
  "section10",
] as const;

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="py-20">
      <SectionContainer>
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-xs uppercase tracking-[0.3em] text-[#525252]">
            aiNOW
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm text-[#525252]">
            {t("lastUpdated")}
          </p>
          <p className="mt-6 leading-relaxed text-[#525252]">
            {t("intro")}
          </p>

          <div className="mt-12 space-y-8">
            {SECTIONS.map((key) => (
              <section key={key}>
                <h2 className="font-display text-lg font-bold tracking-tight text-neutral-900">
                  {t(`${key}Title`)}
                </h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-[#525252]">
                  {t(`${key}Content`)}
                </p>
              </section>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
