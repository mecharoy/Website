'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6">
              About the Lab
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The SMICR (Structural Mechanics, Inference, and Computational Research) Lab is led by Dr. Rajdip Nayek at the Department of Applied Mechanics, IIT Delhi. Our mission is to develop principled, scalable machine learning methods that integrate seamlessly with physics-based models for real-world structural engineering applications.
              </p>
              <p>
                Our work spans structural health monitoring, digital twin development, and physics-informed deep learning — with a focus on uncertainty quantification and interpretable data-driven discovery. We aim to translate fundamental research into robust tools for monitoring and predicting the behavior of complex structural systems.
              </p>
            </div>

            {/* Lab video placeholder */}
            <div className="relative mt-8 rounded-2xl overflow-hidden border border-primary/10">
              <video
                src="/images/labvideo2.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
              />
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
                <a
                  href="https://scholar.google.com/citations?user=dd5LoV4AAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-float inline-block group/scholar"
                >
                  <div className="font-display text-3xl font-extrabold text-warm group-hover/scholar:text-warm/70 transition-colors">30+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Publications</div>
                </a>
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
