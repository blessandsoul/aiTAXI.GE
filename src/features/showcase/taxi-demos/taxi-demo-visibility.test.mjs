import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { createTimelinePlayer } from './timeline.mjs';

const helperUrl = new URL('./taxi-demo-visibility.mjs', import.meta.url);

async function loadVisibilityGate() {
  try {
    return await import(helperUrl.href);
  } catch (error) {
    assert.fail(`the production taxi visibility helper must exist: ${error.message}`);
  }
}

function observerHarness({ emitDuringDisconnect = false } = {}) {
  let callback;
  let observedTarget;
  let disconnectCount = 0;
  let options;

  class FakeIntersectionObserver {
    constructor(nextCallback, nextOptions) {
      callback = nextCallback;
      options = nextOptions;
    }

    observe(target) {
      observedTarget = target;
    }

    disconnect() {
      disconnectCount += 1;
      if (emitDuringDisconnect) callback([{ isIntersecting: true, intersectionRatio: 1 }]);
    }
  }

  return {
    FakeIntersectionObserver,
    emit(isIntersecting, intersectionRatio = isIntersecting ? 1 : 0) {
      callback([{ isIntersecting, intersectionRatio }]);
    },
    snapshot() {
      return { disconnectCount, observedTarget, options };
    },
  };
}

function playerHarness(label = 'player') {
  const events = [];

  return {
    player: {
      play() {
        events.push(`${label}:play`);
      },
      stop() {
        events.push(`${label}:stop`);
      },
    },
    events,
  };
}

test('a taxi demo stays idle at 34% and plays once at 35% visibility', async () => {
  const { createTaxiDemoVisibilityGate } = await loadVisibilityGate();
  const observer = observerHarness();
  const { player, events } = playerHarness();
  const target = { id: 'rendered-taxi-demo' };

  const cleanup = createTaxiDemoVisibilityGate({
    target,
    player,
    Observer: observer.FakeIntersectionObserver,
  });

  assert.deepEqual(events, []);
  assert.equal(observer.snapshot().observedTarget, target);
  assert.deepEqual(observer.snapshot().options, { threshold: 0.35 });

  observer.emit(true, 0.34);
  assert.deepEqual(events, []);

  observer.emit(true, 0.35);
  observer.emit(true, 1);
  assert.deepEqual(events, ['player:play']);
  assert.equal(observer.snapshot().disconnectCount, 1);

  cleanup();
  assert.deepEqual(events, ['player:play', 'player:stop']);
});

test('cleanup invalidates retained callbacks before disconnect and stops exactly once', async () => {
  const { createTaxiDemoVisibilityGate } = await loadVisibilityGate();
  const observer = observerHarness({ emitDuringDisconnect: true });
  const { player, events } = playerHarness();

  const cleanup = createTaxiDemoVisibilityGate({
    target: { id: 'unmounted-taxi-demo' },
    player,
    Observer: observer.FakeIntersectionObserver,
  });

  cleanup();
  observer.emit(true, 1);
  cleanup();

  assert.deepEqual(events, ['player:stop']);
  assert.equal(observer.snapshot().disconnectCount, 1);
});

test('Strict Mode-like remount isolates the old observer from the current player', async () => {
  const { createTaxiDemoVisibilityGate } = await loadVisibilityGate();
  const oldObserver = observerHarness();
  const currentObserver = observerHarness();
  const oldPlayer = playerHarness('old');
  const currentPlayer = playerHarness('current');

  const cleanupOld = createTaxiDemoVisibilityGate({
    target: { id: 'old-box' },
    player: oldPlayer.player,
    Observer: oldObserver.FakeIntersectionObserver,
  });
  cleanupOld();
  cleanupOld();

  const cleanupCurrent = createTaxiDemoVisibilityGate({
    target: { id: 'current-box' },
    player: currentPlayer.player,
    Observer: currentObserver.FakeIntersectionObserver,
  });

  oldObserver.emit(true, 1);
  currentObserver.emit(true, 0.35);

  assert.deepEqual(oldPlayer.events, ['old:stop']);
  assert.deepEqual(currentPlayer.events, ['current:play']);

  cleanupCurrent();
  cleanupCurrent();
  assert.deepEqual(currentPlayer.events, ['current:play', 'current:stop']);
});

test('reduced motion emits the real timeline final immediately without observing', async () => {
  const { createTaxiDemoVisibilityGate } = await loadVisibilityGate();
  const phases = [];
  let observerConstructed = false;

  class UnexpectedObserver {
    constructor() {
      observerConstructed = true;
    }
  }

  const player = createTimelinePlayer({
    reducedMotion: true,
    onFrame: (phase) => phases.push(phase),
  });
  const cleanup = createTaxiDemoVisibilityGate({
    target: { id: 'reduced-motion-box' },
    player,
    reducedMotion: true,
    Observer: UnexpectedObserver,
  });

  assert.deepEqual(phases, ['result']);
  assert.equal(observerConstructed, false);
  cleanup();
});

test('missing IntersectionObserver falls back to one immediate play', async () => {
  const { createTaxiDemoVisibilityGate } = await loadVisibilityGate();
  const { player, events } = playerHarness();

  const cleanup = createTaxiDemoVisibilityGate({
    target: { id: 'no-observer-box' },
    player,
    Observer: undefined,
  });

  assert.deepEqual(events, ['player:play']);
  cleanup();
  cleanup();
  assert.deepEqual(events, ['player:play', 'player:stop']);
});

test('the shared hook wires all five real article boxes through the production gate', () => {
  const hookSource = readFileSync(new URL('./useTaxiDemoTimeline.ts', import.meta.url), 'utf8');
  const frameSource = readFileSync(new URL('./TaxiDemoFrame.tsx', import.meta.url), 'utf8');

  assert.match(
    hookSource,
    /import \{ createTaxiDemoVisibilityGate \} from '\.\/taxi-demo-visibility\.mjs';/u,
  );
  assert.match(hookSource, /const containerRef = useRef<HTMLElement \| null>\(null\);/u);
  assert.match(hookSource, /createTaxiDemoVisibilityGate\(\{[\s\S]*?target: containerRef\.current,[\s\S]*?player,[\s\S]*?reducedMotion: Boolean\(reducedMotion\),/u);
  assert.doesNotMatch(hookSource, /new IntersectionObserver/u);
  assert.match(frameSource, /<article\s+ref=\{containerRef\}/u);
  assert.match(frameSource, /className="[^"]*h-full[^"]*"/u);

  const componentExpectations = new Map([
    ['RideDispatchDemo.tsx', 'dispatch'],
    ['FleetTelemetryDemo.tsx', 'telemetry'],
    ['DepotPlannerDemo.tsx', 'depot'],
    ['ComplianceReportDemo.tsx', 'compliance'],
    ['HybridRolloutDemo.tsx', 'hybrid'],
  ]);

  for (const [component, demoId] of componentExpectations) {
    const source = readFileSync(new URL(component, import.meta.url), 'utf8');
    assert.match(source, new RegExp(`useTaxiDemoTimeline\\('${demoId}'\\)`));
    assert.match(source, /containerRef=\{containerRef\}/u);
  }
});
