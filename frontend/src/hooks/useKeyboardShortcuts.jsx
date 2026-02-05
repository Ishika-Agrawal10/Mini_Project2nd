import { useEffect } from 'react'

export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + G: Generate design
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        handlers.onGenerate?.()
      }

      // Ctrl/Cmd + /: Show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        handlers.onShowShortcuts?.()
      }

      // Ctrl/Cmd + S: Save preferences
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handlers.onSavePreferences?.()
      }

      // Ctrl/Cmd + H: Toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault()
        handlers.onToggleHistory?.()
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        handlers.onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
