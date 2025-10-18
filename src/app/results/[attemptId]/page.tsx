import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ReportClient } from './ReportClient'
import { Skeleton } from '@/components/ui/Skeleton'
import { apiClient } from '@/lib/api'

interface ResultsPageProps {
  params: {
    attemptId: string
  }
}

async function getResultsData(attemptId: string) {
  try {
    const results = await apiClient.getExamResults(attemptId)
    return results
  } catch (error) {
    console.error('Failed to load results:', error)
    return null
  }
}

function ResultsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>

        {/* Results Table Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = params

  // Validate attempt ID format
  if (!attemptId || typeof attemptId !== 'string') {
    notFound()
  }

  // Get results data
  const results = await getResultsData(attemptId)

  if (!results) {
    notFound()
  }

  return (
    <Suspense fallback={<ResultsLoadingSkeleton />}>
      <ReportClient attemptId={attemptId} results={results} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: ResultsPageProps) {
  return {
    title: 'Exam Results | AMC Exam Platform',
    description: 'View your adaptive exam results and detailed analysis',
  }
}
