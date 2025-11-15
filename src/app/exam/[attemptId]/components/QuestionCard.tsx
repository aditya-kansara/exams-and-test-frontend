'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Clock } from 'lucide-react'
import { ItemPublic } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface QuestionCardProps {
  item: ItemPublic
  onSubmit: (response: number, responseTimeMs: number) => void
  isLoading: boolean
  questionNumber: number
  isLastQuestion?: boolean
}

export function QuestionCard({ item, onSubmit, isLoading, questionNumber, isLastQuestion = false }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null)
  const [optionImageUrls, setOptionImageUrls] = useState<Record<number, string>>({})

  // Reset selected option and start time when item changes
  useEffect(() => {
    setSelectedOption(null)
    setStartTime(Date.now())
  }, [item.id])

  useEffect(() => {
    const assets = item.media ?? []
    if (!assets.length) {
      setQuestionImageUrl(null)
      setOptionImageUrls({})
      return
    }

    const bucket =
      process.env.NEXT_PUBLIC_SUPABASE_ITEM_BUCKET ||
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
      'item-bucket'

    try {
      const storage = supabase.storage
      if (!storage) {
        throw new Error('Supabase storage client unavailable')
      }

      const bucketClient = storage.from(bucket)
      const questionAsset = assets.find((asset) => asset.display_order === 0)
      let questionUrl: string | null = null
      if (questionAsset?.storage_key) {
        try {
          const { data } = bucketClient.getPublicUrl(questionAsset.storage_key)
          if (data?.publicUrl) {
            questionUrl = data.publicUrl
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Unable to build question media URL', { questionAsset, error })
          }
        }
      }

      const optionUrls: Record<number, string> = {}
      for (let displayOrder = 1; displayOrder <= 5; displayOrder++) {
        const match = assets.find((asset) => asset.display_order === displayOrder)
        if (!match) continue
        try {
          const { data } = bucketClient.getPublicUrl(match.storage_key)
          if (data?.publicUrl) {
            optionUrls[displayOrder] = data.publicUrl
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Unable to build option media URL', { match, error })
          }
        }
      }

      setQuestionImageUrl(questionUrl)
      setOptionImageUrls(optionUrls)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to resolve media assets', error)
      }
      setQuestionImageUrl(null)
      setOptionImageUrls({})
    }
  }, [item.id, item.media])

  const handleSubmit = async () => {
    if (selectedOption === null || isSubmitting) return

    setIsSubmitting(true)
    try {
      const responseTimeMs = Date.now() - startTime
      await onSubmit(selectedOption, responseTimeMs)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptionClick = (optionIndex: number) => {
    if (!isLoading && !isSubmitting) {
      setSelectedOption(optionIndex + 1) // Convert 0-based to 1-based indexing
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Question Header - Minimal */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Question {questionNumber}
        </h2>
      </div>
      
      {/* Question Media */}
      {/* Question Text */}
      <div className="text-xl leading-relaxed text-gray-900 flex-1">
        {item.question_text}
      </div>

      {/* Question Media */}
      {questionImageUrl && (
        <div className="my-8 flex justify-center">
          <img
            src={questionImageUrl}
            alt="Question illustration"
            className="max-h-72 max-w-full object-contain rounded-md border border-gray-200 bg-white"
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 mt-10 mb-12">
        {[item.option_a_text, item.option_b_text, item.option_c_text, item.option_d_text, item.option_e_text].map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={isLoading || isSubmitting}
            className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-200 ${
              selectedOption === index + 1 
                ? 'border-[#1c90a6] bg-[#1c90a6]/10 text-[#1c90a6]' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === index + 1 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300'
              }`}>
              </div>
              <div className="flex-1">
                <span className="text-lg text-gray-900 block">{option}</span>
              </div>
            </div>
            {optionImageUrls[index + 1] && (
              <div className="mt-4 flex justify-center">
                <img
                  src={optionImageUrls[index + 1]}
                  alt={`Option ${index + 1} illustration`}
                  className="max-h-24 max-w-full object-contain rounded border border-gray-200 bg-white"
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Next/Submit Button - Right Bottom */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null || isLoading || isSubmitting}
          className="px-8 py-3 text-lg font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>{isLastQuestion ? 'Submitting...' : 'Loading...'}</span>
            </div>
          ) : (
            isLastQuestion ? 'Submit Exam' : 'Next'
          )}
        </Button>
      </div>
    </div>
  )
}
