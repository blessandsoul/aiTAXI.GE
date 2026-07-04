'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { Ico } from '@/components/common/Ico'

interface TOCItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    content: string
}

const emptySubscribe = () => () => {}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('')

    // false on the server and the first client render, true once mounted. The
    // original parsed headings in an effect (client-only, since DOMParser is
    // browser-only); gating the parse on this flag keeps DOMParser off the
    // server and makes the first client render match the SSR output (empty TOC).
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    )

    // Parse headings from HTML content (client-only, after mount).
    const items = useMemo<TOCItem[]>(() => {
        if (!mounted) return []

        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        const headings = doc.querySelectorAll('h2, h3')
        const tocItems: TOCItem[] = []

        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`
            tocItems.push({
                id,
                text: heading.textContent || '',
                level: parseInt(heading.tagName[1]),
            })
        })

        return tocItems
    }, [content, mounted])

    // Observe headings for active state
    useEffect(() => {
        if (!items.length) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
        )

        items.forEach((item) => {
            const el = document.getElementById(item.id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [items])

    if (items.length < 2) return null

    return (
        <nav aria-label="Table of Contents" className="rounded-xl border border-[#e5e5e5] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-3">
                <Ico name="solar:list-bold-duotone" className="w-4 h-4 text-[#ffc400]" />
                <span>სარჩელი</span>
            </div>
            <ol className="space-y-1">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault()
                                const el = document.getElementById(item.id)
                                if (el) {
                                    const top = el.getBoundingClientRect().top + window.scrollY - 100
                                    window.scrollTo({ top, behavior: 'smooth' })
                                }
                            }}
                            className={cn(
                                "block py-1 text-sm transition-all duration-200 hover:text-[#ffc400]",
                                item.level === 3 && "pl-4",
                                activeId === item.id
                                    ? "text-[#ffc400] font-medium"
                                    : "text-[#525252]"
                            )}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ol>
        </nav >
    )
}
