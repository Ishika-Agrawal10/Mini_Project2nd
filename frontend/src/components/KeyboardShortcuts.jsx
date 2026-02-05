import React from 'react'
import { motion } from 'framer-motion'

function KeyboardShortcuts({ isOpen, onClose }) {
  if (!isOpen) return null

  const shortcuts = [
    { key: 'Ctrl/Cmd + G', action: 'Generate Design' },
    { key: 'Ctrl/Cmd + S', action: 'Save Preferences' },
    { key: 'Ctrl/Cmd + H', action: 'Toggle History' },
    { key: 'Ctrl/Cmd + /', action: 'Show Shortcuts' },
    { key: 'Esc', action: 'Close Modal' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl border border-dark-border bg-dark-surface p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/60">
              <span className="text-text-secondary text-sm">{item.action}</span>
              <kbd className="px-2 py-1 rounded bg-dark-border text-text-primary text-xs font-mono font-semibold">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default KeyboardShortcuts
