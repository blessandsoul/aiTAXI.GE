import { getTagBySlug, getAllTags } from '@/features/blog/lib/api'
import { BlogCard } from '@/features/blog/components/BlogCard'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import Link from 'next/link'

const BASE_URL = 'https://aitaxi.ge'
const LOCALES = ['ka', 'en', 'ru'] as const

export async function generateStaticParams() {
    const params: { locale: string; tag: string }[] = []
    for (const locale of LOCALES) {
        const tags = await getAllTags(locale)
        for (const { slug } of tags) {
            params.push({ locale, tag: slug })
        }
    }
    return params
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ tag: string; locale: string }>
}): Promise<Metadata> {
    const { tag, locale } = await params
    const result = await getTagBySlug(tag, locale)
    if (!result) return { title: 'Tag Not Found' }

    const { tag: tagName, posts } = result
    const t = await getTranslations({ locale, namespace: 'blog' })

    const title = `${tagName}, ${t('title')} | aiTAXI`
    const description =
        locale === 'ka'
            ? `${posts.length} სტატია თემაზე "${tagName}". რობოტაქსი, ავტონომიური ტაქსი და ფლოტის მართვა.`
            : locale === 'ru'
                ? `${posts.length} статей по теме "${tagName}". Роботакси, беспилотное такси и управление автопарком.`
                : `${posts.length} articles about "${tagName}". Robotaxi technology, autonomous taxis, and fleet operations.`

    const url =
        locale === 'ka'
            ? `${BASE_URL}/blog/tags/${tag}`
            : `${BASE_URL}/${locale}/blog/tags/${tag}`

    // IMPORTANT: tag slugs are locale-specific (ai-marketingi ≠ ai-marketing ≠ ии-маркетинг).
    // So cross-locale hreflang would point to 404s, omit languages entirely.
    // Only self-reference canonical; Google will treat each locale tag page as independent.
    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'aiTAXI',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        // Tag pages are thin aggregation pages, keep crawlable for link discovery
        // but out of the index to avoid "crawled, not indexed" noise.
        robots: { index: false, follow: true },
    }
}

export default async function TagPage({
    params,
}: {
    params: Promise<{ tag: string; locale: string }>
}) {
    const { tag, locale } = await params
    const result = await getTagBySlug(tag, locale)
    // Tag slugs are locale-specific and churn as articles regenerate.
    // Stale / cross-locale slugs 308-redirect to the tag index instead of 404.
    if (!result) permanentRedirect(locale === 'ka' ? '/blog/tags' : `/${locale}/blog/tags`)

    const { tag: tagName, posts } = result
    const t = await getTranslations({ locale, namespace: 'blog' })

    const blogHref = locale === 'ka' ? '/blog' : `/${locale}/blog`
    const tagsHref = locale === 'ka' ? '/blog/tags' : `/${locale}/blog/tags`
    const contactHref = locale === 'ka' ? '/contact' : `/${locale}/contact`
    const homeHref = locale === 'ka' ? '/' : `/${locale}`

    // Contextual CTA text based on tag and locale
    const ctaTitle =
        locale === 'ka'
            ? `ამზადებთ თქვენს ტაქსოპარკს "${tagName}"-სთვის?`
            : locale === 'ru'
                ? `Готовите свой таксопарк к теме "${tagName}"?`
                : `Preparing your taxi fleet for "${tagName}"?`
    const ctaSubtitle =
        locale === 'ka'
            ? 'aiTAXI არის რობოტაქსის ფლოტის მართვის პლატფორმა aiNOW-სგან. ადრეული წვდომა ღიაა.'
            : locale === 'ru'
                ? 'aiTAXI, платформа управления роботакси от aiNOW. Открыт ранний доступ.'
                : 'aiTAXI is a robotaxi fleet management platform by aiNOW. Early access is open.'
    const ctaButton =
        locale === 'ka'
            ? 'მოითხოვე ადრეული წვდომა'
            : locale === 'ru'
                ? 'Запросить ранний доступ'
                : 'Request early access'
    const ctaSecondary =
        locale === 'ka' ? 'მთავარი' : locale === 'ru' ? 'Главная' : 'Home'

    // CollectionPage JSON-LD for AI Overviews / SEO
    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: tagName,
        description: `Articles tagged with "${tagName}"`,
        url:
            locale === 'ka'
                ? `${BASE_URL}/blog/tags/${tag}`
                : `${BASE_URL}/${locale}/blog/tags/${tag}`,
        inLanguage: locale,
        isPartOf: {
            '@type': 'WebSite',
            name: 'aiNOW',
            url: BASE_URL,
        },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: posts.length,
            itemListElement: posts.map((p, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url:
                    locale === 'ka'
                        ? `${BASE_URL}/blog/${p.slug}`
                        : `${BASE_URL}/${locale}/blog/${p.slug}`,
                name: p.title,
            })),
        },
    }

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}${blogHref}` },
            { '@type': 'ListItem', position: 3, name: 'Tags', item: `${BASE_URL}${tagsHref}` },
            { '@type': 'ListItem', position: 4, name: tagName },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20">
                {/* Breadcrumb */}
                <nav className="text-sm text-[#525252] mb-6 flex gap-2 justify-center">
                    <Link href={blogHref} className="hover:text-neutral-900">
                        {t('title')}
                    </Link>
                    <span>/</span>
                    <Link href={tagsHref} className="hover:text-neutral-900">
                        Tags
                    </Link>
                    <span>/</span>
                    <span className="text-neutral-900">{tagName}</span>
                </nav>

                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="font-display text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl text-neutral-900 pb-1">
                        {tagName}
                    </h1>
                    <p className="text-xl text-[#525252]">
                        {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-[#525252]">{t('noPostsForTag')}</p>
                    </div>
                )}

                {/* Conversion CTA, turns tag-page traffic into leads */}
                <div className="mt-20 max-w-4xl mx-auto rounded-2xl border border-[#ffc400]/20 bg-[#ffc400]/5 p-8 md:p-12 text-center">
                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-3">{ctaTitle}</h2>
                    <p className="text-[#525252] mb-6 max-w-2xl mx-auto">{ctaSubtitle}</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href={contactHref}
                            className="rounded-full px-6 py-3 bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-colors"
                        >
                            {ctaButton}
                        </Link>
                        <Link
                            href={homeHref}
                            className="rounded-full px-6 py-3 border border-[#e5e5e5] bg-white text-neutral-900 font-semibold hover:border-[#ffc400]/40 transition-colors"
                        >
                            {ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
