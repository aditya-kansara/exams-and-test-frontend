/**
 * Payment Configuration
 * 
 * This file contains configurable payment settings that can be adjusted
 * for different testing scenarios (development, staging, production).
 */

// Default payment configuration
export const PAYMENT_CONFIG = {
  // Amount in cents (999 = $9.99)
  AMOUNT_CENTS: parseInt(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_CENTS || '999'),
  
  // Currency code
  CURRENCY: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || 'USD',
  
  // Display amount (for UI)
  DISPLAY_AMOUNT: process.env.NEXT_PUBLIC_PAYMENT_DISPLAY_AMOUNT || '$9.99',
  
  // Payment description
  DESCRIPTION: process.env.NEXT_PUBLIC_PAYMENT_DESCRIPTION || 'Detailed Exam Report',
  
  // Company name
  COMPANY_NAME: process.env.NEXT_PUBLIC_PAYMENT_COMPANY_NAME || 'Exams And Test',
}
