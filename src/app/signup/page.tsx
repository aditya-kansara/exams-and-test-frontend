'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

function SignupContent() {
  const router = useRouter()
  const search = useSearchParams()
  const { isAuthenticated, isLoading, signInWithGoogle, signUpWithPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = search.get('redirect') || '/dashboard'
      router.replace(redirect)
    }
  }, [isAuthenticated, isLoading, router, search])

  const onGoogle = async () => {
    try {
      setErr(null)
      setSubmitting(true)
      await signInWithGoogle()
      // The redirect will be handled by Supabase OAuth flow
    } catch (e: any) {
      setErr(e?.message ?? 'Could not sign up with Google')
    } finally {
      setSubmitting(false)
    }
  }

  const onPasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setErr('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setErr('Password must be at least 6 characters long')
      return
    }

    try {
      setErr(null)
      setSubmitting(true)
      await signUpWithPassword({ email, password })
      // The redirect will be handled by the useEffect above
    } catch (e: any) {
      setErr(e?.message ?? 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
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
    <div className="login-shell">
      {/* Left visual (desktop only) */}
      <aside className="login-visual">
        {/* Starfield layers */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        {/* Overlayed signup text content */}
        <div className="login-visual-inner relative z-10">
          <div className="login-brand-row">
            <div className="h-8 w-8">
              <Image
                src="/Examsandtest logo.png"
                alt="Exams And Test Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-lg font-semibold">Exams And Test</span>
          </div>
          <div className="mt-6 h-px w-full" style={{background:'linear-gradient(90deg, transparent, rgba(148,163,184,.25), transparent)'}} />

          <h1 className="login-title">Join Exams And Test Community</h1>
          <p className="login-sub">
            Practice adaptively, certify skills, and gain insights that actually move the needle.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#1c90a6] border border-transparent rounded-lg hover:bg-[#0d7a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] transition-colors"
            >
              Landing page
            </Link>
          </div>
        </div>
      </aside>

      {/* Right form */}
      <main className="login-form">
        <div className="login-card">
          <h2 className="login-headline">
            Create your account
          </h2>

          {/* Email/password form */}
          <form onSubmit={onPasswordSignup} className="mt-6 space-y-3">
            <div className="field">
              <label className="field__label" htmlFor="email">Your email</label>
              <input 
                id="email" 
                className="input" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete="username" 
                required 
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="password">Create password</label>
              <input 
                id="password" 
                className="input" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="new-password" 
                required 
                minLength={6}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="confirmPassword">Confirm password</label>
              <input 
                id="confirmPassword" 
                className="input" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                autoComplete="new-password" 
                required 
                minLength={6}
              />
            </div>

            <button 
              className="btn btn--primary btn--block" 
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 hr-or">or</div>

          {/* Google signup */}
          <button 
            onClick={onGoogle} 
            className="btn btn--outline btn--block mt-4" 
            disabled={submitting}
            type="button"
          >
            <span className="btn__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="#4285F4" d="M23.49 12.27c0-.85-.07-1.47-.22-2.11H12v3.83h6.53c-.13 1.01-.84 2.54-2.42 3.57l-.02.14 3.51 2.72.24.02c2.2-2.03 3.65-5.02 3.65-8.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.94l-3.8-2.94c-1.02.7-2.39 1.2-4.15 1.2-3.18 0-5.87-2.12-6.83-5.04l-.14.01-3.72 2.87-.05.13C3.33 21.53 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.17 14.28a7.33 7.33 0 0 1 0-4.56l-.01-.15-3.75-2.9-.12.06a12 12 0 0 0 0 10.54l3.88-2.99z"/>
                <path fill="#EA4335" d="M12 4.74c2.24 0 3.75.96 4.61 1.76l3.36-3.27C17.94 1.12 15.24 0 12 0 7.34 0 3.33 2.47 1.32 6.27l3.85 2.99C6.13 6.34 8.82 4.74 12 4.74z"/>
              </svg>
            </span>
            Continue with Google
          </button>

          {err && (
            <p className="mt-4 text-sm text-red-600">{err}</p>
          )}

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[hsl(var(--primary))] hover:opacity-90">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid place-items-center bg-white text-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
