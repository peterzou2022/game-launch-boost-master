import * as React from 'react'
import type { MainProps } from './types'
import { layouts } from './layouts'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Head } from './components/Head'
import { ThemeConfigProvider } from './contexts'
import { ThemeProvider } from 'next-themes'

export default function Layout({
  children,
  pageOpts,
  themeConfig: nextraThemeConfig
}: MainProps) {
  const { frontMatter, pageMap } = pageOpts
  const { layout = 'default' } = frontMatter
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const meta = React.useMemo(() => {
    if (pageMap && pageMap[0] && pageMap[0].data) {
      return pageMap[0].data
    }
    return {}
  }, [pageMap])

  const LayoutComponent = layouts[layout] || layouts.default

  return (
    <ThemeConfigProvider value={nextraThemeConfig}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
        <Head frontMatter={frontMatter} pageMap={pageMap} />
        <div className="min-h-screen bg-[#141421]">
          <Navbar
            meta={meta}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
          />
          <div
            className={`min-h-screen pt-16 transition-[padding] duration-300 ${
              sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-[196px]'
            }`}
          >
            <LayoutComponent
              frontMatter={frontMatter}
              themeConfig={nextraThemeConfig}
              pageMap={pageMap}
            >
              {children}
            </LayoutComponent>
            <Footer themeConfig={nextraThemeConfig} />
          </div>
        </div>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
