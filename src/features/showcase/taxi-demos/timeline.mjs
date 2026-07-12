export const DEMO_IDS = ['dispatch', 'telemetry', 'depot', 'compliance', 'hybrid'];
export const PHASES = ['problem', 'ai-action', 'result'];
export const HERO_BEATS = ['fleet', 'blocked', 'assisting', 'resolved'];

const RESULT_KEYS = {
  dispatch: 'dispatch.outcome',
  telemetry: 'telemetry.outcome',
  depot: 'depot.outcome',
  compliance: 'compliance.outcome',
  hybrid: 'hybrid.outcome',
};

const PHASE_KEYS = {
  problem: 'problem',
  'ai-action': 'aiAction',
  result: 'result',
};

export function frameFor(demoId, phase) {
  if (!DEMO_IDS.includes(demoId)) {
    throw new Error(`Unknown taxi demo: ${demoId}`);
  }

  if (!PHASES.includes(phase)) {
    throw new Error(`Unknown taxi demo phase: ${phase}`);
  }

  return {
    demoId,
    phase,
    phaseKey: PHASE_KEYS[phase],
    messageKey: `${demoId}.${PHASE_KEYS[phase]}`,
    resultKey: RESULT_KEYS[demoId],
  };
}

function createStagePlayer({
  stages,
  durationMs,
  schedule = globalThis.setTimeout,
  cancel = globalThis.clearTimeout,
  reducedMotion = false,
  onFrame,
}) {
  const timers = new Set();
  const phaseInterval = durationMs / (stages.length - 1);

  const stop = () => {
    for (const timer of timers) cancel(timer);
    timers.clear();
  };

  const play = () => {
    stop();

    if (reducedMotion) {
      onFrame(stages.at(-1));
      return;
    }

    onFrame(stages[0]);

    stages.slice(1).forEach((phase, index) => {
      let timer;
      timer = schedule(() => {
        timers.delete(timer);
        onFrame(phase);
      }, phaseInterval * (index + 1));
      timers.add(timer);
    });
  };

  const reset = () => {
    stop();
    onFrame(stages[0]);
  };

  const showFinal = () => {
    stop();
    onFrame(stages.at(-1));
  };

  return {
    play,
    replay: play,
    reset,
    showFinal,
    stop,
  };
}

export function createTimelinePlayer(options) {
  return createStagePlayer({ ...options, stages: PHASES, durationMs: 7200 });
}

export function createHeroTimelinePlayer(options) {
  return createStagePlayer({ ...options, stages: HERO_BEATS, durationMs: 7200 });
}
