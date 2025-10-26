'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Building2, Mail, User } from 'lucide-react'
import clsx from 'clsx'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function ExamsAndTestLanding() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showCareers, setShowCareers] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated, isLoading, signOut } = useAuth()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

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
              <div className="h-8 w-8 hover:rotate-6 transition-transform duration-300">
                <Image
                  src="/Examsandtest logo.png"
                  alt="Exams And Test Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="header-brand">
                Exams <span>And Test</span>
              </span>
            </Link>
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
      <section className="section snap-child full-bleed relative min-h-screen overflow-hidden">
        {/* Background image covering the whole section */}
        <div className="absolute inset-0">
          <Image
            src="/Aboriginal art.jpeg"
            alt="Aboriginal Art Background"
            fill
            className="object-cover"
          />
        </div>
        
        {/* White blur overlay extending across the page */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 via-white/70 via-white/50 via-white/30 to-transparent"></div>
        {/* Additional blur only on the left side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent via-transparent via-transparent to-transparent backdrop-blur-sm" style={{maskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 100%)'}}></div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="inner">
            <div className="max-w-4xl">
              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900">
                Prepare with <span className="text-[hsl(var(--primary))] tracking-wide">Exams and Test</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-800">
                Practice in a real-exam interface. Difficulty adapts to you, so every question counts.
                Get focused insights, not guesswork.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link href="/exam" className="btn-solid inline-flex items-center gap-2 rounded-md px-5 py-3 shadow transition">
                  Start Test
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn-solid inline-flex items-center gap-2 rounded-md px-5 py-3 shadow transition"
                >
                  Create a free account
                </Link>
              )}
              <Link
                href="#about"
                className="btn-ghost inline-flex items-center gap-2 rounded-md px-5 py-3 transition"
              >
                Learn more
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 2 — What's Adaptive testing? */}
      <section id="about" className="section snap-child full-bleed bg-hero-green">
        <div className="inner">
          <div className="max-w-4xl mx-auto text-center">
            <p className="hero-question mb-6">
              What are Adaptive Exams?
            </p>
            <h1 className="text-4xl font-bold mb-4">
              An exam based on the official structure of
            </h1>
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">AMC MCQ exams</span>
            </h2>
            <p className="hero-subheading mt-6">
              Examsandtest is built to mirror the official Australian Medical Council MCQ format right down to the interface, timing, and flow. Every practice session feels like the real exam, giving you a chance to perfect your strategy, build confidence, and master time management before the big day.
            </p>
            <br /><br />
            <p className="hero-subheading mt-8">
              Take as many mock exams as you need to sharpen your performance and get comfortable with the AMC's style and difficulty level. Each question is designed to challenge your reasoning, not your memory helping you prepare smarter, not harder.
            </p>
            <br /><br />
            <p className="hero-subheading mt-8">
              Join thousands of candidates who are practising smarter. Try our realistic AMC-style exams for free and experience the only platform that matches your preparation to your future success.
            </p>
          </div>
        </div>
      </section>


      {/* SECTION 3 — AMC block */}
      <section id="amc" className="section snap-child full-bleed relative min-h-screen overflow-hidden">
        {/* Background image covering the whole section */}
        <div className="absolute inset-0">
          <Image
            src="/building.jpeg.jpeg"
            alt="AMC Exam Interface"
            fill
            className="object-cover"
          />
        </div>
        
        {/* White blur overlay extending across the page */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/55 via-white/35 via-white/15 to-transparent"></div>
        {/* Additional blur only on the left side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent via-transparent via-transparent to-transparent backdrop-blur-sm" style={{maskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 100%)'}}></div>
        
        {/* Content positioned to the left */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="inner">
            <div className="max-w-2xl">
              {/* text positioned to the left */}
              <div className="text-gray-900">
                <p className="text-sm tracking-wider uppercase text-[#1c90a6] font-medium mb-3">
                  AMC-Style Experience
                </p>
                <h2 className="amc-heading text-gray-900">
                  Practice in a real <span className="text-[#1c90a6]">AMC simulation</span>
                </h2>
                <p className="amc-subtext text-gray-700">
                  Timing, navigation, and reports mirror the Australian Medical Council's real exam flow,
                  ensuring that every test feels familiar and realistic. Our analytics highlight your
                  strengths and areas for improvement by domain and competency.
                </p>
              </div>
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
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="btn-dark inline-flex items-center gap-2"
                >
                  Create a free account
                </Link>
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
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Contact us
            </button>
            <button
              onClick={() => setShowCareers(true)}
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Careers
            </button>
            <Link href="/privacy-terms" className="hover:text-slate-700 dark:hover:text-slate-200">Privacy & Terms</Link>
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
                <div className="p-2 rounded-full bg-[#1c90a6]/10">
                  <Mail className="h-5 w-5 text-[#1c90a6]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email us</p>
                  <a href="mailto:examsandtestfounder@gmail.com" className="font-medium hover:text-[#1c90a6] transition-colors">examsandtestfounder@gmail.com</a>
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

      {/* Careers Modal */}
      {showCareers && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCareers(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-md p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h5 className="text-2xl font-semibold text-slate-900 mb-2">Careers</h5>
              <p className="text-slate-600">
                Join our team and help shape the future of adaptive testing.
              </p>
            </div>
            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-2 rounded-full bg-[#1c90a6]/10">
                  <Mail className="h-5 w-5 text-[#1c90a6]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Send us your resume</p>
                  <a href="mailto:examsandtestfounder@gmail.com" className="font-medium hover:text-[#1c90a6] transition-colors">examsandtestfounder@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                onClick={() => setShowCareers(false)}
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
