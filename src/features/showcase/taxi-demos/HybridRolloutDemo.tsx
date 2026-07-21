'use client';

import { Ico } from '@/components/common/Ico';
import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

const REQUESTS = ['R-201', 'R-202', 'R-203', 'R-204'];

export function HybridRolloutDemo() {
  const { containerRef, frame, replay } = useTaxiDemoTimeline('hybrid');
  const assigned = frame.phase !== 'problem';
  const expanded = frame.phase === 'result';

  return (
    <TaxiDemoFrame
      containerRef={containerRef}
      demoId="hybrid"
      frame={frame}
      replay={replay}
      translationNamespace="product.demos"
    >
      <div aria-hidden="true" className="min-h-48 space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {REQUESTS.map((request, index) => (
            <div
              key={request}
              className={`rounded-lg border px-2 py-3 text-center font-mono text-[10px] transition-[border-color,background-color,color,transform] ${
                assigned ? 'border-white/10 bg-white/[0.035] text-white/75' : 'border-[#ffc400]/35 bg-[#ffc400]/[0.06] text-white/75'
              }`}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              {request}
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className={`rounded-xl border p-4 transition-[border-color,background-color,transform] ${
            assigned ? 'border-white/15 bg-white/[0.04]' : 'border-white/10 bg-white/[0.02]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20">
                <Ico name="solar:user-hands-bold-duotone" className="size-4 text-white/75" />
              </span>
              <span className="font-mono text-xs text-white/75">R-201 / R-203</span>
            </div>
          </div>
          <div className={`rounded-xl border p-4 transition-[border-color,background-color,transform] ${
            assigned ? 'border-[#ffc400]/40 bg-[#ffc400]/[0.07]' : 'border-white/10 bg-white/[0.02]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 min-w-8 place-items-center rounded-full border border-[#ffc400]/50 font-mono text-[9px] text-[#ffc400]">AV</span>
              <span className="font-mono text-xs text-white/75">R-202 / R-204</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 text-white/75">
                <Ico name="solar:routing-2-bold-duotone" className="size-4" />
                AV
              </span>
              <span className="font-bold text-[#ffc400]">{expanded ? '2 / 2' : '1 / 2'}</span>
            </div>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
              <span className={`block h-full rounded-full bg-[#ffc400] transition-[width] duration-500 ${expanded ? 'w-full' : 'w-1/2'}`} />
            </span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 text-white/75">
                <Ico name="solar:check-circle-bold-duotone" className="size-4" />
                ALL
              </span>
              <span className="font-bold text-white">4 / 4</span>
            </div>
            <span className="mt-2 block h-1.5 rounded-full bg-white/75" />
          </div>
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
