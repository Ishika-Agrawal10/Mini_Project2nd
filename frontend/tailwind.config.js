/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Dark Backgrounds
        'dark-bg': '#0a0a0a',           // Jet black primary
        'dark-surface': '#1a1a1a',      // Charcoal gray cards
        'dark-panel': '#1c1e26',        // Dark slate sections
        'dark-graphite': '#252525',     // Graphite surfaces
        'dark-border': '#2a2a2a',       // Subtle borders
        
        // Accent Colors (use sparingly)
        'accent-lime': '#84ff00',       // Neon lime for CTAs
        'accent-lime-soft': '#9cff57',  // Soft lime for charts
        'accent-yellow': '#ffd93d',     // Muted yellow highlights
        'accent-amber': '#ffad33',      // Warm amber emphasis
        
        // Supporting Colors (data viz)
        'accent-lavender': '#b794f6',   // Lavender for markers
        'accent-coral': '#ff9f9f',      // Coral for contrast
        'accent-orange': '#ff9966',     // Muted orange activity
        'accent-olive': '#a8b566',      // Olive for growth
        
        // Text Colors
        'text-primary': '#f5f5f5',      // Soft off-white
        'text-secondary': '#a0a0a0',    // Cool gray
        'text-label': '#6b6b6b',        // Ash gray labels
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
