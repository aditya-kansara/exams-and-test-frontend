import { z } from 'zod'

// Note: Authentication is now handled by Supabase AuthContext
// These types are kept for backward compatibility if needed

// Exam Configuration
export const EXAM_DURATION_HOURS = 3.5
export const EXAM_DURATION_SECONDS = EXAM_DURATION_HOURS * 60 * 60 // 3.5 hours = 12600 seconds

// Exam Types - Updated to match backend schemas
export const ExamStartRequestSchema = z.object({})

export const ItemPublicSchema = z.object({
  id: z.number(),
  question_text: z.string(),
  option_a_text: z.string(),
  option_b_text: z.string(),
  option_c_text: z.string(),
  option_d_text: z.string(),
  option_e_text: z.string(),
  category: z.string(),
  active_flag: z.boolean(),
  is_scored: z.boolean(),
  created_at: z.string(), // ISO datetime string
})

export const ExamStartResponseSchema = z.object({
  exam_attempt_id: z.number(),
  position: z.number(),
  item: ItemPublicSchema,
})

export const ExamStateResponseSchema = z.object({
  exam_attempt_id: z.number(),
  user_id: z.string(),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  position: z.number(),
  raw_score: z.number().nullable(),
  theta_hat: z.number().nullable(),
  se_theta: z.number().nullable(),
  is_report_unlocked: z.boolean(),
})

export type ExamStartRequest = z.infer<typeof ExamStartRequestSchema>
export type ItemPublic = z.infer<typeof ItemPublicSchema>
export type ExamStartResponse = z.infer<typeof ExamStartResponseSchema>
export type ExamStateResponse = z.infer<typeof ExamStateResponseSchema>

// Answer Types - Updated to match backend schemas
export const AnswerSubmitRequestSchema = z.object({
  exam_attempt_id: z.number(),
  item_id: z.number(),
  selected_option: z.number().min(1).max(5), // Numeric options 1-5
  response_time_ms: z.number().optional(),
  idempotency_key: z.string().optional(),
  served_at: z.string().optional(), // ISO datetime string
  answered_at: z.string().optional(), // ISO datetime string
})

export const AnswerSubmitResponseSchema = z.object({
  next_item_id: z.number().nullable(),
  position: z.number(),
  theta: z.number(),
  se: z.number(),
  stop: z.boolean(),
  item: ItemPublicSchema.nullable().optional(),
})

export type AnswerSubmitRequest = z.infer<typeof AnswerSubmitRequestSchema>
export type AnswerSubmitResponse = z.infer<typeof AnswerSubmitResponseSchema>

// Finish Exam Types
export const FinishRequestSchema = z.object({
  exam_attempt_id: z.number(),
})

export const FinishResponseSchema = z.object({
  raw_score: z.number(),
  completed_at: z.string(),
  theta_hat: z.number().nullable(),
  se_theta: z.number().nullable(),
})

// Results Types - Updated to match ExamReportRes
export const ExamResultsSchema = z.object({
  exam_attempt_id: z.number(),
  raw_score: z.number(),
  theta_hat: z.number(),
  se_theta: z.number(),
  completed_at: z.string(),
  total_items: z.number(),
  items_scored: z.number(),
  scaled_score: z.number().nullable(),
})

export type FinishRequest = z.infer<typeof FinishRequestSchema>
export type FinishResponse = z.infer<typeof FinishResponseSchema>

export type ExamResults = z.infer<typeof ExamResultsSchema>

// WebSocket functionality removed - not needed for current backend

// API Error Types
export const ApiErrorSchema = z.object({
  detail: z.string(),
  error_code: z.string().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

// Auth Types - Magic link authentication removed

// UI State Types
export interface ExamState {
  attemptId: number | null
  currentItem: ItemPublic | null
  position: number | null
  responses: AnswerSubmitRequest[]
  isComplete: boolean
  isLoading: boolean
  error: string | null
}

export interface TimerState {
  timeRemaining: number
  isRunning: boolean
}

// Stripe Types
export interface StripeProduct {
  id: string
  name: string
  description: string
  price: number
  currency: string
  type: 'one_time' | 'subscription'
}

export interface CheckoutSession {
  id: string
  url: string
}

// Report Types
export interface ReportData {
  results: ExamResults
  generated_at: string
  report_id: string
}

export interface ChartData {
  theta: number
  se: number
  item_number: number
}
