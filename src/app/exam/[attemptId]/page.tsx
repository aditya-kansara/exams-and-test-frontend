import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ExamClientWrapper } from './ExamClientWrapper'
import { Skeleton } from '@/components/ui/Skeleton'
import { ExamStartBatchResponse, ExamStartBatchResponseSchema } from '@/lib/types'

interface ExamPageProps {
  params: {
    attemptId: string
  }
  searchParams: {
    data?: string
    fromStorage?: string
    [key: string]: string | string[] | undefined
  }
}

async function getInitialData(
  attemptId: string,
  searchParams: { data?: string | string[]; fromStorage?: string; [key: string]: string | string[] | undefined }
): Promise<ExamStartBatchResponse | null> {
  // Normalize searchParams - handle both string and string[] (Next.js can return either)
  const dataParam = Array.isArray(searchParams.data) ? searchParams.data[0] : searchParams.data
  const fromStorageParam = Array.isArray(searchParams.fromStorage) ? searchParams.fromStorage[0] : searchParams.fromStorage
  
  console.log('getInitialData called with:', {
    attemptId,
    hasDataParam: !!dataParam,
    dataParamLength: dataParam?.length,
    fromStorage: fromStorageParam,
    allSearchParams: Object.keys(searchParams),
  })
  
  // Try to get data from URL parameter first
  if (dataParam) {
    try {
      // Check if URL data might be truncated
      const dataLength = dataParam.length
      console.log('URL data parameter length:', dataLength)
      
      if (dataLength > 2000) {
        console.warn('URL data parameter is very long, may be truncated. Length:', dataLength)
      }
      
      const decoded = decodeURIComponent(dataParam)
      const parsed = JSON.parse(decoded)
      
      // Log the parsed data for debugging
      console.log('Parsed exam data:', {
        exam_attempt_id: parsed.exam_attempt_id,
        question_inventory_length: parsed.question_inventory?.length,
        has_question_inventory: !!parsed.question_inventory,
        is_array: Array.isArray(parsed.question_inventory),
        all_keys: Object.keys(parsed),
      })
      
      // Check if data looks incomplete (common sign of truncation)
      const jsonString = JSON.stringify(parsed)
      if (jsonString.endsWith('...') || !jsonString.endsWith('}')) {
        console.error('Data appears to be truncated - JSON may be incomplete')
        throw new Error('URL data appears to be truncated')
      }
      
      // Try to validate with schema
      let validated: ExamStartBatchResponse
      try {
        validated = ExamStartBatchResponseSchema.parse(parsed)
        console.log('Schema validation passed')
      } catch (schemaError: any) {
        console.error('Schema validation failed:', schemaError)
        if (schemaError.issues) {
          console.error('Validation issues:', schemaError.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })))
        }
        console.error('Parsed data keys:', Object.keys(parsed))
        console.error('Parsed data sample:', JSON.stringify(parsed).substring(0, 1000))
        
        // If schema validation fails but we have the essential fields, try to use it anyway
        if (parsed.exam_attempt_id && Array.isArray(parsed.question_inventory)) {
          console.warn('Schema validation failed but essential fields present, using data anyway')
          // Fill in missing required fields with defaults if needed
          validated = {
            exam_attempt_id: parsed.exam_attempt_id,
            pilot_start_pos: parsed.pilot_start_pos ?? 0,
            theta: parsed.theta ?? 0,
            se_theta: parsed.se_theta ?? 1,
            learning_rate: parsed.learning_rate ?? 0.5,
            question_inventory: parsed.question_inventory,
          } as ExamStartBatchResponse
        } else {
          console.error('Missing essential fields:', {
            has_exam_attempt_id: !!parsed.exam_attempt_id,
            has_question_inventory: !!parsed.question_inventory,
            question_inventory_type: typeof parsed.question_inventory,
            question_inventory_is_array: Array.isArray(parsed.question_inventory),
          })
          throw schemaError
        }
      }
      
      // Ensure question_inventory exists and is an array (can be empty)
      if (validated.question_inventory && Array.isArray(validated.question_inventory)) {
        if (validated.question_inventory.length === 0) {
          console.warn('Question inventory is empty - exam may not have questions loaded yet')
        } else {
          console.log(`Successfully loaded exam data with ${validated.question_inventory.length} questions`)
        }
        return validated
      }
      console.warn('Question inventory is invalid in URL data:', {
        has_question_inventory: !!validated.question_inventory,
        is_array: Array.isArray(validated.question_inventory),
        type: typeof validated.question_inventory,
        value: validated.question_inventory,
      })
    } catch (error: any) {
      console.error('Failed to parse URL data parameter:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // If it's a JSON parse error, the URL might be truncated
      if (error instanceof SyntaxError) {
        console.error('JSON parse error - URL data may be truncated or malformed')
        console.error('Data length:', dataParam?.length)
        console.error('Data preview (first 200 chars):', dataParam?.substring(0, 200))
        console.error('Data preview (last 200 chars):', dataParam?.substring(Math.max(0, (dataParam?.length || 0) - 200)))
      }
      
      // Continue to try API fallback
    }
  } else {
    console.warn('No data parameter in URL')
  }

  // If URL data is missing or invalid, try sessionStorage first (for large data)
  if (fromStorageParam === 'true' || !dataParam) {
    try {
      if (typeof window !== 'undefined') {
        const storageKey = `exam_data_${attemptId}`
        const storedData = sessionStorage.getItem(storageKey)
        
        if (storedData) {
          console.log('Loading exam data from sessionStorage')
          try {
            const parsed = JSON.parse(storedData)
            
            // Validate and use the stored data
            let validated: ExamStartBatchResponse
            try {
              validated = ExamStartBatchResponseSchema.parse(parsed)
            } catch (schemaError: any) {
              console.warn('Schema validation failed for stored data, using anyway:', schemaError)
              if (parsed.exam_attempt_id && Array.isArray(parsed.question_inventory)) {
                validated = {
                  exam_attempt_id: parsed.exam_attempt_id,
                  pilot_start_pos: parsed.pilot_start_pos ?? 0,
                  theta: parsed.theta ?? 0,
                  se_theta: parsed.se_theta ?? 1,
                  learning_rate: parsed.learning_rate ?? 0.5,
                  question_inventory: parsed.question_inventory,
                } as ExamStartBatchResponse
              } else {
                throw new Error('Stored data missing essential fields')
              }
            }
            
            console.log(`Successfully loaded exam data from sessionStorage with ${validated.question_inventory.length} questions`)
            return validated
          } catch (parseError) {
            console.error('Failed to parse stored data:', parseError)
            sessionStorage.removeItem(storageKey)
          }
        }
      }
    } catch (error) {
      console.error('Error accessing sessionStorage:', error)
    }
  }

  // If URL data is missing or invalid, try to fetch from API
  // This is a fallback for cases where the URL is too long or data is missing
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
    const response = await fetch(`${apiBase}/api/exams/${attemptId}/state`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`Failed to fetch exam state: ${response.status} ${response.statusText}`)
      return null
    }

    const stateData = await response.json()
    
    // Construct ExamStartBatchResponse from state data
    // Note: This is a fallback - ideally we should have the full batch response
    // But if the URL data is missing, we can at least show an error instead of 404
    console.warn('Using fallback data fetch - some features may be limited')
    
    // Return null to show error page instead of 404
    return null
  } catch (error) {
    console.error('Failed to fetch exam data from API:', error)
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
  if (!attemptId || typeof attemptId !== 'string' || isNaN(Number(attemptId))) {
    notFound()
  }

  // Get initial data from URL parameters or API
  // Always pass to client wrapper - it will handle loading from URL if server parsing fails
  const initialData = await getInitialData(attemptId, searchParams)

  return (
    <Suspense fallback={<ExamLoadingSkeleton />}>
      <ExamClientWrapper attemptId={attemptId} initialData={initialData} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: ExamPageProps) {
  return {
    title: 'Exam in Progress | AMC Exam Platform',
    description: 'Computer Adaptive Testing - Exam in Progress',
  }
}
