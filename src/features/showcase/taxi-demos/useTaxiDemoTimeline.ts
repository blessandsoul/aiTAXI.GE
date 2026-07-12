'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { createTaxiDemoVisibilityGate } from './taxi-demo-visibility.mjs';
import { createTimelinePlayer, frameFor } from './timeline.mjs';

export type TaxiDemoId = 'dispatch' | 'telemetry' | 'depot' | 'compliance' | 'hybrid';
export type TaxiDemoPhase = 'problem' | 'ai-action' | 'result';

export interface TaxiDemoFrameState {
  demoId: TaxiDemoId;
  phase: TaxiDemoPhase;
  phaseKey: 'problem' | 'aiAction' | 'result';
  messageKey: string;
  resultKey: string;
}

type TimelinePlayer = ReturnType<typeof createTimelinePlayer>;
type DemoController = ReturnType<typeof createTaxiDemoVisibilityGate>;

export function useTaxiDemoTimeline(demoId: TaxiDemoId) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const playerRef = useRef<TimelinePlayer | null>(null);
  const controllerRef = useRef<DemoController | null>(null);
  const [frame, setFrame] = useState<TaxiDemoFrameState>(
    () => frameFor(demoId, 'problem') as TaxiDemoFrameState,
  );

  useEffect(() => {
    const player = createTimelinePlayer({
      reducedMotion: Boolean(reducedMotion),
      onFrame: (phase: TaxiDemoPhase) => {
        setFrame(frameFor(demoId, phase) as TaxiDemoFrameState);
      },
    });
    playerRef.current = player;

    const controller = createTaxiDemoVisibilityGate({
      target: containerRef.current,
      player,
      reducedMotion: Boolean(reducedMotion),
    });
    controllerRef.current = controller;

    return () => {
      controller.cleanup();
      if (controllerRef.current === controller) controllerRef.current = null;
      if (playerRef.current === player) playerRef.current = null;
    };
  }, [demoId, reducedMotion]);

  const replay = useCallback(() => {
    controllerRef.current?.replay();
  }, []);

  return { containerRef, frame, replay };
}
