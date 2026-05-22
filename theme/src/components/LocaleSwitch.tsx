import { useRouter } from 'nextra/hooks'
import { useCallback, useState, useEffect } from 'react'
import { useThemeConfig } from '../contexts'

export function LocaleSwitch({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const { asPath } = router
  const [currentLocale, setCurrentLocale] = useState(router.locale)
  const [isOpen, setIsOpen] = useState(false)
  const themeConfig = useThemeConfig()

  useEffect(() => {
    setCurrentLocale(router.locale)
  }, [router.locale])

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      const date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`

      const path = asPath.replace(/^\/[a-z]{2}/, `/${newLocale}`)
      router.push(path)
      setIsOpen(false)
    },
    [router, asPath]
  )

  const currentLocaleConfig =
    themeConfig?.i18n?.config?.find((l) => l.locale === currentLocale) ||
    themeConfig?.i18n?.config?.[0]

  if (!themeConfig?.features?.i18n || !themeConfig?.i18n?.config?.length) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 text-sm transition-colors ${
          compact
            ? 'h-10 rounded-full bg-[#2a2a40] px-4 text-[#f4f4ff] hover:bg-[#343452]'
            : 'rounded-md px-3 py-2 text-theme-text-secondary hover:bg-theme-bg-secondary hover:text-theme-text-primary'
        }`}
        type="button"
      >
        <span>{currentLocaleConfig?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-theme-bg-primary py-1 shadow-lg ring-1 ring-theme-border">
          {themeConfig.i18n.config?.map((item) => (
            <button
              key={item.locale}
              onClick={() => handleLocaleChange(item.locale)}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                currentLocale === item.locale
                  ? 'bg-theme-bg-secondary text-theme-text-primary'
                  : 'text-theme-text-secondary hover:bg-theme-bg-secondary'
              }`}
              type="button"
            >
              <span>{item.name}</span>
              {currentLocale === item.locale && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
