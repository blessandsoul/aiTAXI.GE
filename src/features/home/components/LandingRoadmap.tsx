import { useTranslations } from 'next-intl';

/* =========================================================================
   LandingRoadmap: honest early-access roadmap. Three phases with a status
   chip each (now / next / later). No invented customers, no fake dates:
   the product is pre-launch and the page says so plainly.
   Copy lives in home.roadmap.*.
   ========================================================================= */

const PHASES = [
  { key: 'now', live: true },
  { key: 'next', live: false },
  { key: 'later', live: false },
] as const;

export function LandingRoadmap() {
  const t = useTranslations('home.roadmap');

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="md:max-w-xl">
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

        {/* Offset phase strip: first card drops lower on desktop for rhythm */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PHASES.map(({ key, live }, i) => (
            <article
              key={key}
              className={`glass-card rounded-3xl p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 ${
                i === 1 ? 'md:translate-y-6' : i === 2 ? 'md:translate-y-12' : ''
              }`}
            >
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  live
                    ? 'bg-[#ffc400]/25 text-[#6b4400]'
                    : 'bg-[#fff3d6] text-[#8a6a1f]'
                }`}
              >
                {live && (
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff8f00] opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff8f00]" />
                  </span>
                )}
                {t(`${key}.chip`)}
              </span>
              <h3 className="mt-4 text-balance font-display text-xl font-bold tracking-tight text-neutral-900">
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
