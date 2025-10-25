'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Building2, Mail, Phone, User } from 'lucide-react'
import clsx from 'clsx'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { LogoET } from '@/components/ui/LogoET'
import Image from 'next/image'

export default function ExamsAndTestLanding() {
  const [scrolled, setScrolled] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated, isLoading, signOut } = useAuth()

  // Mini reveal-on-scroll (no heavy libs)
  const revealRefs = useRef<HTMLElement[]>([])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )
    revealRefs.current.forEach((el) => el && io.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  const handleAuthSuccess = () => setShowAuthModal(false)
  const handleLogout = async () => { await signOut() }

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="snap-root bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* HEADER (unchanged, just ensure contrast stays calm on full-bleed) */}
      <header
        className={clsx(
          'sticky top-0 z-40 transition-all',
          'backdrop-blur bg-white/75 dark:bg-slate-900/60',
          scrolled ? 'border-b border-slate-200/70 dark:border-slate-800/60 shadow-sm' : 'border-b border-transparent'
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 text-[hsl(var(--primary))] hover:rotate-6 transition-transform duration-300">
                <LogoET />
              </div>
              <span className="header-brand">
                Exams <span>And Test</span>
              </span>
            </Link>
            <button
              onClick={() => setShowContact(true)}
              className="hidden sm:inline-flex items-center gap-2 text-sm text-[hsl(var(--primary))] hover:opacity-90 transition link-underline"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <User className="h-4 w-4" aria-label="User icon" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-700 hover:text-slate-900 transition link-underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-slate-700 hover:text-slate-900 transition link-underline"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm rounded-md px-4 py-2 btn-solid"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO (HR-like) */}
      <section className="section snap-child full-bleed bg-hero-white">
        <div className="inner">
          <div className="max-w-4xl">
            <span className="inline-block rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 px-3 py-1 text-[12px] tracking-wide text-[hsl(var(--primary))] font-medium">
              EXAMS AND TEST
            </span>
            <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900">
              Prepare with <span className="text-[hsl(var(--primary))]">Adaptive Tests</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-800">
              Practice in a real-exam interface. Difficulty adapts to you, so every question counts.
              Get focused insights, not guesswork.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link href="/exam" className="btn-solid inline-flex items-center gap-2 rounded-md px-5 py-3 shadow transition">
                  Start Test <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn-solid inline-flex items-center gap-2 rounded-md px-5 py-3 shadow transition"
                >
                  Create a free account <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="#about"
                className="btn-ghost inline-flex items-center gap-2 rounded-md px-5 py-3 transition"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 2 — What's Adaptive testing? */}
      <section id="about" className="section snap-child full-bleed bg-hero-green">
        <div className="inner">
          <div className="max-w-4xl mx-auto text-center">
            <p className="hero-question mb-6">
              What's Adaptive Testing?
            </p>
            <h1 className="hero-heading">
              Questions that adapt to <span className="gradient-text">your ability.</span>
            </h1>
            <p className="hero-subheading mt-6">
              Our engine estimates your ability in real time and selects each next item to be maximally
              informative. You avoid "too easy / too hard" questions and reach a precise result faster —
              so every minute you spend actually moves the needle.
            </p>
            <ul className="mt-8 space-y-4 text-slate-700 text-lg max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="text-[hsl(var(--primary))] mr-3 mt-1">•</span>
                <span>Difficulty adjusts after every response</span>
              </li>
              <li className="flex items-start">
                <span className="text-[hsl(var(--primary))] mr-3 mt-1">•</span>
                <span>Fewer items for the same measurement precision</span>
              </li>
              <li className="flex items-start">
                <span className="text-[hsl(var(--primary))] mr-3 mt-1">•</span>
                <span>Ability-aligned scoring (beyond raw %)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[hsl(var(--primary))] mr-3 mt-1">•</span>
                <span>Clean, distraction-free exam interface</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* SECTION 3 — AMC block */}
      <section id="amc" className="section snap-child full-bleed bg-hero-aqua pb-0 pt-20" style={{alignItems: 'flex-start'}}>
        <div className="inner">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* text first on desktop */}
            <div>
              <p className="text-sm tracking-wider uppercase text-[#1c90a6] font-medium mb-3">
                AMC-Style Experience
              </p>
              <h2 className="amc-heading">
                Practice in a real <span className="text-[#1c90a6]">AMC simulation</span>
              </h2>
              <p className="amc-subtext">
                Timing, navigation, and reports mirror the Australian Medical Council's real exam flow,
                ensuring that every test feels familiar and realistic. Our analytics highlight your
                strengths and areas for improvement by domain and competency.
              </p>
            </div>

            {/* image second on desktop; centered on mobile */}
            <div className="flex justify-center">
              <Image
                src="/media/1_DH1010_lores_070303_000244.jpg.jpeg"
                alt="AMC Exam Interface"
                width={600}
                height={450}
                className="amc-image"
              />
            </div>
          </div>
        </div>
      </section>


      {/* FINAL SECTION — split panel design */}
      <section id="get-started" className="final-split snap-child pt-8">
        {/* subtle divider only on lg+ */}
        <span className="final-divider" aria-hidden="true" />

        <div className="final-grid">
          {/* Left pane */}
          <div className="final-pane">
            <h3>For Learners</h3>
            <p>
              Join adaptive practice with realistic timing and reports. Track progress by
              system and competency—and focus on what actually moves your score.
            </p>
            <div className="mt-6">
              {isAuthenticated ? (
                <Link href="/exam" className="btn-dark inline-flex items-center gap-2">
                  Start Test
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-dark inline-flex items-center gap-2"
                >
                  Create a free account
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right pane */}
          <div className="final-pane">
            <h3>For Institutes</h3>
            <p>
              Cohort dashboards, custom item banks, and institute-wide analytics.
              Pilot with your syllabus and integrations—we'll help you get live fast.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowContact(true)}
                className="btn-dark inline-flex items-center gap-2"
              >
                Contact us
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (can remain outside snap to avoid sticky behavior at end) */}
      <footer className="border-t border-slate-200/70 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Exams And Test</p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-200">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-200">Terms</Link>
          </nav>
        </div>
      </footer>

      {/* Contact + Auth modals unchanged */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        provider="both"
      />
      {showContact && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setShowContact(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-md p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h5 className="text-2xl font-semibold text-slate-900 mb-2">Contact us</h5>
              <p className="text-slate-600">
                Tell us about your goals and we'll get back within 24 hours.
              </p>
            </div>
            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-2 rounded-full bg-emerald-100">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email us</p>
                  <a href="mailto:hello@examsandtest.com" className="font-medium hover:text-emerald-600 transition-colors">hello@examsandtest.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-2 rounded-full bg-emerald-100">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Call us</p>
                  <a href="tel:+61-000-000-000" className="font-medium hover:text-emerald-600 transition-colors">+61 000 000 000</a>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                onClick={() => setShowContact(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
