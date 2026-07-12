'use client';

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
      <div aria-hidden="true" className="grid min-h-48 gap-4 sm:grid-cols-[0.72fr_1.1fr]">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-white/45">REQ-184</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffc400] font-bold text-[#151518]">♿</span>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full border-2 border-[#ffc400]" />
            <span className="h-px flex-1 border-t border-dashed border-white/25" />
            <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold transition-all ${
              arrived ? 'border-[#ffc400] bg-[#ffc400] text-[#151518]' : 'border-white/25 text-white/45'
            }`}>
              {arrived ? '✓' : 'B'}
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between font-mono text-[10px] text-white/38">
            <span>41.7001</span>
            <span className={assigned ? 'text-[#ffc400]' : ''}>{assigned ? '00:04' : '—'}</span>
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
                  <span className={`h-2.5 w-2.5 rounded-full ${selected ? 'bg-[#ffc400]' : 'bg-white/20'}`} />
                  <span className="font-mono text-sm font-semibold text-white">{vehicle.id}</span>
                </span>
                <span className="flex items-center gap-3 font-mono text-xs tabular-nums">
                  {vehicle.distance}
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-white/15">
                    {selected ? '✓' : '·'}
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
