'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Lightbulb } from 'lucide-react'

function PIAvatar() {
  const [imgFailed, setImgFailed] = useState(false)

  if (imgFailed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <span className="text-white text-3xl font-extrabold font-display">RN</span>
      </div>
    )
  }

  return (
    <img
      src="/images/team/rajdip-nayek.jpg"
      alt="Dr. Rajdip Nayek"
      className="w-full h-full object-cover object-top"
      onError={() => setImgFailed(true)}
    />
  )
}

const features = [
  { icon: BookOpen, title: 'Publications', description: 'Publishing in top venues across computational mechanics, machine learning, and structural engineering.', href: 'https://scholar.google.com/citations?user=dd5LoV4AAAAJ&hl=en', float: true },
  { icon: Users, title: 'Collaboration', description: 'Active collaborations with researchers across IIT Delhi, international universities, and industry partners.' },
  { icon: Award, title: 'Recognition', description: 'Funded research in structural health monitoring, digital twins, and physics-informed machine learning.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Unique fusion of Bayesian inference, neural operators, and physics-based models for real-world structures.' },
]

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-warm text-sm font-bold uppercase tracking-widest mb-3">
              Who We Are
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6">
              About the Lab
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                The SMICR (Structural Mechanics, Inference, and Computational Research) Lab is led by Dr. Rajdip Nayek at the Department of Applied Mechanics, IIT Delhi. Our mission is to develop principled, scalable machine learning methods that integrate seamlessly with physics-based models for real-world structural engineering applications.
              </p>
              <p>
                Our work spans structural health monitoring, digital twin development, and physics-informed deep learning — with a focus on uncertainty quantification and interpretable data-driven discovery. We aim to translate fundamental research into robust tools for monitoring and predicting the behavior of complex structural systems.
              </p>
            </div>

            {/* Feature Cards — alternating left-border accent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`relative pl-5 py-4 pr-4 rounded-lg bg-card border border-primary/10 hover:border-primary/25 transition-all duration-200 ${feature.href ? 'cursor-pointer' : ''} ${feature.float ? 'animate-float' : ''}`}
                  style={{ opacity: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3, margin: "0px 0px -80px 0px" }}
                  {...(feature.href ? { onClick: () => { window.open(feature.href!, feature.href!.startsWith('http') ? '_blank' : '_self') } } : {})}
                >
                  {/* Colored left accent bar */}
                  <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${index % 2 === 0 ? 'bg-primary' : 'bg-warm'}`} />
                  <feature.icon className={`w-8 h-8 mb-2 ${index % 2 === 0 ? 'text-primary' : 'text-warm'}`} />
                  <h4 className="font-display text-base font-bold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Advisor card — right side — Grand layout with clear photo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Large photo with decorative frame */}
            <div className="relative mb-6">
              {/* Decorative gradient border behind the image */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-warm to-secondary rounded-2xl opacity-30 blur-sm" />
              <div className="relative h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border-2 border-primary/20">
                <PIAvatar />
              </div>
            </div>

            {/* Info card below the photo */}
            <div className="bg-card border border-primary/10 rounded-2xl p-8 shadow-lg">
              <h3 className="font-display text-3xl font-bold mb-1">Dr. Rajdip Nayek</h3>
              <p className="text-warm font-semibold text-sm mb-4">Assistant Professor, Applied Mechanics, IIT Delhi</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Ph.D. from University of Waterloo (2019), M.E. from IISc Bangalore, B.Tech. from NIT Durgapur. Previously a postdoctoral researcher at the Dynamics Research Group. His research focuses on probabilistic machine learning for structural vibration, digital twins, and structural health monitoring.
              </p>

              {/* Stats with warm accent */}
              <div className="flex gap-8 pt-5 border-t border-primary/10">
                <div>
                  <div className="font-display text-3xl font-extrabold text-warm">30+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Publications</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-extrabold text-primary">8+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Lab Members</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
