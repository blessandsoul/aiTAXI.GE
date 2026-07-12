'use client';

import { Ico } from '@/components/common/Ico';
import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

export function FleetTelemetryDemo() {
  const { containerRef, frame, replay } = useTaxiDemoTimeline('telemetry');
  const rerouted = frame.phase !== 'problem';
  const safe = frame.phase === 'result';

  return (
    <TaxiDemoFrame
      containerRef={containerRef}
      demoId="telemetry"
      frame={frame}
      replay={replay}
      translationNamespace="product.demos"
    >
      <div aria-hidden="true" className="min-h-48 space-y-3">
        <div className={`rounded-xl border p-4 transition-opacity ${
          rerouted ? 'border-red-400/20 opacity-45' : 'border-red-400/45 bg-red-400/[0.07]'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-sm font-bold">
              <Ico name="solar:radar-2-bold-duotone" className="size-4 text-red-300" />
              AV-08
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-red-400/50 text-red-300">
              <Ico name="solar:close-circle-bold-duotone" className="size-4" />
            </span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="inline-flex items-center gap-2 font-display text-3xl font-bold tabular-nums">
              <Ico name="solar:battery-charge-bold-duotone" className="size-6 text-red-300" />
              18%
            </span>
            <span className="mb-1 h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-[18%] rounded-full bg-red-400" />
            </span>
          </div>
        </div>

        <div className={`rounded-xl border p-4 transition-all duration-500 ${
          rerouted
            ? 'translate-y-0 border-[#ffc400]/45 bg-[#ffc400]/[0.08] opacity-100'
            : 'translate-y-2 border-white/10 bg-white/[0.03] opacity-35'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-sm font-bold">
              <Ico name="solar:routing-2-bold-duotone" className="size-4 text-[#ffc400]" />
              AV-14
            </span>
            <span className="font-mono text-xs text-white/55">92%</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-[92%] rounded-full bg-[#ffc400]" />
            </span>
            <span className={`grid h-7 w-7 place-items-center rounded-full border ${
              safe ? 'border-[#ffc400] bg-[#ffc400] text-[#151518]' : 'border-[#ffc400]/50 text-[#ffc400]'
            }`}>
              <Ico
                name={safe ? 'solar:check-circle-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'}
                className="size-4"
              />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs text-white/48">
          <span>4 / 4</span>
          <span className={safe ? 'inline-flex items-center gap-1.5 font-bold text-[#ffc400]' : ''}>
            {safe && <Ico name="solar:check-circle-bold-duotone" className="size-4" />}
            {safe ? '4 / 4' : '0 / 4'}
          </span>
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
