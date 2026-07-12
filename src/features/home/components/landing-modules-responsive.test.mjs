import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const COMPONENT_ROOT = new URL('./', import.meta.url);
const DEMO_ROOT = new URL('../../showcase/taxi-demos/', import.meta.url);
const MESSAGE_ROOT = new URL('../../../messages/', import.meta.url);

const MODULE_IDS = ['dispatch', 'telemetry', 'remote', 'depot', 'safety'];
const MODULE_FIELDS = ['title', 'task', 'action', 'result'];
const LOCALES = ['en', 'ka', 'ru'];

function read(relative, root = COMPONENT_ROOT) {
  return readFileSync(new URL(relative, root), 'utf8');
}

function messages(locale) {
  return JSON.parse(read(`${locale}.json`, MESSAGE_ROOT));
}

test('operations modules remain wide and readable through tablet widths', () => {
  const source = read('LandingModules.tsx');

  assert.doesNotMatch(
    source,
    /md:grid-cols-6|md:col-span-[246]|max-w-\[calc\(100%-4rem\)\]/u,
  );
  assert.match(source, /lg:grid-cols-2/u);
  assert.match(source, /min-w-0/u);
  assert.doesNotMatch(source, /absolute\s+(?:right|top)-/u);
  assert.match(source, /t\('prelaunch'\)/u);

  for (const field of ['task', 'action', 'result']) {
    assert.match(source, new RegExp(`\\.${field}`));
  }
});

test('the five-demo board states the pre-launch boundary before its scenarios', () => {
  const source = read('../../showcase/taxi-demos/TaxiDemos.tsx', COMPONENT_ROOT);

  assert.match(source, /t\('disclaimer'\)/u);
  assert.match(source, /<Ico/u);
  assert.match(source, /xl:grid-cols-2/u);
  assert.doesNotMatch(source, /md:grid-cols-2/u);
});

test('the committed home route reaches all five taxi scenarios through LandingBody', () => {
  const page = read('../../../app/[locale]/page.tsx', COMPONENT_ROOT);
  const body = read('LandingBody.tsx');
  const demos = read('../../showcase/taxi-demos/TaxiDemos.tsx', COMPONENT_ROOT);

  assert.match(page, /import \{ LandingBody \} from '@\/features\/home\/components\/LandingBody';/u);
  assert.match(page, /<LandingBody\s*\/>/u);
  assert.match(body, /import \{ TaxiDemos \} from '@\/features\/showcase\/taxi-demos\/TaxiDemos';/u);
  assert.match(body, /<TaxiDemos\s*\/>/u);

  for (const component of [
    'RideDispatchDemo',
    'FleetTelemetryDemo',
    'DepotPlannerDemo',
    'ComplianceReportDemo',
    'HybridRolloutDemo',
  ]) {
    assert.match(demos, new RegExp(`<${component}\\s*\\/>`), component);
  }

  for (const [file, namespace] of [
    ['LandingHow.tsx', 'product.how'],
    ['LandingRoadmap.tsx', 'product.roadmap'],
    ['LandingFaq.tsx', 'product.faq'],
    ['LandingCta.tsx', 'product.cta'],
    ['LandingWordmark.tsx', 'product.wordmark'],
  ]) {
    assert.ok(read(file).includes(`useTranslations('${namespace}')`), file);
  }
});

test('all five modules use the short task, action, result copy shape in every locale', () => {
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
  }
});

test('taxi UI uses bundled semantic icons and contains no typed status glyphs', () => {
  const files = [
    ['LandingModules.tsx', COMPONENT_ROOT],
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

test('the showcase command includes home, demo, and locale contracts', () => {
  const pkg = JSON.parse(read('../../../../package.json', COMPONENT_ROOT));
  const command = pkg.scripts?.['test:showcase'] ?? '';

  assert.match(command, /src\/features\/home\/components\/\*\.test\.mjs/u);
  assert.match(command, /src\/features\/showcase\/taxi-demos\/\*\.test\.mjs/u);
  assert.match(command, /src\/messages\/\*\.test\.mjs/u);
});
