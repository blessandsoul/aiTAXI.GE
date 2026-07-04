import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type PageItem = number | '…'

/* Numbered window: always 1 and last, current ±1, ellipsis for gaps.
   A gap of exactly one page shows the page itself instead of '…'. */
function pageWindow(current: number, total: number): PageItem[] {
    const wanted = new Set<number>([1, total, current - 1, current, current + 1])
    const pages = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
    const out: PageItem[] = []
    let prev = 0
    for (const p of pages) {
        if (p - prev === 2) out.push(prev + 1)
        else if (p - prev > 2) out.push('…')
        out.push(p)
        prev = p
    }
    return out
}

interface PaginationProps {
    page: number
    totalPages: number
    prevLabel: string
    nextLabel: string
}

/* Server component, pure links, no client JS. Page 1 keeps the clean /blog URL. */
export function Pagination({ page, totalPages, prevLabel, nextLabel }: PaginationProps) {
    if (totalPages <= 1) return null

    const href = (n: number) =>
        (n === 1 ? '/blog' : { pathname: '/blog', query: { page: String(n) } }) as never

    const arrowPill =
        'rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#525252] transition-colors hover:border-[#ffc400]/40 hover:text-neutral-900'
    const numPill =
        'flex h-9 min-w-9 items-center justify-center rounded-full border px-2 text-sm font-medium transition-colors'

    return (
        <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && (
                <Link rel="prev" href={href(page - 1)} className={arrowPill}>
                    ← <span className="hidden sm:inline">{prevLabel}</span>
                </Link>
            )}

            {pageWindow(page, totalPages).map((item, i) =>
                item === '…' ? (
                    <span key={`gap-${i}`} className="px-1 text-sm text-[#525252]" aria-hidden="true">
                        …
                    </span>
                ) : item === page ? (
                    <span
                        key={item}
                        aria-current="page"
                        className={cn(numPill, 'border-neutral-900 bg-neutral-900 text-white')}
                    >
                        {item}
                    </span>
                ) : (
                    <Link
                        key={item}
                        href={href(item)}
                        className={cn(
                            numPill,
                            'border-[#e5e5e5] bg-white text-[#525252] hover:border-[#ffc400]/40 hover:text-neutral-900',
                        )}
                    >
                        {item}
                    </Link>
                ),
            )}

            {page < totalPages && (
                <Link rel="next" href={href(page + 1)} className={arrowPill}>
                    <span className="hidden sm:inline">{nextLabel}</span> →
                </Link>
            )}
        </nav>
    )
}
