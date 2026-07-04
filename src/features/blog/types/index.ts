export interface Author {
    name: string
    avatar?: string
    role?: string
}

export interface CoverCredit {
    credit: string
    creditUrl: string
    source: 'unsplash' | 'pexels'
    sourceUrl: string
}

export interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string // HTML or Markdown
    coverImage: string
    coverCredit?: CoverCredit
    coverQuery?: string // English search query for auto-fetching cover photos
    date: string // ISO date string
    readTime: string
    author: Author
    tags: string[]
    locale?: string // 'ka' | 'en' | 'ru'
}
