'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function Hero() {
  const [phase, setPhase] = useState<'title' | 'tagline'>('title')
  const [waveVisible, setWaveVisible] = useState(false)
  const scrollCount = useRef(0)
  const transitioned = useRef(false)
  const waveTransitioned = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {
      const resume = () => { video.play().catch(() => {}); document.removeEventListener('click', resume) }
      document.addEventListener('click', resume)
    })
  }, [])

  useEffect(() => {
    if (phase !== 'title') return
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && !transitioned.current) {
        scrollCount.current++
        if (scrollCount.current >= 3) {
          transitioned.current = true
          setPhase('tagline')
        }
      }
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 30 && !transitioned.current) {
        scrollCount.current++
        if (scrollCount.current >= 3) {
          transitioned.current = true
          setPhase('tagline')
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      document.body.style.overflow = ''
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'tagline') {
      const t = setTimeout(() => { document.body.style.overflow = '' }, 600)
      return () => clearTimeout(t)
    }
  }, [phase])

  // After tagline appears, one more scroll reveals the wave
  useEffect(() => {
    if (phase !== 'tagline') return

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && !waveTransitioned.current) {
        waveTransitioned.current = true
        setWaveVisible(true)
      }
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 30 && !waveTransitioned.current) {
        waveTransitioned.current = true
        setWaveVisible(true)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [phase])

  return (
    <section className="relative min-h-screen flex items-end justify-center px-4 pb-28 sm:pb-32 bg-background">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full object-cover object-top"
          style={{ height: 'calc(100% + 80px)' }}
        >
          <source src="/uploads/Lab_Video_Generation_Request.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/10 dark:bg-background/40" />
      </div>

      {/* Content — z-30 keeps it above the wave (z-20).
          Section uses items-end so as the tagline expands below,
          the title is naturally pushed upward. */}
      <div className="relative z-30 container mx-auto max-w-5xl">
        <div className="text-center flex flex-col items-center">
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white"
          >
            {'Welcome to the '.split(' ').map((word, wordIndex) => (
              <span key={`word-${wordIndex}`} className="inline-flex">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={`char-${wordIndex}-${charIndex}`}
                    className="inline-block"
                    whileHover={{ y: -15, transition: { type: 'spring', stiffness: 500, damping: 10 } }}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordIndex < 'Welcome to the '.split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {'SMICR Lab'.split(' ').map((word, wordIndex) => (
                <span key={`gradient-word-${wordIndex}`} className="inline-flex">
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={`gradient-char-${wordIndex}-${charIndex}`}
                      className="inline-block"
                      whileHover={{ y: -15, transition: { type: 'spring', stiffness: 500, damping: 10 } }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordIndex < 'SMICR Lab'.split(' ').length - 1 && '\u00A0'}
                </span>
              ))}
            </span>
          </motion.h1>

          {/* Tagline: zero height when hidden so title truly sits at the bottom.
              Expands downward on transition, pushing title up naturally. */}
          <motion.div
            className="overflow-hidden w-full"
            animate={{
              maxHeight: phase === 'tagline' ? '200px' : '0px',
              opacity: phase === 'tagline' ? 1 : 0,
              marginTop: phase === 'tagline' ? '1.5rem' : '0rem',
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <p className="text-lg sm:text-xl font-bold text-white max-w-3xl mx-auto leading-relaxed">
              We develop probabilistic machine learning algorithms for structural vibration
              analysis, digital twin modeling, and structural health monitoring — bridging
              the gap between physics-based models and real-world measurements at IIT Delhi.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Wavy bottom edge — hidden on landing, fades in after scroll.
          Positioned so its bottom extends 4px past section bottom to seal the seam. */}
      <motion.div
        className="absolute left-0 w-full z-20 pointer-events-none"
        style={{ bottom: '-4px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: waveVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-20 sm:h-24"
        >
          <path
            d="M0,25 C22.5,37 67.5,13 90,25 C112.5,37 157.5,13 180,25 C202.5,37 247.5,13 270,25 C292.5,37 337.5,13 360,25 C382.5,37 427.5,13 450,25 C472.5,37 517.5,13 540,25 C562.5,37 607.5,13 630,25 C652.5,37 697.5,13 720,25 C742.5,37 787.5,13 810,25 C832.5,37 877.5,13 900,25 C922.5,37 967.5,13 990,25 C1012.5,37 1057.5,13 1080,25 C1102.5,37 1147.5,13 1170,25 C1192.5,37 1237.5,13 1260,25 C1282.5,37 1327.5,13 1350,25 C1372.5,37 1417.5,13 1440,25 L1440,60 L0,60 Z"
            className="fill-background"
          />
        </svg>
      </motion.div>
    </section>
  )
}
