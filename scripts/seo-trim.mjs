#!/usr/bin/env node
// SEO trim — bulk normalize blog title (≤60) + excerpt (≤155) + scalar style `"..."` quoted.
// Conservative: keeps first clause / first sentence. Quotes safely. Re-runnable (idempotent on clean files).
//
// Usage:
//   node scripts/seo-trim.mjs --dry-run
//   node scripts/seo-trim.mjs --apply
//   node scripts/seo-trim.mjs --apply --locale en
//   node scripts/seo-trim.mjs --apply --files content/blog/en/foo.mdx,content/blog/en/bar.mdx

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const TITLE_MAX = 60;
const EXCERPT_MAX = 155;
const LOCALES = ['en', 'ru', 'ka'];
const ROOT = process.cwd();

// Bad words to strip from end of title (truncated mid-thought feels)
const BAD_TAIL = /\s+(?:and|or|but|with|without|for|by|on|in|to|the|an|a|of|its|their|how|to fix|that|as|is|are|—|–|-|\(|\bAnd|\bOr|\bBut|\bWith|\bWithout|\bFor|\bBy|\bOn|\bIn|\bTo|\bThe|\bAn|\bA|\bOf|\bIts|\bTheir|\bHow|\bTo Fix|\bThat|\bAs|\bIs|\bAre)$/i;
const STRAY_PUNCT_TAIL = /[\s—–\-,;:|(\[{«"„'`]+$/;

function stripBadTail(text) {
    let prev;
    do {
        prev = text;
        text = text.replace(STRAY_PUNCT_TAIL, '');
        text = text.replace(BAD_TAIL, '');
        text = text.replace(STRAY_PUNCT_TAIL, '');
    } while (text !== prev && text.length > 10);
    return text;
}

function trimAtBoundary(text, max) {
    if (text.length <= max) return text.trim();
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(' ');
    if (lastSpace > max * 0.5) return stripBadTail(slice.slice(0, lastSpace).trim());
    return stripBadTail(text.slice(0, max).trim());
}

// Year/number/keyword markers — if present in a half, that half is more SEO-valuable
const HIGH_VALUE_MARKERS = /\b(20\d{2}|\d+(K|M|B|GEL|USD|%|×|x)|vs\.?|#1|how to|why|guide)\b/i;

function scoreCandidate(s) {
    // Score by length + keyword presence
    let score = s.length;
    if (HIGH_VALUE_MARKERS.test(s)) score += 25;
    // Penalize candidate that starts with article only
    if (/^(?:the|an|a)\s+/i.test(s)) score -= 5;
    return score;
}

function smartTrimTitle(title) {
    if (!title || title.length <= TITLE_MAX) return title;

    const candidates = [];

    // Em-dash / pipe pattern — almost always "Primary Topic — Detail/Tagline". Prefer BEFORE.
    for (const sep of [' — ', ' – ', ' | ']) {
        const idx = title.indexOf(sep);
        if (idx > 0) {
            const before = title.slice(0, idx).trim();
            const after = title.slice(idx + sep.length).trim();
            // Strong preference: before
            if (before.length >= 25 && before.length <= TITLE_MAX) candidates.push({ s: before, weight: 1.2 });
            // Weak: after-em-dash
            if (after.length >= 30 && after.length <= TITLE_MAX) candidates.push({ s: after, weight: 0.9 });
        }
    }

    // Colon pattern — varies. Both halves are candidates with equal weight.
    const colonIdx = title.indexOf(': ');
    if (colonIdx > 0) {
        const before = title.slice(0, colonIdx).trim();
        const after = title.slice(colonIdx + 2).trim();
        if (before.length >= 30 && before.length <= TITLE_MAX) candidates.push({ s: before, weight: 1.0 });
        if (after.length >= 30 && after.length <= TITLE_MAX) candidates.push({ s: after, weight: 1.0 });
        // Merged: short topic + truncated detail
        if (before.length >= 8 && before.length < 30) {
            const remaining = TITLE_MAX - before.length - 2;
            if (remaining >= 25) {
                const truncAfter = trimAtBoundary(after, remaining);
                if (truncAfter.length >= 20) candidates.push({ s: before + ': ' + truncAfter, weight: 1.0 });
            }
        }
    }

    // Strip trailing parenthetical
    const withoutParen = title.replace(/\s*\([^)]*\)\s*$/, '').trim();
    if (withoutParen !== title && withoutParen.length >= 30 && withoutParen.length <= TITLE_MAX) {
        candidates.push({ s: withoutParen, weight: 1.1 });
    }

    // "X and Y" — keep X
    const andSplit = title.split(/\s+(?:and|&)\s+/i);
    if (andSplit.length > 1) {
        const first = andSplit[0].trim();
        if (first.length >= 35 && first.length <= TITLE_MAX) candidates.push({ s: first, weight: 0.85 });
    }

    if (candidates.length > 0) {
        // Score = weight * (length + marker bonus)
        candidates.sort((a, b) => (scoreCandidate(b.s) * b.weight) - (scoreCandidate(a.s) * a.weight));
        return candidates[0].s;
    }

    return trimAtBoundary(title, TITLE_MAX);
}

function smartTrimExcerpt(excerpt, bodyFallback = '') {
    if (!excerpt) {
        // Use body first sentence
        const first = bodyFallback.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const sent = first.split(/(?<=[.!?])\s+/)[0] || '';
        return trimAtBoundary(sent, EXCERPT_MAX);
    }
    if (excerpt.length <= EXCERPT_MAX) return excerpt;
    // Try first sentence
    const sentences = excerpt.split(/(?<=[.!?])\s+/);
    if (sentences[0] && sentences[0].length <= EXCERPT_MAX) {
        // Try to fit 2 sentences
        const two = (sentences[0] + ' ' + (sentences[1] || '')).trim();
        if (two.length <= EXCERPT_MAX && sentences[1]) return two;
        return sentences[0].trim();
    }
    return trimAtBoundary(excerpt, EXCERPT_MAX);
}

function rebuildFrontmatter(originalRaw, newData) {
    // Hand-build YAML frontmatter with `"..."` quoted strings for title + excerpt.
    // Preserve all other fields by re-reading from data and serializing via gray-matter.stringify, but force quoting on title+excerpt.
    const { data: existingData, content } = matter(originalRaw);
    const merged = { ...existingData, ...newData };

    // Serialize manually for top-level scalar keys we care about, fallback to gray-matter for arrays/objects.
    const lines = [];
    const keysOrdered = Object.keys(merged);
    for (const key of keysOrdered) {
        const v = merged[key];
        if (key === 'title' || key === 'excerpt') {
            // Always double-quote, escape internal "
            const safe = String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            lines.push(`${key}: "${safe}"`);
        } else if (typeof v === 'string') {
            // Quote if contains : | > characters to be safe
            const needsQuote = /[:|>'"&#\n]/.test(v);
            if (needsQuote) {
                const safe = v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                lines.push(`${key}: "${safe}"`);
            } else {
                lines.push(`${key}: ${v}`);
            }
        } else if (Array.isArray(v)) {
            // tags array as flow style if all strings + short
            if (v.every(x => typeof x === 'string') && v.join('').length < 200) {
                lines.push(`${key}:`);
                for (const item of v) {
                    const safe = item.replace(/"/g, '\\"');
                    lines.push(`  - "${safe}"`);
                }
            } else {
                lines.push(`${key}: ${JSON.stringify(v)}`);
            }
        } else if (v && typeof v === 'object') {
            // author object e.g. {name, role, avatar}
            lines.push(`${key}:`);
            for (const [k2, v2] of Object.entries(v)) {
                if (typeof v2 === 'string') {
                    const needsQuote = /[:|>'"&#\n]/.test(v2);
                    if (needsQuote) {
                        const safe = v2.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                        lines.push(`  ${k2}: "${safe}"`);
                    } else {
                        lines.push(`  ${k2}: ${v2}`);
                    }
                } else {
                    lines.push(`  ${k2}: ${JSON.stringify(v2)}`);
                }
            }
        } else {
            lines.push(`${key}: ${JSON.stringify(v)}`);
        }
    }
    const fm = '---\n' + lines.join('\n') + '\n---\n';
    return fm + content;
}

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

function getFlagValue(flag) {
    const eqForm = args.find(a => a.startsWith(`${flag}=`));
    if (eqForm) return eqForm.slice(flag.length + 1);
    const idx = args.indexOf(flag);
    if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1];
    return undefined;
}

const localeArg = getFlagValue('--locale');
const filesArg = getFlagValue('--files');

let targetFiles = [];
if (filesArg) {
    targetFiles = filesArg.split(',').map(f => f.trim());
} else {
    const locales = localeArg ? [localeArg] : LOCALES;
    for (const loc of locales) {
        const dir = path.join(ROOT, 'content', 'blog', loc);
        if (!fs.existsSync(dir)) continue;
        for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.mdx'))) {
            targetFiles.push(`content/blog/${loc}/${f}`);
        }
    }
}

let changed = 0, skipped = 0, errors = 0;
const log = [];
for (const fp of targetFiles) {
    try {
        const raw = fs.readFileSync(fp, 'utf8');
        const parsed = matter(raw);
        const { data, content } = parsed;
        const oldTitle = data.title || '';
        const oldExcerpt = data.excerpt || '';
        const tLong = oldTitle.length > TITLE_MAX;
        const eLong = oldExcerpt.length > EXCERPT_MAX;
        const folded = /^---[\s\S]*?(title|excerpt):\s*>-/m.test(raw);
        if (!tLong && !eLong && !folded) {
            skipped++;
            continue;
        }
        const newTitle = tLong ? smartTrimTitle(oldTitle) : oldTitle;
        const newExcerpt = eLong ? smartTrimExcerpt(oldExcerpt, content) : oldExcerpt;
        const updates = { title: newTitle, excerpt: newExcerpt };
        const newRaw = rebuildFrontmatter(raw, updates);

        log.push(`${fp}\n  T ${oldTitle.length}→${newTitle.length}: "${oldTitle}"\n         → "${newTitle}"\n  E ${oldExcerpt.length}→${newExcerpt.length}: "${oldExcerpt.slice(0, 80)}…"\n         → "${newExcerpt}"\n`);
        if (APPLY) fs.writeFileSync(fp, newRaw, 'utf8');
        changed++;
    } catch (e) {
        errors++;
        log.push(`ERROR ${fp}: ${e.message}`);
    }
}

console.log(log.join('\n'));
console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — changed ${changed} / skipped ${skipped} / errors ${errors}`);
