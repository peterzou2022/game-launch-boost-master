import React from 'react';
import type { PageMapItem } from 'nextra';
import { GameFrame } from '../components/GameFrame';
import { ShareButtons } from '../components/ShareButtons';
import { Breadcrumb } from '../components/Breadcrumb';
import { GameDescription } from '../components/GameDescription';
import { CommentsSection } from '../components/CommentsSection';
import { RecommendedGames } from '../components/RecommendedGames';

interface DefaultLayoutProps {
    children: React.ReactNode;
    frontMatter: {
        title?: string;
        description?: string;
        game?: string;
        cover?: string;
    };
    pageMap?: PageMapItem[];
}

export function DefaultLayout({ children, frontMatter, pageMap = [] }: DefaultLayoutProps) {
    const gameUrl = frontMatter.game;

    return (
        <main className="min-h-screen bg-theme-bg-primary dark:bg-[#1a1a1a]">
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* 游戏播放器 */}
                {gameUrl && (
                    <div className="mb-6">
                        <GameFrame
                            src={gameUrl}
                            title={frontMatter.title || 'Game'}
                            cover={frontMatter.cover}
                        />
                    </div>
                )}

                {/* 游戏说明组件：展示 frontmatter description，便于模板快速填写 */}
                <GameDescription description={frontMatter.description} title="游戏说明" />

                {/* 文章内容区域 */}
                <div className="bg-white dark:bg-[#242424] rounded-xl shadow-sm">
                    <div className="p-6">
                        {/* 面包屑导航 */}
                        <Breadcrumb />

                        {/* 标题和封面图区域 */}
                        <div className="flex items-start gap-6 mb-6">
                            {/* 封面图 */}
                            {frontMatter.cover && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={frontMatter.cover}
                                        alt={frontMatter.title}
                                        className="w-32 h-32 rounded-xl object-cover"
                                    />
                                </div>
                            )}
                            
                            {/* 标题和分享按钮 */}
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-theme-text-primary mb-4">
                                    {frontMatter.title}
                                </h3>
                                <div className="flex gap-2">
                                    <ShareButtons />
                                </div>
                            </div>
                        </div>

                        {/* 文章内容 */}
                        <article className="prose dark:prose-invert max-w-none">
                            {children}
                        </article>
                    </div>
                </div>

                {/* 评论区域：展示玩家评论，位于游戏介绍下方 */}
                <CommentsSection title="Comment" />

                {/* 推荐游戏：同分类下的其他游戏 */}
                <RecommendedGames pageMap={pageMap} title="推荐游戏" />
            </div>
        </main>
    );
}