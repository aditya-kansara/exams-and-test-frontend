'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, AlertCircle, Database, UserPlus } from 'lucide-react'

export default function SetupPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setError(null)
    setSeedResult(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/api/v1/exam/seed/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setSeedResult(`Successfully seeded ${result.items_inserted} items across ${result.categories} categories`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed database')
    } finally {
      setIsSeeding(false)
    }
  }

  const handleCreateTestUser = async () => {
    try {
      // This would create a test user if needed
      // For now, we'll just show instructions
      alert('Test user creation not implemented yet. Use the registration form with test@example.com')
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to create test user:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Backend Setup
          </h1>
          <p className="text-gray-600">
            Initialize your backend database and test data
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-[#1c90a6]" />
                <span>Database Setup</span>
              </CardTitle>
              <CardDescription>
                Seed the database with sample exam questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  This will add 18 sample questions across 6 categories with proper IRT parameters.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Adult Health (Medicine) - 3 questions</li>
                  <li>• Adult Health (Surgery) - 3 questions</li>
                  <li>• Child Health - 3 questions</li>
                  <li>• Mental Health - 3 questions</li>
                  <li>• Women's Health - 3 questions</li>
                  <li>• Population Health - 3 questions</li>
                </ul>
              </div>

              <Button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="w-full"
              >
                {isSeeding ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Seeding Database...</span>
                  </div>
                ) : (
                  'Seed Database'
                )}
              </Button>

              {seedResult && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-[#1c90a6]">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Success</span>
                  </div>
                  <p className="text-[#1c90a6] text-sm mt-1">{seedResult}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test User Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-6 w-6 text-[#1c90a6]" />
                <span>Test User</span>
              </CardTitle>
              <CardDescription>
                Create a test user for authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Use these credentials to test the authentication system:
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm space-y-1">
                    <p><strong>Email:</strong> test@example.com</p>
                    <p><strong>Password:</strong> password123</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateTestUser}
                variant="outline"
                className="w-full"
              >
                Create Test User
              </Button>

              <div className="text-xs text-gray-500">
                <p>Note: You can also register a new user using the registration form.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Check */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Backend Status</CardTitle>
            <CardDescription>
              Check if your FastAPI backend is running and accessible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Backend Connection:</span>
                <Badge variant="outline">{process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}</Badge>
              </div>
              <Button variant="outline" size="sm">
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Start Backend Server</h4>
                <p className="text-gray-600">
                  Make sure your FastAPI backend is running on {process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Seed Database</h4>
                <p className="text-gray-600">
                  Click "Seed Database" above to add sample questions to your database.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Create Test User</h4>
                <p className="text-gray-600">
                  Register a new user or use the test credentials to authenticate.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">4. Start Exam</h4>
                <p className="text-gray-600">
                  Go back to the main page and start your first adaptive exam!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
