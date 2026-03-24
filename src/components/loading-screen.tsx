'use client'

import { useState, useEffect, useRef } from 'react'

export function LoadingScreen() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (videoRef.current) videoRef.current.playbackRate = 1.5
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 pointer-events-none"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 300ms ease-out',
      }}
    >
      <video
        ref={videoRef}
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
