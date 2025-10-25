'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, Download, CreditCard, Home, Clock, Target } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { ExamStateResponse } from '@/lib/types'
import { EXAM_CONFIG } from '@/config/exam'
import { PAYMENT_CONFIG } from '@/config/payment'

interface SimpleResultsProps {
  attemptId: string
}

export function SimpleResults({ attemptId }: SimpleResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [results, setResults] = useState<ExamStateResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | 'unknown'>('unknown')
  const [isReportUnlocked, setIsReportUnlocked] = useState(false)


  useEffect(() => {
    const initializeResults = async () => {
      try {
        setLoading(true)
        
        // Check if we have URL parameters (from exam completion)
        const score = searchParams.get('score')
        const theta = searchParams.get('theta')
        const se = searchParams.get('se')
        const completed = searchParams.get('completed')
        
        if (score && theta && se && completed) {
          // Use data from URL parameters (from exam completion)
          console.log('Results from URL params:', { score, theta, se, completed })
          const mockResults: ExamStateResponse = {
            exam_attempt_id: parseInt(attemptId),
            user_id: user?.id || '',
            started_at: new Date().toISOString(),
            completed_at: completed,
            position: EXAM_CONFIG.TOTAL_QUESTIONS,
            raw_score: parseInt(score),
            theta_hat: parseFloat(theta),
            se_theta: parseFloat(se),
            is_report_unlocked: false
          }
          console.log('Parsed results:', mockResults)
          setResults(mockResults)
          
          // Check payment status for this attempt
          await checkPaymentStatus()
        } else {
          // Fallback to API call if no URL parameters
          const examState = await apiClient.getExamState(attemptId)
          setResults(examState)
          
          // Check payment status
          await checkPaymentStatus()
        }
      } catch (err) {
        console.error('Failed to load basic results:', err)
        setError('Failed to load exam results')
      } finally {
        setLoading(false)
      }
    }

    const checkPaymentStatus = async () => {
      try {
        // Check if there's a payment associated with this exam attempt
        // This would typically involve checking a payment status endpoint
        // For now, we'll assume payment is pending until user pays
        setPaymentStatus('pending')
        setIsReportUnlocked(false)
        
        // TODO: Implement actual payment status check
        // const paymentStatus = await apiClient.getPaymentStatus(attemptId)
        // setPaymentStatus(paymentStatus.status)
        // setIsReportUnlocked(paymentStatus.is_report_unlocked)
      } catch (err) {
        console.error('Failed to check payment status:', err)
        setPaymentStatus('unknown')
      }
    }

    initializeResults()
  }, [attemptId, searchParams, user?.id])

  const handlePayment = async () => {
    try {
      setPaymentLoading(true)
      setError(null) // Clear any previous errors
      
      // Check if Razorpay is loaded, if not, try to load it dynamically
      if (typeof (window as any).Razorpay === 'undefined') {
        console.log('Razorpay not loaded, attempting to load dynamically...')
        
        // Try to load Razorpay script dynamically
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        
        script.onload = () => {
          console.log('Razorpay script loaded dynamically')
          // Retry the payment after script loads
          setTimeout(() => handlePayment(), 100)
        }
        
        script.onerror = () => {
          console.error('Failed to load Razorpay script')
          setError('Payment gateway not loaded. Please refresh the page and try again.')
          setPaymentLoading(false)
        }
        
        document.head.appendChild(script)
        return
      }

      // Check environment variable
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKey) {
        console.error('Razorpay key not found')
        setError('Payment configuration missing. Please contact support.')
        setPaymentLoading(false)
        return
      }

      // Create Razorpay order
      const orderResponse = await apiClient.createPaymentOrder({
        amount: PAYMENT_CONFIG.AMOUNT_CENTS, // Configurable amount in cents
        currency: PAYMENT_CONFIG.CURRENCY,
        receipt: `exam_${attemptId}_${Date.now()}`,
        notes: {
          exam_attempt_id: parseInt(attemptId),
          user_email: user?.email || 'unknown'
        }
      })

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: PAYMENT_CONFIG.COMPANY_NAME,
        description: PAYMENT_CONFIG.DESCRIPTION,
        order_id: orderResponse.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await apiClient.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            
            // Payment successful - update status and unlock report
            setPaymentStatus('completed')
            setIsReportUnlocked(true)
            
            // Redirect to detailed report
            router.push(`/results/${attemptId}/detailed`)
            } catch (err) {
              setError('Payment verification failed')
            }
        },
        theme: {
          color: '#3B82F6'
        }
      }

      try {
        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      } catch (razorpayError) {
        setError(`Razorpay error: ${razorpayError instanceof Error ? razorpayError.message : 'Unknown error'}`)
      }
    } catch (err) {
      setError(`Payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setPaymentLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'Unable to load exam results'}</p>
          <Button onClick={() => router.push('/')} className="mr-4">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  // Check if exam is completed
  if (!results.completed_at) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Not Completed</h1>
          <p className="text-gray-600 mb-4">This exam has not been completed yet.</p>
          <Button onClick={() => router.push('/')} className="mr-4">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const scorePercentage = results.raw_score ? Math.round((results.raw_score / EXAM_CONFIG.TOTAL_QUESTIONS) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">AMC Exam Results</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exam Completed!</h1>
              <p className="text-gray-600">Your adaptive exam has been finished</p>
            </div>
          </div>
        </div>

        {/* Basic Results */}
        <div className="flex justify-center mb-8">
          <Card className="w-64">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {results.theta_hat !== null && results.theta_hat !== undefined ? results.theta_hat.toFixed(2) : 'N/A'}
              </CardTitle>
              <CardDescription>Ability Score (θ)</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Payment Status Section */}
        {paymentStatus === 'completed' && isReportUnlocked ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Report Unlocked
              </CardTitle>
              <CardDescription>
                Your detailed report is now available for download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Report Ready!</h3>
                    <p className="text-green-800 mt-2">
                      Your comprehensive exam analysis is ready for download.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-900">✓ Paid</div>
                    <div className="text-green-600">Report unlocked</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => router.push(`/results/${attemptId}/detailed`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  View Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Unlock Detailed Report
              </CardTitle>
              <CardDescription>
                Get your comprehensive adaptive exam analysis with detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Detailed Report Includes:</h3>
                  <ul className="text-blue-800 mt-2 space-y-1">
                    <li>• Category-wise performance analysis</li>
                    <li>• Ability estimates for each domain</li>
                    <li>• Confidence intervals and standard errors</li>
                    <li>• Personalized study recommendations</li>
                    <li>• Downloadable PDF report</li>
                  </ul>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900">{PAYMENT_CONFIG.DISPLAY_AMOUNT}</div>
                  <div className="text-blue-600">One-time payment</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                {paymentLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay {PAYMENT_CONFIG.DISPLAY_AMOUNT} to Unlock Report
                  </>
                )}
              </Button>
            </div>

              <p className="text-sm text-gray-500 text-center mt-4">
                Secure payment powered by Razorpay
              </p>
            </CardContent>
          </Card>
        )}


            {/* Additional Info */}
            <div className="text-center text-gray-600">
              <p className="mb-2">
                Completed on {new Date(results.completed_at).toLocaleDateString()} at{' '}
                {new Date(results.completed_at).toLocaleTimeString()}
              </p>
              <p className="text-sm">
                Your exam data is securely stored and will be available for download after payment.
              </p>
            </div>
      </div>
    </div>
  )
}
