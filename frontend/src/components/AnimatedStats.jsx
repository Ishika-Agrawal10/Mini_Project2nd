import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function Counter({ end, duration = 2, label, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true)
      }
    }, { threshold: 0.1 })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const increment = end / (duration * 60)
    let animationId

    const animate = () => {
      start += increment
      if (start < end) {
        setCount(Math.floor(start))
        animationId = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isVisible, end, duration])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-accent-lime mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
    </motion.div>
  )
}

function AnimatedStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-dark-border bg-dark-bg/60 p-8 md:p-12"
    >
      <h2 className="text-2xl font-bold text-text-primary text-center mb-12">By The Numbers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Counter end={79783} label="Training Samples" suffix="+" />
        <Counter end={1000} label="Designs Generated" suffix="+" />
        <Counter end={98} label="ML Accuracy" suffix="%" />
        <Counter end={45} label="% Carbon Saved" suffix="+" />
      </div>
    </motion.div>
  )
}

export default AnimatedStats
