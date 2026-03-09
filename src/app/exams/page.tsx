'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, BookOpen, Calendar, AlertCircle } from 'lucide-react'
import { apiClient, handleApiError } from '@/lib/api'
import { UserAttemptSummary } from '@/lib/types'

export default function ExamsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [attempts, setAttempts] = useState<UserAttemptSummary[]>([])
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false)
  const [attemptsError, setAttemptsError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch user attempts when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchUserAttempts()
    }
  }, [isAuthenticated, isLoading])

  const fetchUserAttempts = async () => {
    try {
      setIsLoadingAttempts(true)
      setAttemptsError(null)
      const response = await apiClient.getUserAttempts(50, 0) // Get more attempts for this page
      setAttempts(response.attempts)
    } catch (error) {
      console.error('Error fetching user attempts:', error)
      setAttemptsError(handleApiError(error))
    } finally {
      setIsLoadingAttempts(false)
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate attempt numbers: sort chronologically and assign sequential numbers
  const { attemptNumberMap, sortedForDisplay } = useMemo(() => {
    if (attempts.length === 0) {
      return { attemptNumberMap: new Map<number, number>(), sortedForDisplay: [] }
    }
    // Sort attempts chronologically (oldest first) to determine numbering
    const sortedAttempts = [...attempts].sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    )
    // Create a map: attempt_id -> attempt number (oldest = 1, newest = highest)
    const map = new Map<number, number>()
    sortedAttempts.forEach((attempt, index) => {
      map.set(attempt.exam_attempt_id, index + 1)
    })
    
    // Sort for display (newest first)
    const sorted = [...attempts].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    )
    
    return { attemptNumberMap: map, sortedForDisplay: sorted }
  }, [attempts])


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
                  Exams And Test
                </span>
              </Link>
            </div>

            {/* Right - Back to Dashboard, Profile and Logout buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100/50 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] transition-colors"
              >
                Back to Dashboard
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
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Previous Exams</h1>
                <p className="text-gray-600">View all the exams you have taken</p>
              </div>
              <button
                onClick={fetchUserAttempts}
                disabled={isLoadingAttempts}
                className="text-sm text-[#1c90a6] hover:text-[#0d7a8a] disabled:opacity-50"
              >
                {isLoadingAttempts ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Exams List */}
          <div className="space-y-4">
            {isLoadingAttempts ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-[#1c90a6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your exam attempts...</p>
              </div>
            ) : attemptsError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Failed to load exam attempts</p>
                <p className="text-sm text-gray-600 mb-4">{attemptsError}</p>
                <button
                  onClick={fetchUserAttempts}
                  className="text-sm text-[#1c90a6] hover:text-[#0d7a8a]"
                >
                  Try again
                </button>
              </div>
            ) : attempts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams taken yet</h3>
                <p className="text-gray-600 mb-6">Take your first exam to see it here</p>
                <button
                  onClick={() => router.push('/exam')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c90a6] text-white font-medium rounded-lg hover:bg-[#0d7a8a] transition-colors"
                >
                  Start Your First Exam
                </button>
              </div>
            ) : (
              sortedForDisplay.map((attempt) => {
                const attemptNumber = attemptNumberMap.get(attempt.exam_attempt_id)
                // This should never happen, but provide fallback
                if (attemptNumber === undefined) {
                  console.error('Attempt number missing for ID:', attempt.exam_attempt_id)
                  return null
                }
                return (
                      <div
                        key={attempt.exam_attempt_id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {formatDate(attempt.started_at)}
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Test Attempt {attemptNumber}
                            </h3>
                            {/* Removed per request: questions/total items/score/ability row */}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => router.push(`/report/${attempt.exam_attempt_id}`)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1c90a6] hover:bg-[#0d7a8a] border border-transparent rounded-md transition-colors"
                            >
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
