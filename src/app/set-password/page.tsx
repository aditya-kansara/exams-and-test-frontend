'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LogoET } from '@/components/ui/LogoET'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export default function SetPasswordPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect if not authenticated or if user already has password
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login')
      return
    }

    // Check if user already has email identity (password auth)
    const hasEmailIdentity = (user.identities || []).some(
      (identity: any) => identity.provider === 'email'
    )
    
    // Check if user has already set a password
    const hasPassword = user.user_metadata?.has_password === true
    
    if (hasEmailIdentity || hasPassword) {
      router.replace('/')
      return
    }
  }, [isAuthenticated, user, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirm) {
      setErr('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setErr('Password must be at least 8 characters long')
      return
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setErr('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      return
    }

    try {
      setErr(null)
      setSubmitting(true)
      
      // Use Supabase's updateUser to add password to the OAuth account
      const { data, error } = await supabase.auth.updateUser({
        password: password,
        data: {
          has_password: true
        }
      })
      
      if (error) {
        setErr(error.message)
        return
      }
      
      setSuccess(true)
      
      // Redirect after showing success message
      setTimeout(() => {
        router.replace('/')
      }, 2000)
    } catch (e: any) {
      setErr(e?.message ?? 'Could not set password')
    } finally {
      setSubmitting(false)
    }
  }

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    
    return {
      strength: (strength / 5) * 100,
      label: labels[Math.min(strength - 1, 4)] || '',
      color: colors[Math.min(strength - 1, 4)] || 'bg-gray-300'
    }
  }

  const passwordStrength = getPasswordStrength()

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-white text-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white text-slate-900">
      <div className="w-full max-w-md p-6 rounded-xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 text-[hsl(var(--primary))]">
              <LogoET />
            </div>
            <span className="text-lg font-semibold">Exams And Test</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your password</h1>
          <p className="mt-2 text-slate-600 text-sm">
            You signed in with Google. Set a password to also log in with email next time.
          </p>
        </div>

        {/* Google Account Info */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Google Account Connected</span>
          </div>
          <p className="text-blue-600 text-sm mt-1">
            Email: {user.email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{err}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Success</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Password set successfully! Redirecting...
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Password Strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.strength < 40 ? 'text-red-600' :
                    passwordStrength.strength < 70 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button 
            className="btn-primary" 
            disabled={submitting || success}
            type="submit"
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up your account...</span>
              </div>
            ) : success ? (
              'Password Set Successfully!'
            ) : (
              'Save password'
            )}
          </button>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• One uppercase letter (A-Z)</li>
            <li>• One lowercase letter (a-z)</li>
            <li>• One number (0-9)</li>
            <li>• One special character (!@#$%^&*)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
