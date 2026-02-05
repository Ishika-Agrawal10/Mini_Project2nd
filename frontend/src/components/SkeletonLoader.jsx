import React from 'react'
import { motion } from 'framer-motion'

function SkeletonLoader({ type = 'card', count = 1 }) {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  }

  if (type === 'card') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-dark-border bg-dark-surface p-6"
          >
            <motion.div
              {...shimmer}
              className="h-6 w-32 rounded-lg bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
            />
            <motion.div
              {...shimmer}
              className="mt-4 h-4 w-full rounded bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
            />
            <motion.div
              {...shimmer}
              className="mt-2 h-4 w-4/5 rounded bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
            />
            <motion.div
              {...shimmer}
              className="mt-6 h-24 w-full rounded-xl bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
            />
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-dark-border bg-dark-surface p-6"
      >
        <motion.div
          {...shimmer}
          className="h-6 w-40 rounded-lg bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
        />
        <motion.div
          {...shimmer}
          className="mt-6 h-64 w-full rounded-xl bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
        />
      </motion.div>
    )
  }

  if (type === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            {...shimmer}
            className="h-4 w-full rounded bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg bg-[length:200%_100%]"
          />
        ))}
      </div>
    )
  }

  return null
}

export default SkeletonLoader
