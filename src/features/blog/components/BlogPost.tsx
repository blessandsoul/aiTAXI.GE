'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { BlogPost as BlogPostType } from '../types'
import { Badge } from '@/components/ui/badge'
import { Ico } from '@/components/common/Ico'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { TableOfContents } from './TableOfContents'
import { tagToSlug } from '../lib/slugify'


interface BlogPostProps {
    post: BlogPostType
}

export function BlogPost({ post }: BlogPostProps) {
    const t = useTranslations('blog')

    return (
        <article className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-10 md:py-14">

            {/* Header section */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 md:mb-12 text-center md:text-left"
            >
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-6 flex justify-center md:justify-start">
                    <ol className="flex items-center gap-1.5 text-sm text-[#525252]">
                        <li>
                            <Link href="/" className="flex items-center gap-1 hover:text-neutral-900 transition-colors duration-200">
                                <Ico name="solar:home-bold-duotone" className="w-3.5 h-3.5" />
                                <span className="sr-only">Home</span>
                            </Link>
                        </li>
                        <li><Ico name="solar:alt-arrow-right-bold-duotone" className="w-3.5 h-3.5 text-[#525252]/40" /></li>
                        <li>
                            <Link href="/blog" className="hover:text-neutral-900 transition-colors duration-200">
                                {t('title')}
                            </Link>
                        </li>
                        <li><Ico name="solar:alt-arrow-right-bold-duotone" className="w-3.5 h-3.5 text-[#525252]/40" /></li>
                        <li className="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                            {post.title}
                        </li>
                    </ol>
                </nav>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                    {post.tags.map(tag => (
                        <Link
                            key={tag}
                            href={`/blog/tags/${tagToSlug(tag)}`}
                            className="rounded-full px-3 py-1 text-xs font-medium bg-[#ffc400]/10 text-[#ffc400] border border-[#ffc400]/20 hover:bg-[#ffc400]/20 transition-colors duration-200"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                    <span className="text-neutral-900">{post.title}</span>
                </h1>

                {/* Author + date byline (E-E-A-T: credentialed author + visible publish date) */}
                {(post.author?.name || post.date) && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-[#525252] md:justify-start">
                        {post.author?.name && (
                            <span className="inline-flex items-center gap-1.5 font-medium text-neutral-900">
                                <Ico name="solar:user-bold-duotone" className="h-4 w-4 text-[#ffc400]" />
                                {post.author?.name}{post.author?.role ? `, ${post.author.role}` : ''}
                            </span>
                        )}
                        {post.date && (
                            <time
                                dateTime={new Date(post.date).toISOString().slice(0, 10)}
                                className="inline-flex items-center gap-1.5"
                            >
                                <Ico name="solar:calendar-mark-bold-duotone" className="h-4 w-4 text-[#525252]/50" />
                                {new Date(post.date).toISOString().slice(0, 10)}
                            </time>
                        )}
                    </div>
                )}

            </motion.header>

            {/* Main Cover Image - Contained */}
            <motion.figure
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-12 shadow-2xl border border-[#e5e5e5]"
            >
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                    unoptimized={post.coverImage.startsWith('/api/og')}
                />
                {post.coverCredit && (
                    <figcaption className="absolute bottom-0 right-0 px-3 py-1.5 text-[10px] text-white/70 bg-black/30 backdrop-blur-sm rounded-tl-lg">
                        <a
                            href={post.coverCredit.creditUrl}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            {post.coverCredit.credit}
                        </a>
                        {' / '}
                        <a
                            href={post.coverCredit.sourceUrl}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="hover:text-white transition-colors capitalize"
                        >
                            {post.coverCredit.source}
                        </a>
                    </figcaption>
                )}
            </motion.figure>

            <div className="grid lg:grid-cols-[250px_1fr] gap-0 lg:gap-10 items-start">

                {/* Table of Contents - Sticky Sidebar on Desktop */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="hidden lg:block sticky top-24"
                >
                    <TableOfContents content={post.content} />
                </motion.aside>

                {/* Mobile TOC */}
                <div className="lg:hidden mb-6">
                    <TableOfContents content={post.content} />
                </div>

                {/* Content */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="prose prose-lg max-w-none
                        prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-headings:text-neutral-900
                        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:md:mt-12 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:md:mt-8 prose-h3:mb-3
                        prose-p:leading-relaxed prose-p:text-[#525252] prose-p:mb-5
                        prose-a:text-[#ffc400] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                        prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-[#e5e5e5]
                        prose-li:text-[#525252] prose-li:marker:text-[#ffc400]/40
                        prose-strong:text-neutral-900 prose-strong:font-bold
                        prose-blockquote:border-l-4 prose-blockquote:border-[#ffc400]/40 prose-blockquote:bg-[#ffc400]/5 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic
                        prose-code:text-[#ffc400] prose-code:bg-[#ffc400]/5 prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                        prose-hr:border-[#e5e5e5]
                        [&>*:first-child]:!mt-0
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-16 pt-8 border-t border-[#e5e5e5]"
            >
                <div className="flex flex-wrap items-center gap-2">
                    {post.tags.map(tag => (
                        <Link key={tag} href={`/blog/tags/${tagToSlug(tag)}`}>
                            <Badge variant="secondary" className="cursor-pointer rounded-full hover:bg-secondary/80 transition-colors">#{tag}</Badge>
                        </Link>
                    ))}
                </div>

                <div className="mt-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffc400] hover:gap-3 transition-all duration-200"
                    >
                        ← {t('backToBlog')}
                    </Link>
                </div>
            </motion.footer>
        </article>
    )
}
