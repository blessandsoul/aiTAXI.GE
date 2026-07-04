/**
 * fetch-covers.mjs
 *
 * Fetches cover images for blog posts from Unsplash (primary) and Pexels (fallback).
 * Runs at build time — downloads images to /public/images/blog-covers/{slug}.jpg
 * and writes a mapping file to content/blog/covers.json.
 *
 * Usage:
 *   node scripts/fetch-covers.mjs
 *   npm run fetch-covers
 *
 * Environment variables (in .env.local):
 *   UNSPLASH_ACCESS_KEY — Unsplash API key (https://unsplash.com/developers)
 *   PEXELS_API_KEY      — Pexels API key (https://www.pexels.com/api/)
 *
 * Both are optional — if neither is set, falls back to static covers.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'blog')
const KA_CONTENT_DIR = path.join(CONTENT_DIR, 'ka')
const COVERS_DIR = path.join(ROOT, 'public', 'images', 'blog-covers')
const MAPPING_FILE = path.join(CONTENT_DIR, 'covers.json')

// Load .env.local manually (no dotenv dependency)
function loadEnv() {
    const envPath = path.join(ROOT, '.env.local')
    if (!fs.existsSync(envPath)) return
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue
        const key = trimmed.slice(0, eqIndex).trim()
        const value = trimmed.slice(eqIndex + 1).trim()
        if (!process.env[key]) {
            process.env[key] = value
        }
    }
}

// Georgian tag → English search term mapping
const TAG_MAP = {
    // Programming & Dev
    'პროგრამირება': 'programming',
    'კოდირება': 'coding',
    'ვებ-განვითარება': 'web development',
    'მობილური': 'mobile app',
    'ფრონტენდი': 'frontend',
    'ბექენდი': 'backend',
    'DevOps': 'devops',

    // AI & ML
    'AI ხელსაწყოები': 'AI tools technology',
    'AI დანერგვა': 'AI implementation business',
    'AI სიახლეები': 'artificial intelligence news',
    'AI მარკეტინგი': 'AI marketing digital',
    'ხელოვნური ინტელექტი': 'artificial intelligence',
    'მანქანური სწავლება': 'machine learning',
    'ნეირონული ქსელები': 'neural networks',

    // Business
    'ბიზნესი': 'business technology',
    'სტრატეგია': 'business strategy',
    'მარკეტინგი': 'digital marketing',
    'სტარტაპი': 'startup',
    'ფინანსები': 'finance technology',

    // Reviews & Guides
    'მიმოხილვა': 'technology review',
    'მოდელების მიმოხილვა': 'AI models comparison',
    'გაიდი': 'tutorial guide',

    // Platforms
    'Hugging Face': 'Hugging Face AI',
    'ღია კოდი': 'open source code',

    // Security
    'უსაფრთხოება': 'cybersecurity',
    'კიბერუსაფრთხოება': 'cybersecurity',

    // Other
    'ტექნოლოგიური სიახლეები': 'technology innovation',
    'ინოვაცია': 'innovation technology',
    'მონაცემები': 'data analytics',
    'ღრუბელი': 'cloud computing',
    'ტურიზმი': 'tourism travel',
}

/**
 * Parse frontmatter from MDX file using gray-matter (already a project dependency)
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const matter = require('gray-matter')

function parseFrontmatter(content) {
    try {
        const { data } = matter(content)
        if (!data || Object.keys(data).length === 0) return null
        return data
    } catch {
        return null
    }
}

/**
 * Build a search query from title + tags
 */
function buildSearchQuery(frontmatter) {
    // If coverQuery is explicitly set, use it
    if (frontmatter.coverQuery) {
        return frontmatter.coverQuery
    }

    const parts = []

    // Map tags to English
    const tags = frontmatter.tags || []
    for (const tag of tags.slice(0, 3)) {
        const mapped = TAG_MAP[tag]
        if (mapped) {
            parts.push(mapped)
        } else {
            // If no mapping, use the tag as-is (might be English already)
            parts.push(tag)
        }
    }

    // Combine and deduplicate words
    const words = parts.join(' ').split(/\s+/)
    const unique = [...new Set(words)]

    // Limit to ~5 words for better results
    return unique.slice(0, 5).join(' ')
}

/**
 * Fetch from Unsplash API
 */
async function fetchFromUnsplash(query) {
    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) return null

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`

    try {
        const res = await fetch(url, {
            headers: { Authorization: `Client-ID ${key}` },
        })

        if (!res.ok) {
            console.warn(`  Unsplash API error: ${res.status} ${res.statusText}`)
            return null
        }

        const data = await res.json()
        if (!data.results?.length) return null

        const photo = data.results[0]
        return {
            url: photo.urls.regular, // 1080px wide
            credit: photo.user.name,
            creditUrl: photo.user.links.html,
            source: 'unsplash',
            sourceUrl: photo.links.html,
        }
    } catch (err) {
        console.warn(`  Unsplash fetch error: ${err.message}`)
        return null
    }
}

/**
 * Fetch from Pexels API
 */
async function fetchFromPexels(query) {
    const key = process.env.PEXELS_API_KEY
    if (!key) return null

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`

    try {
        const res = await fetch(url, {
            headers: { Authorization: key },
        })

        if (!res.ok) {
            console.warn(`  Pexels API error: ${res.status} ${res.statusText}`)
            return null
        }

        const data = await res.json()
        if (!data.photos?.length) return null

        const photo = data.photos[0]
        return {
            url: photo.src.large2x, // 940px wide
            credit: photo.photographer,
            creditUrl: photo.photographer_url,
            source: 'pexels',
            sourceUrl: photo.url,
        }
    } catch (err) {
        console.warn(`  Pexels fetch error: ${err.message}`)
        return null
    }
}

/**
 * Download image to disk
 */
async function downloadImage(imageUrl, destPath) {
    const res = await fetch(imageUrl)
    if (!res.ok) throw new Error(`Download failed: ${res.status}`)

    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(destPath, buffer)
    return buffer.length
}

/**
 * Main
 */
async function main() {
    loadEnv()

    const hasUnsplash = !!process.env.UNSPLASH_ACCESS_KEY
    const hasPexels = !!process.env.PEXELS_API_KEY

    console.log('\n📸 Blog Cover Fetcher')
    console.log('─'.repeat(40))
    console.log(`  Unsplash: ${hasUnsplash ? '✅ configured' : '⚠️  no UNSPLASH_ACCESS_KEY'}`)
    console.log(`  Pexels:   ${hasPexels ? '✅ configured' : '⚠️  no PEXELS_API_KEY'}`)

    if (!hasUnsplash && !hasPexels) {
        console.log('\n  No API keys configured. Skipping cover fetch.')
        console.log('  Add UNSPLASH_ACCESS_KEY and/or PEXELS_API_KEY to .env.local')
        console.log('  Static fallback covers will be used.\n')
        return
    }

    // Ensure output directory exists
    fs.mkdirSync(COVERS_DIR, { recursive: true })

    // Read existing mapping
    let mapping = {}
    if (fs.existsSync(MAPPING_FILE)) {
        try {
            mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'))
        } catch {
            mapping = {}
        }
    }

    // Get all MDX files
    if (!fs.existsSync(CONTENT_DIR)) {
        console.log('\n  No content/blog directory found. Nothing to do.\n')
        return
    }

    // Scan ka/ + en/ subdirectories (covers are shared across locales; ka wins on
    // duplicate slugs, en/ catches EN-only articles that have no ka twin yet)
    const EN_CONTENT_DIR = path.join(CONTENT_DIR, 'en')
    const seen = new Set()
    const entries = []
    for (const dir of [KA_CONTENT_DIR, EN_CONTENT_DIR, CONTENT_DIR]) {
        if (!fs.existsSync(dir) || (dir === CONTENT_DIR && entries.length)) continue
        for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))) {
            const slug = f.replace(/\.mdx$/, '')
            if (seen.has(slug)) continue
            seen.add(slug)
            entries.push({ file: f, dir })
        }
    }

    console.log(`\n  Found ${entries.length} blog posts\n`)

    let fetched = 0
    let skipped = 0
    let failed = 0

    for (const { file, dir: scanDir } of entries) {
        const slug = file.replace(/\.mdx$/, '')
        const destPath = path.join(COVERS_DIR, `${slug}.jpg`)

        // Skip if already downloaded (unless --force flag)
        if (fs.existsSync(destPath) && !process.argv.includes('--force')) {
            console.log(`  ⏭️  ${slug} — already has cover`)
            skipped++
            continue
        }

        // Read frontmatter
        const content = fs.readFileSync(path.join(scanDir, file), 'utf8')
        const frontmatter = parseFrontmatter(content)

        if (!frontmatter) {
            console.log(`  ⚠️  ${slug} — no frontmatter, skipping`)
            failed++
            continue
        }

        // If coverImage is already set to a custom path (not a default), skip
        if (frontmatter.coverImage && !frontmatter.coverImage.startsWith('/images/blog-covers/')) {
            console.log(`  ⏭️  ${slug} — has custom coverImage`)
            skipped++
            continue
        }

        const query = buildSearchQuery(frontmatter)
        console.log(`  🔍 ${slug}`)
        console.log(`     Query: "${query}"`)

        // Try Unsplash first, then Pexels
        let result = await fetchFromUnsplash(query)
        if (!result) {
            result = await fetchFromPexels(query)
        }

        if (!result) {
            console.log(`     ❌ No results found`)
            failed++
            continue
        }

        // Download
        try {
            const bytes = await downloadImage(result.url, destPath)
            const kb = Math.round(bytes / 1024)
            console.log(`     ✅ Downloaded (${kb}KB) from ${result.source}`)
            console.log(`     📷 Credit: ${result.credit}`)

            // Update mapping
            mapping[slug] = {
                path: `/images/blog-covers/${slug}.jpg`,
                credit: result.credit,
                creditUrl: result.creditUrl,
                source: result.source,
                sourceUrl: result.sourceUrl,
                query,
                fetchedAt: new Date().toISOString(),
            }

            fetched++
        } catch (err) {
            console.log(`     ❌ Download failed: ${err.message}`)
            failed++
        }

        // Rate limiting: small delay between requests
        await new Promise(r => setTimeout(r, 300))
    }

    // Save mapping
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf8')

    console.log('\n' + '─'.repeat(40))
    console.log(`  ✅ Fetched: ${fetched}`)
    console.log(`  ⏭️  Skipped: ${skipped}`)
    console.log(`  ❌ Failed:  ${failed}`)
    console.log(`  📄 Mapping: content/blog/covers.json\n`)
}

main().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
})
