import React from 'react';
import type { PageMapItem } from 'nextra';
import { Breadcrumb } from '../components/Breadcrumb';
import { GameCarousel } from '../components/GameCarousel';
import { GameFrame } from '../components/GameFrame';
import { CommentsSection } from '../components/CommentsSection';
import { useRouter } from 'nextra/hooks';
import { getGamesByCategory } from '../utils/getGamesByCategory';
import type { FrontMatter } from '../types';
import type { ThemeConfig } from '../types';
import { Icon } from '@iconify/react';

interface FeaturedLayoutProps {
    children: React.ReactNode;
    frontMatter: FrontMatter;
    pageMap: PageMapItem[];
    themeConfig?: ThemeConfig;
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
                text: 'Reaction time is the delay between a stimulus (e.g. something you see or hear) and your response (e.g. click or key press). A reaction time test measures this in milliseconds.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the average human reaction time?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For visual stimuli, the average is about 200–250 ms. It can vary with age, fitness, sleep, and practice.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is 200 ms reaction time good?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. 200 ms is above average. Many people are around 250 ms, so 200 ms is considered good.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can you improve reaction time?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Regular practice (e.g. taking a reaction time test), good sleep, hydration, and exercise can help improve and maintain faster reflexes.',
            },
        },
    ],
};

const HOMEPAGE_FAQ_SCHEMA_ZH = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '什么是反应时间？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '反应时间是指从刺激（例如看到或听到的内容）出现到你做出反应（例如点击或按键）之间的延迟。反应时间测试就是用毫秒来测量这段时间。',
            },
        },
        {
            '@type': 'Question',
            name: '人的平均反应时间是多少？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '对视觉刺激而言，平均大约在 200–250 毫秒，会因年龄、体能、睡眠和练习而有所差异。',
            },
        },
        {
            '@type': 'Question',
            name: '200 毫秒的反应时间算好吗？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '算。200 毫秒高于平均水平。很多人约在 250 毫秒左右，所以 200 毫秒属于较好水平。',
            },
        },
        {
            '@type': 'Question',
            name: '反应时间能提高吗？',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '能。经常练习（例如做反应时间测试）、保证睡眠、补水和运动，都有助于提高和保持更快的反应速度。',
            },
        },
    ],
};

export function FeaturedLayout({ children, frontMatter, pageMap, themeConfig }: FeaturedLayoutProps) {
    const router = useRouter();
    const { locale = 'en', asPath } = router;
    const isHomepage = asPath === '/' || asPath === '/en' || asPath === '/zh' || asPath === `/${locale}`;
    const baseUrl = (themeConfig?.url || 'https://example.com').replace(/\/$/, '');
    const homepageUrl = locale === 'zh' ? `${baseUrl}/zh` : locale === 'en' ? `${baseUrl}/en` : baseUrl;

    // 获取特色分类的游戏
    const getFeaturedGames = (category: string) => {
        const games = getGamesByCategory(pageMap, category, locale);
        return games.slice(0, 20); // 只取前20个游戏
    };

    // 从路径获取分类名称（中文环境下部分分类使用中文标题）
    const getCategoryTitle = (path: string) => {
        if (locale === 'zh' && path === 'games/Reaction-Time-Test') return '反应时间测试';
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        return lastPart
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // 从 frontMatter 中获取分类列表
    const categories = frontMatter.categories || [];

    const webAppSchema = React.useMemo(
        () =>
            isHomepage && frontMatter.game
                ? {
                      '@context': 'https://schema.org',
                      '@type': 'WebApplication',
                      name: frontMatter.title || (locale === 'zh' ? '反应时间测试' : 'Reaction Time Test'),
                      description: frontMatter.description || (locale === 'zh' ? '免费在线反应时间测试，测量你的反应速度（毫秒）。' : 'Free online reaction time test. Measure your reflex speed in milliseconds.'),
                      url: homepageUrl,
                      applicationCategory: 'Game',
                      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                  }
                : null,
        [isHomepage, frontMatter.game, frontMatter.title, frontMatter.description, homepageUrl, locale]
    );

    const faqSchema = locale === 'zh' ? HOMEPAGE_FAQ_SCHEMA_ZH : HOMEPAGE_FAQ_SCHEMA;

    return (
        <main className="min-h-screen bg-theme-bg-primary dark:bg-[#1a1a1a]">
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

                {/* 首页底部评论区：供用户整体评价站点或首页推荐 */}
                <CommentsSection title="Homepage comments" />
            </div>
        </main>
    );
} 