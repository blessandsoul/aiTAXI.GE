import { useTranslations } from 'next-intl';

import { ComplianceReportDemo } from './ComplianceReportDemo';
import { DepotPlannerDemo } from './DepotPlannerDemo';
import { FleetTelemetryDemo } from './FleetTelemetryDemo';
import { HybridRolloutDemo } from './HybridRolloutDemo';
import { RideDispatchDemo } from './RideDispatchDemo';

export function TaxiDemos() {
  const t = useTranslations('product.demos');

  return (
    <section id="fleet-scenarios" className="relative overflow-hidden px-6 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-28 mx-auto h-64 max-w-5xl rounded-full bg-[#ffc400]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#b45309]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
            {t('heading')}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-2">
          <div className="xl:col-span-2">
            <RideDispatchDemo />
          </div>
          <FleetTelemetryDemo />
          <DepotPlannerDemo />
          <ComplianceReportDemo />
          <HybridRolloutDemo />
        </div>
      </div>
    </section>
  );
}
