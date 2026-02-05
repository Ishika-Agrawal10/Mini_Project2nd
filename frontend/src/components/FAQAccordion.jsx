import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'What is sustainable design?',
      answer:
        'Sustainable design creates buildings with minimal environmental impact, optimizing energy use, water conservation, and material efficiency while maintaining performance and comfort.',
    },
    {
      question: 'How does the AI ranking work?',
      answer:
        'Our ML model analyzes 79,783+ training samples to rank design alternatives by a sustainability index. It considers your priority (energy/water/materials), budget, climate, and location to recommend the best option.',
    },
    {
      question: 'Can I export the designs?',
      answer:
        'Yes! Export as CSV, JSON, or PDF. Perfect for sharing with stakeholders, architects, or building committees. Includes all metrics and recommendations.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No, you can use Guest mode immediately. Creating an account saves your projects, preferences, and design history for quick access later.',
    },
    {
      question: 'What building types can I design?',
      answer:
        'Our system works for offices, retail, residential, industrial, mixed-use developments, and more. Select from pre-built templates or customize your own constraints.',
    },
    {
      question: 'How accurate are the sustainability predictions?',
      answer:
        'Our ML models achieve 98% accuracy on test datasets. Real-world results depend on implementation, materials chosen, and local conditions. We recommend consulting with architects for detailed analysis.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-dark-border bg-dark-bg/60 p-8 md:p-12"
    >
      <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Frequently Asked Questions</h2>

      <div className="space-y-3 max-w-3xl mx-auto">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            viewport={{ once: true }}
            className="rounded-lg border border-dark-border overflow-hidden"
          >
            <motion.button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 bg-dark-bg/60 hover:bg-dark-bg/80 transition flex items-center justify-between text-left"
            >
              <span className="font-semibold text-text-primary">{faq.question}</span>
              <motion.span
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-accent-lime text-xl"
              >
                ▼
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-dark-surface/80 px-6 py-4 border-t border-dark-border"
                >
                  <p className="text-text-secondary text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-text-secondary">
          Still have questions?{' '}
          <span className="text-accent-lime font-semibold cursor-pointer hover:underline">
            Contact our team
          </span>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default FAQAccordion
