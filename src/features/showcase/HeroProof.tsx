'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';

import { Ico } from '@/components/common/Ico';
import { cn } from '@/lib/utils';
import {
  createHeroTimelinePlayer,
} from './taxi-demos/timeline.mjs';
import {
  createTaxiDemoVisibilityGate,
} from './taxi-demos/taxi-demo-visibility.mjs';

const CARS = [
  { id: 1, state: 'moving' },
  { id: 2, state: 'moving' },
  { id: 3, state: 'idle' },
  { id: 4, state: 'moving' },
  { id: 5, state: 'moving' },
  { id: 6, state: 'idle' },
  { id: 7, state: 'hero' },
  { id: 8, state: 'moving' },
  { id: 9, state: 'moving' },
  { id: 10, state: 'moving' },
  { id: 11, state: 'idle' },
  { id: 12, state: 'moving' },
] as const;

type HeroBeat = 'fleet' | 'blocked' | 'assisting' | 'resolved';
type DemoController = ReturnType<typeof createTaxiDemoVisibilityGate>;

export function HeroProof() {
  const t = useTranslations('product.proof');
  const reduced = Boolean(useReducedMotion());
  const [beat, setBeat] = useState<HeroBeat>('fleet');
  const cardRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<DemoController | null>(null);

  useEffect(() => {
    const player = createHeroTimelinePlayer({
      onFrame: (nextBeat: HeroBeat) => setBeat(nextBeat),
    });
    const controller = createTaxiDemoVisibilityGate({
      target: cardRef.current,
      player,
      reducedMotion: reduced,
    });
    controllerRef.current = controller;

    return () => {
      controller.cleanup();
      player.stop();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [reduced]);

  const blocked = beat === 'blocked' || beat === 'assisting';
  const assisting = beat === 'assisting';
  const resolved = beat === 'resolved';

  return (
    <div
      ref={cardRef}
      className="min-w-0 overflow-hidden rounded-3xl border border-neutral-200 bg-white/90 p-4 shadow-[0_28px_70px_-48px_rgba(0,0,0,0.55)] backdrop-blur-sm [contain:inline-size] sm:p-5 md:p-6"
    >
      <div className="min-w-0 rounded-2xl bg-[#141418] p-3.5 sm:p-4">
        <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
            <Ico name="solar:routing-2-bold-duotone" className="size-4 shrink-0 text-[#ffc400]" />
            <span className="truncate">{t('fleet')}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-semibold text-white/60">
            <Ico name="solar:shield-check-bold-duotone" className="size-3.5 text-[#ffc400]" />
            {t('simulation')}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
          {CARS.map((car) => {
            const featured = car.state === 'hero';
            const unsafe = featured && blocked;
            const safe = featured && resolved;
            return (
              <motion.div
                key={car.id}
                initial={false}
                animate={reduced ? {} : { scale: unsafe ? [1, 1.04, 1] : 1 }}
                transition={{ duration: 0.7, repeat: unsafe ? Infinity : 0, ease: 'easeInOut' }}
                className={cn(
                  'flex min-w-0 flex-col gap-2 rounded-lg border px-2 py-2',
                  unsafe
                    ? 'border-red-400/45 bg-red-400/10'
                    : safe
                      ? 'border-[#ffc400]/50 bg-[#ffc400]/10'
                      : 'border-white/[0.07] bg-white/[0.04]',
                )}
              >
                <span className="font-mono text-[9px] text-white/40 tabular-nums">
                  AV-{String(car.id).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Ico
                    name={unsafe ? 'solar:danger-triangle-bold-duotone' : 'solar:routing-2-bold-duotone'}
                    className={cn('size-3.5', unsafe ? 'text-red-300' : safe ? 'text-[#ffc400]' : 'text-white/35')}
                  />
                  <span
                    className={cn(
                      'h-1 min-w-0 flex-1 rounded-full',
                      unsafe ? 'bg-red-400' : safe || car.state === 'moving' ? 'bg-[#ffc400]' : 'bg-white/15',
                    )}
                  />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: blocked || resolved ? 1 : 0.45, y: blocked || resolved ? 0 : 5 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
        className="mt-3 min-w-0 rounded-2xl border border-neutral-200 bg-white p-3.5"
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
            <Ico name="solar:headphones-round-sound-bold-duotone" className="size-4 shrink-0 text-[var(--brand)]" />
            <span className="truncate">{t('assist')}</span>
          </span>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold',
              resolved ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800',
            )}
          >
            <Ico
              name={resolved ? 'solar:check-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'}
              className="size-3.5"
            />
            {resolved ? t('resolved') : assisting ? t('assisting') : t('stuck')}
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-neutral-700">{t('assistNote')}</p>
      </motion.div>

      <div className="mt-3 flex min-w-0 items-start justify-between gap-3">
        <p className="min-w-0 text-[10.5px] leading-relaxed text-neutral-500">{t('note')}</p>
        <button
          type="button"
          onClick={() => controllerRef.current?.replay()}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-[11px] font-bold text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
        >
          <Ico name="solar:refresh-bold-duotone" className="size-4" />
          {t('replay')}
        </button>
      </div>
    </div>
  );
}
