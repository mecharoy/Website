'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'How can I join the SMICR Lab?',
    answer: 'Prospective PhD and MS students should apply through the Applied Mechanics Department at IIT Delhi. If you are interested in working with us, feel free to email Dr. Rajdip Nayek at rajdipn@iitd.ac.in with your CV, transcripts, and a brief description of your research interests. Strong applicants typically have a background in structural/mechanical engineering, applied mathematics, or machine learning.'
  },
  {
    question: 'What research projects are currently active?',
    answer: 'Our active projects span three main areas: (1) digital twin development using Bayesian filtering and neural operators, (2) structural health monitoring via multi-fidelity deep learning and elastic wave propagation, and (3) physics-informed machine learning for inverse problems in mechanics. Contact us to learn which projects currently have openings.'
  },
  {
    question: 'What background is helpful to work in this lab?',
    answer: 'We look for students with strong foundations in one or more of: structural/civil/mechanical engineering, applied mathematics, probability and statistics, or machine learning. Familiarity with Python and scientific computing is expected. Experience with PyTorch, finite element methods, or Bayesian inference is a plus but not required.'
  },
  {
    question: 'Are there funded positions available?',
    answer: 'PhD positions at IIT Delhi are typically funded through institute fellowships (HTRA) or sponsored research projects. Teaching assistantships and research assistantships are available. Prospective students are encouraged to reach out directly to discuss current funding availability before applying.'
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-warm text-sm font-bold uppercase tracking-widest mb-3">
            FAQ
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Common questions about joining the lab, ongoing research, and collaborations.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full flex items-start gap-4 text-left px-6 py-5 rounded-xl transition-all duration-200 ${
                    isOpen
                      ? 'bg-primary/8 border border-primary/20'
                      : 'bg-card border border-primary/8 hover:border-primary/20 hover:bg-card/80'
                  }`}
                >
                  {/* Number */}
                  <span className={`font-display text-sm font-bold mt-0.5 flex-shrink-0 ${isOpen ? 'text-warm' : 'text-muted-foreground'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-bold pr-4">
                      {faq.question}
                    </h3>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
