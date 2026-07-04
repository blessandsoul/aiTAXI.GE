import fs from 'fs'
import path from 'path'
import { getPostWithFallback, getRelatedPosts, getAvailableLocales } from '@/features/blog/lib/api'
import { BlogPost } from '@/features/blog/components/BlogPost'
import { RelatedPosts } from '@/features/blog/components/RelatedPosts'
import { ServiceCrossLink } from '@/features/blog/components/ServiceCrossLink'
import { ReadingProgress } from '@/features/blog/components/ReadingProgress'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { INDEXED_LOCALES } from '@/i18n/seo-locales'

const BASE_URL = 'https://aitaxi.ge'

// Keep the <title> within ~60 chars INCLUDING the "%s | aiNOW" template suffix (8 chars) the root
// layout appends, so Semrush stops flagging long titles. og:title / twitter keep the full title.
function clampTitle(title: string, max = 52): string {
    if (title.length <= max) return title
    const cut = title.slice(0, max)
    const lastSpace = cut.lastIndexOf(' ')
    const clipped = lastSpace > 20 ? cut.slice(0, lastSpace) : cut
    // strip a trailing separator so a clamp never leaves a dangling comma / colon / dash
    return clipped.replace(/[\s.,:;!?·–—-]+$/u, '')
}

// Keep the meta description within Google's ~160 char display window; a clamp ends on a word
// boundary with an ellipsis. og:description / twitter keep the full excerpt.
function clampDescription(text: string, max = 160): string {
    if (text.length <= max) return text
    const cut = text.slice(0, max - 3)
    const lastSpace = cut.lastIndexOf(' ')
    const body = (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,:;!?·–—-]+$/u, '')
    return body + '...'
}

// Static generation, MDX content is build-time. New posts require rebuild OR rely on ISR fallback.
export const dynamicParams = true

export async function generateStaticParams() {
    // Pre-render every indexed locale (single source of truth = seo-locales.ts). Non-indexed
    // locales still render on demand via dynamicParams=true.
    const locales = INDEXED_LOCALES
    const params: { locale: string; slug: string }[] = []
    for (const locale of locales) {
        const dir = path.join(process.cwd(), 'content', 'blog', locale)
        if (!fs.existsSync(dir)) continue
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
        for (const file of files) {
            params.push({ locale, slug: file.replace(/\.mdx$/, '') })
        }
    }
    return params
}

// Generate full SEO metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params
    const result = await getPostWithFallback(slug, locale)

    if (!result) {
        return { title: 'Post Not Found' }
    }

    const { post, isFallback } = result
    const availableLocales = getAvailableLocales(slug)

    const currentUrl = locale === 'ka'
        ? `${BASE_URL}/blog/${slug}`
        : `${BASE_URL}/${locale}/blog/${slug}`

    // Fix duplicate content: if fallback, canonical points to original (ka) version.
    // This tells Google the current URL is NOT the master, consolidates ranking signals.
    const kaUrl = `${BASE_URL}/blog/${slug}`
    const canonical = isFallback ? kaUrl : currentUrl

    // OG share image: a generated branded card (/api/og) instead of a fetched stock
    // photo. Matches the service OG cards, and draws from the post title, date, and tags.
    const ogDate = (() => {
        if (!post.date) return ''
        const d = new Date(post.date as unknown as string)
        return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
    })()
    const ogParams = new URLSearchParams({ title: post.title })
    if (ogDate) ogParams.set('date', ogDate)
    if (post.tags?.length) ogParams.set('tags', post.tags.slice(0, 4).join(','))
    const ogImage = `${BASE_URL}/api/og?${ogParams.toString()}`

    const languages: Record<string, string> = {}
    for (const loc of availableLocales) {
        languages[loc] = loc === 'ka'
            ? `${BASE_URL}/blog/${slug}`
            : `${BASE_URL}/${loc}/blog/${slug}`
    }
    // x-default points to Georgian (primary market)
    if (availableLocales.includes('ka')) {
        languages['x-default'] = kaUrl
    }

    return {
        title: clampTitle(post.title),
        description: clampDescription(post.excerpt),
        alternates: {
            canonical,
            languages,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: currentUrl,
            siteName: 'aiNOW',
            images: [{
                url: ogImage,
                width: 1200,
                height: 630,
                alt: post.title,
            }],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author.name],
            tags: post.tags || [],
            locale: locale === 'ka' ? 'ka_GE' : locale === 'ru' ? 'ru_RU' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [ogImage],
        },
        robots: {
            // Fallback pages show duplicate content, let canonical consolidate signals
            // but keep indexable so they're discoverable via the language switcher.
            index: !isFallback,
            follow: true,
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const result = await getPostWithFallback(slug, locale)

    if (!result) {
        notFound()
    }

    const { post, isFallback } = result
    const relatedPosts = await getRelatedPosts(slug, locale, 3)
    const t = await getTranslations({ locale, namespace: 'blog' })

    // Article JSON-LD
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: post.locale || locale,
        author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
            url: `${BASE_URL}/about`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'aiNOW',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${slug}`,
        },
        keywords: (post.tags || []).join(', '),
        wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
        articleSection: (post.tags || [])[0],
    }

    // FAQPage JSON-LD, extract from article content
    const faqRegex = /<h3[^>]*id="faq-\d+"[^>]*>([^<]+)<\/h3>\s*<p>([^<]+(?:<[^/][^>]*>[^<]*<\/[^>]+>)*[^<]*)<\/p>/g
    const faqItems: { question: string; answer: string }[] = []
    let faqMatch
    while ((faqMatch = faqRegex.exec(post.content)) !== null) {
        faqItems.push({
            question: faqMatch[1].trim(),
            answer: faqMatch[2].replace(/<[^>]*>/g, '').trim(),
        })
    }

    const faqJsonLd = faqItems.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    } : null

    // BreadcrumbList JSON-LD
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title },
        ],
    }

    return (
        <>
            <ReadingProgress />
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            {isFallback && (
                <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 pt-8">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                        {t('fallbackNotice')}
                    </div>
                </div>
            )}
            <BlogPost post={post} />
            <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 pb-20">
                <ServiceCrossLink tags={post.tags || []} locale={locale} />
                <RelatedPosts posts={relatedPosts} />
            </div>
        </>
    )
}
