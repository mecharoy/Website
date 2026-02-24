'use client'

import { motion } from 'framer-motion'
import { GraduationCap, FlaskConical } from 'lucide-react'

const members = [
  {
    icon: GraduationCap,
    role: 'PhD Student',
    name: '[Student Name 1]',
    description: '[Placeholder: Research focus and brief background of this team member.]',
  },
  {
    icon: GraduationCap,
    role: 'PhD Student',
    name: '[Student Name 2]',
    description: '[Placeholder: Research focus and brief background of this team member.]',
  },
  {
    icon: GraduationCap,
    role: 'MS Student',
    name: '[Student Name 3]',
    description: '[Placeholder: Research focus and brief background of this team member.]',
  },
  {
    icon: FlaskConical,
    role: 'Undergraduate Researcher',
    name: '[Student Name 4]',
    description: '[Placeholder: Research focus and brief background of this team member.]',
  },
]

export function Portfolio() {
  return (
    <section id="team" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Our People
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            {'Meet the Team'.split(' ').map((word, wordIndex) => (
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
                {wordIndex < 'Meet the Team'.split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            [Placeholder: A short line about the team culture or diversity of backgrounds.]
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              className="group bg-card border-2 border-primary/20 rounded-2xl overflow-hidden text-center hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer shadow-lg dark:shadow-sm"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
              whileHover={{
                y: -10,
                scale: 1.04,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 12
                }
              }}
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <member.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{member.role}</span>
                <h3 className="font-display text-lg font-bold mt-1 mb-2">{member.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
