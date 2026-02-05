import React from 'react'
import { motion } from 'framer-motion'
import AnimatedStats from '../components/AnimatedStats'
import SuccessMetrics from '../components/SuccessMetrics'
import FAQAccordion from '../components/FAQAccordion'

function Intro({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent-lime/10 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-lavender/10 blur-3xl"
      />
      <div className="relative z-10">
        {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-8"
      >
        <motion.div
          className="w-full rounded-[32px] border border-dark-border bg-dark-surface/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-10"
        >
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <motion.div
                animate={{ borderColor: ['#84ff00', '#0ea5e9', '#84ff00'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-3 rounded-[28px] border border-accent-lime/30 blur-[1px]"
              />
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-dark-bg border border-dark-border shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 28c8-10 20-12 28-6-4 10-14 16-26 16-4 0-6-4-2-10z" fill="#84ff00" fillOpacity="0.85" />
                <path d="M26 14h16v10H26z" fill="#0ea5e9" fillOpacity="0.8" />
                <path d="M28 16h4v3h-4zm6 0h4v3h-4zM28 20h4v3h-4zm6 0h4v3h-4z" fill="#0a0a0a" fillOpacity="0.6" />
                <path d="M18 30c6-4 12-6 18-7" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M8 30c4-1 8-2 12-2" stroke="#9cff57" strokeWidth="2" strokeLinecap="round" />
              </svg>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold md:text-5xl">Sustainable Design Studio</h1>
              <p className="mt-3 max-w-2xl text-text-secondary">
                Build high-performance, low-impact architecture with AI-guided sustainability scoring,
                evidence-based material choices, and rapid design alternatives.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 grid gap-6 lg:grid-cols-3"
          >
            <motion.div
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-dark-border bg-dark-bg/60 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition duration-300"
            >
              <motion.div
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-lime/40 bg-accent-lime/10 px-3 py-1 text-xs font-semibold text-accent-lime"
              >
                Smart Inputs
              </motion.div>
              <h2 className="text-lg font-semibold">Constraint-driven setup</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Specify budget, climate, occupancy, and size. The engine adapts targets to local conditions
                and applies priority-weighted scoring for energy, water, or materials.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-dark-border bg-dark-bg/60 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition duration-300"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-amber/40 bg-accent-amber/10 px-3 py-1 text-xs font-semibold text-accent-amber">
                AI Ranking
              </div>
              <h2 className="text-lg font-semibold">Best-match strategies</h2>
              <p className="mt-2 text-sm text-text-secondary">
                We generate multiple sustainable strategies, rank them by performance index, and highlight
                the top option with clear justifications and tradeoffs.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-dark-border bg-dark-bg/60 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition duration-300"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-lavender/40 bg-accent-lavender/10 px-3 py-1 text-xs font-semibold text-accent-lavender">
                Actionable Output
              </div>
              <h2 className="text-lg font-semibold">Insights you can use</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Compare alternatives, export summaries for stakeholders, and iterate quickly with ML-powered
                recommendations that align with your sustainability goals.
              </p>
            </motion.div>
          </motion.div>

          <div className="mt-8 rounded-2xl border border-dark-border bg-dark-bg/60 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-text-secondary">Core Functions</div>
                <p className="mt-2 text-sm text-text-secondary">
                  Sustainability scoring, ML-driven ranking, design alternatives, and reporting.
                </p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-text-secondary">Data Signals</div>
                <p className="mt-2 text-sm text-text-secondary">
                  Real + synthetic training data, climate context, material efficiency, and water use.
                </p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-text-secondary">Outcome</div>
                <p className="mt-2 text-sm text-text-secondary">
                  Faster sustainable decisions with transparent metrics and a best-match recommendation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
          {/* Animated Statistics Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto w-full max-w-7xl px-6 py-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center text-3xl font-bold md:text-4xl"
            >
              Proven Impact by the Numbers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mx-auto mt-3 max-w-2xl text-center text-text-secondary"
            >
              Real data from hundreds of design iterations across diverse building types and climates
            </motion.p>
            <div className="mt-8">
              <AnimatedStats />
            </div>
          </motion.section>

          {/* Success Metrics Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto w-full max-w-7xl px-6 py-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center text-3xl font-bold md:text-4xl"
            >
              Sustainability Metrics That Matter
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mx-auto mt-3 max-w-2xl text-center text-text-secondary"
            >
              Track reductions across the most impactful environmental categories
            </motion.p>
            <div className="mt-8">
              <SuccessMetrics />
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto w-full max-w-4xl px-6 py-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center text-3xl font-bold md:text-4xl"
            >
              Common Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mx-auto mt-3 max-w-2xl text-center text-text-secondary"
            >
              Everything you need to know about the Sustainable Design Studio
            </motion.p>
            <div className="mt-8">
              <FAQAccordion />
            </div>
          </motion.section>

          {/* Final CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto w-full max-w-7xl px-6 py-16 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold md:text-4xl"
            >
              Ready to Transform Your Design Process?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mx-auto mt-3 max-w-2xl text-text-secondary"
            >
              Join the sustainable design revolution with AI-powered insights and real-time sustainability scoring.
            </motion.p>
            <motion.button
              onClick={onGetStarted}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-accent-lime px-8 py-4 text-lg font-semibold text-black shadow-[0_20px_40px_rgba(132,255,0,0.3)] transition hover:brightness-110"
            >
              Start Building Sustainably
            </motion.button>
          </motion.section>
      </div>
    </div>
  )
}

export default Intro
