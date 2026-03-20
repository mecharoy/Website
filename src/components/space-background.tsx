'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)

      // Colorful hues: blue, purple, cyan, pink
      const hueRanges = [210, 270, 180, 330] // Blue, Purple, Cyan, Pink

      for (let i = 0; i < particleCount; i++) {
        const baseHue = hueRanges[Math.floor(Math.random() * hueRanges.length)]
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.2,
          hue: baseHue + Math.random() * 30 - 15, // Vary within range
        })
      }
      return particles
    }

    particlesRef.current = createParticles()

    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll)

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      // Clear canvas completely to prevent trails
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scrollProgress = scrollRef.current / (document.body.scrollHeight - window.innerHeight)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX + scrollProgress * 0.5
        particle.y += particle.speedY + scrollProgress * 0.3

        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.x -= (dx / distance) * force * 2
          particle.y -= (dy / distance) * force * 2
        }

        // Pulsate based on scroll
        const pulse = Math.sin(Date.now() * 0.001 + index * 0.1) * 0.3 + 0.7

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        )

        // Colorful particles - theme aware
        const hue = particle.hue
        const saturation = theme === 'dark' ? 80 : 90
        const lightness = theme === 'dark'
          ? 60 + scrollProgress * 10 // Brighter in dark mode
          : 35 + scrollProgress * 5 // Darker/more saturated in light mode for visibility
        const opacityMultiplier = theme === 'dark' ? 1.3 : 1.8 // Strong visibility in both modes

        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${particle.opacity * pulse * 0.7 * opacityMultiplier})`)
        gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity * pulse * 0.5 * opacityMultiplier})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core particle
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness + 5}%, ${particle.opacity * pulse * 0.8 * opacityMultiplier})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Connect nearby particles - theme aware with colorful lines
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const baseOpacity = (1 - distance / 150) * 0.2
            const opacity = theme === 'dark' ? baseOpacity * 1.5 : baseOpacity * 2.0
            // Average hue between connected particles
            const avgHue = (particle.hue + otherParticle.hue) / 2
            const lightness = theme === 'dark' ? 60 : 40
            const saturation = theme === 'dark' ? 80 : 90
            ctx.strokeStyle = `hsla(${avgHue}, ${saturation}%, ${lightness}%, ${opacity})`
            ctx.lineWidth = theme === 'dark' ? 0.5 : 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: theme === 'dark' ? 0.6 : 1 }}
    />
  )
}
