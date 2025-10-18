'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { CheckCircle, Clock, Target, Brain, AlertCircle, User } from 'lucide-react'
import { apiClient, handleApiError } from '@/lib/api'
import { useExamStore } from '@/lib/store/exam'
import { useAuth } from '@/contexts/AuthContext'
import { EXAM_DURATION_HOURS } from '@/lib/types'

export default function ExamEntryPage() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRules, setShowRules] = useState(false)
  const resetExam = useExamStore((state) => state.resetExam)
  const { user, isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <User className="h-6 w-6 text-blue-600" />
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

  const ExamRules = () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        <div>
          <h4 className="font-medium">Adaptive Testing</h4>
          <p className="text-sm text-muted-foreground">
            Questions will adapt to your ability level for more accurate assessment.
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h4 className="font-medium">Time Limit</h4>
          <p className="text-sm text-muted-foreground">
            You have {EXAM_DURATION_HOURS} hours to complete the exam. The timer will be displayed throughout.
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Target className="h-5 w-5 text-purple-500 mt-0.5" />
        <div>
          <h4 className="font-medium">Question Format</h4>
          <p className="text-sm text-muted-foreground">
            Multiple choice questions with 5 options each. Select the best answer.
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Brain className="h-5 w-5 text-orange-500 mt-0.5" />
        <div>
          <h4 className="font-medium">Scoring</h4>
          <p className="text-sm text-muted-foreground">
            Your ability level is estimated in real-time using advanced psychometric methods.
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notes</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• You cannot go back to previous questions</li>
              <li>• Each question must be answered to proceed</li>
              <li>• The exam will end when time runs out or ability is precisely estimated</li>
              <li>• Your progress is saved automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
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
          <p className="text-xl text-gray-600">
            Computer Adaptive Testing for Medical Knowledge Assessment
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Exam Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6" />
                <span>Exam Overview</span>
              </CardTitle>
              <CardDescription>
                What to expect during your adaptive exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Duration</span>
                  <span className="text-sm text-muted-foreground">{EXAM_DURATION_HOURS} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Questions</span>
                  <span className="text-sm text-muted-foreground">15-30 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Format</span>
                  <span className="text-sm text-muted-foreground">Multiple choice</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Adaptive</span>
                  <span className="text-sm text-muted-foreground">Yes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6" />
                <span>Instructions</span>
              </CardTitle>
              <CardDescription>
                How the adaptive testing works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>• Questions adapt based on your responses</p>
                <p>• Answer each question to the best of your ability</p>
                <p>• Your ability level is estimated in real-time</p>
                <p>• The exam ends when your ability is precisely measured</p>
              </div>
              
              <Dialog open={showRules} onOpenChange={setShowRules}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Rules
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Exam Rules and Guidelines</DialogTitle>
                    <DialogDescription>
                      Please read these rules carefully before starting your exam.
                    </DialogDescription>
                  </DialogHeader>
                  <ExamRules />
                </DialogContent>
              </Dialog>
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

        {/* Footer Info */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Need help? Contact support or review the exam guidelines.</p>
        </div>
      </div>
    </div>
  )
}
