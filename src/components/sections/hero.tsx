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
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
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
        <div className="hidden dark:block absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-background/60 to-transparent" />
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
              <span className="inline-flex">
                {'SMICR'.split('').map((char, charIndex) => (
                  <motion.span
                    key={`gradient-char-${charIndex}`}
                    className="inline-block"
                    whileHover={{ y: -15, transition: { type: 'spring', stiffness: 500, damping: 10 } }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </span>
            {'\u00A0'}
            <span className="text-white">
              <span className="inline-flex">
                {'Lab'.split('').map((char, charIndex) => (
                  <motion.span
                    key={`white-char-${charIndex}`}
                    className="inline-block"
                    whileHover={{ y: -15, transition: { type: 'spring', stiffness: 500, damping: 10 } }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
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
            <p className="text-lg sm:text-xl font-bold text-white max-w-3xl mx-auto leading-relaxed px-6 py-4 rounded-xl bg-black/50 backdrop-blur-sm">
              We develop probabilistic machine learning algorithms for structural vibration
              analysis, digital twin modeling, and structural health monitoring — bridging
              the gap between physics-based models and real-world measurements at IIT Delhi.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Wavy bottom edge — hidden on landing, fades in after scroll.
          Flat edge sits at the video/hero bottom; wave dips down into the next section. */}
      <motion.div
        className="absolute left-0 w-full pointer-events-none"
        style={{
          bottom: '-80px',
          zIndex: 20,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: waveVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-32 sm:h-36"
        >
          <path
            d="M0,0 L1440,0 L1440,35 C1417.5,47 1372.5,23 1350,35 C1327.5,47 1282.5,23 1260,35 C1237.5,47 1192.5,23 1170,35 C1147.5,47 1102.5,23 1080,35 C1057.5,47 1012.5,23 990,35 C967.5,47 922.5,23 900,35 C877.5,47 832.5,23 810,35 C787.5,47 742.5,23 720,35 C697.5,47 652.5,23 630,35 C607.5,47 562.5,23 540,35 C517.5,47 472.5,23 450,35 C427.5,47 382.5,23 360,35 C337.5,47 292.5,23 270,35 C247.5,47 202.5,23 180,35 C157.5,47 112.5,23 90,35 C67.5,47 22.5,23 0,35 Z"
            className="fill-[hsl(200,22%,8%)]"
          />
        </svg>
      </motion.div>
    </section>
  )
}
