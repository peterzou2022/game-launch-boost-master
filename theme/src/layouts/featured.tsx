import React from 'react'
import type { PageMapItem } from 'nextra'
import { Icon } from '@iconify/react'
import { useRouter } from 'nextra/hooks'
import { GameFrame } from '../components/GameFrame'
import { CommentsSection } from '../components/CommentsSection'
import { RightRailGames } from '../components/RightRailGames'
import { getAllGamePages, getGamesByCategory } from '../utils/getGamesByCategory'
import type { FrontMatter, ThemeConfig } from '../types'

interface FeaturedLayoutProps {
  children: React.ReactNode
  frontMatter: FrontMatter
  pageMap: PageMapItem[]
  themeConfig?: ThemeConfig
}

const HOMEPAGE_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is reaction time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reaction time is the delay between a stimulus and your response. A reaction time test measures this in milliseconds.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the average human reaction time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For visual stimuli, the average is about 200 to 250 milliseconds.'
      }
    }
  ]
}

const HOMEPAGE_FAQ_SCHEMA_ZH = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '什么是反应时间？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '反应时间是从刺激出现到做出动作之间的延迟，通常以毫秒为单位。'
      }
    },
    {
      '@type': 'Question',
      name: '人类平均反应时间是多少？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '视觉反应的常见平均值大约在 200 到 250 毫秒之间。'
      }
    }
  ]
}

function AdSlot({ image, href }: { image?: string; href?: string }) {
  if (!image) return null

  const content = (
    <div className="rounded-[14px] bg-[#171824] p-4 shadow-[0_10px_32px_rgba(0,0,0,0.24)] ring-1 ring-[#26283b]">
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

export function FeaturedLayout({
  children,
  frontMatter,
  pageMap,
  themeConfig
}: FeaturedLayoutProps) {
  const router = useRouter()
  const { locale = 'en', asPath } = router
  const [expanded, setExpanded] = React.useState(false)
  const isHomepage = asPath === '/' || asPath === '/en' || asPath === '/zh' || asPath === `/${locale}`
  const baseUrl = (themeConfig?.url || 'https://example.com').replace(/\/$/, '')
  const homepageUrl = locale === 'zh' ? `${baseUrl}/zh` : locale === 'en' ? `${baseUrl}/en` : baseUrl

  const categories = frontMatter.categories || []
  const categoryGames = React.useMemo(() => {
    if (isHomepage) {
      return getAllGamePages(pageMap, locale).slice(0, 12)
    }

    return categories.flatMap((category) => getGamesByCategory(pageMap, category, locale).slice(0, 12))
  }, [categories, isHomepage, locale, pageMap])

  const uniqueGames = React.useMemo(() => {
    const seen = new Set<string>()
    return categoryGames.filter((game) => {
      const key = game.slug || game.title || ''
      if (!key || seen.has(key) || game.title === frontMatter.title) return false
      seen.add(key)
      return true
    })
  }, [categoryGames, frontMatter.title])

  const relatedGames = uniqueGames.slice(0, 6)
  const recommendedGames = uniqueGames.slice(6, 12)

  const webAppSchema = React.useMemo(
    () =>
      isHomepage && frontMatter.game
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: frontMatter.title || (locale === 'zh' ? '反应时间测试' : 'Reaction Time Test'),
            description:
              frontMatter.description ||
              (locale === 'zh'
                ? '免费在线反应时间测试，测量你的反应速度。'
                : 'Free online reaction time test. Measure your reflex speed in milliseconds.'),
            url: homepageUrl,
            applicationCategory: 'Game',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
          }
        : null,
    [frontMatter.description, frontMatter.game, frontMatter.title, homepageUrl, isHomepage, locale]
  )

  const faqSchema = locale === 'zh' ? HOMEPAGE_FAQ_SCHEMA_ZH : HOMEPAGE_FAQ_SCHEMA

  return (
    <main className="min-h-screen bg-[#10111b]">
      {isHomepage && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          {webAppSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
          )}
        </>
      )}

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

            <div className="overflow-hidden rounded-[14px] bg-[#151622] shadow-[0_10px_28px_rgba(0,0,0,0.22)] ring-1 ring-[#26283b]">
              <div
                className={`relative overflow-hidden transition-[max-height] duration-500 ${
                  expanded ? 'max-h-[4000px]' : 'max-h-[720px]'
                }`}
              >
                <div className="space-y-5 px-5 pb-4 pt-5">
                  {frontMatter.description && (
                    <p className="text-[15px] leading-7 text-[#aab0da]">
                      {frontMatter.description}
                    </p>
                  )}
                  <article className="prose max-w-none dark:prose-invert">{children}</article>
                </div>

                {!expanded && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#151622] via-[#151622]/96 to-transparent" />
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

              <div className="border-t border-[#282a3d] px-5 pb-5 pt-4">
                <CommentsSection title="Homepage Comments" />
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
