import React from 'react'
import { motion } from 'framer-motion'

function CustomSpinner({ variant = 'default', size = 'md', message = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  if (variant === 'leaf') {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.svg
          className={sizeClasses[size]}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <motion.path
            d="M32 8C20 8 12 20 12 32C12 44 20 56 32 56C44 56 52 44 52 32C52 20 44 8 32 8Z"
            fill="#84ff00"
            fillOpacity="0.2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M32 12C32 12 20 18 20 32C20 46 32 52 32 52"
            stroke="#84ff00"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M32 12C32 12 44 18 44 32C44 46 32 52 32 52"
            stroke="#9cff57"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </motion.svg>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-text-secondary"
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'building') {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.svg
          className={sizeClasses[size]}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            x="20"
            y="48"
            width="24"
            height="8"
            fill="#84ff00"
            initial={{ y: 56 }}
            animate={{ y: 48 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.rect
            x="20"
            y="36"
            width="24"
            height="8"
            fill="#84ff00"
            fillOpacity="0.7"
            initial={{ y: 56 }}
            animate={{ y: 36 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: 0.1 }}
          />
          <motion.rect
            x="20"
            y="24"
            width="24"
            height="8"
            fill="#84ff00"
            fillOpacity="0.5"
            initial={{ y: 56 }}
            animate={{ y: 24 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
          />
          <motion.rect
            x="20"
            y="12"
            width="24"
            height="8"
            fill="#84ff00"
            fillOpacity="0.3"
            initial={{ y: 56 }}
            animate={{ y: 12 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: 0.3 }}
          />
        </motion.svg>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-text-secondary"
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${sizeClasses[size]} rounded-full bg-accent-lime`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-text-secondary"
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  // Default circular spinner
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-dark-border border-t-accent-lime`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-text-secondary"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default CustomSpinner
