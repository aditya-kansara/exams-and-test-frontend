'use client'

import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CreditCard, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { apiClient, handleApiError } from '@/lib/api'
import { PAYMENT_CONFIG } from '@/config/payment'
import { QuestionDetail } from '@/lib/types'

interface ReportData {
  exam_attempt_id: number
  raw_score: number
  theta_hat: number
  se_theta: number
  completed_at: string
  total_items: number
  items_scored: number
  scaled_score: number | null
  is_report_unlocked: boolean
  questions: QuestionDetail[]
}

export default function ReportPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [securityKey, setSecurityKey] = useState<string | null>(null)
  
  const attemptId = params.attemptId as string

  // Normalize theta to 0-500 scale (clamped to [-3, 3])
  const getNormalizedThetaScore = (theta: number | null | undefined) => {
    const MIN_THETA = -3
    const MAX_THETA = 3
    if (typeof theta !== 'number' || !isFinite(theta)) return 0
    const clamped = Math.max(MIN_THETA, Math.min(MAX_THETA, theta))
    const normalized = ((clamped - MIN_THETA) / (MAX_THETA - MIN_THETA)) * 500
    return Math.round(normalized)
  }

  useEffect(() => {
    // Surface payment failure state if redirected with query param
    try {
      const paymentParam = searchParams?.get('payment')
      if (paymentParam === 'failed') {
        setPaymentError('Payment verification failed. Please try again or contact support.')
      }
    } catch (_) {}

    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router, searchParams])

  useEffect(() => {
    if (isAuthenticated && !isLoading && attemptId) {
      fetchReportData()
      setupSecurityMeasures()
    }
  }, [isAuthenticated, isLoading, attemptId])

  // Effect to handle blur removal when unlocked
  useEffect(() => {
    if (isUnlocked && reportData?.questions) {
      // Force remove blur effects when unlocked
      const questionElements = document.querySelectorAll('[data-question-content="true"]')
      questionElements.forEach((element) => {
        const el = element as HTMLElement
        el.classList.remove('locked-content', 'blur-[8px]', 'pointer-events-none', 'select-none')
        el.classList.add('unlocked-content')
        el.style.filter = 'none'
        el.style.pointerEvents = 'auto'
        el.style.userSelect = 'auto'
        ;(el.style as any).webkitUserSelect = 'auto'
        ;(el.style as any).mozUserSelect = 'auto'
        ;(el.style as any).msUserSelect = 'auto'
      })
    }
  }, [isUnlocked, reportData])

  // Security measures to prevent blur bypass
  const setupSecurityMeasures = () => {
    // Generate a random security key
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSecurityKey(key)
    
    // Store the key in a way that's hard to access
    if (typeof window !== 'undefined') {
      (window as any).__reportSecurityKey = key
    }
    
    // Monitor for DOM manipulation attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
          const target = mutation.target as HTMLElement
          if (target.closest('[data-question-content]')) {
            // Re-apply blur if someone tries to remove it
            if (!isUnlocked && !target.classList.contains('blur-[8px]')) {
              target.classList.add('blur-[8px]', 'pointer-events-none', 'select-none')
            }
          }
        }
      })
    })
    
    // Start observing
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    })
    
    // Developer tools unblocked for debugging: disable previous right-click/F12 blocking
    const enableDevToolsBlock = false
    // Initialize with no-op handlers to satisfy strict typing
    let handleContextMenu: (e: MouseEvent) => void = () => {}
    let handleKeyDown: (e: KeyboardEvent) => void = () => {}
    let devHandlersAttached = false
    if (enableDevToolsBlock) {
      handleContextMenu = (e: MouseEvent) => {
        e.preventDefault()
        return false
      }
      handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 's')) {
          e.preventDefault()
          return false
        }
      }
      document.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('keydown', handleKeyDown)
      devHandlersAttached = true
    }
    
    // Periodic security check
    const securityInterval = setInterval(() => {
      if (!isUnlocked) {
        // Check if blur classes are still applied
        const questionElements = document.querySelectorAll('[data-question-content="true"]')
        questionElements.forEach((element) => {
          if (!element.classList.contains('locked-content')) {
            element.classList.add('locked-content')
          }
        })
        
        // Check if security key is still valid
        const currentKey = (window as any).__reportSecurityKey
        if (currentKey !== securityKey) {
          console.warn('Security key mismatch detected')
          // Re-apply security measures
          setupSecurityMeasures()
        }
      } else {
        // When unlocked, ensure all content is clear
        const questionElements = document.querySelectorAll('[data-question-content="true"]')
        questionElements.forEach((element) => {
          const el = element as HTMLElement
          el.classList.remove('locked-content', 'blur-[8px]', 'pointer-events-none', 'select-none')
          el.classList.add('unlocked-content')
          // Force remove any blur effects
          el.style.filter = 'none'
          el.style.pointerEvents = 'auto'
          el.style.userSelect = 'auto'
          ;(el.style as any).webkitUserSelect = 'auto'
          ;(el.style as any).mozUserSelect = 'auto'
          ;(el.style as any).msUserSelect = 'auto'
        })
      }
    }, 1000) // Check every second
    
    // Developer tools are unblocked; do not disable console during debugging
    
    // Cleanup function
    return () => {
      observer.disconnect()
      if (devHandlersAttached) {
        document.removeEventListener('contextmenu', handleContextMenu)
        document.removeEventListener('keydown', handleKeyDown)
      }
      clearInterval(securityInterval)
    }
  }

  const fetchReportData = async () => {
    try {
      setIsLoadingReport(true)
      setReportError(null)
      
      console.log('Fetching report data for attempt:', attemptId)
      
      // Get exam state first to check if attempt exists and is completed
      const state = await apiClient.getExamState(attemptId)
      console.log('Exam state:', state)
      
      if (!state.completed_at) {
        setReportError('This exam is not completed yet. Please complete the exam first.')
        return
      }
      
      // Get basic results for summary display
      let results
      try {
        console.log('Attempting to get exam results...')
        results = await apiClient.getExamResults(attemptId)
        console.log('Exam results:', results)
      } catch (error) {
        // If report is not available, create a basic report from state data
        console.log('Report not available, creating basic report from state data:', error)
        results = {
          exam_attempt_id: parseInt(attemptId),
          raw_score: state.raw_score || 0,
          theta_hat: state.theta_hat || 0,
          se_theta: state.se_theta || 0,
          completed_at: state.completed_at,
          total_items: 120, // Default value
          items_scored: state.position || 0,
          scaled_score: null
        }
        console.log('Created basic results:', results)
      }
      
      // If report is not unlocked, show static questions but keep scores visible
      if (!state.is_report_unlocked) {
        console.log('Report is locked, showing static questions but keeping scores visible')
        const staticReport: ReportData = {
          ...results,
          is_report_unlocked: false,
          questions: [] // No actual questions loaded
        }
        
        setReportData(staticReport)
        setIsUnlocked(false)
        return
      }
      
      // Load actual questions data from API
      console.log('Loading actual questions from API...')
      const questionsResponse = await apiClient.getExamQuestions(attemptId)
      const actualQuestions = questionsResponse.questions
      
      console.log('Loaded actual questions:', actualQuestions.length)
      console.log('Questions data:', actualQuestions)
      
      const report: ReportData = {
        ...results,
        is_report_unlocked: true,
        questions: actualQuestions
      }
      
      console.log('Final report data:', report)
      setReportData(report)
      setIsUnlocked(true)
      
      // Ensure questions are immediately visible when unlocked
      setTimeout(() => {
        const questionElements = document.querySelectorAll('[data-question-content="true"]')
        questionElements.forEach((element) => {
          const el = element as HTMLElement
          el.classList.remove('locked-content', 'blur-[8px]', 'pointer-events-none', 'select-none')
          el.classList.add('unlocked-content')
          el.style.filter = 'none'
          el.style.pointerEvents = 'auto'
          el.style.userSelect = 'auto'
        })
      }, 100)
      
    } catch (error) {
      console.error('Error fetching report data:', error)
      setReportError(handleApiError(error))
    } finally {
      setIsLoadingReport(false)
    }
  }

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true)
      setPaymentError(null)
      
      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        console.log('Razorpay not loaded, attempting to load dynamically...')
        
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        
        script.onload = () => {
          console.log('Razorpay script loaded dynamically')
          setTimeout(() => handlePayment(), 100)
        }
        
        script.onerror = () => {
          console.error('Failed to load Razorpay script')
          setPaymentError('Payment gateway not loaded. Please refresh the page and try again.')
          setIsProcessingPayment(false)
        }
        
        document.head.appendChild(script)
        return
      }

      // Check environment variable
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKey) {
        console.error('Razorpay key not found')
        setPaymentError('Payment configuration missing. Please contact support.')
        setIsProcessingPayment(false)
        return
      }

      // Create Razorpay order
      const orderResponse = await apiClient.createPaymentOrder({
        amount: PAYMENT_CONFIG.AMOUNT_CENTS,
        currency: PAYMENT_CONFIG.CURRENCY,
        receipt: `exam_report_${attemptId}_${Date.now()}`,
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
        prefill: {
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
          email: user?.email || '',
        },
        theme: {
          color: '#1c90a6'
        },
        handler: async (response: any) => {
          try {
            console.log('Payment successful:', response)
            
            // Verify payment
            await apiClient.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            
            console.log('Payment verified successfully')
            
            // Refresh the report data to load actual content
            await fetchReportData()
            
            // Redirect to ensure the unlocked report view is shown (use hard navigation for reliability)
            if (typeof window !== 'undefined') {
              window.location.href = `/report/${attemptId}`
            } else {
              router.replace(`/report/${attemptId}`)
            }
            
          } catch (error) {
            console.error('Payment verification failed:', error)
            setPaymentError('Payment verification failed. Please contact support.')
            // Redirect back with failure flag so the page shows the error banner
            if (typeof window !== 'undefined') {
              window.location.href = `/report/${attemptId}?payment=failed`
            } else {
              router.replace(`/report/${attemptId}?payment=failed`)
            }
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed')
            setIsProcessingPayment(false)
          }
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
      
      // Fallback: poll server to confirm and unlock by order id (in case handler isn't invoked)
      try {
        const maxTries = 24 // ~2 minutes at 5s interval
        let tries = 0
        const interval = setInterval(async () => {
          tries += 1
          try {
            const res = await apiClient.confirmPayment(orderResponse.id)
            if (res?.status === 'captured' && res?.unlocked) {
              clearInterval(interval)
              if (typeof window !== 'undefined') {
                window.location.href = `/report/${attemptId}`
              } else {
                router.replace(`/report/${attemptId}`)
              }
            }
          } catch (e) {
            // ignore and keep polling
          }
          if (tries >= maxTries) {
            clearInterval(interval)
          }
        }, 5000)
      } catch (_) {}
      
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(handleApiError(error))
      setIsProcessingPayment(false)
    }
  }

  const handleDownloadReport = async () => {
    try {
      console.log('Downloading report for attempt:', attemptId)
      
      // Call the report generation API using the API client
      const blob = await apiClient.generateReport(parseInt(attemptId))

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `exam-report-${attemptId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to generate report. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Early returns for loading and error states
  if (isLoading || isLoadingReport) {
    return (
      <div className="min-h-screen grid place-items-center bg-white text-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (reportError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h1>
          <p className="text-gray-600 mb-6">{reportError}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#1c90a6] text-white rounded-lg hover:bg-[#0d7a8a] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .locked-content {
          filter: blur(15px) brightness(0.6) contrast(0.4) saturate(0.3);
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .locked-content * {
          pointer-events: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        
        .unlocked-content {
          filter: none !important;
          pointer-events: auto !important;
          user-select: auto !important;
          -webkit-user-select: auto !important;
          -moz-user-select: auto !important;
          -ms-user-select: auto !important;
          -webkit-touch-callout: auto !important;
          -webkit-tap-highlight-color: auto !important;
        }
        
        .unlocked-content * {
          filter: none !important;
          pointer-events: auto !important;
          user-select: auto !important;
          -webkit-user-select: auto !important;
          -moz-user-select: auto !important;
          -ms-user-select: auto !important;
          -webkit-touch-callout: auto !important;
          -webkit-tap-highlight-color: auto !important;
        }
        
        .security-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), 
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          z-index: 5;
          pointer-events: none;
        }
      `}</style>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Exam Report #{reportData.exam_attempt_id}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/exams')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] transition-colors"
              >
                Back to Previous Exams
              </button>

              {!isUnlocked ? (
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1c90a6] hover:bg-[#0d7a8a] border border-transparent rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessingPayment ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Pay $9.99 to Unlock
                </button>
              ) : (
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1c90a6] hover:bg-[#0d7a8a] border border-transparent rounded-md transition-colors"
                >
                  Download Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Summary</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1c90a6] mb-2">Score: {getNormalizedThetaScore(reportData.theta_hat)}</div>
            <div className="text-sm text-gray-600">
              {reportData.items_scored} questions answered
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Completed on {formatDate(reportData.completed_at)}
          </div>
          {!isUnlocked && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1c90a6]/10 border border-[#1c90a6]/20 rounded-lg">
                <CreditCard className="h-4 w-4 text-[#1c90a6]" />
                <span className="text-sm text-[#1c90a6] font-medium">
                  Detailed questions hidden - Payment required to view
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
            {!isUnlocked && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <EyeOff className="h-4 w-4" />
                <span>Content locked - Payment required</span>
              </div>
            )}
            {isUnlocked && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Eye className="h-4 w-4" />
                <span>Content unlocked</span>
              </div>
            )}
          </div>

          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Payment Error</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{paymentError}</p>
            </div>
          )}

          <div className="space-y-6">
            {!isUnlocked ? (
              <div className="border rounded-lg p-12 relative border-gray-300 min-h-[400px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-[#1c90a6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-10 w-10 text-[#1c90a6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Questions Locked</h3>
                  <p className="text-gray-600 mb-8">
                    Pay $9.99 to unlock detailed report showing your stronger and weaker areas, and it also includes detailed questions, answers and explanations.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">What you'll get:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Detailed question-by-question analysis</li>
                      <li>• Your selected answers vs correct answers</li>
                      <li>• Comprehensive explanations for each question</li>
                      <li>• Performance insights by category</li>
                      <li>• Downloadable report card</li>
                    </ul>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-[#1c90a6] hover:bg-[#0d7a8a] border border-transparent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessingPayment ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CreditCard className="h-5 w-5" />
                    )}
                    Pay $9.99 to Unlock
                  </button>
                </div>
              </div>
            ) : (
              reportData.questions.length > 0 ? (
                reportData.questions.map((question) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-6 relative border-gray-200"
                  >
                    <div className="unlocked-content" data-question-content="true">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Question {question.position}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            question.is_correct 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {question.is_correct ? 'Correct' : 'Incorrect'}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {question.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{question.question_text}</p>

                      <div className="space-y-2 mb-4">
                        {[
                          { key: 'A', text: question.option_a_text, value: 1 },
                          { key: 'B', text: question.option_b_text, value: 2 },
                          { key: 'C', text: question.option_c_text, value: 3 },
                          { key: 'D', text: question.option_d_text, value: 4 },
                          { key: 'E', text: question.option_e_text, value: 5 }
                        ].map((option) => (
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
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                        <p className="text-gray-700 text-sm">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Found</h3>
                  <p className="text-gray-600">No questions were found for this exam attempt.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

