'use client';

import { TaxiDemoFrame } from './TaxiDemoFrame';
import { useTaxiDemoTimeline } from './useTaxiDemoTimeline';

const SOURCES = ['TLM-01', 'GPS-02', 'CAM-03', 'OPS-04'];

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
              key={source}
              className={`rounded-xl border p-3 transition-all duration-500 ${
                assembled
                  ? 'border-[#ffc400]/30 bg-[#ffc400]/[0.06]'
                  : index % 2 === 0
                    ? '-translate-y-1 border-white/12 bg-white/[0.035]'
                    : 'translate-y-1 border-white/12 bg-white/[0.035]'
              }`}
            >
              <span className="font-mono text-[10px] text-white/48">{source}</span>
              <span className={`mt-3 grid h-6 w-6 place-items-center rounded-full border text-xs ${
                assembled ? 'border-[#ffc400] text-[#ffc400]' : 'border-white/15 text-white/25'
              }`}>
                {assembled ? '✓' : String(index + 1)}
              </span>
            </div>
          ))}
        </div>

        <span className={`hidden text-lg transition-colors sm:block ${assembled ? 'text-[#ffc400]' : 'text-white/20'}`}>→</span>

        <div className={`relative min-h-36 rounded-xl border p-4 transition-all duration-500 ${
          complete
            ? 'border-[#ffc400]/55 bg-[#ffc400]/[0.09] opacity-100'
            : 'border-white/10 bg-white/[0.025] opacity-35'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/55">RPT-024</span>
            <span className="font-mono text-xs font-bold text-[#ffc400]">4 / 4</span>
          </div>
          <div className="mt-4 space-y-2">
            <span className="block h-1.5 w-full rounded-full bg-white/15" />
            <span className="block h-1.5 w-4/5 rounded-full bg-white/15" />
            <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
          </div>
          <span className={`absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border font-bold ${
            complete ? 'border-[#ffc400] bg-[#ffc400] text-[#151518]' : 'border-white/15 text-white/20'
          }`}>
            {complete ? '✓' : '·'}
          </span>
        </div>
      </div>
    </TaxiDemoFrame>
  );
}
