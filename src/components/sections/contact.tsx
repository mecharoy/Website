'use client'

import { motion } from 'framer-motion'
import { Mail, Globe, Linkedin } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-32 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t border-primary/10">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <a href="mailto:rajdipn@iitd.ac.in" className="text-center block hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-display font-bold text-primary mb-1">Email</h4>
            <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
              rajdipn@iitd.ac.in
            </p>
          </a>

          <a href="https://www.linkedin.com/in/rajdipnayek1989/" target="_blank" rel="noopener noreferrer" className="text-center block hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <Linkedin className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-display font-bold text-primary mb-1">LinkedIn</h4>
            <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
              rajdipnayek1989
            </p>
          </a>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-display font-bold text-primary mb-1">Office</h4>
            <p className="text-sm text-muted-foreground">
              Room B-24, Block IV, IIT Delhi<br />Hauz Khas, New Delhi 110016
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
