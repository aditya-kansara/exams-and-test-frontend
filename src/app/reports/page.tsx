'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, FileText, Calendar, Clock, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
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

  // Mock data - in a real app, this would come from an API
  const mockReports = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Comprehensive Performance Report',
      type: 'Detailed Analysis',
      duration: '45m',
      status: 'Completed',
      examId: '1',
      score: 85
    },
    {
      id: '2', 
      date: '2024-01-10',
      title: 'Progress Summary Report',
      type: 'Monthly Review',
      duration: '38m',
      status: 'Completed',
      examId: '2',
      score: 78
    },
    {
      id: '3',
      date: '2024-01-05',
      title: 'Initial Assessment Report',
      type: 'Baseline Analysis',
      duration: '52m',
      status: 'Completed',
      examId: '3',
      score: 92
    }
  ]

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Previous Reports</h1>
            <p className="text-gray-600">View reports and results of all tests you have taken</p>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {mockReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-600 mb-6">Complete your first test to see reports here</p>
                <button
                  onClick={() => router.push('/exam')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c90a6] text-white font-medium rounded-lg hover:bg-[#0d7a8a] transition-colors"
                >
                  Start Your First Test
                </button>
              </div>
            ) : (
              mockReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {report.duration}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>Type: {report.type}</span>
                        <span>Status: {report.status}</span>
                        <span>Exam #{report.examId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#1c90a6]">
                          {report.score}%
                        </div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                      <Link
                        href={`/reports/${report.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1c90a6] bg-[#1c90a6]/10 border border-[#1c90a6]/20 rounded-md hover:bg-[#1c90a6]/20 transition-colors"
                      >
                        <BarChart3 className="h-4 w-4" />
                        View Report
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
