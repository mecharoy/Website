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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            FAQ
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Common questions about joining the lab, ongoing research, and collaborations.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-card border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg dark:shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-display text-lg sm:text-xl font-bold pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 sm:px-8 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
