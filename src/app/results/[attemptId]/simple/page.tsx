import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { SimpleResults } from '../SimpleResults'
import { Skeleton } from '@/components/ui/Skeleton'

interface SimpleResultsPageProps {
  params: {
    attemptId: string
  }
}

function SimpleResultsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Results Card Skeleton */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-32 w-64" />
        </div>

        {/* Payment Section Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-96 mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function SimpleResultsPage({ params }: SimpleResultsPageProps) {
  const { attemptId } = params

  // Validate attempt ID format
  if (!attemptId || typeof attemptId !== 'string') {
    notFound()
  }

  return (
    <Suspense fallback={<SimpleResultsLoadingSkeleton />}>
      <SimpleResults attemptId={attemptId} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: SimpleResultsPageProps) {
  return {
    title: 'Exam Results | AMC Exam Platform',
    description: 'View your exam results and unlock detailed report',
  }
}
