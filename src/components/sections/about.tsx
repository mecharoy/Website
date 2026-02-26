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
  { icon: BookOpen, title: 'Publications', description: 'Publishing in top venues across computational mechanics, machine learning, and structural engineering.' },
  { icon: Users, title: 'Collaboration', description: 'Active collaborations with researchers across IIT Delhi, international universities, and industry partners.' },
  { icon: Award, title: 'Recognition', description: 'Funded research in structural health monitoring, digital twins, and physics-informed machine learning.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Unique fusion of Bayesian inference, neural operators, and physics-based models for real-world structures.' },
]

export function About() {
  return (
    <section id="about" className="py-20 sm:py-32 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
              Who We Are
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6">
              {'About the Lab'.split(' ').map((word, wordIndex) => (
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
                  {wordIndex < 'About the Lab'.split(' ').length - 1 && '\u00A0'}
                </span>
              ))}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                The SMICR (Structural Mechanics, Inference, and Computational Research) Lab is led by Dr. Rajdip Nayek at the Department of Applied Mechanics, IIT Delhi. Our mission is to develop principled, scalable machine learning methods that integrate seamlessly with physics-based models for real-world structural engineering applications.
              </p>
              <p>
                Our work spans structural health monitoring, digital twin development, and physics-informed deep learning — with a focus on uncertainty quantification and interpretable data-driven discovery. We aim to translate fundamental research into robust tools for monitoring and predicting the behavior of complex structural systems.
              </p>
            </div>

            {/* Feature Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-card border-2 border-primary/20 rounded-xl p-6 hover:border-primary hover:-translate-y-1 transition-all shadow-lg dark:shadow-sm"
                  style={{ opacity: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
                >
                  <feature.icon className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-display text-lg font-bold mb-2 text-primary">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Advisor / Lab Highlight - Right Side */}
          <motion.div
            className="relative bg-card border-2 border-primary/20 rounded-3xl p-10 shadow-2xl flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="w-52 h-52 rounded-full overflow-hidden ring-4 ring-primary/30 mx-auto">
              <PIAvatar />
            </div>
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold mb-1">Dr. Rajdip Nayek</h3>
              <p className="text-primary font-semibold text-sm mb-3">Assistant Professor, Applied Mechanics, IIT Delhi</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ph.D. from University of Waterloo (2019), M.E. from IISc Bangalore, B.Tech. from NIT Durgapur. Previously a postdoctoral researcher at the Dynamics Research Group. His research focuses on probabilistic machine learning for structural vibration, digital twins, and structural health monitoring.
              </p>
            </div>
            <div className="border-t border-primary/10 pt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">30+</div>
                <div className="text-xs text-muted-foreground mt-1">Publications</div>
              </div>
              <div>
                <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">8+</div>
                <div className="text-xs text-muted-foreground mt-1">Lab Members</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
