'use client';

import type { ReactNode, RefObject } from 'react';
import { useTranslations } from 'next-intl';

import { PHASES } from './timeline.mjs';
import type {
  TaxiDemoFrameState,
  TaxiDemoId,
  TaxiDemoPhase,
} from './useTaxiDemoTimeline';

const PHASE_LABELS = {
  problem: 'problem',
  'ai-action': 'aiAction',
  result: 'result',
} as const;

interface TaxiDemoFrameProps {
  children: ReactNode;
  containerRef: RefObject<HTMLElement | null>;
  demoId: TaxiDemoId;
  frame: TaxiDemoFrameState;
  replay: () => void;
  translationNamespace: 'product.demos';
}

export function TaxiDemoFrame({
  children,
  containerRef,
  demoId,
  frame,
  replay,
  translationNamespace,
}: TaxiDemoFrameProps) {
  const t = useTranslations(translationNamespace);
  const translate = (key: string) => t(key as never);
  const activeIndex = PHASES.indexOf(frame.phase);
  const titleId = `taxi-demo-${demoId}-title`;

  return (
    <article
      ref={containerRef}
      aria-labelledby={titleId}
      className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#151518] text-white shadow-[0_28px_70px_-48px_rgba(0,0,0,0.9)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffc400]/80 to-transparent"
      />

      <div className="flex flex-col gap-5 p-5 sm:p-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ffc400]">
              {demoId}
            </p>
            <h3
              id={titleId}
              className="mt-2 text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {translate(`${demoId}.title`)}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-white/58 sm:text-base">
              {translate(`${demoId}.description`)}
            </p>
          </div>

          <button
            type="button"
            onClick={replay}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold text-white transition-colors hover:border-[#ffc400]/60 hover:bg-[#ffc400]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc400]"
          >
            <span aria-hidden="true" className="text-lg leading-none">↻</span>
            {translate('replay')}
          </button>
        </header>

        <ol className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {(PHASES as readonly TaxiDemoPhase[]).map((phase, index) => {
            const current = phase === frame.phase;
            const complete = index < activeIndex;

            return (
              <li
                key={phase}
                aria-current={current ? 'step' : undefined}
                className={`relative min-w-0 border-r border-white/10 px-2 py-3 last:border-r-0 sm:px-4 ${
                  current ? 'bg-[#ffc400] text-[#151518]' : 'text-white/48'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold tabular-nums" aria-hidden="true">
                    {complete ? '✓' : String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] sm:text-xs">
                    {translate(PHASE_LABELS[phase])}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] p-4 sm:p-5">
          {children}
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.55fr)]">
          <div aria-live="polite" className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ffc400]">
              {translate(frame.phaseKey)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/78">
              {translate(frame.messageKey)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ffc400]/30 bg-[#ffc400]/[0.08] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ffc400]">
              {translate('result')}
            </p>
            <p className="mt-2 font-display text-lg font-bold leading-tight text-white">
              {frame.phase === 'result' ? translate(frame.resultKey) : '—'}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-auto border-t border-white/10 bg-white/[0.035] px-5 py-4 text-xs leading-relaxed text-white/52 sm:px-7">
        <span aria-hidden="true" className="mr-2 text-[#ffc400]">●</span>
        {translate('disclaimer')}
      </p>
    </article>
  );
}
