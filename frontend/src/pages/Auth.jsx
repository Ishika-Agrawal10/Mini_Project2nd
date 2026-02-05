import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Auth = ({ onContinue, onBackToIntro }) => {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'architect' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const apiUrl = (path) => `${apiBase}${path}`

  // Check for OAuth callback success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authSuccess = params.get('auth_success')
    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')
    const errorMsg = params.get('error')

    if (authSuccess === 'true' && token) {
      // Verify token with backend
      fetch(apiUrl('/api/auth/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          onContinue({ ...data.user, rememberMe: true })
        }
      })
      .catch(err => setError('Authentication verification failed'))
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (errorMsg) {
      setError(errorMsg === 'auth_failed' ? 'OAuth authentication failed' : 'Email not provided by OAuth provider')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)
  const getPasswordStrength = (value) => {
    if (!value) return { label: 'Empty', score: 0 }
    const rules = [
      value.length >= 8,
      /[A-Z]/.test(value),
      /[a-z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value),
    ]
    const score = rules.filter(Boolean).length
    if (score <= 2) return { label: 'Weak', score }
    if (score === 3) return { label: 'Fair', score }
    if (score === 4) return { label: 'Good', score }
    return { label: 'Strong', score }
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.password || form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (mode === 'signup') {
      if (!form.name || form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
      if (!form.role) nextErrors.role = 'Select a role.'
    }
    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSocial = (provider) => {
    const backendUrl = apiBase
    const providerLower = provider.toLowerCase()
    
    // Open OAuth flow in current window
    window.location.href = `${backendUrl}/api/auth/${providerLower}/login?redirect=${window.location.origin}`
  }

  const handleSubmit = async () => {
    setError('')
    if (!validateForm()) return
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role }

      const res = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Authentication failed')
        return
      }

      onContinue({ ...data.user, rememberMe })
    } catch (err) {
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-text-primary flex items-center justify-center px-6 relative overflow-hidden">
      {/* Back Button */}
      <motion.button
        onClick={onBackToIntro}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-gray-300 transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Floating Orbs Background */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 15, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-12 left-12 w-64 h-64 rounded-full bg-gradient-to-br from-slate-700/40 to-slate-800/30 blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 40, 0],
          x: [0, -20, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-16 w-80 h-80 rounded-full bg-gradient-to-tl from-slate-600/30 to-slate-700/20 blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, -25, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-br from-slate-500/20 to-slate-600/10 blur-3xl"
      />

      {/* Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="relative bg-gradient-to-br from-slate-800/10 to-slate-900/5 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-12 shadow-2xl">
          {/* Decorative Orb Top */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-slate-600/40 to-slate-700/30 blur-2xl"
          />

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-center text-white mb-8 tracking-tight">
                  LOGIN
                </h1>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleSocial('Google')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600/40 bg-slate-700/20 px-4 py-2 text-sm text-gray-200 transition hover:bg-slate-700/30"
                  >
                    <span className="text-base">🟢</span>
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocial('Microsoft')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600/40 bg-slate-700/20 px-4 py-2 text-sm text-gray-200 transition hover:bg-slate-700/30"
                  >
                    <span className="text-base">🪟</span>
                    Continue with Microsoft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocial('GitHub')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600/40 bg-slate-700/20 px-4 py-2 text-sm text-gray-200 transition hover:bg-slate-700/30 sm:col-span-2"
                  >
                    <span className="text-base">🐙</span>
                    Continue with GitHub
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="h-px flex-1 bg-slate-700/40" />
                  Or sign in with email
                  <span className="h-px flex-1 bg-slate-700/40" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/40 text-white placeholder-gray-500 focus:outline-none focus:border-slate-500/60 transition backdrop-blur-sm"
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange('password')}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/40 text-white placeholder-gray-500 focus:outline-none focus:border-slate-500/60 transition backdrop-blur-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-600/60 bg-slate-700/40 text-slate-300"
                      />
                      Remember me
                    </label>
                    <button type="button" className="hover:text-gray-300 transition">
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400 text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-3.5 rounded-xl bg-slate-600/40 hover:bg-slate-600/50 border border-slate-500/40 text-white font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </motion.button>

                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="hover:text-gray-300 transition"
                    >
                      Sign up
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-gray-300 hover:text-white">Terms</a> and{' '}
                    <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-center text-white mb-8 tracking-tight">
                  SIGN UP
                </h1>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleSocial('Google')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600/40 bg-slate-700/20 px-4 py-2 text-sm text-gray-200 transition hover:bg-slate-700/30"
                  >
                    <span className="text-base">🟢</span>
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocial('Microsoft')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600/40 bg-slate-700/20 px-4 py-2 text-sm text-gray-200 transition hover:bg-slate-700/30"
                  >
                    <span className="text-base">🪟</span>
                    Continue with Microsoft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocial('GitHub')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600/40 bg-slate-700/20 px-4 py-2 text-sm text-gray-200 transition hover:bg-slate-700/30 sm:col-span-2"
                  >
                    <span className="text-base">🐙</span>
                    Continue with GitHub
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="h-px flex-1 bg-slate-700/40" />
                  Or sign up with email
                  <span className="h-px flex-1 bg-slate-700/40" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      value={form.name}
                      onChange={handleChange('name')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/40 text-white placeholder-gray-500 focus:outline-none focus:border-slate-500/60 transition backdrop-blur-sm"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Role
                    </label>
                    <select
                      value={form.role}
                      onChange={handleChange('role')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/40 text-white focus:outline-none focus:border-slate-500/60 transition backdrop-blur-sm"
                    >
                      <option value="architect">Architect</option>
                      <option value="engineer">Engineer</option>
                      <option value="consultant">Sustainability Consultant</option>
                      <option value="student">Student</option>
                    </select>
                    {formErrors.role && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.role}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/40 text-white placeholder-gray-500 focus:outline-none focus:border-slate-500/60 transition backdrop-blur-sm"
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange('password')}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/40 text-white placeholder-gray-500 focus:outline-none focus:border-slate-500/60 transition backdrop-blur-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.password}</p>
                    )}
                    <div className="mt-3">
                      {(() => {
                        const strength = getPasswordStrength(form.password)
                        const width = Math.min(100, (strength.score / 5) * 100)
                        const color = strength.label === 'Strong'
                          ? 'bg-emerald-400'
                          : strength.label === 'Good'
                            ? 'bg-lime-400'
                            : strength.label === 'Fair'
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                        return (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Password strength</span>
                              <span>{strength.label}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-700/40">
                              <div className={`h-2 rounded-full ${color}`} style={{ width: `${width}%` }} />
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-600/60 bg-slate-700/40 text-slate-300"
                    />
                    Remember me
                  </label>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400 text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-3.5 rounded-xl bg-slate-600/40 hover:bg-slate-600/50 border border-slate-500/40 text-white font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {loading ? 'Creating account...' : 'Create Account'}
                  </motion.button>

                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="hover:text-gray-300 transition font-medium"
                    >
                      Sign in
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-gray-300 hover:text-white">Terms</a> and{' '}
                    <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guest Access Link */}
          <div className="mt-8 pt-6 border-t border-slate-600/20">
            <button
              onClick={() => onContinue({ id: null, name: 'Guest', email: '' })}
              className="w-full text-sm text-gray-400 hover:text-gray-300 transition"
            >
              Continue as Guest →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Auth
