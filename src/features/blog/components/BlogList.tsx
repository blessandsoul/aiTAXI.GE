import { getTranslations } from 'next-intl/server'
import { BlogPost } from '../types'
import { BlogCard } from './BlogCard'
import { Link } from '@/i18n/navigation'

interface BlogListProps {
    posts: BlogPost[]
    /** Tag cloud computed server-side from the FULL post set (not just the current page). */
    topTags?: { tag: string; slug: string }[]
}

// Server component: the old client-side tag filter forced the full 165-post payload
// onto one page. Tags now link to the dedicated /blog/tags/[slug] pages, and the
// grid renders only the posts the server passed in (paginated upstream).
export async function BlogList({ posts, topTags = [] }: BlogListProps) {
    const t = await getTranslations('blog')

    return (
        <div>
            {/* Posts grid, articles first */}
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

            {/* Tag links, below articles */}
            {topTags.length > 0 && (
                <section aria-labelledby="blog-topics" className="mt-14">
                    <h2 id="blog-topics" className="mb-4 text-center font-display text-xl font-bold tracking-tight text-neutral-900">
                        {t('topicsHeading')}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {topTags.map(({ tag, slug }) => (
                            <Link
                                key={slug}
                                href={`/blog/tags/${slug}` as never}
                                className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border bg-white text-[#525252] border-[#e5e5e5] hover:border-[#ffc400] hover:text-neutral-900"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* All tags link for SEO */}
            <div className="text-center">
                <Link
                    href={'/blog/tags' as never}
                    className="text-sm text-[#525252] hover:text-neutral-900 transition-colors underline-offset-4 hover:underline"
                >
                    {t('viewAllTags') || 'View all tags →'}
                </Link>
            </div>
        </div>
    )
}
