import * as React from 'react'
import { useRouter } from 'nextra/hooks'
import Link from 'next/link'
import { LocaleSwitch } from './LocaleSwitch'
import { ThemeSwitch } from './ThemeSwitch'
import { useFSRoute } from 'nextra/hooks'
import { Icon } from '@iconify/react'
import { useThemeConfig } from '../contexts'
import type { PageMapItem } from 'nextra'

type MenuItem = {
    title: string
    type: string
    icon?: string
    route?: string
    href?: string
    items?: Record<string, MenuItem>
    key?: string
}

interface MetaJsonFile {
    kind: 'Meta'
    data: Record<string, MenuItem>
}

interface NavbarProps {
    meta?: any
}

// 添加 Logo 配置类型
interface LogoConfig {
    text: string;
    image: string;
    height: number;
}

// 扩展主题配置类型
interface ThemeConfig {
    features?: {
        i18n?: boolean;
        themeSwitch?: boolean;
    };
    siteName?: string;
    logo?: LogoConfig;
    primaryColor?: string;
}

export function Navbar({ meta }: NavbarProps) {
    const router = useRouter()
    const { asPath, locale = 'en' } = router
    const themeConfig = useThemeConfig() as ThemeConfig
    const siteName = themeConfig?.siteName
    const primaryColor = themeConfig?.primaryColor || '#81c869'
    const fsRoute = useFSRoute()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')

    // 检查主题切换功能是否启用
    const themeEnabled = themeConfig?.features?.themeSwitch ?? false
    const i18nEnabled = themeConfig?.features?.i18n ?? false

    // 处理菜单配置
    const menuConfig = React.useMemo(() => {
        if (!meta) return {}
        if (typeof meta === 'function') return meta()
        return meta
    }, [meta])

    // 转换菜单配置为数组形式
    const menuItems = React.useMemo(() => {
        return Object.entries(menuConfig).map(([key, item]: [string, any]) => ({
            ...item,
            route: item.href || `/${locale}/${key}`,
            key
        }))
    }, [menuConfig, locale])

    // 关闭菜单的处理函数
    const handleCloseMenu = () => {
        setIsMenuOpen(false)
    }

    // 点击外部关闭菜单
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const nav = document.getElementById('mobile-menu')
            if (nav && !nav.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isMenuOpen])

    // 添加判断激活状态的函数
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        const base = themeConfig?.features?.i18n ? `/${locale}` : ''
        router.push(`${base}/games?q=${encodeURIComponent(searchQuery.trim())}`)
    }

    const isMenuItemActive = React.useCallback((item: MenuItem) => {
        if (!asPath) return false;

        // 移除语言前缀和尾部斜杠进行比较
        const currentPath = asPath.replace(new RegExp(`^/${locale}`), '').replace(/\/$/, '');
        const itemPath = (item.href || item.route || '')
            .replace(new RegExp(`^/${locale}`), '')
            .replace(/\/$/, '');

        if (item.type === 'page') {
            // 页面类型需要精确匹配
            return currentPath === itemPath;
        } else if (item.type === 'menu') {
            // 菜单类型检查当前路径是否以菜单路径开头
            // 同时检查子项是否匹配
            if (currentPath.startsWith(itemPath)) {
                return true;
            }
            // 检查子项
            if (item.items) {
                return Object.entries(item.items).some(([key, subitem]) => {
                    const subitemPath = (subitem.href || `${itemPath}/${key}`).replace(/\/$/, '');
                    return currentPath === subitemPath;
                });
            }
        }
        return false;
    }, [asPath, locale]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <nav className="bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                    <div className="flex h-16 md:h-20 items-center">
                        {/* Logo 区域 */}
                        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8">
                            <Link
                                href={themeConfig?.features?.i18n ? `/${locale}` : '/'}
                                className="flex items-center gap-2"
                            >
                                <img 
                                    src={themeConfig?.logo?.image} 
                                    alt={themeConfig?.logo?.text} 
                                    className="w-auto" 
                                    style={{ height: themeConfig?.logo?.height }} 
                                />
                                <span className="text-lg md:text-xl font-bold text-theme-text-primary" style={{ color: primaryColor }}>
                                    {themeConfig?.logo?.text}
                                </span>
                            </Link>
                        </div>

                        {/* 右侧区域：搜索框（缩短一半）+ 主题/语言，整体位于页面右上方 */}
                        <div className="flex-1 flex items-center justify-end min-w-0 gap-2 md:gap-3 pl-4 pr-4 sm:pr-6 lg:pr-8">
                            {/* 桌面端：右上方搜索框，宽度约为原来一半 */}
                            <div className="hidden md:block w-full max-w-xs flex-shrink-0">
                                <form onSubmit={handleSearchSubmit} className="w-full">
                                    <div className="relative flex items-center bg-[#f5f3ef] dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-500 transition-colors">
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="SEARCH GAMES"
                                            className="w-full py-2.5 pl-3 pr-10 bg-transparent text-theme-text-primary placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium focus:outline-none rounded-lg"
                                            aria-label="Search games"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 p-1.5 text-theme-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors rounded"
                                            aria-label="Search"
                                        >
                                            <Icon icon="material-symbols:search" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* 移动端：Logo 右侧紧凑搜索框，宽度缩短一半 */}
                            <div className="md:hidden flex-1 min-w-0 max-w-[50%]">
                                <form onSubmit={handleSearchSubmit} className="flex">
                                    <div className="relative w-full flex items-center bg-[#f5f3ef] dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="SEARCH GAMES"
                                            className="w-full py-2 pl-3 pr-9 bg-transparent text-theme-text-primary placeholder-gray-400 text-sm focus:outline-none rounded-lg"
                                            aria-label="Search games"
                                        />
                                        <button type="submit" className="absolute right-1.5 p-1 text-theme-text-secondary">
                                            <Icon icon="material-symbols:search" className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="flex-shrink-0 flex items-center space-x-2">
                                {/* 移动端菜单按钮 */}
                                <div className="md:hidden">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsMenuOpen(!isMenuOpen)
                                        }}
                                        className="p-2 text-theme-text-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                    >
                                        <Icon
                                            icon={isMenuOpen ? "material-symbols:close" : "material-symbols:menu"}
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>

                                <div className="hidden md:flex items-center space-x-2">
                                    {themeEnabled && <ThemeSwitch />}
                                    {i18nEnabled && <LocaleSwitch />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 移动端菜单 */}
                    <div
                        id="mobile-menu"
                        className={`md:hidden fixed inset-x-0 top-16 bottom-0 bg-theme-bg-primary dark:bg-dark transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <div className="w-full overflow-x-auto pb-20">
                            {/* 移动端搜索框 */}
                            <div className="px-4 pt-4 pb-2 border-b border-theme-border">
                                <form onSubmit={handleSearchSubmit} className="flex">
                                    <div className="relative flex-1 flex items-center bg-[#f5f3ef] dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="SEARCH GAMES"
                                            className="w-full py-2.5 pl-4 pr-11 bg-transparent text-theme-text-primary placeholder-gray-400 text-sm focus:outline-none rounded-lg"
                                            aria-label="Search games"
                                        />
                                        <button type="submit" className="absolute right-2 p-1.5 text-theme-text-secondary">
                                            <Icon icon="material-symbols:search" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="px-4 py-2 space-y-1">
                                {menuItems.map((item: MenuItem) => {
                                    const isActive = isMenuItemActive(item);

                                    if (item.type === 'menu' && item.items) {
                                        return (
                                            <div key={item.route} className="space-y-1">
                                                <div className="flex items-center px-3 py-2 text-theme-text-primary">
                                                    {item.icon && (
                                                        <Icon icon={item.icon} className="w-5 h-5 mr-3" />
                                                    )}
                                                    <span className="whitespace-nowrap">{item.title}</span>
                                                </div>
                                                <div className="pl-8 space-y-1">
                                                    {Object.entries(item.items).map(([key, subitem]) => (
                                                        <Link
                                                            key={key}
                                                            href={subitem.href || `${item.route}/${key}`}
                                                            className="flex items-center px-3 py-2 text-sm text-theme-text-secondary hover:text-primary-500 dark:hover:text-primary-400"
                                                            onClick={handleCloseMenu}
                                                        >
                                                            {subitem.icon && (
                                                                <Icon icon={subitem.icon} className="w-4 h-4 mr-3" />
                                                            )}
                                                            <span className="whitespace-nowrap">{subitem.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={item.key}
                                            href={item.href || item.route || ''}
                                            className={`flex items-center px-3 py-2 ${isActive
                                                ? 'text-primary-500 dark:text-primary-400'
                                                : 'text-theme-text-secondary hover:text-primary-500 dark:hover:text-primary-400'
                                                }`}
                                            onClick={handleCloseMenu}
                                        >
                                            {item.icon && (
                                                <Icon icon={item.icon} className="w-5 h-5 mr-3" />
                                            )}
                                            <span className="whitespace-nowrap">{item.title}</span>
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* 移动端功能区域 */}
                            <div className="fixed bottom-0 left-0 right-0 border-t border-theme-border bg-theme-bg-primary dark:bg-dark-secondary">
                                <div className="px-4 py-3 flex items-center justify-between">
                                    {i18nEnabled && <LocaleSwitch />}
                                    {themeEnabled && <ThemeSwitch />}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="mt-16 md:mt-20 border-b border-theme-border bg-theme-bg-primary/50 dark:bg-dark-secondary/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                </div>
            </div>
        </>
    )
} 