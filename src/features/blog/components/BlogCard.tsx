'use client'

import { Link, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { BlogPost } from '../types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { tagToSlug } from '../lib/slugify'

interface BlogCardProps {
    post: BlogPost
    className?: string
    index?: number
}

export function BlogCard({ post, className, index = 0 }: BlogCardProps) {
    const t = useTranslations('blog')
    const router = useRouter()
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1]
            }}
        >
            <Link
                href={`/blog/${post.slug}`}
                className={cn(
                    "group relative flex flex-col h-full cursor-pointer rounded-2xl",
                    "border border-[#e5e5e5] bg-white",
                    "shadow-sm hover:shadow-xl hover:shadow-[#ffc400]/10",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-1 hover:border-[#ffc400]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc400]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    "overflow-hidden",
                    className
                )}
            >
                {/* Cover Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={post.coverImage.startsWith('/api/og')}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push(`/blog/tags/${tagToSlug(tag)}`)
                                }}
                                className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-md border border-white/10 hover:bg-white/25 transition-colors duration-200 cursor-pointer"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>


                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-display text-base font-bold leading-snug tracking-tight text-neutral-900 mb-1.5 line-clamp-2 transition-colors duration-200 group-hover:text-[#ffc400]">
                        {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#525252]">
                        {post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + '… ' : post.excerpt + ' '}
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#ffc400] whitespace-nowrap transition-all duration-200 group-hover:gap-1.5">
                            {t('readMore')} <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </span>
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
