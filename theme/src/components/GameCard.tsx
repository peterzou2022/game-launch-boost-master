import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

interface GameCardProps {
  title: string
  description?: string
  cover?: string
  href: string
  category?: string
  date?: string
  tags?: string[]
  author?: string
}

export function GameCard({
  title,
  description,
  cover = '/default-cover.jpg',
  href,
  category,
  date,
  tags,
  author
}: GameCardProps) {
  return (
    <div className="group overflow-hidden rounded-[18px] border border-[#d8cfbf] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-[#322b24] dark:bg-[#1e1813]">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-[#2f2417] text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 dark:bg-[#f0e2ce] dark:text-[#1e1712]">
              <Icon icon="material-symbols:play-arrow-rounded" className="h-8 w-8" />
            </div>
          </div>

          {category && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b4630] backdrop-blur-sm dark:bg-[#1e1813]/88 dark:text-[#e1ceb2]">
                {category}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-theme-text-primary">{title}</h3>

          {description && (
            <p className="mb-3 line-clamp-2 text-sm text-theme-text-secondary">{description}</p>
          )}

          {tags && tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f3ede2] px-2 py-0.5 text-xs text-[#6e5842] dark:bg-[#2b241d] dark:text-[#ccb79f]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#ece3d5] pt-3 text-xs text-theme-text-secondary dark:border-[#2f2923]">
            {author && (
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:person-outline" className="h-4 w-4" />
                <span>{author}</span>
              </div>
            )}

            {date && (
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:calendar-today-outline" className="h-4 w-4" />
                <span>{new Date(date).toISOString().split('T')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
