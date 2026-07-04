import { getPosts, getAllTags } from '@/features/blog/lib/api'
import { BlogList } from '@/features/blog/components/BlogList'
import { Pagination } from '@/features/blog/components/Pagination'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

const PAGE_SIZE = 24

type SearchParams = Promise<{ page?: string }>

function parsePage(raw: string | undefined): number {
    const n = Number.parseInt(raw ?? '1', 10)
    return Number.isNaN(n) || n < 1 ? 1 : n
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: SearchParams }): Promise<Metadata> {
    const { locale } = await params
    const { page: rawPage } = await searchParams
    const page = parsePage(rawPage)
    const t = await getTranslations({ locale, namespace: 'seo.blog' })

    const path = '/blog'
    const base = locale === 'ka' ? `https://aitaxi.ge${path}` : `https://aitaxi.ge/${locale}${path}`
    const suffix = page > 1 ? `?page=${page}` : ''

    return {
        title: page > 1 ? `${t('title')}, ${page}` : t('title'),
        description: t('description'),
        alternates: {
            canonical: `${base}${suffix}`,
            // hreflang only on the first page, paginated pages self-canonicalize per locale
            ...(page === 1
                ? {
                      languages: {
                          ka: `https://aitaxi.ge${path}`,
                          en: `https://aitaxi.ge/en${path}`,
                          ru: `https://aitaxi.ge/ru${path}`,
                          'x-default': `https://aitaxi.ge${path}`,
                      },
                  }
                : {}),
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
    }
}

export default async function BlogPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: SearchParams }) {
    const { locale } = await params
    const { page: rawPage } = await searchParams
    const t = await getTranslations({ locale, namespace: 'blog' })
    let posts = await getPosts(locale)
    const isFallback = posts.length === 0 && locale !== 'ka'
    if (isFallback) posts = await getPosts('ka')

    const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
    const page = Math.min(parsePage(rawPage), totalPages)
    const pagePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const topTags = (await getAllTags(isFallback ? 'ka' : locale)).slice(0, 24)

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                <h1 className="font-display text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl text-neutral-900 pb-1">
                    {t('title')}
                </h1>
                <p className="text-xl text-[#525252]">
                    {t('subtitle')}
                </p>
            </div>

            {isFallback && (
                <div className="max-w-3xl mx-auto mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                    {t('fallbackNotice')}
                </div>
            )}

            <section aria-labelledby="blog-latest">
                <h2 id="blog-latest" className="mb-8 font-display text-2xl font-bold tracking-tight text-neutral-900">
                    {t('latestHeading')}
                </h2>
                <BlogList posts={pagePosts} topTags={topTags} />
            </section>

            <Pagination
                page={page}
                totalPages={totalPages}
                prevLabel={t('prevPage')}
                nextLabel={t('nextPage')}
            />
        </div>
    )
}
