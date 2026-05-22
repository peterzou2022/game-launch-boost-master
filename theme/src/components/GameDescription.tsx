import React from 'react'
import { Icon } from '@iconify/react'

interface GameDescriptionProps {
  title?: string
  description?: string
  children?: React.ReactNode
}

export function GameDescription({
  title = 'Game Overview',
  description,
  children
}: GameDescriptionProps) {
  const hasContent = description || (children && React.Children.count(children) > 0)
  if (!hasContent) return null

  return (
    <div className="mb-6 overflow-hidden rounded-[14px] bg-[#171824] shadow-sm ring-1 ring-[#282a3d]">
      <div className="flex items-center gap-2 border-b border-[#282a3d] px-5 py-4">
        <Icon icon="material-symbols:info-outline" className="h-5 w-5 flex-shrink-0 text-[#8c82ff]" />
        <h2 className="text-lg font-semibold text-theme-text-primary">{title}</h2>
      </div>
      <div className="p-5">
        {description && (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-theme-text-secondary">
            {description}
          </p>
        )}
        {children && (
          <div className="prose max-w-none text-[15px] leading-relaxed text-theme-text-secondary dark:prose-invert">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
