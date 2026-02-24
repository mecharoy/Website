'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'How can I join the lab?',
    answer: '[Placeholder: Describe the process for prospective students — whether to email the PI directly, apply through the department, what qualifications you look for (GPA, background, research experience), and when openings are typically available.]'
  },
  {
    question: 'What research projects are currently active?',
    answer: '[Placeholder: Give a brief overview of ongoing projects. E.g., "We are currently working on [Project 1], [Project 2], and [Project 3]. Each project is at a different stage — from early exploration to publication-ready work. Reach out to learn which projects have openings."]'
  },
  {
    question: 'Do you accept undergraduate researchers?',
    answer: '[Placeholder: Explain whether you take undergrads, what commitment you expect (hours per week, credit vs. paid, duration), and what skills or coursework would make a strong applicant.]'
  },
  {
    question: 'Are there funded PhD positions available?',
    answer: '[Placeholder: Describe funding situations — RA, TA, fellowship opportunities. Let prospective students know where and how to apply, and whether to contact the PI before or after applying to the program.]'
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
