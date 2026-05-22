import type { ThemeConfig } from '../types'
import Link from 'next/link'

export function Footer({ themeConfig }: { themeConfig?: ThemeConfig }) {
  const siteName = themeConfig?.siteName || 'Site Name'

  return (
    <footer className="border-t border-[#2b2b40] bg-[#141421]">
      <div className="mx-auto max-w-[1640px] px-4 py-8 sm:px-6 lg:px-7">
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8e92b5]">
              Ready to reskin
            </p>
            <p className="text-sm text-theme-text-secondary">
              Swap MDX content, keep the game portal shell.
            </p>
          </div>
          <div className="text-sm text-theme-text-secondary">
            {new Date().getFullYear()}{' '}
            <Link
              href="/"
              className="font-medium text-theme-text-primary transition-colors hover:text-[#b0a9ff]"
            >
              {siteName}
            </Link>
            . All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
