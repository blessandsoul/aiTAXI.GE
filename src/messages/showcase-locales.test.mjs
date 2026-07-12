import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const LOCALES = ['en', 'ka', 'ru'];
const SHARED_KEYS = [
  'eyebrow',
  'heading',
  'subtitle',
  'disclaimer',
  'problem',
  'aiAction',
  'result',
  'replay',
];
const DEMO_IDS = ['dispatch', 'telemetry', 'depot', 'compliance', 'hybrid'];
const DEMO_KEYS = ['title', 'description', 'problem', 'aiAction', 'result', 'outcome'];

async function loadMessages(locale) {
  const source = await readFile(new URL(`./${locale}.json`, import.meta.url), 'utf8');
  return JSON.parse(source);
}

function assertNonEmptyStrings(object, keys, context) {
  for (const key of keys) {
    assert.equal(typeof object?.[key], 'string', `${context}.${key} must be a string`);
    assert.ok(object[key].trim(), `${context}.${key} must not be empty`);
  }
}

test('showcase copy has complete key parity in English, Georgian, and Russian', async () => {
  const namespaces = {};

  for (const locale of LOCALES) {
    const messages = await loadMessages(locale);
    const demos = messages.product?.demos;
    assert.ok(demos, `${locale}.product.demos must exist`);
    assertNonEmptyStrings(demos, SHARED_KEYS, `${locale}.product.demos`);

    for (const demoId of DEMO_IDS) {
      assertNonEmptyStrings(
        demos[demoId],
        DEMO_KEYS,
        `${locale}.product.demos.${demoId}`,
      );
    }

    namespaces[locale] = demos;
  }

  const keys = (value) => Object.keys(value).sort();
  assert.deepEqual(keys(namespaces.ka), keys(namespaces.en));
  assert.deepEqual(keys(namespaces.ru), keys(namespaces.en));

  for (const demoId of DEMO_IDS) {
    assert.deepEqual(keys(namespaces.ka[demoId]), keys(namespaces.en[demoId]));
    assert.deepEqual(keys(namespaces.ru[demoId]), keys(namespaces.en[demoId]));
  }
});

test('Georgian showcase copy contains no Cyrillic characters', async () => {
  const messages = await loadMessages('ka');
  const copy = JSON.stringify(messages.product?.demos ?? {});

  assert.doesNotMatch(copy, /[\u0400-\u04ff]/u);
});
