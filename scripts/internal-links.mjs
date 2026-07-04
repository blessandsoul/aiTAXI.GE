#!/usr/bin/env node
// Inject "Related Reading" section into posts with <5 inline /blog/ links.
// Picks 8 related posts by tag-overlap score within same locale.
// Inserts before <h2 id="faq"> if present, else at end of body.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const APPLY = process.argv.includes('--apply');
const LOCALES = ['en', 'ru', 'ka'];
const MIN_LINKS = 5;
const RELATED_COUNT = 8;
const RELATED_HEADINGS = {
    en: 'Related Reading',
    ru: 'Похожее',
    ka: 'დაკავშირებული სტატიები',
};

function readAllPosts(loc) {
    const dir = `content/blog/${loc}`;
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(x => x.endsWith('.mdx')).map(f => {
        const fp = path.join(dir, f);
        const raw = fs.readFileSync(fp, 'utf8');
        const { data, content } = matter(raw);
        const slug = f.replace(/\.mdx$/, '');
        return { slug, title: data.title || '', tags: data.tags || [], raw, content, fp };
    });
}

function countInternalLinks(content) {
    const matches = content.match(/href=["']\/(?:[a-z]{2}\/)?blog\/[^"']+["']/g) || [];
    return matches.length;
}

function tagOverlap(a, b) {
    const setA = new Set((a.tags || []).map(t => String(t).toLowerCase()));
    let n = 0;
    for (const t of (b.tags || [])) {
        if (setA.has(String(t).toLowerCase())) n++;
    }
    return n;
}

let changed = 0, skipped = 0;

for (const loc of LOCALES) {
    const all = readAllPosts(loc);
    if (all.length === 0) continue;

    for (const post of all) {
        const linkCount = countInternalLinks(post.content);
        if (linkCount >= MIN_LINKS) { skipped++; continue; }
        // Already has "Related Reading" section — skip
        if (/<h2[^>]*id=["']related[^"']*["']|<h2[^>]*>\s*(?:Related Reading|Похожее|დაკავშირებული)/i.test(post.content)) {
            skipped++;
            continue;
        }

        // Find related: highest tag overlap, then most recent
        const related = all
            .filter(p => p.slug !== post.slug)
            .map(p => ({ p, score: tagOverlap(post, p) }))
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, RELATED_COUNT)
            .map(x => x.p);

        if (related.length === 0) { skipped++; continue; }

        const heading = RELATED_HEADINGS[loc];
        let block = `\n\n<h2 id="related-reading">${heading}</h2>\n\n<ul>\n`;
        for (const r of related) {
            block += `  <li><a href="/blog/${r.slug}">${r.title}</a></li>\n`;
        }
        block += '</ul>\n';

        // Insert before <h2 id="faq"> if present, else append at end
        let newContent;
        const faqIdx = post.content.search(/<h2[^>]*id=["']faq["']/i);
        if (faqIdx > 0) {
            newContent = post.content.slice(0, faqIdx) + block + '\n' + post.content.slice(faqIdx);
        } else {
            newContent = post.content + block;
        }

        // Rebuild file: preserve frontmatter raw
        const fmEnd = post.raw.indexOf('\n---\n', 3) + '\n---\n'.length;
        const newRaw = post.raw.slice(0, fmEnd) + newContent;

        if (APPLY) fs.writeFileSync(post.fp, newRaw, 'utf8');
        console.log(`${loc}/${post.slug}.mdx — had ${linkCount} links, added ${related.length}`);
        changed++;
    }
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — changed ${changed} / skipped ${skipped}`);
