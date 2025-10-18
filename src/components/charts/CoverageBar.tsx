'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ExamResults } from '@/lib/types'

interface CoverageBarProps {
  results: ExamResults
  className?: string
}

interface CoverageData {
  content_area: string
  answered: number
  total: number
  percentage: number
}

export function CoverageBar({ results, className }: CoverageBarProps) {
  // Since we don't have content areas in the new schema, create a simple summary
  const coverageData: CoverageData[] = [{
    content_area: 'Total Items',
    answered: results.total_items,
    total: results.total_items,
    percentage: 100
  }]

  const formatTooltip = (value: number, name: string, props: any) => {
    const payload = props.payload
    if (name === 'answered') {
      return [`${value} items`, 'Answered']
    }
    if (name === 'total') {
      return [`${value} items`, 'Total Available']
    }
    return [value, name]
  }

  return (
    <div className={`chart-container ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">Content Area Coverage</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={coverageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="content_area" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis label={{ value: 'Items', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={formatTooltip} />
            <Bar 
              dataKey="answered" 
              fill="#10b981" 
              name="answered"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {coverageData.map((area) => (
          <div key={area.content_area} className="text-sm">
            <div className="flex justify-between">
              <span className="font-medium">{area.content_area}</span>
              <span className="text-muted-foreground">
                {area.answered} items
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(area.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
