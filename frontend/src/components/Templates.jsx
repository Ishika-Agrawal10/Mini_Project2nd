import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TEMPLATES = [
  {
    id: 'office-eco',
    name: 'Eco Office',
    description: 'High-efficiency office with smart systems',
    icon: '🏢',
    defaults: { area: 5000, budget: 150, climate: 'temperate', priority: 'energy' },
  },
  {
    id: 'green-retail',
    name: 'Green Retail',
    description: 'Sustainable shopping space with natural light',
    icon: '🛍️',
    defaults: { area: 3000, budget: 100, climate: 'moderate', priority: 'materials' },
  },
  {
    id: 'water-efficient',
    name: 'Water-Smart Building',
    description: 'Focus on water conservation & recycling',
    icon: '💧',
    defaults: { area: 2000, budget: 80, climate: 'arid', priority: 'water' },
  },
  {
    id: 'carbon-neutral',
    name: 'Carbon Neutral Home',
    description: 'Residential with net-zero emissions',
    icon: '🏡',
    defaults: { area: 1500, budget: 120, climate: 'cold', priority: 'energy' },
  },
  {
    id: 'industrial-green',
    name: 'Green Industrial',
    description: 'Manufacturing with minimal waste',
    icon: '🏭',
    defaults: { area: 8000, budget: 200, climate: 'moderate', priority: 'materials' },
  },
  {
    id: 'mixed-use',
    name: 'Mixed-Use Development',
    description: 'Combined residential & commercial space',
    icon: '🏙️',
    defaults: { area: 10000, budget: 300, climate: 'temperate', priority: 'energy' },
  },
]

function Templates({ onSelectTemplate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl border border-dark-border bg-dark-surface/60 p-6"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-4">Design Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => onSelectTemplate(template.defaults)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-dark-border bg-dark-bg/60 hover:bg-dark-bg/80 p-4 text-left transition group"
          >
            <div className="text-3xl mb-2">{template.icon}</div>
            <h3 className="font-semibold text-text-primary group-hover:text-accent-lime transition">
              {template.name}
            </h3>
            <p className="text-xs text-text-secondary mt-1">{template.description}</p>
            <div className="mt-3 text-xs text-text-secondary space-y-1">
              <div>💰 ${template.defaults.budget}k</div>
              <div>📐 {template.defaults.area.toLocaleString()} m²</div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default Templates
