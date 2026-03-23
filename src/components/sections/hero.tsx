'use client'

import { motion } from 'framer-motion'

export function Hero() {
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
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white"
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

        </div>
      </div>
    </section>
  )
}
