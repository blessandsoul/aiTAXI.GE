import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const demosUrl = new URL('./TaxiDemos.tsx', import.meta.url);
const frameUrl = new URL('./TaxiDemoFrame.tsx', import.meta.url);

test('fleet scenarios form one accessible vertical story stack at every width', () => {
  const demos = readFileSync(demosUrl, 'utf8');
  const frame = readFileSync(frameUrl, 'utf8');

  assert.match(demos, /role="region"/);
  assert.match(demos, /aria-labelledby="fleet-scenarios-heading"/);
  assert.match(demos, /className="mt-10 grid min-w-0 gap-8 xl:gap-10"/);
  assert.doesNotMatch(demos, /snap-x|snap-start|overflow-x-auto/);
  assert.doesNotMatch(demos, /(?:md|xl):grid-cols-2/);
  assert.ok((demos.match(/className="min-w-0"/g) ?? []).length >= 5);

  assert.match(frame, /grid min-w-0 gap-6 p-5 sm:p-7 lg:grid-cols-/);
  assert.match(frame, /const visualFirst =/);
  assert.match(frame, /data-demo-outcome/);
  assert.match(frame, /text-xl[^\n]+sm:text-3xl/);
});
