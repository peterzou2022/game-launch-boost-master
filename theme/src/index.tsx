import * as React from 'react'
import type { MainProps } from './types'
import { layouts } from './layouts'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Head } from './components/Head'
import { ThemeConfigProvider } from './contexts'
import { ThemeProvider } from 'next-themes'

export default function Layout({ children, pageOpts, themeConfig: nextraThemeConfig }: MainProps) {
    const { frontMatter, pageMap } = pageOpts
    const { layout = 'default' } = frontMatter

    // 获取 meta 数据
    const meta = React.useMemo(() => {
        if (pageMap && pageMap[0] && pageMap[0].data) {
            return pageMap[0].data
        }
        return {}
    }, [pageMap])

    console.log('nextraThemeConfig:', nextraThemeConfig)

    const LayoutComponent = layouts[layout] || layouts.default

    return (
        <ThemeConfigProvider value={nextraThemeConfig}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <Head frontMatter={frontMatter} pageMap={pageMap} />
                <div className="min-h-screen bg-gray-100">
                    <Navbar meta={meta} />
                    <LayoutComponent
                        frontMatter={frontMatter}
                        themeConfig={nextraThemeConfig}
                        pageMap={pageMap}
                    >
                        {children}
                    </LayoutComponent>
                    <Footer themeConfig={nextraThemeConfig} />
                </div>
            </ThemeProvider>
        </ThemeConfigProvider>
    )
}