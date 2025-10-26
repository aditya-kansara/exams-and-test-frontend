/**
 * Exam Configuration
 * 
 * This file contains configurable exam settings that can be adjusted
 * for different testing scenarios (development, staging, production).
 */

// Default exam configuration
export const EXAM_CONFIG = {
  // Total number of questions in the exam
  TOTAL_QUESTIONS: parseInt(process.env.NEXT_PUBLIC_EXAM_TOTAL_QUESTIONS || '2'),
  
  // Number of scored questions (should be <= TOTAL_QUESTIONS)
  SCORED_QUESTIONS: parseInt(process.env.NEXT_PUBLIC_EXAM_SCORED_QUESTIONS || '2'),
  
  // Number of pilot questions (unscored)
  PILOT_QUESTIONS: parseInt(process.env.NEXT_PUBLIC_EXAM_PILOT_QUESTIONS || '0'),
  
  // Minimum questions before stopping criteria can be applied
  MIN_QUESTIONS_FOR_STOP: parseInt(process.env.NEXT_PUBLIC_EXAM_MIN_QUESTIONS_FOR_STOP || '2'),
  
  // Maximum questions to present (should be <= TOTAL_QUESTIONS)
  MAX_QUESTIONS: parseInt(process.env.NEXT_PUBLIC_EXAM_MAX_QUESTIONS || '2'),
  
  // Standard error threshold for stopping
  SE_THRESHOLD: parseFloat(process.env.NEXT_PUBLIC_EXAM_SE_THRESHOLD || '0.35'),
  
  // Exam duration in hours
  DURATION_HOURS: parseFloat(process.env.NEXT_PUBLIC_EXAM_DURATION_HOURS || '3.5'),
  
  // Exam duration in seconds
  DURATION_SECONDS: parseFloat(process.env.NEXT_PUBLIC_EXAM_DURATION_HOURS || '3.5') * 60 * 60,
}

// Validation function to ensure configuration is valid
export function validateExamConfig() {
  const config = EXAM_CONFIG
  
  if (config.SCORED_QUESTIONS > config.TOTAL_QUESTIONS) {
    throw new Error('SCORED_QUESTIONS cannot be greater than TOTAL_QUESTIONS')
  }
  
  if (config.MAX_QUESTIONS > config.TOTAL_QUESTIONS) {
    throw new Error('MAX_QUESTIONS cannot be greater than TOTAL_QUESTIONS')
  }
  
  if (config.MIN_QUESTIONS_FOR_STOP > config.TOTAL_QUESTIONS) {
    throw new Error('MIN_QUESTIONS_FOR_STOP cannot be greater than TOTAL_QUESTIONS')
  }
  
  if (config.PILOT_QUESTIONS + config.SCORED_QUESTIONS > config.TOTAL_QUESTIONS) {
    throw new Error('PILOT_QUESTIONS + SCORED_QUESTIONS cannot be greater than TOTAL_QUESTIONS')
  }
  
  return true
}

// Export individual values for convenience
export const {
  TOTAL_QUESTIONS,
  SCORED_QUESTIONS,
  PILOT_QUESTIONS,
  MIN_QUESTIONS_FOR_STOP,
  MAX_QUESTIONS,
  SE_THRESHOLD,
  DURATION_HOURS,
  DURATION_SECONDS,
} = EXAM_CONFIG

// Validate configuration on import
validateExamConfig()
