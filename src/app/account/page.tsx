'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  User, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  Settings,
  History
} from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  totalExams: number
  averageAbility: number
  lastExamDate: string
  bestAbility: number
}

export default function AccountPage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch user data from the API
    // For now, we'll simulate loading
    setTimeout(() => {
      setUserStats({
        totalExams: 5,
        averageAbility: 1.23,
        lastExamDate: '2024-01-15',
        bestAbility: 2.15
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">
            Manage your exam history and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">user@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="text-gray-900">January 2024</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-6 w-6" />
                  <span>Recent Exams</span>
                </CardTitle>
                <CardDescription>
                  Your latest exam attempts and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock exam history */}
                  {[
                    { date: '2024-01-15', ability: 2.15, items: 28, duration: '45m' },
                    { date: '2024-01-10', ability: 1.89, items: 25, duration: '52m' },
                    { date: '2024-01-05', ability: 1.67, items: 22, duration: '38m' },
                  ].map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Exam #{exam.date}</p>
                          <p className="text-sm text-gray-600">
                            {exam.items} items • {exam.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">
                          θ = {exam.ability}
                        </Badge>
                        <Link href={`/results/${exam.date}`}>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Results
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Your Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {userStats?.totalExams}
                    </div>
                    <p className="text-sm text-gray-600">Total Exams</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {userStats?.averageAbility.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Average Ability</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {userStats?.bestAbility.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Best Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/exam" className="block">
                  <Button className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Start New Exam
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  View Certificates
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6" />
                  <span>Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>This Month</span>
                      <span>3/5 exams</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Goal Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
