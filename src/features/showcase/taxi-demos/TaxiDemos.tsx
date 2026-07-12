import { useTranslations } from 'next-intl';

import { Ico } from '@/components/common/Ico';
import { ComplianceReportDemo } from './ComplianceReportDemo';
import { DepotPlannerDemo } from './DepotPlannerDemo';
import { FleetTelemetryDemo } from './FleetTelemetryDemo';
import { HybridRolloutDemo } from './HybridRolloutDemo';
import { RideDispatchDemo } from './RideDispatchDemo';

export function TaxiDemos() {
  const t = useTranslations('product.demos');

  return (
    <section id="fleet-scenarios" className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:px-8">
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

        <div className="mt-8 flex min-w-0 items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 sm:p-5">
          <Ico name="solar:shield-warning-bold-duotone" className="mt-0.5 size-5 shrink-0 text-[#9a6c00]" />
          <p className="min-w-0">{t('disclaimer')}</p>
        </div>

        <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-2">
          <div className="min-w-0 xl:col-span-2">
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
