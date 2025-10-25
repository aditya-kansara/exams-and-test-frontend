'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ExamStartResponse, AnswerSubmitRequest } from '@/lib/types'
import { EXAM_CONFIG } from '@/config/exam'
import { apiClient, handleApiError } from '@/lib/api'
// WebSocket removed - not needed for current backend implementation
import { useExamStore } from '@/lib/store/exam'
import { QuestionCard } from './components/QuestionCard'
import { ExamHeaderTimer } from './components/ExamHeaderTimer'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

interface ExamClientProps {
  attemptId: string
  initialData: ExamStartResponse
}

export function ExamClient({ attemptId, initialData }: ExamClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get store state and actions
  const {
    currentItem,
    responses,
    isComplete,
    isLoading,
    timer,
    setAttemptId,
    setCurrentItem,
    setPosition,
    addResponse,
    setComplete,
    setLoading,
    setError: setStoreError,
    setTimer,
    startTimer,
    stopTimer,
    tickTimer
  } = useExamStore()

  // Initialize exam state
  useEffect(() => {
    setAttemptId(parseInt(attemptId))
    setCurrentItem(initialData.item)
    setPosition(initialData.position)
        // Set timer to configured exam duration
        setTimer(EXAM_CONFIG.DURATION_SECONDS)
    startTimer()
  }, [attemptId, initialData, setAttemptId, setCurrentItem, setPosition, setTimer, startTimer])

  // Timer effect
  useEffect(() => {
    if (!timer.isRunning) return

    const interval = setInterval(() => {
      tickTimer()
    }, 1000)

    return () => clearInterval(interval)
  }, [timer.isRunning, tickTimer])

  // Check for exam completion when timer reaches 0
  useEffect(() => {
    if (timer.timeRemaining <= 0 && timer.isRunning) {
      handleTimeUp()
    }
  }, [timer.timeRemaining, timer.isRunning])

  // WebSocket functionality removed - not needed for current backend

  const handleTimeUp = useCallback(async () => {
    stopTimer()
    setComplete(true)
    router.push(`/results/${attemptId}`)
  }, [attemptId, stopTimer, setComplete, router])

  const handleAnswerSubmit = async (response: number, responseTimeMs: number) => {
    if (!currentItem || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const answerRequest: AnswerSubmitRequest = {
        exam_attempt_id: parseInt(attemptId),
        item_id: currentItem.id,
        selected_option: response,
        response_time_ms: responseTimeMs,
        served_at: currentItem.created_at, // This is when the item was served
        answered_at: new Date().toISOString() // Current timestamp when answered
      }

      const result = await apiClient.submitAnswer(answerRequest)
      
      
      // Add response to store
      addResponse(answerRequest)

      // Check if exam should stop
      if (result.stop) {
        try {
          // Finish the exam
          const finishResult = await apiClient.finishExam({
            exam_attempt_id: parseInt(attemptId)
          })
          
          setComplete(true)
          stopTimer()
          
          // Redirect to simpleResults with finish data
          const finishData = {
            score: finishResult.theta_hat?.toString() || '0', // Using theta_hat as the score
            theta: finishResult.theta_hat?.toString() || '0',
            se: finishResult.se_theta?.toString() || '1',
            completed: finishResult.completed_at // Use the actual completion time from backend
          }
          
          const queryParams = new URLSearchParams(finishData).toString()
          router.push(`/results/${attemptId}/simple?${queryParams}`)
        } catch (finishError) {
          console.error('Error calling finish API:', finishError)
          setError('Failed to finish exam. Please try again.')
        }
      } else if (result.item) {
        // Update with next item
        setCurrentItem(result.item)
        setPosition(result.position)
      } else {
        // No more items and we've reached the total questions
        // This handles the case where item is null and we've completed all questions
        const currentQuestionNumber = responses.length + 1
        const totalQuestions = EXAM_CONFIG.TOTAL_QUESTIONS
        
        if (currentQuestionNumber >= totalQuestions) {
          // Finish the exam
          const finishResult = await apiClient.finishExam({
            exam_attempt_id: parseInt(attemptId)
          })
          
          setComplete(true)
          stopTimer()
          
          // Redirect to simpleResults with finish data
          const finishData = {
            score: finishResult.theta_hat?.toString() || '0', // Using theta_hat as the score
            theta: finishResult.theta_hat?.toString() || '0',
            se: finishResult.se_theta?.toString() || '1',
            completed: finishResult.completed_at // Use the actual completion time from backend
          }
          
          const queryParams = new URLSearchParams(finishData).toString()
          router.push(`/results/${attemptId}/simple?${queryParams}`)
        }
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }


  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Exam Complete!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Redirecting to your results...
          </p>
          <Button 
            onClick={() => router.push(`/results/${attemptId}`)}
            className="px-8 py-3 text-lg"
          >
            View Results
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Timer - Sticky position in top-right */}
      <div className="sticky top-4 z-40 flex justify-end">
          <ExamHeaderTimer 
          timeRemaining={timer.timeRemaining} 
          totalSeconds={EXAM_CONFIG.DURATION_SECONDS}
        />
      </div>

      {/* Error Display - Minimal */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-10 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Question - Full Screen */}
      <div className="w-full h-screen px-8 py-8">
        {currentItem && (
          <QuestionCard
            item={currentItem}
            onSubmit={handleAnswerSubmit}
            isLoading={isSubmitting}
            questionNumber={responses.length + 1}
            isLastQuestion={responses.length >= EXAM_CONFIG.TOTAL_QUESTIONS - 1} // Consider last question as potential last
          />
        )}
      </div>
    </div>
  )
}
