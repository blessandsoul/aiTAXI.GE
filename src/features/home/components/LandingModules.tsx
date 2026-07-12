import { useTranslations } from 'next-intl';

import { Ico } from '@/components/common/Ico';

const MODULES = [
  { key: 'dispatch', icon: 'solar:routing-2-bold-duotone' },
  { key: 'telemetry', icon: 'solar:radar-2-bold-duotone' },
  { key: 'remote', icon: 'solar:headphones-round-sound-bold-duotone' },
  { key: 'depot', icon: 'solar:battery-charge-bold-duotone' },
  { key: 'safety', icon: 'solar:document-text-bold-duotone' },
] as const;

const LEVELS = [
  { key: 'task', copySuffix: '.task', icon: 'solar:clipboard-list-bold-duotone' },
  { key: 'action', copySuffix: '.action', icon: 'solar:settings-bold-duotone' },
  { key: 'result', copySuffix: '.result', icon: 'solar:check-circle-bold-duotone' },
] as const;

export function LandingModules() {
  const t = useTranslations('product.modules');
  const translate = (key: string) => t(key as never);

  return (
    <section id="products" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#9a6c00]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8 flex min-w-0 items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 sm:p-5">
          <Ico name="solar:shield-warning-bold-duotone" className="mt-0.5 size-5 shrink-0 text-[#9a6c00]" />
          <p className="min-w-0">{t('prelaunch')}</p>
        </div>

        <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-2">
          {MODULES.map(({ key, icon }, index) => (
            <article
              key={key}
              className={`glass-card min-w-0 rounded-3xl border border-neutral-200/80 bg-white/80 p-5 shadow-[0_18px_44px_-36px_rgba(0,0,0,0.45)] sm:p-7 ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <header className="flex min-w-0 items-start gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400]/16 text-[#8a6200]">
                  <Ico name={icon} className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 text-balance font-display text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    {translate(`${key}.title`)}
                  </h3>
                </div>
              </header>

              <dl className={`mt-6 grid min-w-0 gap-3 ${index === 0 ? 'lg:grid-cols-3' : ''}`}>
                {LEVELS.map((level) => (
                  <div
                    key={level.key}
                    className="min-w-0 rounded-2xl border border-neutral-200/75 bg-white px-4 py-4"
                  >
                    <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-neutral-500">
                      <Ico name={level.icon} className="size-4 shrink-0 text-[#9a6c00]" />
                      {translate(`${level.key}Label`)}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-neutral-700">
                      {translate(`${key}${level.copySuffix}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
