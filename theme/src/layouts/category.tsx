import React, { useEffect, useState } from 'react'
import type { PageMapItem } from 'nextra'
import { GameCard } from '../components/GameCard'
import { Breadcrumb } from '../components/Breadcrumb'
import { getGamesInCurrentDirectory } from '../utils/getGamesByCategory'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useRouter } from 'nextra/hooks'

interface CategoryLayoutProps {
  children: React.ReactNode
  pageMap: PageMapItem[]
}

export function CategoryLayout({ children, pageMap }: CategoryLayoutProps) {
  const router = useRouter()
  const pathLocale = router.pathname.split('/')[1]
  const locale = pathLocale || router.locale || 'en'
  const { query } = router
  const currentPage = Number(query.page) || 1
  const [isClient, setIsClient] = useState(false)
  const pageSize = 12

  useEffect(() => {
    setIsClient(true)
  }, [])

  const allGames = getGamesInCurrentDirectory(pageMap, router.pathname, locale)
  const totalGames = allGames.length
  const totalPages = Math.ceil(totalGames / pageSize)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  const games = allGames.slice(start, end)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const buildPageUrl = (page: number) => {
    const { pathname, query } = router
    return {
      pathname,
      query: { ...query, page }
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f0e4] dark:bg-[#130f0c]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb />

        <div className="mb-8 overflow-hidden rounded-[22px] border border-[#d8cfbf] bg-white shadow-sm dark:border-[#322b24] dark:bg-[#1e1813]">
          <div className="px-6 py-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7355] dark:text-[#bba88a]">
              Game Collection
            </p>
            <h1 className="text-3xl font-semibold text-theme-text-primary">
              {locale === 'zh' ? '分类游戏库' : 'Browse by Category'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-theme-text-secondary">
              {locale === 'zh'
                ? '这一层用于承接同一类游戏。后续只需要继续往对应目录放 MDX 文件，卡片列表会自动继承当前模板布局。'
                : 'Use this archive layout for a full category landing page. Add new MDX files to the same folder and the card grid keeps this template automatically.'}
            </p>
          </div>
        </div>

        {isClient && (
          <>
            {games.length > 0 ? (
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {games.map((game) => (
                  <GameCard
                    key={game.slug}
                    title={game.title || 'Untitled Game'}
                    description={game.description}
                    cover={game.cover}
                    category={game.category}
                    date={game.date}
                    tags={game.tags}
                    author={game.author}
                    href={game.slug || '#'}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-[#d8cfbf] bg-white py-12 text-center dark:border-[#322b24] dark:bg-[#1e1813]">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ede2] dark:bg-[#241d17]">
                  <Icon icon="material-symbols:games-outline" className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-theme-text-primary">No Games Found</h3>
                <p className="text-sm text-theme-text-secondary">
                  There are no games in this category yet.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-[20px] border border-[#d8cfbf] bg-white px-5 py-4 dark:border-[#322b24] dark:bg-[#1e1813]">
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:apps" className="h-4 w-4 text-theme-text-secondary" />
                  <span className="text-sm text-theme-text-secondary">{totalGames}</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasPrevPage && (
                    <Link
                      href={buildPageUrl(currentPage - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-theme-text-secondary transition-colors hover:bg-[#f3ede2] hover:text-theme-text-primary dark:hover:bg-[#241d17]"
                    >
                      <Icon icon="material-symbols:chevron-left" className="h-5 w-5" />
                    </Link>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={buildPageUrl(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                          page === currentPage
                            ? 'bg-[#2f2417] text-white dark:bg-[#f0e2ce] dark:text-[#1e1712]'
                            : 'text-theme-text-secondary transition-colors hover:bg-[#f3ede2] hover:text-theme-text-primary dark:hover:bg-[#241d17]'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>

                  {hasNextPage && (
                    <Link
                      href={buildPageUrl(currentPage + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-theme-text-secondary transition-colors hover:bg-[#f3ede2] hover:text-theme-text-primary dark:hover:bg-[#241d17]"
                    >
                      <Icon icon="material-symbols:chevron-right" className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className="prose mt-8 rounded-[20px] border border-[#d8cfbf] bg-white p-6 shadow-sm dark:border-[#322b24] dark:bg-[#1e1813]">
          {children}
        </div>
      </div>
    </main>
  )
}
