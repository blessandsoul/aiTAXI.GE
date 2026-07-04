// Smoke test: run the embedded font through Satori (the engine inside next/og that
// parses fonts and throws "Unsupported OpenType signature" on a bad buffer) with
// Georgian + Latin text, and assert valid SVG comes out.
//   node scripts/verify-og-font.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

const mod = await import(pathToFileURL(require.resolve('satori')).href);
const satori = typeof mod.default === 'function' ? mod.default
  : typeof mod.default?.default === 'function' ? mod.default.default
  : typeof mod.satori === 'function' ? mod.satori
  : mod;

const src = readFileSync(join(here, '../src/features/blog/lib/georgian-font.ts'), 'utf8');
const pick = (k) => Buffer.from(src.match(new RegExp(k + " = '([^']+)'"))[1], 'base64');

const fonts = [
  { name: 'Noto Sans Georgian', data: pick('georgianFontBase64'), weight: 700, style: 'normal' },
  { name: 'Noto Sans Georgian', data: pick('latinFontBase64'), weight: 700, style: 'normal' },
];

const el = {
  type: 'div',
  props: {
    style: { display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#08080d', color: '#fff', fontSize: 64, fontFamily: '"Noto Sans Georgian", sans-serif' },
    children: 'ვებსაიტების შექმნა · aiNOW.ge · React',
  },
};

const svg = await satori(el, { width: 1200, height: 630, fonts });
const ok = typeof svg === 'string' && svg.startsWith('<svg') && svg.includes('<path');
console.log(`SVG out: ${svg.length} chars, paths:${(svg.match(/<path/g) || []).length} — ${ok ? 'OK ✅ font parsed, glyphs drawn' : 'FAIL ❌'}`);
process.exit(ok ? 0 : 1);
