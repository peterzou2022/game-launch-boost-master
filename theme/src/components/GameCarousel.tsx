import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { GameCard } from './GameCard'
import type { FrontMatter } from '../types'

interface GameCarouselProps {
  title: string
  games: FrontMatter[]
}

export function GameCarousel({ title, games }: GameCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerRow = 4
  const rows = 2
  const itemsPerPage = itemsPerRow * rows
  const showNavigation = games.length > itemsPerPage
  const canGoPrev = currentIndex > 0
  const canGoNext = (currentIndex + 1) * itemsPerPage < games.length

  const nextSlide = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1)
  }

  const prevSlide = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1)
  }

  const visibleGames = games.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  const actualRows = Math.ceil(visibleGames.length / itemsPerRow)

  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-theme-text-primary">{title}</h2>
        {showNavigation && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#d8cfbf] bg-white transition-colors dark:border-[#322b24] dark:bg-[#1e1813] ${
                canGoPrev
                  ? 'text-theme-text-secondary hover:bg-[#f3ede2] hover:text-theme-text-primary dark:hover:bg-[#241d17]'
                  : 'cursor-not-allowed text-gray-300 dark:text-gray-600'
              }`}
              disabled={!canGoPrev}
            >
              <Icon icon="material-symbols:chevron-left" className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#d8cfbf] bg-white transition-colors dark:border-[#322b24] dark:bg-[#1e1813] ${
                canGoNext
                  ? 'text-theme-text-secondary hover:bg-[#f3ede2] hover:text-theme-text-primary dark:hover:bg-[#241d17]'
                  : 'cursor-not-allowed text-gray-300 dark:text-gray-600'
              }`}
              disabled={!canGoNext}
            >
              <Icon icon="material-symbols:chevron-right" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <div className="grid gap-6">
        {Array.from({ length: actualRows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visibleGames
              .slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
              .map((game) => (
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
        ))}
      </div>
    </div>
  )
}
