import { createDemoLoop } from '../../home/components/lib/demo-loop.mjs';

export const TAXI_DEMO_CYCLE_MS = 7200;
export const TAXI_DEMO_FINAL_HOLD_MS = 2000;
export const TAXI_DEMO_VISIBILITY_THRESHOLD = 0.35;

/** Own the complete family lifecycle for one rendered aiTAXI story. */
export function createTaxiDemoVisibilityGate({
  target,
  player,
  reducedMotion = false,
  Observer = globalThis.IntersectionObserver,
  pageDocument = globalThis.document,
  schedule = globalThis.setTimeout,
  cancelScheduled = globalThis.clearTimeout,
}) {
  for (const method of ['play', 'showFinal', 'reset', 'stop']) {
    if (typeof player?.[method] !== 'function') {
      throw new TypeError(`createTaxiDemoVisibilityGate requires player.${method}`);
    }
  }

  return createDemoLoop({
    target,
    reducedMotion,
    threshold: TAXI_DEMO_VISIBILITY_THRESHOLD,
    cycleMs: TAXI_DEMO_CYCLE_MS,
    holdMs: TAXI_DEMO_FINAL_HOLD_MS,
    play: player.play,
    showFinal: player.showFinal,
    reset: player.reset,
    stop: player.stop,
    Observer,
    pageDocument,
    schedule,
    cancelScheduled,
  });
}
