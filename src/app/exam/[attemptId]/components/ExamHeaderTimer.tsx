'use client'

import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import clsx from 'clsx'

type Props = {
  timeRemaining: number        // seconds left
  totalSeconds: number         // full exam length in seconds
  className?: string
}

export function ExamHeaderTimer({ timeRemaining, totalSeconds, className }: Props) {
  const seconds = Math.max(0, Math.floor(timeRemaining || 0))
  const pct = Math.max(0, Math.min(100, (seconds / Math.max(1, totalSeconds)) * 100))

  const isSub15m = seconds <= 15 * 60
  const isSub5m  = seconds <= 5 * 60
  const isSub10s = seconds <= 10

  const timeText = useMemo(() => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
  }, [seconds])

  // Keep it neutral until truly late time
  const tone = isSub5m ? 'red' : isSub15m ? 'amber' : 'neutral'
  const urgentClass = isSub10s ? 'motion-safe:animate-pulse' : ''

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      className={clsx(
        'rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur px-3 py-2 shadow-sm w-[220px]',
        'flex flex-col gap-1.5',
        className
      )}
    >
      {/* Top row: icon + time + tiny label */}
      <div className="flex items-center gap-2">
        <Clock className={clsx(
          'h-4 w-4',
          tone === 'red' ? 'text-red-600' :
          tone === 'amber' ? 'text-amber-600' : 'text-slate-500'
        )} aria-hidden="true" />
        <div className="flex-1 leading-none">
          <div className={clsx(
            'font-mono tabular-nums text-base tracking-tight min-w-[88px] text-slate-800',
            urgentClass
          )}>
            {timeText}
          </div>
          <div className="text-[11px] leading-none text-slate-500">Time remaining</div>
        </div>
        <div className="hidden sm:block text-[11px] text-slate-400 text-right min-w-[3.2ch]">{Math.round(pct)}%</div>
      </div>

      {/* Progress bar - slimmer and calmer */}
      <div className="h-1 w-full rounded-full bg-slate-200/80 overflow-hidden">
        <div
          className={clsx(
            'h-1 transition-[width] duration-500',
            tone === 'red' ? 'bg-red-500/90' :
            tone === 'amber' ? 'bg-amber-500/90' : 'bg-[#1c90a6]/90'
          )}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
