import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "seo.notFound" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "seo.notFound" });
  const homePath = locale === "ka" ? "/" : `/${locale}`;

  return (
    <div className="py-32">
      <SectionContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-7xl font-extrabold tracking-tight text-[#ffc400]">404</p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 md:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-lg text-[#525252]">{t("body")}</p>
          <div className="mt-10">
            <Button asChild className="rounded-full bg-linear-to-r from-[#ffc400] to-[#ff8f00] text-white transition hover:brightness-110">
              <Link href={homePath}>← {t("backHome")}</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
