'use client'

import { motion } from 'framer-motion'
import { Mail, Globe, Linkedin, ArrowUpRight } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="relative py-20 sm:py-32 px-4 overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-warm/5 pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-warm text-sm font-bold uppercase tracking-widest mb-3">
            Get in Touch
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Interested in our research or joining the lab? Reach out.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <a
            href="mailto:rajdipn@iitd.ac.in"
            className="group flex flex-col items-center p-8 rounded-2xl bg-card border border-primary/10 hover:border-warm/40 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-12 h-12 bg-warm/15 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-warm" />
            </div>
            <h4 className="font-display font-bold mb-1">Email</h4>
            <p className="text-sm text-muted-foreground group-hover:text-warm transition-colors">
              rajdipn@iitd.ac.in
            </p>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 mt-3 group-hover:text-warm group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="https://www.linkedin.com/in/rajdipnayek1989/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-8 rounded-2xl bg-card border border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Linkedin className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-display font-bold mb-1">LinkedIn</h4>
            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
              rajdipnayek1989
            </p>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 mt-3 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </a>

          <div className="flex flex-col items-center p-8 rounded-2xl bg-card border border-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-display font-bold mb-1">Office</h4>
            <p className="text-sm text-muted-foreground text-center">
              Room B-24, Block IV<br />IIT Delhi, New Delhi 110016
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
