import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const COMPONENT_ROOT = new URL('./', import.meta.url);
const DEMO_ROOT = new URL('../../showcase/taxi-demos/', import.meta.url);
const MESSAGE_ROOT = new URL('../../../messages/', import.meta.url);

const MODULE_IDS = ['dispatch', 'telemetry', 'remote', 'depot', 'safety'];
const MODULE_FIELDS = ['title', 'task', 'action', 'result'];
const CAPABILITY_IDS = ['dispatch', 'telemetry', 'assistance', 'depot', 'safety'];
const LOCALES = ['en', 'ka', 'ru'];

function read(relative, root = COMPONENT_ROOT) {
  return readFileSync(new URL(relative, root), 'utf8');
}

function messages(locale) {
  return JSON.parse(read(`${locale}.json`, MESSAGE_ROOT));
}

test('operations modules render exactly five static responsive capabilities', () => {
  const source = read('LandingModules.tsx');
  const frame = read('ProductCapabilities.tsx');
  const css = read('product-capabilities.css');

  assert.match(source, /<ProductCapabilities/u);
  assert.match(source, /useTranslations\('product\.capabilities'\)/u);
  assert.equal((source.match(/\{ key: '[^']+', icon: 'solar:[^']+' \}/gu) ?? []).length, 5);
  assert.doesNotMatch(source, /snap-x|overflow-x-auto|data-landing-demo|data-demo-replay/u);
  assert.match(frame, /items\.map\(\(item, index\) =>/u);
  assert.match(frame, /data-feature-section="true"/u);
  assert.doesNotMatch(frame, /data-landing-demo|data-demo-replay/u);
  assert.match(css, /width:\s*calc\(100% - 48px\)/u);
  assert.match(css, /max-width:\s*1216px/u);
  assert.match(css, /@media \(max-width: 800px\)/u);
  assert.match(css, /@media \(max-width: 479px\)/u);
});

test('the five-demo board states the pre-launch boundary before its scenarios', () => {
  const source = read('../../showcase/taxi-demos/TaxiDemos.tsx', COMPONENT_ROOT);

  assert.match(source, /t\('disclaimer'\)/u);
  assert.match(source, /<Ico/u);
  assert.match(source, /className="mt-10 grid min-w-0 gap-8 xl:gap-10"/u);
  assert.doesNotMatch(source, /(?:md|xl):grid-cols-2/u);
  assert.doesNotMatch(source, /snap-x|overflow-x-auto/u);
});

test('the committed home route keeps one hero demo and three static fleet outcomes', () => {
  const page = read('../../../app/[locale]/page.tsx', COMPONENT_ROOT);
  const body = read('LandingBody.tsx');
  const sections = read('ProductLandingSections.tsx');
  const heroStory = read('HeroWorkflowStory.tsx');

  assert.match(page, /import \{ LandingBody \} from '@\/features\/home\/components\/LandingBody';/u);
  assert.match(page, /<LandingBody\s*\/>/u);
  assert.match(body, /<ProductLandingSections\s*\/>/u);
  assert.doesNotMatch(body, /TaxiDemos|data-landing-demo/u);
  assert.match(sections, /\[steps\[0\],steps\[2\],steps\[4\]\]\.map/u);
  assert.equal((sections.match(/data-business-outcome="true"/gu) ?? []).length, 1);
  for (const id of ['compare', 'dashboard', 'reviews', 'cases', 'integrations', 'resources']) {
    assert.match(sections, new RegExp(`id="${id}"`, 'u'));
  }
  assert.equal((heroStory.match(/data-landing-demo="true"/gu) ?? []).length, 1);

  for (const [file, namespace] of [
    ['LandingFaq.tsx', 'product.faq'],
    ['LandingCta.tsx', 'product.cta'],
    ['LandingWordmark.tsx', 'product.wordmark'],
  ]) {
    assert.ok(read(file).includes(`useTranslations('${namespace}')`), file);
  }
});

test('archived modules and the five public capabilities keep complete copy in every locale', () => {
  for (const locale of LOCALES) {
    const modules = messages(locale).product?.modules;
    assert.equal(typeof modules?.prelaunch, 'string', `${locale}.product.modules.prelaunch`);
    assert.ok(modules.prelaunch.trim());

    for (const label of ['taskLabel', 'actionLabel', 'resultLabel']) {
      assert.equal(typeof modules?.[label], 'string', `${locale}.product.modules.${label}`);
      assert.ok(modules[label].trim());
    }

    for (const moduleId of MODULE_IDS) {
      for (const field of MODULE_FIELDS) {
        assert.equal(
          typeof modules?.[moduleId]?.[field],
          'string',
          `${locale}.product.modules.${moduleId}.${field}`,
        );
        assert.ok(modules[moduleId][field].trim());
      }
    }

    const capabilities = messages(locale).product?.capabilities;
    for (const key of ['eyebrow', 'title', 'intro', 'outcomeLabel']) {
      assert.equal(typeof capabilities?.[key], 'string', `${locale}.product.capabilities.${key}`);
      assert.ok(capabilities[key].trim());
    }
    for (const capabilityId of CAPABILITY_IDS) {
      for (const field of ['title', 'description', 'result']) {
        assert.equal(
          typeof capabilities?.[capabilityId]?.[field],
          'string',
          `${locale}.product.capabilities.${capabilityId}.${field}`,
        );
        assert.ok(capabilities[capabilityId][field].trim());
      }
    }
  }
});

test('taxi UI uses bundled semantic icons and contains no typed status glyphs', () => {
  const files = [
    ['LandingModules.tsx', COMPONENT_ROOT],
    ['ProductCapabilities.tsx', COMPONENT_ROOT],
    ['TaxiDemoFrame.tsx', DEMO_ROOT],
    ['RideDispatchDemo.tsx', DEMO_ROOT],
    ['FleetTelemetryDemo.tsx', DEMO_ROOT],
    ['DepotPlannerDemo.tsx', DEMO_ROOT],
    ['ComplianceReportDemo.tsx', DEMO_ROOT],
    ['HybridRolloutDemo.tsx', DEMO_ROOT],
    ['../../showcase/HeroProof.tsx', COMPONENT_ROOT],
  ];
  const source = files.map(([file, root]) => read(file, root)).join('\n');

  assert.doesNotMatch(source, /[♿⚡✦◇✓→·↻●×Σ]/u);
  assert.doesNotMatch(source, />\s*!\s*</u);
  assert.doesNotMatch(source, /lucide-react|<svg/u);

  for (const icon of [
    'solar:routing-2-bold-duotone',
    'solar:accessibility-bold-duotone',
    'solar:battery-charge-bold-duotone',
    'solar:radar-2-bold-duotone',
    'solar:bolt-circle-bold-duotone',
    'solar:broom-bold-duotone',
    'solar:settings-bold-duotone',
    'solar:document-text-bold-duotone',
    'solar:check-circle-bold-duotone',
    'solar:alt-arrow-right-bold-duotone',
  ]) {
    assert.match(source, new RegExp(icon), `${icon} must be used in visitor UI`);
  }
});

test('public product copy is actor-owned, plain, and explicitly pre-launch', () => {
  const en = JSON.stringify(messages('en').product);
  const ka = JSON.stringify(messages('ka').product);
  const ru = JSON.stringify(messages('ru').product);

  assert.doesNotMatch(en, /\b(?:we|our|us)\b/iu);
  assert.doesNotMatch(ru, /\b(?:мы|наш(?:а|е|и)?|нас|нам)\b/iu);
  assert.doesNotMatch(ka, /(?:^|[^ა-ჰ])ჩვენ(?:ი|ს|თან|თვის)?(?:[^ა-ჰ]|$)/u);
  assert.doesNotMatch(`${en}${ka}${ru}`, /100%|currently operated|live fleet/iu);

  assert.match(messages('en').product.modules.prelaunch, /pre-launch/iu);
  assert.match(messages('ka').product.modules.prelaunch, /გაშვებამდე/u);
  assert.match(messages('ru').product.modules.prelaunch, /не запущена|до запуска/iu);
});

test('public structured product facts use aiNOW as actor and keep the pre-launch boundary', () => {
  const source = read('../../../config/site.ts', COMPONENT_ROOT);

  assert.doesNotMatch(source, /\b(?:we|our|us)\b/iu);
  assert.match(source, /aiNOW/u);
  assert.match(source, /pre-launch/iu);
  assert.doesNotMatch(source, /live telemetry|run(?:ning)? a fleet|operate the fleet/iu);
});

test('the per-site brand tokens load after shared CSS so every ai prefix remains visible', () => {
  const layout = read('../../../app/[locale]/layout.tsx', COMPONENT_ROOT);
  const brand = read('../../../app/brand.css', COMPONENT_ROOT);

  assert.match(layout, /import "@\/app\/brand\.css";/u);
  assert.ok(layout.indexOf('site-new.css') < layout.indexOf('brand.css'));
  for (const token of ['--brand:', '--brand-soft:', '--brand-ink:']) {
    assert.ok(brand.includes(token), token);
  }
});

test('the desktop hero grid cannot be widened by rotating product copy', () => {
  const source = read('LandingHero.tsx');
  const css = read('landing-hero.css');
  assert.match(source, /data-family-shell="true" className="hero-family-shell[^\n]*min-w-0/u);
  assert.match(source, /className="grid min-w-0 gap-8/u);
  assert.match(source, /className="typewriter"/u);
  assert.doesNotMatch(source, /caretW|availableWidth|clampTypewriterReservedWidth/u);
  assert.match(css, /\.hero-family-shell\{width:min\(1140px,calc\(100% - 48px\)\)/u);
  assert.match(css, /\.tw-text\s*\{[^}]*overflow-wrap:\s*anywhere/u);
});

test('short desktop navigation labels retain a 44 by 44 pixel target', () => {
  const css = read('landing-nav.css');
  const navLinkRule = css.match(/\.nav-link\s*\{([^}]*)\}/u)?.[1] ?? '';

  assert.match(navLinkRule, /min-width:\s*44px/u);
  assert.match(navLinkRule, /min-height:\s*44px/u);
  assert.match(navLinkRule, /justify-content:\s*center/u);
});

test('the showcase command includes home, demo, and locale contracts', () => {
  const pkg = JSON.parse(read('../../../../package.json', COMPONENT_ROOT));
  const command = pkg.scripts?.['test:showcase'] ?? '';

  assert.match(command, /src\/features\/home\/components\/\*\.test\.mjs/u);
  assert.match(command, /src\/features\/showcase\/taxi-demos\/\*\.test\.mjs/u);
  assert.match(command, /src\/messages\/\*\.test\.mjs/u);
});
