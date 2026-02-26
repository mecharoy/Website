'use client'

import { motion } from 'framer-motion'
import { Microscope, Cpu, BrainCircuit, Check } from 'lucide-react'

const researchAreas = [
  {
    icon: Microscope,
    title: 'Digital Twins',
    description: 'Creating virtual frameworks that replicate the real-time behavior of structural systems by combining physics-based models with measured data and machine learning.',
    topics: [
      'Bayesian filtering with neural operators',
      'Model discrepancy quantification',
      'Real-time state estimation',
      'Uncertainty-aware predictions',
    ],
  },
  {
    icon: Cpu,
    title: 'Structural Health Monitoring',
    description: 'Developing scalable probabilistic methods to detect, localize, and assess damage in structures using vibration data and data-driven inference.',
    topics: [
      'Vibration-based damage detection',
      'Elastic wave propagation analysis',
      'Multi-fidelity deep learning',
      'Sensor data fusion',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'Physics-Informed Machine Learning',
    description: 'Integrating deep learning with physical laws and constitutive models to solve inverse problems and discover interpretable data-driven models in mechanics.',
    topics: [
      'Physics-informed neural networks',
      'Bayesian sparse regression',
      'Material constitutive modeling',
      'Neural operators for PDEs',
    ],
  },
]

export function Services() {
  return (
    <section id="research" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            What We Study
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            {'Research Areas'.split(' ').map((word, wordIndex) => (
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
                {wordIndex < 'Research Areas'.split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We bridge traditional computational mechanics with modern machine learning to build scalable, interpretable, and uncertainty-aware models for real-world structural systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              className="group relative bg-card border-2 border-primary/20 rounded-2xl p-8 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20 cursor-pointer shadow-lg dark:shadow-sm"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 12
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <area.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-display text-2xl font-bold mb-3">{area.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{area.description}</p>

                <ul className="space-y-3 mb-6">
                  {area.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
