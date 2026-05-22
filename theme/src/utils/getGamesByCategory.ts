import type { MdxFile, PageMapItem } from 'nextra'
import type { FrontMatter } from '../types'

function isMdxFile(item: PageMapItem): item is MdxFile {
  return 'frontMatter' in item && 'name' in item
}

function normalize(value?: string) {
  return (value || '').trim().toLowerCase()
}

function isGamePage(frontMatter: FrontMatter = {}) {
  return !!frontMatter.game
}

function getAllGames(pageMap: PageMapItem[], locale: string) {
  const games: FrontMatter[] = []
  const seen = new Set<string>()

  const walk = (items: PageMapItem[]) => {
    items.forEach((item) => {
      if ('children' in item) {
        walk(item.children)
        return
      }

      if (!isMdxFile(item) || item.name === 'index') return

      const route = item.route || ''
      if (!route.startsWith(`/${locale}/`)) return

      const frontMatter = (item.frontMatter || {}) as FrontMatter
      if (!isGamePage(frontMatter)) return

      const key = normalize(frontMatter.title) || normalize(route)
      if (seen.has(key)) return
      seen.add(key)

      games.push({
        ...frontMatter,
        slug: route
      })
    })
  }

  walk(pageMap)
  return games
}

export function getGamesByCategory(
  pageMap: PageMapItem[],
  category: string,
  locale: string = 'en'
) {
  const target = normalize(category)
  return getAllGames(pageMap, locale).filter(
    (game) => normalize(game.category) === target
  )
}

export function getGamesInCurrentDirectory(
  pageMap: PageMapItem[],
  currentPath: string,
  locale: string = 'en'
) {
  const current = normalize(currentPath.split('/').pop())
  return getAllGames(pageMap, locale).filter(
    (game) =>
      normalize(game.category) === current ||
      normalize(game.slug?.split('/').pop()) === current
  )
}

export function getRecommendedGames(
  pageMap: PageMapItem[],
  currentRoute: string,
  locale: string,
  limit: number = 8
): FrontMatter[] {
  const games = getAllGames(pageMap, locale)
  const currentGame = games.find(
    (game) => (game.slug || '').replace(/\/$/, '') === currentRoute.replace(/\/$/, '')
  )

  if (!currentGame) {
    return games.slice(0, limit)
  }

  const sameCategory = games.filter(
    (game) =>
      game.slug !== currentGame.slug &&
      normalize(game.category) === normalize(currentGame.category)
  )

  if (sameCategory.length > 0) {
    return sameCategory.slice(0, limit)
  }

  return games
    .filter((game) => game.slug !== currentGame.slug)
    .slice(0, limit)
}
