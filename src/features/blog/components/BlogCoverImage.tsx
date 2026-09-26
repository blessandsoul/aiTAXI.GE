import Image from 'next/image';

const SAFE_COVER = /^\/images\/blog-covers\/[a-z0-9][a-z0-9._-]*\.(?:jpe?g|png|webp|avif)$/i;

export function getSafeBlogCoverImage(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const source = value.trim();
  return SAFE_COVER.test(source) && !source.includes('..') ? source : null;
}

export function BlogCoverImage({ src, alt, className, priority = false }: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return <span className={className}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 760px" priority={priority} /></span>;
}
