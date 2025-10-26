'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { apiClient, handleApiError } from '@/lib/api'
import { PasswordSetupModal } from '@/components/auth/PasswordSetupModal'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'password-setup'>('processing')
  const [message, setMessage] = useState<string>('Processing authentication...')
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<{
    email: string
    name?: string
    isNewUser: boolean
  } | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Handling OAuth callback...')
          console.log('URL:', window.location.href)
          console.log('Hash:', window.location.hash)
          console.log('Search params:', window.location.search)
        }
        
        // Handle the OAuth callback with Supabase
        const { data, error } = await supabase.auth.getSession()
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Session data:', data)
          console.log('Session error:', error)
        }
        
        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Session error:', error)
          }
          setStatus('error')
          setMessage('Authentication failed')
          setError(error.message)
          return
        }

        if (!data.session) {
          if (process.env.NODE_ENV === 'development') {
            console.log('No active session found')
          }
          setStatus('error')
          setMessage('No active session found')
          setError('Please try signing in again')
          return
        }

        const user = data.session.user
        
        // Check if user has email identity (password auth)
        const hasEmailIdentity = (user.identities || []).some(
          (identity: any) => identity.provider === 'email'
        )
        
        // Check if user has already set a password (using user_metadata)
        const hasPassword = user.user_metadata?.has_password === true
        
        if (!hasEmailIdentity && !hasPassword) {
          // New user who needs to set a password
          setUserInfo({
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name,
            isNewUser: true
          })
          setStatus('password-setup')
          setMessage('Please set a password to complete your account setup')
        } else {
          // Existing user or user who already has password
          setStatus('success')
          setMessage('Authentication successful!')
          
          // Redirect to home page after successful authentication
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } catch (err) {
        setStatus('error')
        setMessage('Authentication failed')
        setError(handleApiError(err))
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  const handlePasswordSetupComplete = () => {
    setStatus('success')
    setMessage('Account setup complete! Redirecting...')
    
    // Redirect to home page after successful password setup
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {status === 'processing' && <Loader2 className="h-6 w-6 animate-spin text-[#1c90a6]" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-[#1c90a6]" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
            {status === 'password-setup' && <Loader2 className="h-6 w-6 animate-spin text-[#1c90a6]" />}
            <span>Authentication</span>
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
              <p className="text-[#1c90a6] text-sm">
                You have been successfully authenticated. Redirecting to the home page...
              </p>
            </div>
          )}

          <div className="space-y-3">
            {status === 'error' && (
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            )}
            
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Continue to answersAndTests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Setup Modal for New Google Users */}
      {status === 'password-setup' && userInfo && (
        <PasswordSetupModal
          isOpen={true}
          userEmail={userInfo.email}
          userName={userInfo.name}
          onSuccess={handlePasswordSetupComplete}
        />
      )}
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#1c90a6]" />
              <span>Loading...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">Initializing authentication...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
