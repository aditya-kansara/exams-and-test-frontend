'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Clock } from 'lucide-react'
import { ItemPublic } from '@/lib/types'

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

  // Reset selected option and start time when item changes
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
      
      {/* Question Text */}
      <div className="text-xl leading-relaxed text-gray-900 mb-12 flex-1">
        {item.question_text}
      </div>

      {/* Options */}
      <div className="space-y-4 mb-12">
        {[item.option_a_text, item.option_b_text, item.option_c_text, item.option_d_text, item.option_e_text].map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={isLoading || isSubmitting}
            className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-200 ${
              selectedOption === index + 1 
                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === index + 1 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300'
              }`}>
                {selectedOption === index + 1 && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-lg text-gray-900">
                <span className="font-medium mr-3">{index + 1}.</span>
                {option}
              </span>
            </div>
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
            isLastQuestion ? 'Submit Answer' : 'Next'
          )}
        </Button>
      </div>
    </div>
  )
}
