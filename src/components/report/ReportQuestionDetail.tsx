'use client'

import { useMemo } from 'react'
import { CheckCircle } from 'lucide-react'
import { QuestionDetail } from '@/lib/types'
import { getLabeledExplanationMedia, groupAndResolveMedia } from '@/lib/mediaSlots'
import { ReportLabeledMediaGallery } from './ReportLabeledMediaGallery'
import { ReportMediaGallery } from './ReportMediaGallery'

interface ReportQuestionDetailProps {
  question: QuestionDetail
}

export function ReportQuestionDetail({ question }: ReportQuestionDetailProps) {
  const grouped = useMemo(
    () => groupAndResolveMedia(question.media),
    [question.media],
  )

  const explanationMedia = useMemo(
    () => getLabeledExplanationMedia(question.media),
    [question.media],
  )

  const options = [
    { key: 'A' as const, text: question.option_a_text, value: 1 },
    { key: 'B' as const, text: question.option_b_text, value: 2 },
    { key: 'C' as const, text: question.option_c_text, value: 3 },
    { key: 'D' as const, text: question.option_d_text, value: 4 },
    { key: 'E' as const, text: question.option_e_text, value: 5 },
  ]

  return (
    <div className="border rounded-lg p-6 relative border-gray-200">
      <div className="unlocked-content" data-question-content="true">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {question.position}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                question.is_correct
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {question.is_correct ? 'Correct' : 'Incorrect'}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {question.category}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{question.question_text}</p>

        <ReportMediaGallery
          urls={grouped.question.main.map((m) => m.url)}
          alt={`Question ${question.position} illustration`}
        />

        <div className="space-y-2 mb-4">
          {options.map((option) => {
            const optionUrls = grouped.question.options[option.key].map((m) => m.url)

            return (
              <div
                key={option.key}
                className={`p-3 rounded-lg border ${
                  option.value === question.correct_option
                    ? 'border-green-500 bg-green-50'
                    : option.value === question.selected_option
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">{option.key}.</span>
                  <span className="text-gray-700">{option.text}</span>
                  {option.value === question.correct_option && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </div>
                <ReportMediaGallery
                  urls={optionUrls}
                  alt={`Question ${question.position} option ${option.key}`}
                  imageClassName="max-h-48 max-w-full object-contain rounded border border-gray-200 bg-white"
                />
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Explanation</h4>
          <p className="text-gray-700 text-sm">{question.explanation}</p>
          <ReportLabeledMediaGallery items={explanationMedia} />
        </div>
      </div>
    </div>
  )
}
