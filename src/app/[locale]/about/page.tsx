import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { team } from "@/features/about/data/team";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { FadeIn } from "@/components/common/FadeIn";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });

  const path = "/about";
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "ka" ? `https://aitaxi.ge${path}` : `https://aitaxi.ge/${locale}${path}`,
      languages: { ka: `https://aitaxi.ge${path}`, en: `https://aitaxi.ge/en${path}`, ru: `https://aitaxi.ge/ru${path}`, 'x-default': `https://aitaxi.ge${path}` },
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

// Eyebrow label shared across sections, mono, uppercase, wide tracking (landing look).
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#525252]">
      {children}
    </p>
  );
}

// The three pillars of the aiTAXI effort: platform, research, pilot program.
const FLAGSHIPS = [
  { key: "build1", color: "#b45309" },
  { key: "build2", color: "#2563eb" },
  { key: "build3", color: "#10b981", soon: true },
] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  // Localized field with an English fallback (team.ts ships ka/en).
  const pick = (m: { ka: string; en: string }) =>
    (m as Record<string, string>)[locale] ?? m.en;

  return (
    <div className="landing-page">
      <div className="space-y-20 py-16 md:space-y-28 md:py-24">
        {/* Mission */}
        <SectionContainer>
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>aiTAXI · by aiNOW</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 md:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#525252]">
                {t("mission")}
              </p>
            </div>
          </FadeIn>
        </SectionContainer>

        {/* What we build, the 3 flagship products */}
        <SectionContainer>
          <FadeIn>
            <h2 className="text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 md:text-6xl">
              {t("buildTitle")}
            </h2>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {FLAGSHIPS.map((f, i) => (
              <FadeIn key={f.key} delay={i * 0.08}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border border-[#e5e5e5] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md",
                    "soon" in f && f.soon && "opacity-80"
                  )}
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#737373]">
                    {t(`${f.key}Tag`)}
                  </span>
                  <h3
                    className="mt-3 font-display text-2xl font-extrabold tracking-tight"
                    style={{ color: f.color }}
                  >
                    {t(`${f.key}Name`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#525252]">
                    {t(`${f.key}Desc`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </SectionContainer>

        {/* Team, 2 founders + Head of Sales */}
        <SectionContainer>
          <FadeIn>
            <h2 className="text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 md:text-6xl">
              {t("teamTitle")}
            </h2>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.08}>
                <div className="group flex h-full flex-col items-center rounded-2xl border border-[#e5e5e5] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  {/* Photo with gradient ring */}
                  <div className={cn("rounded-full bg-linear-to-br p-[2.5px]", member.accent)}>
                    <div className="h-24 w-24 overflow-hidden rounded-full bg-white">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        style={member.imagePosition ? { objectPosition: member.imagePosition } : undefined}
                      />
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-[#0a0a0a]">
                    {locale === "ka" ? member.nameKa : member.name}
                  </h3>
                  <span
                    className={cn(
                      "mt-1.5 inline-block rounded-full bg-linear-to-r px-3 py-0.5 text-xs font-medium text-white",
                      member.accent
                    )}
                  >
                    {pick(member.role)}
                  </span>
                  {member.tags && member.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {member.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/5 bg-black/[0.04] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#525252]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#525252]">
                    {pick(member.bio)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </SectionContainer>

        {/* Values */}
        <SectionContainer>
          <FadeIn>
            <h2 className="text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 md:text-6xl">
              {t("valuesTitle")}
            </h2>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-3">
            {(["value1", "value2", "value3"] as const).map((key, i) => (
              <FadeIn key={key} delay={i * 0.08}>
                <div className="text-center">
                  <h3 className="font-display text-xl font-extrabold tracking-tight text-[#0a0a0a]">{t(key)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#525252]">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
