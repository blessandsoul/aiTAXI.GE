import { cn } from '@/lib/utils';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionContainer = ({ children, className }: SectionContainerProps) => {
  return (
    <section data-family-shell="true" className={cn("mx-auto w-[calc(100%-48px)] max-w-[1216px]", className)}>
      {children}
    </section>
  );
};
