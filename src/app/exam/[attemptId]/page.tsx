import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ExamClient } from './ExamClient'
import { Skeleton } from '@/components/ui/Skeleton'
import { ExamStartResponse } from '@/lib/types'

interface ExamPageProps {
  params: {
    attemptId: string
  }
  searchParams: {
    data?: string
  }
}

async function getInitialData(searchParams: { data?: string }): Promise<ExamStartResponse | null> {
  if (!searchParams.data) {
    return null
  }
  
  try {
    return JSON.parse(decodeURIComponent(searchParams.data)) as ExamStartResponse
  } catch (error) {
    console.error('Failed to parse initial exam data:', error)
    return null
  }
}

function ExamLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Timer Skeleton - Sticky position in top-right */}
      <div className="sticky top-4 z-40 flex justify-end">
        <div className="rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm px-3 py-2 w-[220px] flex flex-col gap-1.5">
          {/* Top row: icon + time + tiny label */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 leading-none">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="hidden sm:block h-3 w-6" />
          </div>
          {/* Progress bar - slimmer */}
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      </div>

      {/* Question Skeleton - Full Screen */}
      <div className="w-full h-screen px-8 py-8">
        <div className="w-full h-full flex flex-col">
          {/* Question Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-40" />
          </div>
          
          {/* Question Text Skeleton */}
          <div className="mb-12 flex-1">
            <Skeleton className="h-7 w-full mb-3" />
            <Skeleton className="h-7 w-4/5" />
          </div>

          {/* Options Skeleton */}
          <div className="space-y-4 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 border-2 border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Next/Submit Button Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-12 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ExamPage({ params, searchParams }: ExamPageProps) {
  const { attemptId } = params

  // Validate attempt ID format
  if (!attemptId || typeof attemptId !== 'string') {
    notFound()
  }

  // Get initial data from URL parameters
  const initialData = await getInitialData(searchParams)

  if (!initialData) {
    notFound()
  }

  return (
    <Suspense fallback={<ExamLoadingSkeleton />}>
      <ExamClient attemptId={attemptId} initialData={initialData} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: ExamPageProps) {
  return {
    title: 'Exam in Progress | AMC Exam Platform',
    description: 'Computer Adaptive Testing - Exam in Progress',
  }
}
