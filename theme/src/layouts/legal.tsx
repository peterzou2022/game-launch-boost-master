import * as React from 'react'
import type { LayoutProps } from '../types'

export function LegalLayout({ children, frontMatter }: LayoutProps) {
  return (
    <main className="min-h-screen bg-[#10111b]">
      <div className="mx-auto max-w-[980px] px-4 py-6 lg:px-6">
        <section className="overflow-hidden rounded-[14px] bg-[#151622] shadow-[0_10px_28px_rgba(0,0,0,0.22)] ring-1 ring-[#26283b]">
          <div className="border-b border-[#282a3d] px-6 py-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e92b5]">
              Site Information
            </p>
            <h1 className="text-3xl font-semibold text-white">
              {frontMatter.title}
            </h1>
            {frontMatter.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#aab0da]">
                {frontMatter.description}
              </p>
            )}
          </div>

          <div className="px-6 py-6">
            <article className="prose max-w-none dark:prose-invert">
              {children}
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
