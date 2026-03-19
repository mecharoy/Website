'use client'

import { motion } from 'framer-motion'
import { Microscope, Cpu, BrainCircuit, ArrowRight } from 'lucide-react'

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
    color: 'from-primary to-secondary',
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
    color: 'from-secondary to-accent',
  },
  {
    icon: BrainCircuit,
    title: 'Physics-Informed ML',
    description: 'Integrating deep learning with physical laws and constitutive models to solve inverse problems and discover interpretable data-driven models in mechanics.',
    topics: [
      'Physics-informed neural networks',
      'Bayesian sparse regression',
      'Material constitutive modeling',
      'Neural operators for PDEs',
    ],
    color: 'from-accent to-primary',
  },
]

export function Services() {
  return (
    <section id="research" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <motion.div
          className="flex items-end gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div>
            <div className="text-warm text-sm font-bold uppercase tracking-widest mb-3">
              What We Study
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">
              Research Areas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mt-4 leading-relaxed">
              We bridge traditional computational mechanics with modern machine learning to build scalable, interpretable, and uncertainty-aware models for real-world structural systems.
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              className="group relative grid grid-cols-1 lg:grid-cols-[5rem_1fr] gap-6 items-start"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
            >
              {/* Large number */}
              <div className="section-number hidden lg:block" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Card */}
              <div className="relative bg-card rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                {/* Top gradient bar */}
                <div className={`h-1 bg-gradient-to-r ${area.color}`} />

                <div className="p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <area.icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-2xl font-bold mb-3">{area.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{area.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {area.topics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15"
                          >
                            <ArrowRight className="w-3 h-3" />
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
