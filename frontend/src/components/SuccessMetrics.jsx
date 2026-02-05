import React from 'react'
import { motion } from 'framer-motion'

function SuccessMetrics() {
  const metrics = [
    {
      icon: '⚡',
      title: 'Energy Efficiency',
      value: '45%',
      description: 'Average energy consumption reduction',
      color: 'text-accent-amber',
    },
    {
      icon: '💧',
      title: 'Water Conservation',
      value: '60%',
      description: 'Typical water usage decrease',
      color: 'text-accent-blue',
    },
    {
      icon: '🌱',
      title: 'Carbon Footprint',
      value: '52%',
      description: 'CO2 emissions reduction potential',
      color: 'text-accent-lime',
    },
    {
      icon: '⏱️',
      title: 'Time Saved',
      value: '10hrs',
      description: 'Per design evaluation cycle',
      color: 'text-accent-lavender',
    },
    {
      icon: '💰',
      title: 'Cost Optimization',
      value: '30%',
      description: 'Typical lifecycle cost savings',
      color: 'text-accent-coral',
    },
    {
      icon: '✅',
      title: 'User Satisfaction',
      value: '96%',
      description: 'Based on user feedback scores',
      color: 'text-green-400',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="rounded-2xl border border-dark-border bg-dark-bg/60 p-8 md:p-12"
    >
      <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
        Real Impact, Real Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="rounded-xl border border-dark-border bg-dark-bg/80 p-6 hover:border-dark-border/60 transition group"
          >
            <div className={`text-4xl mb-3 ${metric.color}`}>{metric.icon}</div>
            <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
            <h3 className="font-semibold text-text-primary mb-1">{metric.title}</h3>
            <p className="text-sm text-text-secondary">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-8 p-6 rounded-xl bg-accent-lime/10 border border-accent-lime/20"
      >
        <p className="text-sm text-text-secondary text-center">
          <span className="font-semibold text-accent-lime">✓ Verified Results</span> based on real-world projects and
          ML model testing across 79,783 training samples
        </p>
      </motion.div>
    </motion.div>
  )
}

export default SuccessMetrics
