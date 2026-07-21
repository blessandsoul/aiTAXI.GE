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
    <section id="fleet-scenarios" className="relative overflow-hidden py-16 md:py-24 xl:py-28">
      <div className="relative mx-auto w-[calc(100%-48px)] max-w-[1216px]">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#52525b]">
            {t('eyebrow')}
          </p>
          <h2 id="fleet-scenarios-heading" className="mt-3 text-balance font-display text-[30px] font-extrabold leading-[33px] tracking-tight text-[#111827] md:text-[36px] md:leading-[40px]">
            {t('heading')}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8 flex min-w-0 items-start gap-3 rounded-2xl border border-[#ffc400]/70 bg-[#fff8db] p-4 text-sm leading-relaxed text-[#3f3500] sm:p-5">
          <Ico name="solar:shield-warning-bold-duotone" className="mt-0.5 size-5 shrink-0 text-[#18181b]" />
          <p className="min-w-0">{t('disclaimer')}</p>
        </div>

        <div
          role="region"
          aria-labelledby="fleet-scenarios-heading"
          className="mt-10 grid min-w-0 gap-8 xl:gap-10"
        >
          <div className="min-w-0">
            <RideDispatchDemo />
          </div>
          <div className="min-w-0"><FleetTelemetryDemo /></div>
          <div className="min-w-0"><DepotPlannerDemo /></div>
          <div className="min-w-0"><ComplianceReportDemo /></div>
          <div className="min-w-0"><HybridRolloutDemo /></div>
        </div>
      </div>
    </section>
  );
}
