import React from 'react'
import type { MdxFile, PageMapItem } from 'nextra'
import { Icon } from '@iconify/react'
import { useRouter } from 'nextra/hooks'
import { GameFrame } from '../components/GameFrame'
import { GameDescription } from '../components/GameDescription'
import { CommentsSection } from '../components/CommentsSection'
import { RightRailGames } from '../components/RightRailGames'
import type { FrontMatter } from '../types'

interface DefaultLayoutProps {
  children: React.ReactNode
  frontMatter: FrontMatter
  pageMap?: PageMapItem[]
}

function isMdxFile(item: PageMapItem): item is MdxFile {
  return 'frontMatter' in item && 'name' in item
}

function collectGames(pageMap: PageMapItem[], locale: string, currentTitle?: string) {
  const games: FrontMatter[] = []

  const walk = (items: PageMapItem[]) => {
    items.forEach((item) => {
      if ('children' in item) {
        walk(item.children)
        return
      }

      if (!isMdxFile(item)) return

      const route = item.route || ''
      if (!route.startsWith(`/${locale}/`) || item.name === 'index') return

      const itemFrontMatter = item.frontMatter || {}
      if (itemFrontMatter.game && itemFrontMatter.title && itemFrontMatter.title !== currentTitle) {
        games.push({
          ...itemFrontMatter,
          slug: route
        })
      }
    })
  }

  walk(pageMap)
  return games
}

function AdSlot({ image, href }: { image?: string; href?: string }) {
  if (!image) return null

  const content = (
    <div className="rounded-2xl bg-[#1a1a2b] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      <p className="mb-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#8e92b5]">
        Advertisement
      </p>
      <img src={image} alt="Advertisement" className="w-full rounded-xl object-cover" />
    </div>
  )

  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}

export function DefaultLayout({
  children,
  frontMatter,
  pageMap = []
}: DefaultLayoutProps) {
  const router = useRouter()
  const locale = router.locale || (frontMatter.locale === 'zh' ? 'zh' : 'en')
  const [expanded, setExpanded] = React.useState(false)
  const allGames = React.useMemo(
    () => collectGames(pageMap, locale, frontMatter.title),
    [frontMatter.title, locale, pageMap]
  )

  const relatedGames = allGames.slice(0, 6)
  const recommendedGames = allGames.slice(6, 12)

  return (
    <main className="min-h-screen bg-[#10111b]">
      <div className="mx-auto max-w-[1660px] px-3 py-3 lg:px-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="space-y-4">
            {frontMatter.game && (
              <GameFrame
                src={frontMatter.game}
                title={frontMatter.title || 'Game'}
                cover={frontMatter.cover}
              />
            )}

            {frontMatter.bottomAdImage && (
              <AdSlot image={frontMatter.bottomAdImage} href={frontMatter.bottomAdHref} />
            )}

            <div className="overflow-hidden rounded-[14px] bg-[#171824] shadow-[0_12px_36px_rgba(0,0,0,0.25)] ring-1 ring-[#26283b]">
              <div
                className={`relative overflow-hidden transition-[max-height] duration-500 ${
                  expanded ? 'max-h-[4000px]' : 'max-h-[720px]'
                }`}
              >
                <div className="space-y-5 px-5 pb-5 pt-5">
                  <div className="rounded-[14px] bg-[#13141f] p-5 ring-1 ring-[#24263a]">
                    <div className="space-y-5">
                      <GameDescription title="Game Description" description={frontMatter.description} />
                      <article className="prose max-w-none dark:prose-invert">{children}</article>
                    </div>
                  </div>
                </div>

                {!expanded && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#171824] via-[#171824]/96 to-transparent" />
                )}
              </div>

              <div className="border-t border-[#282a3d] px-5 py-4 text-center">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-lg text-[#aab0da] transition-colors hover:text-white"
                >
                  <span>{expanded ? 'Show less' : 'Show more'}</span>
                  <Icon
                    icon={
                      expanded
                        ? 'material-symbols:expand-less-rounded'
                        : 'material-symbols:expand-more-rounded'
                    }
                    className="h-5 w-5"
                  />
                </button>
              </div>

              <div className="px-5 pb-5">
                <CommentsSection title="Comment" />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <AdSlot image={frontMatter.rightAdImage} href={frontMatter.rightAdHref} />
            <RightRailGames title="Related Games" games={relatedGames} />
            <RightRailGames
              title="Recommended Games"
              games={recommendedGames.length ? recommendedGames : relatedGames.slice(0, 4)}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
