'use client';

import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

const DEMAND = [26, 20, 17, 22, 34, 48, 67, 96, 84, 62, 44, 31];
const DEPOT_JOBS = ['⚡', '✦', '◇'];

export function DepotPlannerDemo() {
  const { containerRef, frame, replay } = useTaxiDemoTimeline('depot');
  const planned = frame.phase !== 'problem';
  const ready = frame.phase === 'result';

  return (
    <TaxiDemoFrame
      containerRef={containerRef}
      demoId="depot"
      frame={frame}
      replay={replay}
      translationNamespace="product.demos"
    >
      <div aria-hidden="true" className="min-h-48">
        <div className="relative h-28 rounded-xl border border-white/10 bg-white/[0.03] px-3 pb-5 pt-4">
          <div className="flex h-full items-end gap-1.5">
            {DEMAND.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={`flex-1 rounded-t-sm transition-colors duration-500 ${
                  index === 7 ? 'bg-[#ffc400]' : index < 4 && planned ? 'bg-[#ffc400]/45' : 'bg-white/13'
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <span className="absolute bottom-1 left-3 font-mono text-[9px] text-white/35">01:00</span>
          <span className="absolute bottom-1 right-[31%] font-mono text-[9px] font-bold text-[#ffc400]">17:00</span>
          {planned && (
            <span className="absolute inset-y-2 left-2 w-[31%] rounded-lg border border-dashed border-[#ffc400]/55 bg-[#ffc400]/[0.05]" />
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEPOT_JOBS.map((symbol, index) => (
            <div
              key={symbol}
              className={`flex min-h-16 items-center justify-between rounded-xl border px-3 transition-all duration-500 ${
                planned
                  ? 'translate-y-0 border-[#ffc400]/35 bg-[#ffc400]/[0.07] opacity-100'
                  : 'translate-y-2 border-white/10 bg-white/[0.025] opacity-35'
              }`}
            >
              <span className="text-lg text-[#ffc400]">{symbol}</span>
              <span className="font-mono text-xs text-white/55">AV-{String(index + 3).padStart(2, '0')}</span>
              {ready && <span className="text-sm font-bold text-[#ffc400]">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
