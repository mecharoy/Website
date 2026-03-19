'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const members = [
  {
    photo: '/images/team/sahil-kashyap.jpg',
    initials: 'SK',
    role: 'PhD Student',
    name: 'Sahil Kashyap',
    description: 'Digital twin modeling and Bayesian filtering with neural operators. M.Tech. from MNNIT Allahabad. (Aug 2022–present)',
  },
  {
    photo: '/images/team/toiba-noor.jpg',
    initials: 'TN',
    role: 'PhD Student',
    name: 'Toiba Noor',
    description: 'Soil constitutive modeling using deep learning. B.Tech. from NIT Srinagar. (Dec 2022–present)',
  },
  {
    photo: '/images/team/rohan-thorat.jpg',
    initials: 'RT',
    role: 'PhD Student',
    name: 'Rohan Thorat',
    description: 'Integration of control, system identification, and reinforcement learning for structural systems. (Aug 2023–present)',
  },
  {
    photo: '/images/team/sawan.jpg',
    initials: 'S',
    role: 'PhD Student',
    name: 'Sawan',
    description: 'Gaussian process-based uncertainty-aware neural operators. B.Tech. from Delhi Technological University. (Dec 2022–present)',
    photoPosition: '50% 20%',
  },
  {
    photo: '/images/team/abhijit-choudhury.jpg',
    initials: 'AC',
    role: 'MS Student',
    name: 'Abhijit Choudhury',
    description: 'Multi-fidelity deep learning for structural health monitoring via elastic wave propagation. (Aug 2023–present)',
    photoPosition: '50% 20%',
  },
]

function MemberAvatar({ photo, initials, name, photoPosition }: { photo: string; initials: string; name: string; photoPosition?: string }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imgFailed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <span className="text-white text-3xl font-extrabold font-display">{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={photo}
      alt={name}
      className="w-full h-full object-cover"
      style={{ objectPosition: photoPosition ?? '50% 50%' }}
      onError={() => setImgFailed(true)}
    />
  )
}

export function Portfolio() {
  return (
    <section id="team" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-warm text-sm font-bold uppercase tracking-widest mb-3">
            Our People
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Meet the Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A diverse group of researchers from top institutions across India, united by a passion for combining machine learning with structural mechanics.
          </p>
        </motion.div>

        {/* Staggered masonry-like layout: first row 2 cols, second row 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {members.slice(0, 2).map((member, index) => (
            <motion.div
              key={member.name}
              className="group relative bg-card border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-52 sm:h-auto overflow-hidden flex-shrink-0">
                  <MemberAvatar photo={member.photo} initials={member.initials} name={member.name} photoPosition={member.photoPosition} />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-warm mb-1">{member.role}</span>
                  <h3 className="font-display text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.slice(2).map((member, index) => (
            <motion.div
              key={member.name}
              className="group bg-card border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 2) * 0.12 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-40 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                  <MemberAvatar photo={member.photo} initials={member.initials} name={member.name} photoPosition={member.photoPosition} />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-warm mb-1">{member.role}</span>
                  <h3 className="font-display text-lg font-bold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
