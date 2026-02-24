'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 0, label: 'Publications', suffix: '+' },
  { value: 0, label: 'Lab Members', suffix: '' },
  { value: 0, label: 'Projects', suffix: '+' },
  { value: 0, label: 'Years Active', suffix: '' },
]

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let current = 0
    const increment = value / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, isInView])

  return (
    <div ref={ref} className="font-display text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {prefix}{count}{suffix}
    </div>
  )
}

export function Stats() {
  return (
    <section className="relative py-16 sm:py-20 bg-card/50 backdrop-blur-sm border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <div className="text-muted-foreground font-medium mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
