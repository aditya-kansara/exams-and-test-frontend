'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { User, AlertCircle } from 'lucide-react'
import { apiClient, handleApiError } from '@/lib/api'
import { useExamStore } from '@/lib/store/exam'
import { useAuth } from '@/contexts/AuthContext'
import { EXAM_DURATION_HOURS } from '@/lib/types'

export default function ExamEntryPage() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resetExam = useExamStore((state) => state.resetExam)
  const { user, isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1c90a6]/10 to-[#1c90a6]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1c90a6]/10 to-[#1c90a6]/5 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <User className="h-6 w-6 text-[#1c90a6]" />
              <span>Authentication Required</span>
            </CardTitle>
            <CardDescription>
              You need to be logged in to start an exam
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Please sign in to your account to access the exam.
            </p>
            <div className="flex flex-col space-y-3">
              <Link href="/">
                <Button className="w-full">
                  Go to Home & Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleStartExam = async () => {
    setIsStarting(true)
    setError(null)

    try {
      // Reset any previous exam state
      resetExam()
      
      // Start new exam
      const examResponse = await apiClient.startExam()

      // Navigate to exam interface with the start data
      router.push(`/exam/${examResponse.exam_attempt_id}?data=${encodeURIComponent(JSON.stringify(examResponse))}`)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsStarting(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c90a6]/10 to-[#1c90a6]/5 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2 text-slate-700 bg-white px-4 py-2 rounded-lg shadow-sm">
              <User className="h-4 w-4" aria-label="User icon" />
              <span className="text-sm">{user?.email}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Test
          </h1>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm leading-relaxed">
                <p>1. This exam comprises of 150 questions, which are based on adaptive exam on architecture of real AMC mcq exam.</p>
                <p>2. Total time given would be 3.5 hours and a clock will be displayed on the top right corner for your reference.</p>
                <p>3. Answering all the questions is mandatory to submit the exam in the given time, if in case time runs out while giving the exams, the exam would be considered to be submitted and would be evaluated based on the number of questions you have attempted in designated time.</p>
                <p>4. There are no negative markings which is same as actual AMC exams.</p>
                <p>5. After completing the exam please click on the submit button to end the exam.</p>
                <p>6. Once clicked on the next button, you cannot revisit the previous MCQ, which is exactly same as actual AMC exam.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error starting exam:</span>
              </div>
              <p className="text-red-600 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartExam}
            disabled={isStarting}
            size="lg"
            className="text-lg px-8 py-4"
          >
            {isStarting ? 'Starting Test...' : 'Start Test'}
          </Button>
          
          <Link href="/">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
