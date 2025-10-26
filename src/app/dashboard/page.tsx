'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.replace('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleStartTest = () => {
    router.push('/exam')
  }

  const handlePreviousResults = () => {
    router.push('/exams')
  }

  const handlePreviousReports = () => {
    router.push('/reports')
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

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - ET Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8">
                  <Image
                    src="/Examsandtest logo.png"
                    alt="Exams And Test Logo"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Exams <span className="text-[#1c90a6]">And Test</span>
                </span>
              </Link>
            </div>

            {/* Right - Profile and Logout buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/account')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] transition-colors"
              >
                <User className="h-4 w-4" />
                Profile Setup
              </button>
              
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1c90a6] border border-transparent rounded-md hover:bg-[#0d7a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back, <span className="text-[#1c90a6]">{user?.email?.split('@')[0]}!</span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            {/* Start Test Button - Full Width */}
            <button
              onClick={handleStartTest}
              className="w-full bg-[#1c90a6] hover:bg-[#0d7a8a] text-white font-bold py-6 px-8 rounded-xl text-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center relative overflow-hidden group"
            >
              <Image
                src="/start-new-test.webp"
                alt="Start New Test"
                fill
                className="object-cover blur-sm group-hover:blur-none transition-all duration-200"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-200"></div>
              <span className="relative z-10 text-white font-bold text-xl">
                Start New Test
              </span>
            </button>

            {/* Secondary Buttons Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous Exams */}
              <button
                onClick={handlePreviousResults}
                className="relative overflow-hidden rounded-xl text-lg font-semibold py-6 px-8 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center border border-gray-200 group"
              >
                <Image
                  src="/Previous-test-results.jpg"
                  alt="Previous Exams"
                  fill
                  className="object-cover blur-sm group-hover:blur-none transition-all duration-200"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-200"></div>
                <span className="relative z-10 text-white font-semibold text-center">
                  Previous Exams
                </span>
              </button>

              {/* Previous Reports */}
              <button
                onClick={handlePreviousReports}
                className="relative overflow-hidden rounded-xl text-lg font-semibold py-6 px-8 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center border border-gray-200 group"
              >
                <Image
                  src="/Previous-reports.jpg"
                  alt="Previous Reports"
                  fill
                  className="object-cover blur-sm group-hover:blur-none transition-all duration-200"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-200"></div>
                <span className="relative z-10 text-white font-semibold text-center">
                  Previous Reports
                </span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
