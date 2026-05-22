import { useTheme } from 'next-themes'
import { useMounted } from 'nextra/hooks'
import { Icon } from '@iconify/react'

interface ThemeSwitchProps {
  className?: string
  compact?: boolean
}

export function ThemeSwitch({ className, compact = false }: ThemeSwitchProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useMounted()

  return (
    <button
      className={`flex items-center justify-center transition-colors ${
        compact
          ? 'h-10 w-10 rounded-full bg-[#2a2a40] text-[#f4f4ff] hover:bg-[#343452]'
          : 'p-2 text-gray-500 hover:text-[#8b80ff]'
      } ${className || ''}`}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      title="Toggle theme"
      type="button"
    >
      {mounted && (
        <Icon
          icon={
            resolvedTheme === 'dark'
              ? 'material-symbols:dark-mode'
              : 'material-symbols:light-mode'
          }
          className="h-5 w-5"
        />
      )}
    </button>
  )
}
