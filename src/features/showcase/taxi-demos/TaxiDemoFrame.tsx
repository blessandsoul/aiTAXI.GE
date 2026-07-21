'use client';

import type { ReactNode, RefObject } from 'react';
import { useTranslations } from 'next-intl';

import { Ico } from '@/components/common/Ico';
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
  const visualFirst = demoId === 'telemetry' || demoId === 'compliance';

  return (
    <article
      ref={containerRef}
      data-landing-demo="true"
      data-demo={`taxi-${demoId}`}
      data-demo-id={`taxi-${demoId}`}
      data-demo-detail={frame.phase}
      aria-labelledby={titleId}
      aria-live="off"
      className="relative flex min-w-0 flex-col overflow-hidden rounded-[32px] bg-white text-[#111827] shadow-[0_0_0_1px_rgba(17,24,39,0.06),0_24px_70px_-42px_rgba(17,24,39,0.38)] [contain:inline-size]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffc400]/80 to-transparent"
      />

      <div className="grid min-w-0 gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-stretch lg:gap-10 lg:p-10">
        <div
          className={`flex min-w-0 flex-col ${
            visualFirst ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'
          }`}
        >
          <header className="min-w-0">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#725600]">
              <Ico name="solar:routing-2-bold-duotone" className="size-4" />
              {translate('scenarioLabel')}
            </p>
            <h3
              id={titleId}
              className="mt-2 text-balance font-display text-xl font-bold tracking-tight text-[#111827] sm:text-3xl"
            >
              {translate(`${demoId}.title`)}
            </h3>
            <p className="mt-2 max-w-[62ch] text-pretty text-sm leading-relaxed text-[#4B5563] sm:text-base">
              {translate(`${demoId}.description`)}
            </p>
          </header>

          <button
            type="button"
            data-demo-replay
            onClick={replay}
            className="mt-5 inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f4f4f5] px-4 text-sm font-semibold text-[#27272a] transition-[transform,background-color] active:scale-[0.96] hover:bg-[#e9e9ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f6e00]"
          >
            <Ico name="solar:refresh-bold-duotone" className="size-4" />
            {translate('replay')}
          </button>

          <ol className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl bg-[#f4f4f5] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.07)]">
            {(PHASES as readonly TaxiDemoPhase[]).map((phase, index) => {
              const current = phase === frame.phase;
              const complete = index < activeIndex;

              return (
                <li
                  key={phase}
                  aria-current={current ? 'step' : undefined}
                  className={`relative min-w-0 border-r border-[#e4e4e7] px-2 py-2.5 last:border-r-0 sm:px-3 ${
                    current ? 'bg-[#ffc400] text-[#151518]' : 'text-[#667085]'
                  }`}
                >
                  <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:text-left">
                    <Ico
                      name={
                        complete
                          ? 'solar:check-circle-bold-duotone'
                          : current
                            ? 'solar:alt-arrow-right-bold-duotone'
                            : 'solar:clock-circle-bold-duotone'
                      }
                      className="size-4 shrink-0"
                    />
                    <span className="min-w-0 break-words text-[9px] font-semibold uppercase tracking-[0.06em] sm:text-[10px]">
                      {translate(PHASE_LABELS[phase])}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div
            data-demo-outcome
            data-demo-copy-slot="result"
            className="mt-auto"
          >
            <p className="font-display text-lg font-bold leading-tight text-[#111827]">
              {frame.phase === 'result' ? translate(frame.resultKey) : translate('waiting')}
            </p>
          </div>
        </div>

        <div
          className={`min-w-0 ${
            visualFirst ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2 lg:row-start-1'
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] p-3 text-white sm:p-5">
            {children}
          </div>
          <div
            aria-live="off"
            data-demo-copy-slot="action"
            className="mt-3 rounded-2xl bg-[#f7f7f8] p-4 shadow-[inset_0_0_0_1px_rgba(17,24,39,0.07)]"
          >
            <p className="text-[11px] font-bold text-[#725600]">
              {translate(frame.phaseKey)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
              {translate(frame.messageKey)}
            </p>
          </div>
        </div>
      </div>

    </article>
  );
}
