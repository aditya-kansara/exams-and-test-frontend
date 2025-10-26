import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  ExamStartRequest,
  ExamStartRequestSchema,
  ExamStartResponse,
  ExamStartResponseSchema,
  ExamStateResponse,
  ExamStateResponseSchema,
  AnswerSubmitRequest,
  AnswerSubmitRequestSchema,
  AnswerSubmitResponse,
  AnswerSubmitResponseSchema,
  FinishRequest,
  FinishRequestSchema,
  FinishResponse,
  FinishResponseSchema,
  ExamResults,
  ExamResultsSchema,
  ApiError,
  ApiErrorSchema,
} from './types'

class ApiClient {
  public client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.data) {
          try {
            const apiError = ApiErrorSchema.parse(error.response.data)
            throw new Error(apiError.detail)
          } catch {
            throw new Error('An unexpected error occurred')
          }
        }
        throw error
      }
    )

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  setSupabaseToken(token: string) {
    this.token = token
    // Don't store Supabase tokens in localStorage - they're managed by Supabase
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Note: Authentication is now handled by Supabase AuthContext
  // The API client automatically uses Supabase tokens via the interceptor

  // Exam endpoints
  async startExam(): Promise<ExamStartResponse> {
    // Backend start endpoint doesn't expect any body
    const response = await this.client.post('/api/v1/exam/start')
    return ExamStartResponseSchema.parse(response.data)
  }

  async submitAnswer(answer: AnswerSubmitRequest): Promise<AnswerSubmitResponse> {
    const validatedAnswer = AnswerSubmitRequestSchema.parse(answer)
    const response = await this.client.post('/api/v1/exam/answer', validatedAnswer)
    
    return AnswerSubmitResponseSchema.parse(response.data)
  }

  async finishExam(finishRequest: FinishRequest): Promise<FinishResponse> {
    const validatedRequest = FinishRequestSchema.parse(finishRequest)
    const response = await this.client.post('/api/v1/exam/finish', validatedRequest)
    return FinishResponseSchema.parse(response.data)
  }

  // Payment API methods
  async createPaymentOrder(orderData: {
    amount: number
    currency: string
    receipt: string
    notes?: Record<string, any>
  }) {
    const response = await this.client.post('/api/v1/payments/orders', orderData)
    return response.data
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) {
    const response = await this.client.post('/api/v1/payments/verify', paymentData)
    return response.data
  }

  async getPaymentStatus(attemptId: string) {
    const response = await this.client.get(`/api/v1/payments/status/${attemptId}`)
    return response.data
  }

  async getExamResults(attemptId: string): Promise<ExamResults> {
    const response = await this.client.get(`/api/v1/exam/${attemptId}/report`)
    return ExamResultsSchema.parse(response.data)
  }

  async getExamState(attemptId: string): Promise<ExamStateResponse> {
    const response = await this.client.get(`/api/v1/exam/${attemptId}/state`)
    return ExamStateResponseSchema.parse(response.data)
  }

  // Note: Magic link authentication has been removed

  // Note: Google OAuth is now handled by Supabase directly via supabase.auth.signInWithOAuth()
  // These backend endpoints are kept for server-side OAuth flows if needed

  // User profile and backend-specific methods
  async getUserProfile(): Promise<{ user_id: string; email: string; created_at?: string; last_sign_in?: string; email_verified: boolean }> {
    const response = await this.client.get('/auth/profile')
    return response.data
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    // Health check is at the root level, not under /api/v1/exam
    const response = await this.client.get('/health')
    return response.data
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Utility functions for common API patterns
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('Network Error') ||
    error.message.includes('timeout') ||
    error.message.includes('ECONNREFUSED')
  )
}

// Export types for convenience
export type { ExamStartRequest, ExamStartResponse, AnswerSubmitRequest, AnswerSubmitResponse, ExamResults }
