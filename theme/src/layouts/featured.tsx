import React from 'react';
import type { PageMapItem } from 'nextra';
import { Breadcrumb } from '../components/Breadcrumb';
import { GameCarousel } from '../components/GameCarousel';
import { GameFrame } from '../components/GameFrame';
import { useRouter } from 'nextra/hooks';
import { getGamesByCategory } from '../utils/getGamesByCategory';
import type { FrontMatter } from '../types';
import { Icon } from '@iconify/react';

interface FeaturedLayoutProps {
    children: React.ReactNode;
    frontMatter: FrontMatter;
    pageMap: PageMapItem[];
}

export function FeaturedLayout({ children, frontMatter, pageMap }: FeaturedLayoutProps) {
    const router = useRouter();
    const { locale = 'en' } = router;

    // 获取特色分类的游戏
    const getFeaturedGames = (category: string) => {
        const games = getGamesByCategory(pageMap, category, locale);
        return games.slice(0, 20); // 只取前20个游戏
    };

    // 从路径获取分类名称
    const getCategoryTitle = (path: string) => {
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        return lastPart
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // 从 frontMatter 中获取分类列表
    const categories = frontMatter.categories || [];

    return (
        <main className="min-h-screen bg-theme-bg-primary dark:bg-[#1a1a1a]">
            {/* 头部区域 */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {frontMatter.game && (
                    <div className="mb-6">
                        <GameFrame
                            src={frontMatter.game}
                            title={frontMatter.title || 'Game'}
                            cover={frontMatter.cover}
                        />
                    </div>
                )}

                {/* 分类游戏列表 */}
                {categories.length > 0 ? (
                    categories.map((category) => {
                        const games = getFeaturedGames(category);
                        if (games.length === 0) return null;

                        return (
                            <GameCarousel
                                key={category}
                                title={getCategoryTitle(category)}
                                games={games}
                            />
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Icon icon="material-symbols:games-outline" className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-theme-text-primary mb-2">
                            No Categories Found
                        </h3>
                        <p className="text-sm text-theme-text-secondary">
                            Please add some categories in the frontmatter to display games.
                        </p>
                    </div>
                )}

                {/* MDX 内容 */}
                <div className="mt-8 prose dark:prose-invert prose-slate max-w-none">
                    <article className="nextra-body relative pb-8 w-full">
                        {children}
                    </article>
                </div>
            </div>
        </main>
    );
} 