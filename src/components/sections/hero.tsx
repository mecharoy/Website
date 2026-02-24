'use client'

import { motion } from 'framer-motion'
import { FlaskConical } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-8 animate-float">
              <FlaskConical className="w-4 h-4" />
              [University Name] — [Department Name]
            </div>
          </motion.div>

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
              {'[Lab Name]'.split(' ').map((word, wordIndex) => (
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
                  {wordIndex < '[Lab Name]'.split(' ').length - 1 && '\u00A0'}
                </span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            [Placeholder: Brief description of the lab's mission and research focus. E.g., "We investigate the fundamental principles of [Research Area] to advance knowledge and develop solutions for real-world challenges."]
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
              className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-4 text-base font-semibold text-primary transition-all hover:bg-primary/10 hover:-translate-y-1"
            >
              Meet the Team
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
