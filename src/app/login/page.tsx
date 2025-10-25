'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { LogoET } from '@/components/ui/LogoET'
import { useAuth } from '@/contexts/AuthContext'

function LoginContent() {
  const router = useRouter()
  const search = useSearchParams()
  const { isAuthenticated, isLoading, signInWithGoogle, signInWithPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = search.get('redirect') || '/'
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
      setErr(e?.message ?? 'Could not sign in with Google')
    } finally {
      setSubmitting(false)
    }
  }

  const onPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setErr(null)
      setSubmitting(true)
      await signInWithPassword({ email, password, remember })
      // The redirect will be handled by the useEffect above
    } catch (e: any) {
      setErr(e?.message ?? 'Invalid credentials')
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

        {/* Overlayed login text content */}
        <div className="login-visual-inner relative z-10">
          <div className="login-brand-row">
            <div className="h-8 w-8 text-[hsl(var(--primary))]"><LogoET /></div>
            <span className="text-lg font-semibold">Exams And Test</span>
          </div>
          <div className="mt-6 h-px w-full" style={{background:'linear-gradient(90deg, transparent, rgba(148,163,184,.25), transparent)'}} />

          <h1 className="login-title">Exams And Test Community</h1>
          <p className="login-sub">
            Practice adaptively, certify skills, and gain insights that actually move the needle.
          </p>
        </div>
      </aside>

      {/* Right form */}
      <main className="login-form">
        <div className="login-card">
          <h2 className="login-headline">
            Welcome back!<br />
            Login to your account
          </h2>
          <p className="helper">
            It's nice to see you again. Ready to learn?
          </p>

          {/* Email/password form */}
          <form onSubmit={onPasswordLogin} className="mt-6 space-y-3">
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
              <label className="field__label" htmlFor="password">Your password</label>
              <input 
                id="password" 
                className="input" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="current-password" 
                required 
              />
            </div>

            <button 
              className="btn btn--primary btn--block" 
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Logging in...' : 'Log in'}
            </button>

            <div className="login-utility">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="accent-[hsl(var(--primary))]"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </form>

          <div className="mt-6 hr-or">or</div>

          {/* Google first (mandatory for new users) */}
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

          <div className="social-row mt-3">
            <button className="btn btn--social">
              <span className="btn__icon">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#0A66C2" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.07v9.39h-4v-8.33c0-1.99-.04-4.55-2.77-4.55-2.77 0-3.2 2.16-3.2 4.39v8.49h-4V7.98z"/></svg>
              </span>
              LinkedIn
            </button>
            <button className="btn btn--social">
              <span className="btn__icon">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#111827" d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.57v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.75-1.35-1.75-1.1-.75.08-.74.08-.74 1.22.09 1.87 1.26 1.87 1.26 1.08 1.86 2.83 1.32 3.52 1.01.11-.8.42-1.32.76-1.63-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.25-3.22-.13-.3-.54-1.51.12-3.14 0 0 1.01-.32 3.3 1.23a11.48 11.48 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.63.25 2.84.12 3.14.78.84 1.25 1.91 1.25 3.22 0 4.61-2.8 5.63-5.47 5.93.43.37.82 1.1.82 2.23v3.3c0 .31.22.68.83.57A12 12 0 0012 .5z"/></svg>
              </span>
              GitHub
            </button>
            <button className="btn btn--social">
              <span className="btn__icon">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#1877F2" d="M22.675 0h-21.35C.594 0 0 .593 0 1.326v21.348C0 23.406.594 24 1.325 24H12.82V14.706h-3.13v-3.62h3.13V8.413c0-3.1 1.893-4.788 4.66-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.503 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.62h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .593 23.406 0 22.675 0z"/></svg>
              </span>
              Facebook
            </button>
          </div>

          {err && (
            <p className="mt-4 text-sm text-red-600">{err}</p>
          )}

          <p className="mt-6 text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[hsl(var(--primary))] hover:opacity-90">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid place-items-center bg-white text-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
