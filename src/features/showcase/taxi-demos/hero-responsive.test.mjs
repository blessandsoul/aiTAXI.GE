import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const modelUrl = new URL('../../home/components/hero-typewriter-width.mjs', import.meta.url);
const heroUrl = new URL('../../home/components/LandingHero.tsx', import.meta.url);
const heroCssUrl = new URL('../../home/components/landing-hero.css', import.meta.url);

test('hero clamps long phrases to the available hero column at every width', async () => {
  assert.equal(existsSync(modelUrl), true, 'responsive typewriter width model must exist');

  const { clampTypewriterReservedWidth } = await import(modelUrl.href);
  const heroSource = readFileSync(heroUrl, 'utf8');
  const heroCss = readFileSync(heroCssUrl, 'utf8');

  assert.equal(clampTypewriterReservedWidth(422, 8, 342, true), 342);
  assert.equal(clampTypewriterReservedWidth(659, 8, 586, true), 586);

  assert.match(heroSource, /clampTypewriterReservedWidth\(maxW, caretW, availableW, true\)/);
  assert.doesNotMatch(heroSource, /matchMedia\('\(min-width: 1024px\)'\)/);
  assert.match(heroSource, /className="hero-content [^"]*w-full[^"]*min-w-0/);
  assert.match(heroCss, /\.hero-content > \.grid > \* \{ width: 100%; min-width: 0; \}/);
  assert.match(heroCss, /\.typewriter \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?white-space: normal;/);
  assert.doesNotMatch(heroCss, /@media \(min-width: 768px\) \{[\s\S]*?\.typewriter \{[^}]*white-space: nowrap;/);
});
