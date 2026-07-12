'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

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

export function useTaxiDemoTimeline(demoId: TaxiDemoId) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const playerRef = useRef<TimelinePlayer | null>(null);
  const [frame, setFrame] = useState<TaxiDemoFrameState>(
    () => frameFor(demoId, 'problem') as TaxiDemoFrameState,
  );

  useEffect(() => {
    let hasPlayed = false;
    const player = createTimelinePlayer({
      reducedMotion: Boolean(reducedMotion),
      onFrame: (phase: TaxiDemoPhase) => {
        setFrame(frameFor(demoId, phase) as TaxiDemoFrameState);
      },
    });
    playerRef.current = player;

    const playOnce = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      player.play();
    };

    const node = containerRef.current;
    let observer: IntersectionObserver | null = null;

    if (reducedMotion || !node || typeof IntersectionObserver === 'undefined') {
      playOnce();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          playOnce();
          observer?.disconnect();
        },
        { threshold: 0.35 },
      );
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      player.stop();
      if (playerRef.current === player) playerRef.current = null;
    };
  }, [demoId, reducedMotion]);

  const replay = useCallback(() => {
    playerRef.current?.replay();
  }, []);

  return { containerRef, frame, replay };
}
