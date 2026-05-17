'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Clock } from 'lucide-react'
import { ItemPublic } from '@/lib/types'
import {
  getExamOptionImageUrls,
  getExamQuestionImageUrls,
} from '@/lib/mediaSlots'
import { ReportMediaGallery } from '@/components/report/ReportMediaGallery'

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

  const questionImageUrls = useMemo(
    () => getExamQuestionImageUrls(item.media),
    [item.id, item.media],
  )

  const optionImageUrls = useMemo(
    () => getExamOptionImageUrls(item.media),
    [item.id, item.media],
  )

  useEffect(() => {
    setSelectedOption(null)
    setStartTime(Date.now())
  }, [item.id])

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
      setSelectedOption(optionIndex + 1)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Question {questionNumber}
        </h2>
      </div>

      <div className="text-xl leading-relaxed text-gray-900 flex-1">
        {item.question_text}
      </div>

      <ReportMediaGallery
        urls={questionImageUrls}
        alt={`Question ${questionNumber} illustration`}
        layout="row"
        className="my-8 flex flex-wrap justify-center gap-3"
      />

      <div className="space-y-4 mt-10 mb-12">
        {[item.option_a_text, item.option_b_text, item.option_c_text, item.option_d_text, item.option_e_text].map((option, index) => {
          const optionNumber = index + 1
          const urls = optionImageUrls[optionNumber] ?? []

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isLoading || isSubmitting}
              className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedOption === optionNumber
                  ? 'border-[#1c90a6] bg-[#1c90a6]/10 text-[#1c90a6]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedOption === optionNumber
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300'
                }`}>
                </div>
                <div className="flex-1">
                  <span className="text-lg text-gray-900 block">{option}</span>
                </div>
              </div>
              {urls.length > 0 && (
                <div className="pl-10">
                  <ReportMediaGallery
                    urls={urls}
                    alt={`Option ${optionNumber} illustration`}
                    layout="stack"
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>

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
