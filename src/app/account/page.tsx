'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, Save } from 'lucide-react'

interface ProfileData {
  fullName: string
  displayName: string
  examDate: string
  amcNumber: string
  address: string
  email: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    displayName: '',
    examDate: '',
    amcNumber: '',
    address: '',
    email: user?.email || ''
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user?.email) {
      setProfileData(prev => ({
        ...prev,
        email: user.email || ''
      }))
    }
  }, [user])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.replace('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveMessage(null)
      
      // In a real app, this would save to the backend
      // For now, we'll simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage('Profile saved successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null)
      }, 3000)
    } catch (error) {
      console.error('Save error:', error)
      setSaveMessage('Error saving profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white text-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - ET Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8">
                  <Image
                    src="/Examsandtest logo.png"
                    alt="Exams And Test Logo"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Exams And Test
                </span>
              </Link>
            </div>

            {/* Right - Back to Dashboard and Logout buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100/50 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] transition-colors"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1c90a6] border border-transparent rounded-md hover:bg-[#0d7a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Setup</h1>
          <p className="text-gray-600">Complete your profile information</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c90a6] focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                value={profileData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c90a6] focus:border-transparent transition-colors"
                placeholder="Enter your display name"
                required
              />
            </div>

            {/* Date of Exams */}
            <div>
              <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Exams *
              </label>
              <input
                type="date"
                id="examDate"
                value={profileData.examDate}
                onChange={(e) => handleInputChange('examDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c90a6] focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* AMC Number */}
            <div>
              <label htmlFor="amcNumber" className="block text-sm font-medium text-gray-700 mb-2">
                AMC Number *
              </label>
              <input
                type="text"
                id="amcNumber"
                value={profileData.amcNumber}
                onChange={(e) => handleInputChange('amcNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c90a6] focus:border-transparent transition-colors"
                placeholder="Enter your AMC number"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                id="address"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c90a6] focus:border-transparent transition-colors resize-none"
                placeholder="Enter your address"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c90a6] focus:border-transparent transition-colors bg-gray-50"
                placeholder="Enter your email"
                required
                disabled
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed as it's linked to your account</p>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#1c90a6] hover:bg-[#0d7a8a] text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`mt-4 p-4 rounded-lg text-center font-medium ${
                saveMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {saveMessage}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}