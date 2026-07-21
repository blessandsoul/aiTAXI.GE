import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const heroUrl = new URL('../../home/components/LandingHero.tsx', import.meta.url);
const heroCssUrl = new URL('../../home/components/landing-hero.css', import.meta.url);

test('hero keeps static product copy inside the available column at every width', () => {
  const heroSource = readFileSync(heroUrl, 'utf8');
  const heroCss = readFileSync(heroCssUrl, 'utf8');

  assert.match(heroSource, /data-family-shell="true" className="hero-family-shell[^\n]*min-w-0/);
  assert.match(heroSource, /className="grid min-w-0 gap-8/u);
  assert.match(heroSource, /className="hero-static-accent"/u);
  assert.doesNotMatch(heroSource, /setInterval|setTimeout|caretW|availableWidth|clampTypewriterReservedWidth/u);
  assert.match(heroCss, /\.hero-family-shell\{width:min\(1140px,calc\(100% - 48px\)\)/u);
  assert.match(heroCss, /@media\(max-width:640px\)[\s\S]*?\.hero-family-shell\{width:calc\(100% - 32px\)!important\}/u);
  assert.match(heroCss, /\.hero-static-accent\{[^}]*overflow-wrap:anywhere/u);
});
