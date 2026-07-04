#!/usr/bin/env node
// Add id="faq-N" to <h3> tags inside FAQ sections so the blog page can extract them for JSON-LD.
// Heuristic: find the FAQ <h2> (id="faq" OR text "FAQ"/"FAQs"/"Frequently Asked Questions"),
// then renumber all <h3> tags until the next <h2> as id="faq-1", id="faq-2", etc.

import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const LOCALES = ['en', 'ru', 'ka'];

let changed = 0, skipped = 0;

for (const loc of LOCALES) {
    const dir = `content/blog/${loc}`;
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.mdx'))) {
        const fp = path.join(dir, f);
        const raw = fs.readFileSync(fp, 'utf8');

        // Match FAQ section: <h2 ...id="faq"...>...</h2> ... or text-based <h2>FAQ</h2>
        const faqH2Re = /<h2[^>]*(?:id=["']faq["']|>\s*(?:FAQ|FAQs|Frequently Asked Questions|ხშირად დასმული|Часто задаваемые))[^<]*<\/h2>/i;
        const faqMatch = raw.match(faqH2Re);
        if (!faqMatch) { skipped++; continue; }

        const faqStart = faqMatch.index + faqMatch[0].length;
        // Find next <h2> after FAQ (end of FAQ section)
        const restAfter = raw.slice(faqStart);
        const nextH2 = restAfter.match(/<h2[^>]*>/);
        const faqEnd = faqStart + (nextH2 ? nextH2.index : restAfter.length);

        const faqSection = raw.slice(faqStart, faqEnd);
        const beforeFaq = raw.slice(0, faqStart);
        const afterFaq = raw.slice(faqEnd);

        // Check if already has id="faq-N" — skip
        if (/<h3[^>]*id=["']faq-\d+["']/.test(faqSection)) { skipped++; continue; }

        // Renumber <h3> tags
        let n = 1;
        const newFaqSection = faqSection.replace(/<h3([^>]*)>/g, (_, attrs) => {
            const cleaned = attrs.replace(/\s+id=["'][^"']*["']/, '');
            return `<h3${cleaned} id="faq-${n++}">`;
        });

        if (newFaqSection === faqSection) { skipped++; continue; }

        const newRaw = beforeFaq + newFaqSection + afterFaq;
        if (APPLY) fs.writeFileSync(fp, newRaw, 'utf8');
        console.log(`${loc}/${f} — ${n - 1} questions tagged`);
        changed++;
    }
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — changed ${changed} / skipped ${skipped}`);
