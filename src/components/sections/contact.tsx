'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Globe, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { submitContactForm } from '@/app/actions/contact'

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)

    if (result.success) {
      toast({
        title: 'Message sent!',
        description: 'We\'ll get back to you shortly.',
      })
      e.currentTarget.reset()
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }

    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="py-20 sm:py-32 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t border-primary/10">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Let's Connect
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            {'Get in Touch'.split(' ').map((word, wordIndex) => (
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
                {wordIndex < 'Get in Touch'.split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
          </h2>
          <p className="text-lg text-muted-foreground">
            Interested in our research, collaboration, or joining the lab? Send us a message and we'll get back to you.
          </p>
        </motion.div>

        <motion.div
          className="bg-card border-2 border-primary/20 rounded-2xl p-8 sm:p-12 mb-12 shadow-lg dark:shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="business" className="block text-sm font-semibold mb-2">
                Affiliation / Institution
              </label>
              <input
                type="text"
                id="business"
                name="business"
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Your University or Organization"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="I'm interested in joining the lab / collaborating on / learning more about..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
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
