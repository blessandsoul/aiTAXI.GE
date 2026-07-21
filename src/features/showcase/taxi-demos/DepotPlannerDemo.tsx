'use client';

import { Ico } from '@/components/common/Ico';
import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

const DEMAND = [26, 20, 17, 22, 34, 48, 67, 96, 84, 62, 44, 31];
const DEPOT_JOBS = [
  { vehicle: 'AV-03', icon: 'solar:bolt-circle-bold-duotone' },
  { vehicle: 'AV-04', icon: 'solar:broom-bold-duotone' },
  { vehicle: 'AV-05', icon: 'solar:settings-bold-duotone' },
] as const;

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
          <span className="absolute bottom-1 left-3 font-mono text-[9px] text-white/75">01:00</span>
          <span className="absolute bottom-1 right-[31%] font-mono text-[9px] font-bold text-[#ffc400]">17:00</span>
          {planned && (
            <span className="absolute inset-y-2 left-2 w-[31%] rounded-lg border border-dashed border-[#ffc400]/55 bg-[#ffc400]/[0.05]" />
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEPOT_JOBS.map((job) => (
            <div
              key={job.vehicle}
              className={`flex min-h-16 items-center justify-between rounded-xl border px-3 transition-[border-color,background-color,transform] duration-500 ${
                planned
                  ? 'translate-y-0 border-[#ffc400]/35 bg-[#ffc400]/[0.07]'
                  : 'translate-y-2 border-white/10 bg-white/[0.025]'
              }`}
            >
              <Ico name={job.icon} className="size-5 text-[#ffc400]" />
              <span className="font-mono text-xs text-white/75">{job.vehicle}</span>
              <Ico
                name={ready ? 'solar:check-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'}
                className={`size-4 ${ready ? 'text-[#ffc400]' : 'text-white/75'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
