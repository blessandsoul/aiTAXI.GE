'use client';

import { Ico } from '@/components/common/Ico';
import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

const VEHICLES = [
  { id: 'AV-04', distance: '7.2', compatible: false },
  { id: 'AV-12', distance: '2.1', compatible: true },
  { id: 'AV-21', distance: '4.6', compatible: false },
] as const;

export function RideDispatchDemo() {
  const { containerRef, frame, replay } = useTaxiDemoTimeline('dispatch');
  const assigned = frame.phase !== 'problem';
  const arrived = frame.phase === 'result';

  return (
    <TaxiDemoFrame
      containerRef={containerRef}
      demoId="dispatch"
      frame={frame}
      replay={replay}
      translationNamespace="product.demos"
    >
      <div aria-hidden="true" className="grid min-h-48 min-w-0 gap-4 lg:grid-cols-[0.72fr_1.1fr]">
        <div className="flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-white/45">REQ-184</span>
            <span className="grid size-9 place-items-center rounded-xl bg-[#ffc400] text-[#151518]">
              <Ico name="solar:accessibility-bold-duotone" className="size-5" />
            </span>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Ico name="solar:map-point-bold-duotone" className="size-5 shrink-0 text-[#ffc400]" />
            <span className="h-px min-w-0 flex-1 border-t border-dashed border-white/25" />
            <span className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all ${
              arrived ? 'border-[#ffc400] bg-[#ffc400] text-[#151518]' : 'border-white/25 text-white/45'
            }`}>
              <Ico
                name={arrived ? 'solar:check-circle-bold-duotone' : 'solar:map-point-bold-duotone'}
                className="size-4"
              />
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between font-mono text-[10px] text-white/38">
            <span>41.7001</span>
            <span className={assigned ? 'text-[#ffc400]' : ''}>{assigned ? '00:04' : '00:00'}</span>
          </div>
        </div>

        <div className="space-y-2">
          {VEHICLES.map((vehicle) => {
            const selected = vehicle.compatible && assigned;
            return (
              <div
                key={vehicle.id}
                className={`flex min-h-14 items-center justify-between rounded-xl border px-4 transition-all duration-500 ${
                  selected
                    ? 'translate-x-0 border-[#ffc400] bg-[#ffc400]/12'
                    : 'border-white/10 bg-white/[0.035] text-white/48'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Ico
                    name={selected ? 'solar:routing-2-bold-duotone' : 'solar:radar-2-bold-duotone'}
                    className={`size-4 ${selected ? 'text-[#ffc400]' : 'text-white/25'}`}
                  />
                  <span className="font-mono text-sm font-semibold text-white">{vehicle.id}</span>
                </span>
                <span className="flex items-center gap-3 font-mono text-xs tabular-nums">
                  {vehicle.distance}
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-white/15">
                    <Ico
                      name={selected ? 'solar:check-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'}
                      className="size-3.5"
                    />
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
