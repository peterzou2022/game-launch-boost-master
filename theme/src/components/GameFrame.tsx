import React from 'react'
import { Icon } from '@iconify/react'

interface GameFrameProps {
  src: string
  title: string
  cover?: string
}

const getCoverAlt = (title: string) =>
  /reaction/i.test(title) ? `${title} - reaction time test game cover` : `${title} - game cover`

export function GameFrame({ src, title, cover }: GameFrameProps) {
  const [key, setKey] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showTip, setShowTip] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const handleReload = () => setKey((prev) => prev + 1)
  const handlePlay = () => setIsLoaded(true)

  const handleFullscreen = async () => {
    if (!iframeRef.current) return

    try {
      if (!document.fullscreenElement) {
        await iframeRef.current.requestFullscreen()
        setIsFullscreen(true)
        setShowTip(true)
        setTimeout(() => setShowTip(false), 3000)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err)
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-[4px] bg-[#070811] shadow-[0_18px_48px_rgba(0,0,0,0.35)] ring-1 ring-black/40">
      <div className="relative aspect-video w-full bg-[#070811]">
        {!isLoaded ? (
          <div
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center"
            onClick={handlePlay}
          >
            <img
              src={cover || '/default-cover.jpg'}
              alt={cover ? getCoverAlt(title) : 'Default cover'}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Icon
                icon="material-symbols:play-circle"
                className="h-20 w-20 text-white transition-colors hover:text-[#f5d8a8]"
              />
            </div>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              key={key}
              src={src}
              title={title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {showTip && (
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-sm text-white shadow-lg">
                Press ESC to exit fullscreen
              </div>
            )}
          </>
        )}
      </div>
      {isLoaded && (
        <div className="flex items-center justify-end gap-1 border-t border-white/8 bg-[#1f1f32] px-3 py-2">
          <button
            onClick={handleReload}
            className="rounded-full p-2 text-[#c8cbe9] transition-colors hover:bg-white/10 hover:text-white"
            title="Reload"
          >
            <Icon icon="material-symbols:refresh" className="h-5 w-5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="rounded-full p-2 text-[#c8cbe9] transition-colors hover:bg-white/10 hover:text-white"
            title="Fullscreen"
          >
            <Icon
              icon={isFullscreen ? 'material-symbols:fullscreen-exit' : 'material-symbols:fullscreen'}
              className="h-5 w-5"
            />
          </button>
        </div>
      )}
    </div>
  )
}
