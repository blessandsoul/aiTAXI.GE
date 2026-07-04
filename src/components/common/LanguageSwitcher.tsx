'use client';

import { useRef, useEffect, useState, useSyncExternalStore, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from '@/i18n/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Ico } from '@/components/common/Ico';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'default' | 'mobile';
}

const emptySubscribe = () => () => {};

/* ── Loading overlay (rendered via portal so it covers the entire page) ── */
const LoadingOverlay = ({ targetLocale, theme }: { targetLocale: typeof LOCALES[number] | null, theme?: string }) => {
  // false on the server / first client render, true once mounted, needed so
  // createPortal only runs client-side (document.body is unavailable on SSR).
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  if (!mounted || !targetLocale) return null;

  return createPortal(
    <motion.div
      key="locale-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm transition-colors duration-0"
      style={{
        backgroundColor: theme === 'dark' ? 'oklch(0.11 0.005 270)' : 'oklch(0.97 0.005 80)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <Ico name="solar:refresh-bold-duotone" className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{targetLocale.flag}</span>
          <span className={cn(
            "text-sm font-medium text-muted-foreground",
            targetLocale.code === 'ka' && "font-(family-name:--font-noto-georgian)"
          )}>
            {targetLocale.label}
          </span>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export const LanguageSwitcher = ({ variant = 'default' }: LanguageSwitcherProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [targetLocale, setTargetLocale] = useState<typeof LOCALES[number] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = useLocale();
  const currentLanguage = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0];

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    const target = LOCALES.find((l) => l.code === newLocale) || null;
    setTargetLocale(target);
    setIsOpen(false);

    startTransition(() => {
      router.push(pathname, { locale: newLocale });
    });
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border/50 px-3 py-1.5 text-sm font-medium",
            "transition-all duration-200 ease-out",
            "hover:bg-muted hover:brightness-110 active:scale-[0.98]",
            isOpen && "bg-muted",
            isPending && "opacity-60 pointer-events-none"
          )}
          aria-label="Switch language"
          aria-expanded={isOpen}
        >
          <Ico name="solar:global-bold-duotone" className="h-4 w-4" />
          <span className={cn("hidden sm:inline", currentLanguage.code === 'ka' && "font-(family-name:--font-noto-georgian)")}>{currentLanguage.label}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
          <Ico name="solar:alt-arrow-down-bold-duotone" className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={variant === 'mobile' ? { opacity: 0, y: 8 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={variant === 'mobile' ? { opacity: 0, y: 8 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute right-0 z-50 min-w-40 overflow-hidden rounded-lg border border-border/50 bg-popover shadow-lg",
                variant === 'mobile'
                  ? "bottom-full mb-2"
                  : "top-full mt-2"
              )}
            >
              {LOCALES.map((locale) => (
                <button
                  key={locale.code}
                  type="button"
                  onClick={() => switchLocale(locale.code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    currentLocale === locale.code
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span className="text-lg leading-none">{locale.flag}</span>
                  <span className={locale.code === 'ka' ? "font-(family-name:--font-noto-georgian)" : ""}>{locale.label}</span>
                  {currentLocale === locale.code && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen loading overlay during locale transition */}
      <AnimatePresence>
        {isPending && <LoadingOverlay targetLocale={targetLocale} theme={resolvedTheme} />}
      </AnimatePresence>
    </>
  );
};
