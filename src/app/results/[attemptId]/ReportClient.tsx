'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExamResults } from '@/lib/types'
import { AbilityTrace } from '@/components/charts/AbilityTrace'
import { CoverageBar } from '@/components/charts/CoverageBar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Download, 
  Clock, 
  Target, 
  Brain, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Award,
  BarChart3,
  FileText
} from 'lucide-react'

interface ReportClientProps {
  attemptId: string
  results: ExamResults
}

export function ReportClient({ attemptId, results }: ReportClientProps) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // formatDuration function removed - not needed with new schema

  const getAbilityLevel = (theta: number) => {
    if (theta >= 2) return { level: 'Advanced', color: 'bg-[#1c90a6]/10 text-[#1c90a6]' }
    if (theta >= 1) return { level: 'Proficient', color: 'bg-[#1c90a6]/10 text-[#1c90a6]' }
    if (theta >= 0) return { level: 'Competent', color: 'bg-yellow-100 text-yellow-800' }
    if (theta >= -1) return { level: 'Developing', color: 'bg-orange-100 text-orange-800' }
    return { level: 'Beginner', color: 'bg-red-100 text-red-800' }
  }

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true)
    try {
      // Call the report generation API
      const response = await fetch(`/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attemptId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `exam-report-${attemptId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error generating report:', error)
      // For now, just show an alert - in production you'd want better error handling
      alert('Failed to generate report. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const abilityLevel = getAbilityLevel(results.theta_hat)
  // Since we don't have theta_trace in the new schema, we'll create a simple placeholder
  const chartData = [
    { theta: results.theta_hat, se: results.se_theta, item_number: 1 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Exam Results
              </h1>
              <p className="text-gray-600">
                Computer Adaptive Testing Analysis - {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleDownloadReport}
                disabled={isGeneratingReport}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>{isGeneratingReport ? 'Generating...' : 'Download PDF'}</span>
              </Button>
              <Link href="/exam">
                <Button className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Take Another Exam</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5 text-[#1c90a6]" />
                <span>Final Ability</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1c90a6] mb-2">
                {results.theta_hat.toFixed(2)}
              </div>
              <Badge className={abilityLevel.color}>
                {abilityLevel.level}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                SE: {results.se_theta.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-[#1c90a6]" />
                <span>Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1c90a6] mb-2">
                {results.total_items}
              </div>
              <p className="text-sm text-muted-foreground">
                Items completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Date(results.completed_at).toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Exam completion date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-600" />
                <span>Accuracy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2"> 
                {results.items_scored > 0 ? ((results.raw_score / results.items_scored) * 100).toFixed(0) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">
                Correct answers ({results.raw_score}/{results.items_scored})
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AbilityTrace data={chartData} />
          <CoverageBar results={results} />
        </div>

        {/* Summary Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span>Exam Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Raw Score:</span>
                    <span className="font-mono">{results.raw_score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Items Scored:</span>
                    <span>{results.items_scored}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Items:</span>
                    <span>{results.total_items}</span>
                  </div>
                  {results.scaled_score && (
                    <div className="flex justify-between text-sm">
                      <span>Scaled Score:</span>
                      <span className="font-mono">{results.scaled_score.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Ability Estimates</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Final Theta (θ):</span>
                    <span className="font-mono">{results.theta_hat.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Standard Error:</span>
                    <span className="font-mono">{results.se_theta.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confidence Interval:</span>
                    <span className="font-mono">
                      {results.theta_hat.toFixed(2)} ± {(results.se_theta * 1.96).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
          <Link href="/exam">
            <Button>
              Take Another Exam
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
