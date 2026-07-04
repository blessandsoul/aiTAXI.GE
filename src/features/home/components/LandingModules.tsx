import { useTranslations } from 'next-intl';
import { Ico } from '@/components/common/Ico';

/* =========================================================================
   LandingModules, "#products": the aiTAXI platform modules.
   Asymmetric bento (one wide lead cell + four support cells), NOT an
   equal-card row. Cells reuse the glass-card motif from globals.css.
   Copy lives in home.modules.*; entity keywords stay in the visible text
   (robotaxi, dispatch, telemetry, teleoperation, depot) for GEO.
   ========================================================================= */

const SUPPORT_MODULES = [
  { key: 'telemetry', icon: 'solar:chart-2-bold-duotone' },
  { key: 'remote', icon: 'solar:headphones-round-sound-bold-duotone' },
  { key: 'depot', icon: 'solar:bolt-circle-bold-duotone' },
  { key: 'safety', icon: 'solar:shield-check-bold-duotone' },
] as const;

export function LandingModules() {
  const t = useTranslations('home.modules');

  return (
    <section id="products" className="scroll-mt-24 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#b45309]">
          {t('eyebrow')}
        </p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
          {t('heading')}
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
          {t('subtitle')}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {/* Lead cell: dispatch, spans wide */}
          <article className="glass-card group relative overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg md:col-span-4 md:p-10">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,196,0,0.35) 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400]/15 text-[#b45309]">
              <Ico name="solar:routing-2-bold-duotone" className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-balance font-display text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              {t('dispatch.title')}
            </h3>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-neutral-600 md:text-base">
              {t('dispatch.desc')}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[1, 2, 3].map((n) => (
                <li
                  key={n}
                  className="rounded-full border border-[#ffc400]/40 bg-[#ffc400]/10 px-3 py-1 text-xs font-medium text-neutral-800"
                >
                  {t(`dispatch.chip${n}`)}
                </li>
              ))}
            </ul>
          </article>

          {/* Tall support cell */}
          <article className="glass-card rounded-3xl border border-[#e5e5e5] bg-white p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg md:col-span-2">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400]/15 text-[#b45309]">
              <Ico name={SUPPORT_MODULES[0].icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-balance font-display text-xl font-bold tracking-tight text-neutral-900">
              {t('telemetry.title')}
            </h3>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-neutral-600">
              {t('telemetry.desc')}
            </p>
          </article>

          {/* Three lower cells, deliberately uneven spans (2/2/2 under a 4+2 top) */}
          {SUPPORT_MODULES.slice(1).map(({ key, icon }) => (
            <article
              key={key}
              className="glass-card rounded-3xl border border-[#e5e5e5] bg-white p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg md:col-span-2"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400]/15 text-[#b45309]">
                <Ico name={icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-balance font-display text-xl font-bold tracking-tight text-neutral-900">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-neutral-600">
                {t(`${key}.desc`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
