'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ExamClient } from './ExamClient'
import { ExamStartBatchResponse } from '@/lib/types'

interface ExamClientWrapperProps {
  attemptId: string
  initialData: ExamStartBatchResponse | null
}

export function ExamClientWrapper({ attemptId, initialData: serverInitialData }: ExamClientWrapperProps) {
  const searchParams = useSearchParams()
  const [clientInitialData, setClientInitialData] = useState<ExamStartBatchResponse | null>(serverInitialData)
  const [isLoading, setIsLoading] = useState(!serverInitialData)

  useEffect(() => {
    // If server didn't provide data, try to get it from URL on client side
    if (!serverInitialData) {
      const dataParam = searchParams.get('data')
      
      if (dataParam) {
        try {
          const decoded = decodeURIComponent(dataParam)
          const parsed = JSON.parse(decoded)
          
          // Validate essential fields
          if (parsed.exam_attempt_id && Array.isArray(parsed.question_inventory)) {
            const validated: ExamStartBatchResponse = {
              exam_attempt_id: parsed.exam_attempt_id,
              pilot_start_pos: parsed.pilot_start_pos ?? 0,
              theta: parsed.theta ?? 0,
              se_theta: parsed.se_theta ?? 1,
              learning_rate: parsed.learning_rate ?? 0.5,
              question_inventory: parsed.question_inventory,
            }
            setClientInitialData(validated)
            setIsLoading(false)
            console.log('Loaded exam data from URL on client side')
            return
          }
        } catch (error) {
          console.error('Failed to parse URL data on client:', error)
        }
      }
      
      // Try sessionStorage
      try {
        const storageKey = `exam_data_${attemptId}`
        const storedData = sessionStorage.getItem(storageKey)
        
        if (storedData) {
          const parsed = JSON.parse(storedData)
          if (parsed.exam_attempt_id && Array.isArray(parsed.question_inventory)) {
            const validated: ExamStartBatchResponse = {
              exam_attempt_id: parsed.exam_attempt_id,
              pilot_start_pos: parsed.pilot_start_pos ?? 0,
              theta: parsed.theta ?? 0,
              se_theta: parsed.se_theta ?? 1,
              learning_rate: parsed.learning_rate ?? 0.5,
              question_inventory: parsed.question_inventory,
            }
            setClientInitialData(validated)
            setIsLoading(false)
            console.log('Loaded exam data from sessionStorage')
            return
          }
        }
      } catch (error) {
        console.error('Failed to load from sessionStorage:', error)
      }
      
      setIsLoading(false)
    }
  }, [serverInitialData, searchParams, attemptId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#1c90a6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  if (!clientInitialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Exam</h1>
          <p className="text-gray-600 mb-6">
            The exam data could not be loaded. Please try starting a new exam.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/exam"
              className="px-4 py-2 bg-[#1c90a6] text-white rounded-lg hover:bg-[#0d7a8a] transition-colors"
            >
              Start New Exam
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <ExamClient attemptId={attemptId} initialData={clientInitialData} />
}

