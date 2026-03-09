'use client'

import { useEffect, useState } from 'react'

interface UserIdWatermarkProps {
  email: string
}

interface WatermarkState {
  top: number
  left: number
  rotation: number
  visible: boolean
  nonce: number
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function UserIdWatermark({ email }: UserIdWatermarkProps) {
  const [state, setState] = useState<WatermarkState>({
    top: 50,
    left: 50,
    rotation: 0,
    visible: false,
    nonce: 0,
  })

  useEffect(() => {
    if (!email) return

    let cycleTimer: ReturnType<typeof setTimeout> | null = null
    let hideTimer: ReturnType<typeof setTimeout> | null = null

    const runCycle = () => {
      setState({
        top: getRandomInt(12, 88),
        left: getRandomInt(8, 92),
        rotation: getRandomInt(-24, 24),
        visible: true,
        nonce: Date.now(),
      })

      hideTimer = setTimeout(() => {
        setState((prev) => ({ ...prev, visible: false }))
      }, getRandomInt(3000, 5000))

      cycleTimer = setTimeout(runCycle, getRandomInt(7000, 15000))
    }

    runCycle()

    return () => {
      if (cycleTimer) clearTimeout(cycleTimer)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [email])

  if (!email) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div
        key={state.nonce}
        className={`absolute select-none whitespace-nowrap font-semibold tracking-[0.35em] text-slate-900/10 transition-opacity duration-500 ${
          state.visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: `${state.top}%`,
          left: `${state.left}%`,
          transform: `translate(-50%, -50%) rotate(${state.rotation}deg)`,
          fontSize: 'clamp(14px, 2vw, 24px)',
        }}
      >
        {email}
      </div>
    </div>
  )
}
