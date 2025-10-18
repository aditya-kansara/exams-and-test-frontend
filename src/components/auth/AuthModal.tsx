'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { handleApiError } from '@/lib/api'
import { AlertCircle, User, Lock, Mail, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  provider?: 'google' | 'email' | 'both'
}

type AuthMode = 'login'

export function AuthModal({ isOpen, onClose, onSuccess, provider = 'google' }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (authMode === 'login') {
        // Use Supabase for email/password login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        
        if (error) {
          setError(error.message)
          return
        }
        
        if (data.user) {
          // Authentication successful - AuthContext will handle the session
          onSuccess()
          onClose()
        }
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const resetForm = () => {
    setFormData({ email: '', password: '' })
    setError(null)
    setSuccessMessage(null)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setError(error.message)
        setIsLoading(false)
      }
      // If successful, the user will be redirected to Google OAuth
    } catch (err) {
      setError(handleApiError(err))
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    return 'Sign In / Register'
  }

  const getDescription = () => {
    return 'New users: Register with Google. Existing users: Login with Google or email/password'
  }

  const getSubmitText = () => {
    return 'Sign In'
  }

  const getLoadingText = () => {
    return 'Signing in...'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>


        {/* Google OAuth Button */}
        {(provider === 'google' || provider === 'both') && (
          <div className="mb-4">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600 mb-1">New users: Register with Google only</p>
              <p className="text-xs text-gray-500">Existing users: Login with Google or email/password below</p>
            </div>
            <Button
              type="button"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </Button>
          </div>
        )}

        {/* Divider */}
        {(provider === 'both') && (
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or login with email/password</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Success</span>
              </div>
              <p className="text-green-600 text-sm mt-1">{successMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{getLoadingText()}</span>
              </div>
            ) : (
              getSubmitText()
            )}
          </Button>

          {/* Registration Policy Note */}
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <strong>Registration Policy:</strong> New users must register with Google OAuth. 
              Email/password login is only available for existing users who have set a password.
            </p>
          </div>

        </form>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Test Credentials:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Email:</strong> testuser@mail.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setFormData({
                  email: 'testuser@mail.com',
                  password: 'password123'
                })
              }}
            >
              Fill Test Credentials
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}