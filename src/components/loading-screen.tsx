'use client'

import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleEnded = () => {
    setFading(true)
    setTimeout(() => {
      setGone(true)
      document.body.style.overflow = ''
    }, 300)
  }

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 300ms ease-out',
      }}
    >
      <video
        src="/images/smicranim.webm"
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className="w-[min(60vw,400px)] h-auto pointer-events-auto"
      />
    </div>
  )
}
