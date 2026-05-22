import * as React from 'react'
import { useRouter } from 'nextra/hooks'
import Link from 'next/link'
import { LocaleSwitch } from './LocaleSwitch'
import { ThemeSwitch } from './ThemeSwitch'
import { Icon } from '@iconify/react'
import { useThemeConfig } from '../contexts'

type MenuItem = {
  title: string
  type: string
  route?: string
  href?: string
  items?: Record<string, MenuItem>
  key?: string
}

interface NavbarProps {
  meta?: any
  collapsed: boolean
  onToggle: () => void
}

interface ThemeConfig {
  features?: {
    i18n?: boolean
    themeSwitch?: boolean
  }
}

const utilityLinks = [
  { title: 'About Us', href: '#' },
  { title: 'Contact Us', href: '#' },
  { title: 'DMCA', href: '#' },
  { title: 'Privacy Policy', href: '#' },
  { title: 'Terms of Service', href: '#' }
]

const navIcons: Record<string, string> = {
  Newest: '🆕',
  Trending: '🔥',
  'Top Popular': '📈',
  'Favorite Games': '❤️'
}

export function Navbar({ meta, collapsed, onToggle }: NavbarProps) {
  const router = useRouter()
  const { asPath, locale = 'en' } = router
  const themeConfig = useThemeConfig() as ThemeConfig
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const i18nEnabled = themeConfig?.features?.i18n ?? false
  const themeEnabled = themeConfig?.features?.themeSwitch ?? false
  const homeHref = i18nEnabled ? `/${locale}` : '/'

  const menuConfig = React.useMemo(() => {
    if (!meta) return {}
    if (typeof meta === 'function') return meta()
    return meta
  }, [meta])

  const menuItems = React.useMemo(() => {
    return Object.entries(menuConfig).map(([key, item]: [string, any]) => ({
      ...item,
      route: item.href || `/${locale}/${key}`,
      key
    }))
  }, [menuConfig, locale])

  const categoryMenu = menuItems.find(
    (item: MenuItem) => item.key === 'categories' && item.type === 'menu'
  )
  const categoryItems = categoryMenu?.items
    ? (Object.entries(categoryMenu.items) as [string, MenuItem][])
    : []

  const primaryNav = React.useMemo(
    () => [
      {
        title: 'Newest',
        href: homeHref
      },
      {
        title: 'Trending',
        href: categoryItems[0]?.[1]?.href || homeHref
      },
      {
        title: 'Top Popular',
        href: categoryItems[1]?.[1]?.href || categoryItems[0]?.[1]?.href || homeHref
      },
      {
        title: 'Favorite Games',
        href: asPath || homeHref
      }
    ],
    [asPath, categoryItems, homeHref]
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const base = i18nEnabled ? `/${locale}` : ''
    router.push(`${base}/games?q=${encodeURIComponent(searchQuery.trim())}`)
    setIsMobileMenuOpen(false)
  }

  const isActive = React.useCallback(
    (href: string) => {
      const current = (asPath || '').replace(/\/$/, '')
      const target = href.replace(/\/$/, '')
      return current === target
    },
    [asPath]
  )

  const DesktopSidebar = (
    <aside
      className={`fixed bottom-0 left-0 top-[61px] z-40 hidden border-r border-[#2c2d43] bg-[#0d0e16] transition-[width] duration-300 lg:block ${
        collapsed ? 'w-0 overflow-hidden border-r-0' : 'w-[199px]'
      }`}
    >
      <div className="flex h-full flex-col justify-between overflow-y-auto px-[12px] pb-6 pt-[14px]">
        <div className="space-y-[2px]">
          {primaryNav.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-[12px] rounded-md px-[6px] py-[9px] text-[15px] font-bold transition-colors ${
                isActive(item.href)
                  ? 'text-white'
                  : 'text-white hover:bg-[#161726]'
              }`}
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-[18px] leading-none">
                {navIcons[item.title] || '•'}
              </span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="space-y-4">
          <div className="border-t border-[#2b2c3f] pt-[18px]">
            <div className="space-y-[8px]">
              {utilityLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block text-[16px] leading-none text-[#9fa4c5] transition-colors hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#646985]">©2026 ReactionTimeTest</p>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-[61px] border-b border-[#2c2d43] bg-[#202031]">
        <div className="flex h-full items-center gap-3 px-[12px]">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen((prev) => !prev)
              } else {
                onToggle()
              }
            }}
            className="relative flex h-10 w-10 items-center justify-center text-[#f0f0ff] transition-colors hover:bg-[#2a2a40]"
            aria-label="Toggle navigation"
          >
            <span className="relative h-[22px] w-[25px]">
              <span className="absolute left-[2px] top-[2px] h-[2px] w-[16px] rounded-full bg-current" />
              <span className="absolute left-[2px] top-[10px] h-[2px] w-[16px] rounded-full bg-current" />
              <span className="absolute left-[2px] top-[18px] h-[2px] w-[16px] rounded-full bg-current" />
              <span className="absolute right-[1px] top-[7px] h-0 w-0 border-y-[4px] border-r-[6px] border-y-transparent border-r-current" />
            </span>
          </button>

          <Link href={homeHref} className="flex items-center">
            <span className="select-none text-[29px] font-light uppercase tracking-[0.17em] text-white [text-shadow:0_0_4px_#fff,0_0_9px_rgba(255,255,255,0.78),0_0_17px_rgba(204,209,255,0.58)]">
            ReactionTimeTest
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="ml-auto hidden flex-1 md:block">
            <div className="mx-auto w-full max-w-[460px]">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="h-11 w-full rounded-full border border-[#4a4a67] bg-[#41415e] px-5 pr-12 text-sm text-white placeholder:text-[#c4c4db] focus:border-[#6b6b91] focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#5462ff] text-white"
                  aria-label="Search"
                >
                  <Icon icon="material-symbols:search-rounded" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {i18nEnabled && <LocaleSwitch compact />}
            {themeEnabled && <ThemeSwitch compact />}
          </div>
        </div>
      </header>

      {DesktopSidebar}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside
            className="h-full w-[280px] border-r border-[#2d2d40] bg-[#12121d] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center">
              <span className="select-none text-[24px] font-light uppercase tracking-[0.15em] text-white [text-shadow:0_0_4px_#fff,0_0_9px_rgba(255,255,255,0.78),0_0_17px_rgba(204,209,255,0.58)]">
              ReactionTimeTest
              </span>
            </div>
            <div className="space-y-1">
              {primaryNav.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#24243a] text-white'
                      : 'text-[#d1d1e7] hover:bg-[#1c1c2d] hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex h-7 w-7 items-center justify-center text-base">
                    {navIcons[item.title] || '•'}
                  </span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
