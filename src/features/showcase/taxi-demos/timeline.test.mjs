import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEMO_IDS,
  PHASES,
  createTimelinePlayer,
  frameFor,
} from './timeline.mjs';

function createClock() {
  let now = 0;
  let nextId = 1;
  const timers = new Map();
  const cancelled = [];

  return {
    schedule(callback, delay) {
      const id = nextId++;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    cancel(id) {
      cancelled.push(id);
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
    get cancelledCount() {
      return cancelled.length;
    },
    get pendingCount() {
      return timers.size;
    },
  };
}

test('all five demos define the same problem, AI action, and result journey', () => {
  assert.deepEqual(DEMO_IDS, ['dispatch', 'telemetry', 'depot', 'compliance', 'hybrid']);
  assert.deepEqual(PHASES, ['problem', 'ai-action', 'result']);

  for (const demoId of DEMO_IDS) {
    const frames = PHASES.map((phase) => frameFor(demoId, phase));

    assert.deepEqual(
      frames.map((frame) => frame.phase),
      PHASES,
      `${demoId} must traverse all three phases`,
    );
    assert.ok(frames.at(-1).resultKey.trim(), `${demoId} must name a translated result`);
  }
});

test('a normal play reaches the result at exactly 7200ms', () => {
  const clock = createClock();
  const seen = [];
  const player = createTimelinePlayer({
    schedule: clock.schedule,
    cancel: clock.cancel,
    reducedMotion: false,
    onFrame: (phase) => seen.push(phase),
  });

  player.play();
  assert.deepEqual(seen, ['problem']);

  clock.advance(3599);
  assert.deepEqual(seen, ['problem']);

  clock.advance(1);
  assert.deepEqual(seen, ['problem', 'ai-action']);

  clock.advance(3599);
  assert.deepEqual(seen, ['problem', 'ai-action']);

  clock.advance(1);
  assert.deepEqual(seen, PHASES);
  assert.equal(clock.pendingCount, 0);
});

test('replay cancels the old run and restarts from the problem', () => {
  const clock = createClock();
  const seen = [];
  const player = createTimelinePlayer({
    schedule: clock.schedule,
    cancel: clock.cancel,
    reducedMotion: false,
    onFrame: (phase) => seen.push(phase),
  });

  player.play();
  clock.advance(3600);
  player.replay();

  assert.equal(seen.at(-1), 'problem');
  assert.equal(clock.cancelledCount, 1);
  assert.equal(clock.pendingCount, 2);

  clock.advance(7200);
  assert.deepEqual(seen.slice(-3), PHASES);
});

test('stop cancels every pending frame', () => {
  const clock = createClock();
  const seen = [];
  const player = createTimelinePlayer({
    schedule: clock.schedule,
    cancel: clock.cancel,
    reducedMotion: false,
    onFrame: (phase) => seen.push(phase),
  });

  player.play();
  assert.equal(clock.pendingCount, 2);

  player.stop();
  assert.equal(clock.pendingCount, 0);
  assert.equal(clock.cancelledCount, 2);

  clock.advance(7200);
  assert.deepEqual(seen, ['problem']);
});

test('reduced motion emits only the result and schedules nothing', () => {
  const clock = createClock();
  const seen = [];
  const player = createTimelinePlayer({
    schedule: clock.schedule,
    cancel: clock.cancel,
    reducedMotion: true,
    onFrame: (phase) => seen.push(phase),
  });

  player.play();

  assert.deepEqual(seen, ['result']);
  assert.equal(clock.pendingCount, 0);
});

test('unknown demo IDs and phases are rejected', () => {
  assert.throws(() => frameFor('remote-assistance', 'problem'), /Unknown taxi demo/);
  assert.throws(() => frameFor('dispatch', 'waiting'), /Unknown taxi demo phase/);
});
