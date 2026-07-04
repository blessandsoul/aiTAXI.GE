"use client";

import { usePathname } from "@/i18n/navigation";
import { LandingNav } from "@/features/home/components/LandingNav";
import { LandingFooter } from "@/features/home/components/LandingFooter";
import { SmoothScroll } from "@/components/SmoothScroll";
// Built-in chat bubble temporarily hidden, an external chat script will be
// embedded instead. Re-enable by uncommenting this import and the <ChatAssistant /> below.
// import { ChatAssistant } from "@/features/chat-assistant";

interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell = ({ children }: LayoutShellProps) => {
  // The landing header/footer are the global header/footer, rendered on every
  // page. LandingNav is position:fixed (it floats over content), so non-hero
  // pages need top padding to clear it; the home hero pulls itself flush under
  // the floating nav via -mt-16, so it must stay flush (no top padding) or a
  // white gap opens. usePathname() from next-intl returns the locale-stripped
  // path, so "/" matches across all locales.
  const pathname = usePathname();
  const isFlushHero = pathname === "/";

  return (
    <div className="flex min-h-dvh flex-col">
      <SmoothScroll />
      <LandingNav />
      <main className={isFlushHero ? "flex-1" : "flex-1 pt-24"}>{children}</main>
      <LandingFooter />
    </div>
  );
};
