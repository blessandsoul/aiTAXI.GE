import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { createTaxiDemoVisibilityGate } from './taxi-demo-visibility.mjs';

function createClock() {
  let now = 0;
  let nextId = 1;
  const timers = new Map();

  return {
    schedule(callback, delay) {
      const id = nextId++;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    cancel(id) {
      timers.delete(id);
    },
    advance(milliseconds) {
      const target = now + milliseconds;
      while (true) {
        const next = [...timers.entries()]
          .filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        const [id, timer] = next;
        timers.delete(id);
        now = timer.at;
        timer.callback();
      }
      now = target;
    },
    get pendingCount() {
      return timers.size;
    },
  };
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
      if (emitDuringDisconnect && callback) {
        callback([{ target: observedTarget, isIntersecting: true, intersectionRatio: 1 }]);
      }
    }
  }

  return {
    FakeIntersectionObserver,
    emit(isIntersecting, intersectionRatio = isIntersecting ? 1 : 0) {
      callback([{ target: observedTarget, isIntersecting, intersectionRatio }]);
    },
    snapshot() {
      return { disconnectCount, observedTarget, options };
    },
  };
}

function documentHarness() {
  const listeners = new Set();
  return {
    hidden: false,
    addEventListener(type, callback) {
      if (type === 'visibilitychange') listeners.add(callback);
    },
    removeEventListener(type, callback) {
      if (type === 'visibilitychange') listeners.delete(callback);
    },
    setHidden(hidden) {
      this.hidden = hidden;
      for (const callback of [...listeners]) callback();
    },
    get listenerCount() {
      return listeners.size;
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
      showFinal() {
        events.push(`${label}:final`);
      },
      reset() {
        events.push(`${label}:reset`);
      },
      stop() {
        events.push(`${label}:stop`);
      },
    },
    events,
  };
}

function contractTargetHarness() {
  const attributes = new Map();
  return {
    target: {
      matches(selector) {
        return selector === '[data-demo-id]';
      },
      setAttribute(name, value) {
        attributes.set(name, value);
      },
    },
    attribute(name) {
      return attributes.get(name);
    },
  };
}

test('the DOM contract exposes idle, playing, final, and a two-second final hold', () => {
  const clock = createClock();
  const observer = observerHarness();
  const { player, events } = playerHarness();
  const contract = contractTargetHarness();
  const controller = createTaxiDemoVisibilityGate({
    target: contract.target,
    player,
    Observer: observer.FakeIntersectionObserver,
    pageDocument: documentHarness(),
    schedule: clock.schedule,
    cancelScheduled: clock.cancel,
  });

  assert.equal(contract.attribute('data-landing-demo'), 'true');
  assert.equal(contract.attribute('data-demo-state'), 'idle');

  observer.emit(true, 1);
  assert.equal(contract.attribute('data-demo-state'), 'playing');
  clock.advance(7200);
  assert.equal(contract.attribute('data-demo-state'), 'final');
  assert.equal(events.at(-1), 'player:play');

  clock.advance(1999);
  assert.equal(contract.attribute('data-demo-state'), 'final');
  clock.advance(1);
  assert.equal(contract.attribute('data-demo-state'), 'playing');
  assert.deepEqual(events.slice(-3), ['player:stop', 'player:reset', 'player:play']);

  controller.cleanup();
});

test('a visible taxi story plays for 7200ms, holds for 2000ms, then repeats', () => {
  const clock = createClock();
  const observer = observerHarness();
  const pageDocument = documentHarness();
  const { player, events } = playerHarness();
  const target = { id: 'taxi-story' };

  const controller = createTaxiDemoVisibilityGate({
    target,
    player,
    Observer: observer.FakeIntersectionObserver,
    pageDocument,
    schedule: clock.schedule,
    cancelScheduled: clock.cancel,
  });

  assert.deepEqual(events, []);
  assert.deepEqual(observer.snapshot().options, { threshold: 0.35 });
  observer.emit(true, 0.34);
  assert.deepEqual(events, []);

  observer.emit(true, 0.35);
  assert.deepEqual(events, ['player:play']);
  assert.equal(clock.pendingCount, 1);

  clock.advance(9199);
  assert.deepEqual(events, ['player:play']);
  clock.advance(1);
  assert.deepEqual(events, ['player:play', 'player:stop', 'player:reset', 'player:play']);

  controller.cleanup();
});

test('off-screen and hidden stories stop, reset, and restart cleanly on return', () => {
  const clock = createClock();
  const observer = observerHarness();
  const pageDocument = documentHarness();
  const { player, events } = playerHarness();
  const controller = createTaxiDemoVisibilityGate({
    target: { id: 'taxi-story' },
    player,
    Observer: observer.FakeIntersectionObserver,
    pageDocument,
    schedule: clock.schedule,
    cancelScheduled: clock.cancel,
  });

  observer.emit(true, 1);
  observer.emit(false, 0);
  assert.deepEqual(events, ['player:play', 'player:stop', 'player:reset']);
  assert.equal(clock.pendingCount, 0);

  observer.emit(true, 1);
  pageDocument.setHidden(true);
  assert.deepEqual(events.slice(-3), ['player:play', 'player:stop', 'player:reset']);
  assert.equal(clock.pendingCount, 0);

  pageDocument.setHidden(false);
  assert.equal(events.at(-1), 'player:play');
  controller.cleanup();
});

test('Replay restarts immediately and stale repeat callbacks cannot mutate the story', () => {
  const clock = createClock();
  const observer = observerHarness();
  const { player, events } = playerHarness();
  const controller = createTaxiDemoVisibilityGate({
    target: { id: 'taxi-story' },
    player,
    Observer: observer.FakeIntersectionObserver,
    pageDocument: documentHarness(),
    schedule: clock.schedule,
    cancelScheduled: clock.cancel,
  });

  observer.emit(true, 1);
  controller.replay();
  assert.deepEqual(events, ['player:play', 'player:stop', 'player:reset', 'player:play']);

  clock.advance(9200);
  assert.deepEqual(events.slice(-3), ['player:stop', 'player:reset', 'player:play']);
  controller.cleanup();
});

test('reduced motion and missing observers render the final state without timers', () => {
  for (const options of [
    { reducedMotion: true, Observer: class UnexpectedObserver {} },
    { reducedMotion: false, Observer: undefined },
  ]) {
    const clock = createClock();
    const { player, events } = playerHarness();
    const controller = createTaxiDemoVisibilityGate({
      target: { id: 'static-story' },
      player,
      pageDocument: documentHarness(),
      schedule: clock.schedule,
      cancelScheduled: clock.cancel,
      ...options,
    });

    assert.deepEqual(events, ['player:final']);
    assert.equal(clock.pendingCount, 0);
    controller.replay();
    assert.deepEqual(events.slice(-2), ['player:stop', 'player:final']);
    controller.cleanup();
  }
});

test('cleanup is idempotent and retained observer callbacks stay inert', () => {
  const observer = observerHarness({ emitDuringDisconnect: true });
  const pageDocument = documentHarness();
  const { player, events } = playerHarness();
  const controller = createTaxiDemoVisibilityGate({
    target: { id: 'unmounted-story' },
    player,
    Observer: observer.FakeIntersectionObserver,
    pageDocument,
  });

  controller.cleanup();
  observer.emit(true, 1);
  controller.cleanup();

  assert.deepEqual(events, ['player:stop']);
  assert.equal(observer.snapshot().disconnectCount, 1);
  assert.equal(pageDocument.listenerCount, 0);
});

test('the shared React hook exposes the managed controller to all five cards', () => {
  const hookSource = readFileSync(new URL('./useTaxiDemoTimeline.ts', import.meta.url), 'utf8');
  const frameSource = readFileSync(new URL('./TaxiDemoFrame.tsx', import.meta.url), 'utf8');
  const visualSource = readFileSync(new URL('../../../app/taxi-hallmark.css', import.meta.url), 'utf8');

  assert.match(hookSource, /createTaxiDemoVisibilityGate/u);
  assert.match(hookSource, /controllerRef/u);
  assert.match(hookSource, /controllerRef\.current\?\.replay\(\)/u);
  assert.match(frameSource, /<article\s+ref=\{containerRef\}/u);
  assert.match(frameSource, /data-demo-detail=\{frame\.phase\}/u);
  assert.match(frameSource, /aria-live="off"/u);
  assert.match(frameSource, /data-demo-replay/u);
  assert.match(frameSource, /data-demo-copy-slot="action"/u);
  assert.match(frameSource, /data-demo-copy-slot="result"/u);
  assert.match(visualSource, /\[data-demo-copy-slot="action"\][^{]*\{[^}]*min-height:\s*148px/su);
  assert.match(visualSource, /\[data-demo-copy-slot="result"\][^{]*\{[^}]*min-height:\s*148px/su);

  for (const [component, demoId] of [
    ['RideDispatchDemo.tsx', 'dispatch'],
    ['FleetTelemetryDemo.tsx', 'telemetry'],
    ['DepotPlannerDemo.tsx', 'depot'],
    ['ComplianceReportDemo.tsx', 'compliance'],
    ['HybridRolloutDemo.tsx', 'hybrid'],
  ]) {
    const source = readFileSync(new URL(component, import.meta.url), 'utf8');
    assert.match(source, new RegExp(`useTaxiDemoTimeline\\('${demoId}'\\)`));
  }
});

test('the autonomous hero uses the shared visibility-owned loop and keeps Replay visible', () => {
  const source = readFileSync(new URL('../HeroProof.tsx', import.meta.url), 'utf8');
  const heroStory = readFileSync(new URL('../../home/components/HeroWorkflowStory.tsx', import.meta.url), 'utf8');
  const heroCss = readFileSync(new URL('../../home/components/hero-workflow-story.css', import.meta.url), 'utf8');
  const heroLoop = readFileSync(new URL('../../home/components/lib/demo-loop.mjs', import.meta.url), 'utf8');

  assert.match(source, /<HeroWorkflowStory/u);
  assert.match(source, /mode="autonomous"/u);
  assert.match(source, /demoId="taxi-hero-proof"/u);
  assert.match(source, /productIcon="solar:routing-2-bold-duotone"/u);
  assert.doesNotMatch(source, /bridgeLabel|bridge:/u);
  assert.match(heroStory, /createDemoLoop/u);
  assert.match(heroStory, /threshold:\s*0\.35/u);
  assert.match(heroStory, /const CYCLE_MS = 6_400/u);
  assert.match(heroStory, /holdMs:\s*2_000/u);
  assert.match(heroStory, /controllerRef\.current\?\.replay\(\)/u);
  assert.match(heroStory, /data-demo-detail=\{`phase-\$\{phase\}`\}/u);
  assert.match(heroStory, /aria-live="off"/u);
  assert.match(heroStory, /data-demo-replay="true"/u);
  assert.match(heroCss, /\.hero-workflow__row\s*\{[\s\S]*?min-height:\s*82px;/u);
  assert.match(heroCss, /@media \(max-width: 479px\)[\s\S]*?\.hero-workflow__row\s*\{[\s\S]*?min-height:\s*76px;/u);
  assert.match(heroCss, /\.hero-workflow__replay\s*\{[\s\S]*?min-height:\s*44px;/u);
  assert.doesNotMatch(heroCss, /transition:\s*all/u);
  for (const state of ['idle', 'playing', 'final', 'manual', 'paused']) {
    assert.match(heroLoop, new RegExp(`setDemoState\\('${state}'\\)`, 'u'));
  }
  assert.match(heroLoop, /if \(staticFinalState\)[\s\S]*showFinal\(\)/u);
  assert.match(heroLoop, /pageDocument\?\.hidden/u);
  assert.doesNotMatch(heroStory, /setInterval|window\.setInterval/u);
});
