'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Lightbulb } from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'Publications', description: '[Placeholder: Brief note about the lab\'s publication record and venues.]' },
  { icon: Users, title: 'Collaboration', description: '[Placeholder: Note about industry or academic collaborations.]' },
  { icon: Award, title: 'Recognition', description: '[Placeholder: Awards, grants, or honors received by the lab.]' },
  { icon: Lightbulb, title: 'Innovation', description: '[Placeholder: What sets this lab\'s approach apart.]' },
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
                [Placeholder: First paragraph about the lab — its founding, mission, and core values. E.g., "The [Lab Name] was established in [Year] by [Advisor Name] at [University Name]. Our mission is to..."]
              </p>
              <p>
                [Placeholder: Second paragraph about research impact, current projects, or unique positioning. E.g., "Our work spans [domain A] and [domain B], with a focus on translating fundamental discoveries into..."]
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-extrabold mx-auto">
              PI
            </div>
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold mb-1">[Advisor Name]</h3>
              <p className="text-primary font-semibold text-sm mb-3">[Title, e.g., Associate Professor]</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                [Placeholder: Short bio of the PI — research interests, background, and vision for the lab.]
              </p>
            </div>
            <div className="border-t border-primary/10 pt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">[#]</div>
                <div className="text-xs text-muted-foreground mt-1">Publications</div>
              </div>
              <div>
                <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">[#]</div>
                <div className="text-xs text-muted-foreground mt-1">Lab Members</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
