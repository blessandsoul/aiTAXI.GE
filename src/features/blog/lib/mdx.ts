import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { BlogPost } from '../types'

const blogRoot = path.join(process.cwd(), 'content/blog')

// Configure marked: GFM features + leave existing HTML blocks/tags intact.
marked.setOptions({
    gfm: true,
    breaks: false,
})

function renderMarkdown(raw: string): string {
    // marked.parse is synchronous when no async extensions are loaded.
    const html = marked.parse(raw) as string
    // Strip any JSON-LD <script> authored inside the MDX body. Blog structured data
    // (Article + FAQPage + BreadcrumbList) is emitted ONCE, typed, from blog/[slug]/page.tsx.
    // A raw copy left in the rendered HTML produced a DUPLICATE FAQPage that Semrush flagged
    // as a structured-data markup error.
    return html.replace(
        /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
        '',
    )
}

function getLocaleDir(locale: string): string {
    return path.join(blogRoot, locale)
}

export function getPostSlugs(locale: string = 'ka'): string[] {
    const dir = getLocaleDir(locale)
    if (!fs.existsSync(dir)) {
        return []
    }
    return fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
}

export function getPostBySlug(slug: string, locale: string = 'ka', fields: string[] = []): Partial<BlogPost> {
    const realSlug = slug.replace(/\.mdx$/, '')
    const fullPath = path.join(getLocaleDir(locale), `${realSlug}.mdx`)

    if (!fs.existsSync(fullPath)) {
        return {}
    }

    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        const items: Record<string, unknown> = {}

        // Ensure only the minimal needed data is exposed
        fields.forEach((field) => {
            if (field === 'slug') {
                items[field] = realSlug
            }
            if (field === 'id') {
                items[field] = realSlug
            }
            if (field === 'content') {
                items[field] = renderMarkdown(content)
            }

            if (typeof data[field] !== 'undefined') {
                items[field] = data[field]
            }
        })

        items.locale = locale

        return items as Partial<BlogPost>
    } catch (e) {
        console.error(`Error reading file ${fullPath}`, e)
        return {}
    }
}

export function getAllPosts(locale: string = 'ka', fields: string[] = []): Partial<BlogPost>[] {
    const slugs = getPostSlugs(locale)
    const posts = slugs
        .map((slug) => getPostBySlug(slug, locale, fields))
        .filter((post) => post.slug || post.id)
        // sort posts by date in descending order
        .sort((post1, post2) => (post1.date! > post2.date! ? -1 : 1))
    return posts
}
