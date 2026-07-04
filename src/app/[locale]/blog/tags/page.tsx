import { getAllTags } from '@/features/blog/lib/api'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = 'https://aitaxi.ge'
const LOCALES = ['ka', 'en', 'ru'] as const

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'blog' })

    const title = `Tags, ${t('title')} | aiNOW`
    const description =
        locale === 'ka'
            ? 'ყველა თემა: AI მარკეტინგი, ჩათბოტი, ავტომატიზაცია, გაყიდვების ზრდა და სხვა.'
            : locale === 'ru'
                ? 'Все темы: ИИ маркетинг, чат-бот, автоматизация, рост продаж и другое.'
                : 'All topics: AI marketing, chatbot, automation, sales growth and more.'

    const url =
        locale === 'ka'
            ? `${BASE_URL}/blog/tags`
            : `${BASE_URL}/${locale}/blog/tags`

    return {
        title,
        description,
        alternates: {
            canonical: url,
            languages: {
                ...Object.fromEntries(
                    LOCALES.map((loc) => [
                        loc,
                        loc === 'ka' ? `${BASE_URL}/blog/tags` : `${BASE_URL}/${loc}/blog/tags`,
                    ]),
                ),
                'x-default': `${BASE_URL}/blog/tags`,
            },
        },
        openGraph: { title, description, url, siteName: 'aiNOW', type: 'website' },
        twitter: { card: 'summary', title, description },
        // Thin aggregation page, crawlable for discovery, kept out of the index.
        robots: { index: false, follow: true },
    }
}

export default async function TagsIndexPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const tags = await getAllTags(locale)
    const t = await getTranslations({ locale, namespace: 'blog' })

    const tagsBase = locale === 'ka' ? '/blog/tags' : `/${locale}/blog/tags`

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20">
            <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
                <h1 className="font-display text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl text-neutral-900 pb-1">
                    Tags
                </h1>
                <p className="text-xl text-[#525252]">
                    {t('subtitle')}
                </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
                {tags.map(({ tag, slug, count }) => {
                    // Scale font-size by count (min 0.9rem, max 1.6rem)
                    const maxCount = tags[0]?.count ?? 1
                    const scale = 0.9 + (count / maxCount) * 0.7
                    return (
                        <Link
                            key={slug}
                            href={`${tagsBase}/${slug}`}
                            className="rounded-full px-4 py-2 bg-white text-neutral-900 border border-[#e5e5e5] hover:border-[#ffc400] hover:bg-[#ffc400]/10 transition-all duration-200"
                            style={{ fontSize: `${scale}rem` }}
                        >
                            {tag}
                            <span className="ml-2 text-[#525252] text-sm">({count})</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
