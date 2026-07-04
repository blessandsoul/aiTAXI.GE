import { useTranslations } from 'next-intl';

/* =========================================================================
   LandingHow: how a taxi company adopts aiTAXI, three numbered steps in an
   offset editorial column (left-aligned rail, not a centered card row).
   Copy lives in home.how.*.
   ========================================================================= */

const STEPS = ['audit', 'integrate', 'operate'] as const;

export function LandingHow() {
  const t = useTranslations('home.how');

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[minmax(280px,420px)_1fr] md:gap-16">
        {/* Left rail: heading sticks while steps scroll on desktop */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#b45309]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-neutral-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Step rail */}
        <ol className="relative flex flex-col gap-6 border-l border-[#e5e5e5] pl-8 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step} className="relative">
              <span
                className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-[#ffc400] font-mono text-[11px] font-bold text-neutral-950"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="text-balance font-display text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
                {t(`${step}.title`)}
              </h3>
              <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-neutral-600 md:text-base">
                {t(`${step}.desc`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
