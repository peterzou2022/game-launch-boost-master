import React from 'react';
import { Icon } from '@iconify/react';

interface GameDescriptionProps {
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

/**
 * 游戏说明组件：用于游戏页中展示游戏简介/说明，便于模板使用者快速填写。
 */
export function GameDescription({ title = '游戏说明', description, children }: GameDescriptionProps) {
    const hasContent = description || (children && React.Children.count(children) > 0);

    if (!hasContent) return null;

    return (
        <div className="mb-6 rounded-xl bg-white dark:bg-[#242424] shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center gap-2">
                <Icon icon="material-symbols:info-outline" className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <h2 className="text-lg font-semibold text-theme-text-primary">{title}</h2>
            </div>
            <div className="p-5">
                {description && (
                    <p className="text-theme-text-secondary text-[15px] leading-relaxed whitespace-pre-wrap">
                        {description}
                    </p>
                )}
                {children && <div className="text-theme-text-secondary text-[15px] leading-relaxed prose dark:prose-invert max-w-none">{children}</div>}
            </div>
        </div>
    );
}
