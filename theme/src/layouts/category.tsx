import React, { useState, useEffect } from 'react';
import type { PageMapItem } from 'nextra';
import { GameCard } from '../components/GameCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { getGamesInCurrentDirectory } from '../utils/getGamesByCategory';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'nextra/hooks';
import type { FrontMatter } from '../types';

interface CategoryLayoutProps {
    children: React.ReactNode;
    pageMap: PageMapItem[];
}

export function CategoryLayout({ children, pageMap }: CategoryLayoutProps) {
    const router = useRouter();
    // 从路径中提取实际的 locale
    const pathLocale = router.pathname.split('/')[1];
    const locale = pathLocale || router.locale || 'en';
    const { query } = router;
    const currentPage = Number(query.page) || 1;
    const [isClient, setIsClient] = useState(false);
    const pageSize = 12;

    useEffect(() => {
        setIsClient(true);
    }, []);

    // // 获取当前目录下的所有游戏
    // console.log('=== CategoryLayout Debug ===');
    // console.log('Router:', {
    //     pathname: router.pathname,
    //     locale: locale,
    //     query
    // });

    const allGames = getGamesInCurrentDirectory(pageMap, router.pathname, locale);
    
    // 计算分页
    const totalGames = allGames.length;
    const totalPages = Math.ceil(totalGames / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const games = allGames.slice(start, end);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    // console.log('Pagination:', {
    //     totalGames,
    //     totalPages,
    //     currentPage,
    //     gamesOnCurrentPage: games.length
    // });
    // console.log('=== End Debug ===');

    // 构建分页链接
    const buildPageUrl = (page: number) => {
        const { pathname, query } = router;
        return {
            pathname,
            query: { ...query, page }
        };
    };

    return (
        <main className="min-h-screen bg-theme-bg-primary dark:bg-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Breadcrumb />

                {isClient && (
                    <>
                        {games.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                    <Icon icon="material-symbols:games-outline" className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-theme-text-primary mb-2">
                                    No Games Found
                                </h3>
                                <p className="text-sm text-theme-text-secondary">
                                    There are no games in this category yet.
                                </p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-theme-border pt-6">
                                <div className="flex items-center gap-2">
                                    <Icon icon="material-symbols:apps" className="w-4 h-4 text-theme-text-secondary" />
                                    <span className="text-sm text-theme-text-secondary">
                                        {totalGames}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasPrevPage && (
                                        <Link
                                            href={buildPageUrl(currentPage - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md text-theme-text-secondary hover:text-primary-500 transition-colors"
                                        >
                                            <Icon icon="material-symbols:chevron-left" className="w-5 h-5" />
                                        </Link>
                                    )}
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <Link
                                                key={page}
                                                href={buildPageUrl(page)}
                                                className={`
                                                    w-8 h-8 flex items-center justify-center rounded-md text-sm
                                                    ${page === currentPage
                                                        ? 'bg-primary-500 text-white'
                                                        : 'text-theme-text-secondary hover:text-primary-500 transition-colors'
                                                    }
                                                `}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>

                                    {hasNextPage && (
                                        <Link
                                            href={buildPageUrl(currentPage + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md text-theme-text-secondary hover:text-primary-500 transition-colors"
                                        >
                                            <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="prose mt-8">
                    {children}
                </div>
            </div>
        </main>
    );
} 