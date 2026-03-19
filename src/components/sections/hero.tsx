'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/Gemini_Generated_Image_tbcgkotbcgkotbcg.png"
          alt="SMICR Lab hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/10 dark:bg-background/40" />
      </div>
      <div className="relative z-10 container mx-auto max-w-5xl">
        <div className="text-center">
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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

          <motion.p
            className="text-lg sm:text-xl text-foreground/80 dark:text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We develop probabilistic machine learning algorithms for structural vibration analysis, digital twin modeling, and structural health monitoring — bridging the gap between physics-based models and real-world measurements at IIT Delhi.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="#research"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-1"
            >
              Explore Our Research
            </a>
            <a
              href="#team"
              className="inline-flex items-center justify-center rounded-full border-2 border-foreground/60 px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-foreground/10 hover:-translate-y-1"
            >
              Meet the Team
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
