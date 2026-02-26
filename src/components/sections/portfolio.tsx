'use client'

import { motion } from 'framer-motion'

const members = [
  {
    photo: 'https://lh3.googleusercontent.com/sitesv/APaQ0ST8GiUI-A__qX4-zg_eogfnro3XvG_1lNbmR-_uFFIWx0U3tXkc_qyMfEeO2TIvZOm1cSobUJtQSs4s2crtqMnnv788_S2NhGXkHDEGLEgisCfxK41YR-_Rrryr-Ki8b6_lnhN4YxBVSD34_lWb9_KKqUzWuYqcimuUiRTFpstsx0epWlXh2zLP8eRsih-dbC3mYOafXmWHlTlSZmICgUT1Jj49GOYgfvBY=w1280',
    role: 'PhD Student',
    name: 'Sahil Kashyap',
    description: 'Digital twin modeling and Bayesian filtering with neural operators. M.Tech. from MNNIT Allahabad. (Aug 2022–present)',
  },
  {
    photo: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQHVqmwVn2BsVuUhJmF953XsD4xv9vAmdNIgdLc_SUbn7MjVbgMDEy1Q0StXb3_1JDUuUMZCUjwGAVhy7eGaV5bxYFRYHzLbkYDjTRm8mdk12aDNNDpWRvHL6GMrVxGS7Mc9HSF489CRb6zsCofayyJaDkrJzSLqDMTMBZO3fmXKVcIZVhVTunCY7VD_RPT9FxC5h_0loP-PcIrzlL8kJ5wdXL3tOO8suc0hWA=w1280',
    role: 'PhD Student',
    name: 'Toiba Noor',
    description: 'Soil constitutive modeling using deep learning. B.Tech. from NIT Srinagar. (Dec 2022–present)',
  },
  {
    photo: 'https://lh3.googleusercontent.com/sitesv/APaQ0SRGSC8hwm0y7HRREgM1T8AeGekPd6s01goGdQhD2bB0PWXl7L9yt1tRyNBmLwDNKO4Tp9Y6KkMT5nqucHD5P4aT8sT611R0ZvafagNEGxLskaQpJ2oTiRcSZmRnmgYnqkiXq1Bo2qEFiRerTmTB2Lm8R4QobrkB9Tam_lsNXG75BpoTNWydHbq3ff0=w1280',
    role: 'PhD Student',
    name: 'Rohan Thorat',
    description: 'Integration of control, system identification, and reinforcement learning for structural systems. (Aug 2023–present)',
  },
  {
    photo: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQq6Au7VOmthRXo96RVceT7hmaK-CmcvDrcZgSmZ6ojjcSIkkH03DM2AWqnIehulrccdW6lBo1jnOXEhCJmVAikMLW8kFYGaLdscSJkEd42MJqQvzxOEvXFoO_3bsu31GZ2KZEzf8z6dv6mrhQKJwlQtIJRS4WHVW5ocBSvnCnQDKY5VMsvvNNuiUyon54lZMTx2vIbXgrycITUt2-03dCuEfayqo1hmBLHnI=w1280',
    role: 'PhD Student',
    name: 'Sawan',
    description: 'Gaussian process-based uncertainty-aware neural operators. B.Tech. from Delhi Technological University. (Dec 2022–present)',
  },
  {
    photo: 'https://lh3.googleusercontent.com/sitesv/APaQ0SSQbXvBjJQ8gF1DWokUjIjQfPCK-2bwxIQ6xubv16n989HdfQ6UPyVjn33ktlY1nZh6Q-YF65cVjvOnU3-YRX0BUyGOaADFwxDqxu67AafZ8-jjJBnBxlQqumsm41cbZ1QyZpdaVYHjFb2YdRfBaGIhKndldhNBfUtG-jlen18Tw9RiJUz3LSfX0lfKgzTdOee-K4AnvKGrQpTP_qw1wVoZgnTxrdzWaQK8ZHs=w1280',
    role: 'MS Student',
    name: 'Abhijit Choudhury',
    description: 'Multi-fidelity deep learning for structural health monitoring via elastic wave propagation. (Aug 2023–present)',
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
            A diverse group of researchers from top institutions across India, united by a passion for combining machine learning with structural mechanics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
              <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
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
