import React from 'react';
import type { PageMapItem } from 'nextra';
import { useRouter } from 'nextra/hooks';
import { GameCard } from './GameCard';
import { getRecommendedGames } from '../utils/getGamesByCategory';
import { Icon } from '@iconify/react';

const RECOMMENDED_LIMIT = 8;

interface RecommendedGamesProps {
    pageMap: PageMapItem[];
    title?: string;
    limit?: number;
}

/**
 * 推荐游戏组件：展示当前游戏同分类下的其他游戏，便于模板使用者直接使用。
 */
export function RecommendedGames({ pageMap, title = 'Recommended Games', limit = RECOMMENDED_LIMIT }: RecommendedGamesProps) {
    const router = useRouter();
    const { asPath, locale = 'en' } = router;
    const games = React.useMemo(
        () => getRecommendedGames(pageMap, asPath, locale, limit),
        [pageMap, asPath, locale, limit]
    );

    if (games.length === 0) return null;

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-theme-text-primary mb-4 flex items-center gap-2">
                <Icon icon="material-symbols:recommend" className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {games.map((game) => (
                    <GameCard
                        key={game.slug}
                        href={game.slug || '#'}
                        title={game.title || ''}
                        description={game.description}
                        cover={game.cover}
                        category={game.category}
                        date={game.date}
                    />
                ))}
            </div>
        </div>
    );
}
