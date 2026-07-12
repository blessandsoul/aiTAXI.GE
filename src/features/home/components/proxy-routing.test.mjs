import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../../../../', import.meta.url);
const proxyUrl = new URL('src/proxy.ts', root);
const middlewareUrl = new URL('src/middleware.ts', root);
const configUrl = new URL('next.config.ts', root);

test('Next proxy preserves short blog URLs before locale routing', () => {
  assert.equal(existsSync(proxyUrl), true, 'src/proxy.ts must exist');
  assert.equal(existsSync(middlewareUrl), false, 'legacy middleware must be removed');

  const source = readFileSync(proxyUrl, 'utf8');
  assert.match(source, /import shortUrls from "\.\.\/content\/blog\/short-urls\.json";/u);
  assert.ok(
    source.includes('const SHORT_URL_PATTERN = /^\\/([a-z][a-z0-9]{5})$/;'),
    'proxy must preserve the exact one-letter plus five-alphanumeric short-code pattern',
  );
  assert.match(source, /NextResponse\.redirect\(destination, 301\)/u);
  assert.match(source, /return intlMiddleware\(request\);/u);
  assert.match(source, /matcher:\s*\["\/\(\(\?!api\|_next\|_vercel/u);
});

test('Next keeps the raw short code available to the proxy', () => {
  const source = readFileSync(configUrl, 'utf8');
  assert.match(source, /skipProxyUrlNormalize:\s*true/u);
});
