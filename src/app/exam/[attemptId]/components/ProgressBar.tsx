'use client'

interface ProgressBarProps {
  currentPosition: number
  totalItems?: number // Optional since we don't know total in adaptive testing
}

export function ProgressBar({ currentPosition, totalItems }: ProgressBarProps) {
  // For adaptive testing, we don't know the total items, so we show current position
  const displayText = totalItems 
    ? `${currentPosition} of ${totalItems} questions`
    : `Question ${currentPosition}`

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700">Exam Progress</span>
        <span className="text-gray-600">{displayText}</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill bg-blue-500 h-2 rounded transition-all duration-300"
          style={{ width: totalItems ? `${Math.min((currentPosition / totalItems) * 100, 100)}%` : '0%' }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        {totalItems 
          ? `${((currentPosition / totalItems) * 100).toFixed(1)}% complete`
          : 'Adaptive testing in progress'
        }
      </div>
    </div>
  )
}
