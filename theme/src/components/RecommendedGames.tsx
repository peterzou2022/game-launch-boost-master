import React from 'react'
import type { PageMapItem } from 'nextra'
import { useRouter } from 'nextra/hooks'
import { GameCard } from './GameCard'
import { getRecommendedGames } from '../utils/getGamesByCategory'
import { Icon } from '@iconify/react'

const RECOMMENDED_LIMIT = 8

interface RecommendedGamesProps {
  pageMap: PageMapItem[]
  title?: string
  limit?: number
}

export function RecommendedGames({
  pageMap,
  title = 'Recommended Games',
  limit = RECOMMENDED_LIMIT
}: RecommendedGamesProps) {
  const router = useRouter()
  const { asPath, locale = 'en' } = router
  const games = React.useMemo(
    () => getRecommendedGames(pageMap, asPath, locale, limit),
    [pageMap, asPath, locale, limit]
  )

  if (games.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-theme-text-primary">
        <Icon icon="material-symbols:recommend" className="h-6 w-6 text-[#9b7b4f] dark:text-[#d5b27b]" />
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {games.map((game) => (
          <GameCard
            key={game.slug}
            href={game.slug || '#'}
            title={game.title || ''}
            description={game.description}
            cover={game.cover}
            category={game.category}
            date={game.date}
          />
        ))}
      </div>
    </section>
  )
}
