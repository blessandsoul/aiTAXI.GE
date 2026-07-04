'use client'

import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { BlogPost } from '../types'
import { useTranslations } from 'next-intl'

interface RelatedPostsProps {
    posts: BlogPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    const t = useTranslations('blog')

    if (!posts.length) return null

    return (
        <aside className="mt-16 pt-10 border-t border-[#e5e5e5]" aria-label="Related articles">
            <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900 mb-6">
                {t('relatedPosts')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-3 p-3 rounded-xl border border-[#e5e5e5] bg-white hover:bg-[#fafafa] hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="80px"
                            />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-[#ffc400] transition-colors duration-200">
                                {post.title}
                            </h3>
                            <time dateTime={post.date} className="text-xs text-[#525252]/60 mt-1">
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </time>
                        </div>
                    </Link>
                ))}
            </div>
        </aside>
    )
}
