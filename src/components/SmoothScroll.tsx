'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from '@/i18n/navigation';

/* =========================================================================
   SmoothScroll, global Lenis smooth-scroll, mounted once in LayoutShell.
   Initializes Lenis on mount, drives it with a requestAnimationFrame loop, and
   destroys it on unmount. Bails out entirely under prefers-reduced-motion (no
   smoothing, native scroll only). Lenis listens to the native scroll, so the
   nav's scrollIntoView anchor jumps and href="#..." links keep working.

   Route-change reset: Lenis keeps its own scroll state across client-side
   navigations, so a new page opened at the OLD scroll offset (deep down the
   page). On every pathname change we hard-reset to the top, unless the URL
   carries a #hash (anchor navigation must keep its target).
   ========================================================================= */

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New route = start at the top (native jump, no smooth animation), except
  // anchor navigations like /#products where the browser must land on the hash.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
