import React from 'react'
import Link from 'next/link'
import type { FrontMatter } from '../types'

interface RightRailGamesProps {
  title: string
  games: FrontMatter[]
}

export function RightRailGames({ title, games }: RightRailGamesProps) {
  if (!games.length) return null

  return (
    <section className="rounded-[14px] bg-[#171824] p-3 shadow-[0_10px_32px_rgba(0,0,0,0.24)] ring-1 ring-[#26283b]">
      <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#aeb4da]">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={game.slug || '#'}
            className="group overflow-hidden rounded-[10px] bg-[#22243a] ring-1 ring-[#30324b] transition-transform hover:-translate-y-0.5"
          >
            <img
              src={game.cover || '/default-cover.jpg'}
              alt={game.title || 'Game'}
              className="aspect-[4/3] w-full object-cover"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
