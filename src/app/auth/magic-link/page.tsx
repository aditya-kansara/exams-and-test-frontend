'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { apiClient, handleApiError } from '@/lib/api'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function MagicLinkContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState<string>('Verifying magic link...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyMagicLink = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('No verification token found')
        setError('Invalid magic link. Please try again.')
        return
      }

      try {
        const tokenData = await apiClient.verifyMagicLink(token)
        setStatus('success')
        setMessage('Magic link verified successfully!')
        
        // Redirect to home page after successful verification
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (err) {
        setStatus('error')
        setMessage('Magic link verification failed')
        setError(handleApiError(err))
      }
    }

    verifyMagicLink()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {status === 'verifying' && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
            <span>Magic Link Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">{message}</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-green-600 text-sm">
                You have been successfully authenticated. Redirecting to the home page...
              </p>
            </div>
          )}

          <div className="space-y-3">
            {status === 'error' && (
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            )}
            
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              Continue to answersAndTests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MagicLinkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span>Loading...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">Initializing magic link verification...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <MagicLinkContent />
    </Suspense>
  )
}
