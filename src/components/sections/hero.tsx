'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Hero() {
  const [phase, setPhase] = useState<'title' | 'tagline'>('title')
  const transitioned = useRef(false)

  useEffect(() => {
    if (phase !== 'title') return
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && !transitioned.current) {
        transitioned.current = true
        setPhase('tagline')
      }
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 30 && !transitioned.current) {
        transitioned.current = true
        setPhase('tagline')
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

  return (
    <section className="relative min-h-screen flex items-end justify-center px-4 pb-12 overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full object-cover object-top"
          style={{ height: 'calc(100% + 80px)' }}
        >
          <source src="/uploads/Lab_Video_Generation_Request.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/10 dark:bg-background/40" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl">
        <div className="text-center">
          <AnimatePresence mode="wait">
            {phase === 'title' ? (
              <motion.h1
                key="title"
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {'Welcome to the '.split(' ').map((word, wordIndex) => (
                  <span key={`word-${wordIndex}`} className="inline-flex">
                    {word.split('').map((char, charIndex) => (
                      <motion.span
                        key={`char-${wordIndex}-${charIndex}`}
                        className="inline-block"
                        whileHover={{
                          y: -15,
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 10
                          }
                        }}
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
                          whileHover={{
                            y: -15,
                            transition: {
                              type: "spring",
                              stiffness: 500,
                              damping: 10
                            }
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                      {wordIndex < 'SMICR Lab'.split(' ').length - 1 && '\u00A0'}
                    </span>
                  ))}
                </span>
              </motion.h1>
            ) : (
              <motion.p
                key="tagline"
                className="text-lg sm:text-xl font-bold text-white max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                We develop probabilistic machine learning algorithms for structural vibration
                analysis, digital twin modeling, and structural health monitoring — bridging
                the gap between physics-based models and real-world measurements at IIT Delhi.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Wavy bottom edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          viewBox="0 0 1440 40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20"
        >
          <path
            d="M0,15 C22.5,23 67.5,7 90,15 C112.5,23 157.5,7 180,15 C202.5,23 247.5,7 270,15 C292.5,23 337.5,7 360,15 C382.5,23 427.5,7 450,15 C472.5,23 517.5,7 540,15 C562.5,23 607.5,7 630,15 C652.5,23 697.5,7 720,15 C742.5,23 787.5,7 810,15 C832.5,23 877.5,7 900,15 C922.5,23 967.5,7 990,15 C1012.5,23 1057.5,7 1080,15 C1102.5,23 1147.5,7 1170,15 C1192.5,23 1237.5,7 1260,15 C1282.5,23 1327.5,7 1350,15 C1372.5,23 1417.5,7 1440,15 L1440,40 L0,40 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
