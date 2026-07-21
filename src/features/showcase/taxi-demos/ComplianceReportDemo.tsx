'use client';

import { Ico } from '@/components/common/Ico';
import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

const SOURCES = [
  { code: 'TLM-01', icon: 'solar:radar-2-bold-duotone' },
  { code: 'GPS-02', icon: 'solar:routing-2-bold-duotone' },
  { code: 'CAM-03', icon: 'solar:camera-bold-duotone' },
  { code: 'OPS-04', icon: 'solar:headphones-round-sound-bold-duotone' },
] as const;

export function ComplianceReportDemo() {
  const { containerRef, frame, replay } = useTaxiDemoTimeline('compliance');
  const assembled = frame.phase !== 'problem';
  const complete = frame.phase === 'result';

  return (
    <TaxiDemoFrame
      containerRef={containerRef}
      demoId="compliance"
      frame={frame}
      replay={replay}
      translationNamespace="product.demos"
    >
      <div aria-hidden="true" className="grid min-h-48 gap-3 sm:grid-cols-[1fr_auto_0.72fr] sm:items-center">
        <div className="grid grid-cols-2 gap-2">
          {SOURCES.map((source, index) => (
            <div
              key={source.code}
              className={`rounded-xl border p-3 transition-[border-color,background-color,transform] duration-500 ${
                assembled
                  ? 'border-[#ffc400]/30 bg-[#ffc400]/[0.06]'
                  : index % 2 === 0
                    ? '-translate-y-1 border-white/12 bg-white/[0.035]'
                    : 'translate-y-1 border-white/12 bg-white/[0.035]'
              }`}
            >
              <span className="flex items-center gap-2 font-mono text-[10px] text-white/75">
                <Ico name={source.icon} className="size-4 text-[#ffc400]" />
                {source.code}
              </span>
              <span className={`mt-3 grid h-6 w-6 place-items-center rounded-full border ${
                assembled ? 'border-[#ffc400] text-[#ffc400]' : 'border-white/15 text-white/75'
              }`}>
                <Ico
                  name={assembled ? 'solar:check-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'}
                  className="size-3.5"
                />
              </span>
            </div>
          ))}
        </div>

        <Ico
          name="solar:alt-arrow-right-bold-duotone"
          className={`hidden size-5 transition-colors sm:block ${assembled ? 'text-[#ffc400]' : 'text-white/75'}`}
        />

        <div className={`relative min-h-36 rounded-xl border p-4 transition-[border-color,background-color,transform] duration-500 ${
          complete
            ? 'border-[#ffc400]/55 bg-[#ffc400]/[0.09]'
            : 'border-white/10 bg-white/[0.025]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-white/75">
              <Ico name="solar:document-text-bold-duotone" className="size-4 text-[#ffc400]" />
              RPT-024
            </span>
            <span className="font-mono text-xs font-bold text-[#ffc400]">4 / 4</span>
          </div>
          <div className="mt-4 space-y-2">
            <span className="block h-1.5 w-full rounded-full bg-white/15" />
            <span className="block h-1.5 w-4/5 rounded-full bg-white/15" />
            <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
          </div>
          <span className={`absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border ${
            complete ? 'border-[#ffc400] bg-[#ffc400] text-[#151518]' : 'border-white/15 text-white/75'
          }`}>
            <Ico
              name={complete ? 'solar:check-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'}
              className="size-4"
            />
          </span>
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
