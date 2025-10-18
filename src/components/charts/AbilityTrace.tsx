'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartData } from '@/lib/types'

interface AbilityTraceProps {
  data: ChartData[]
  className?: string
}

export function AbilityTrace({ data, className }: AbilityTraceProps) {
  const formatTooltip = (value: number, name: string) => {
    if (name === 'theta') {
      return [`${value.toFixed(2)}`, 'Ability (θ)']
    }
    if (name === 'se') {
      return [`${value.toFixed(2)}`, 'Standard Error']
    }
    return [value, name]
  }

  return (
    <div className={`chart-container ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">Ability Estimation Trace</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="item_number" 
              label={{ value: 'Item Number', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Ability (θ)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={formatTooltip} />
            <Line 
              type="monotone" 
              dataKey="theta" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Shows how your ability estimate (θ) changes as you answer questions.
      </p>
    </div>
  )
}
