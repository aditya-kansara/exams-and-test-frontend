'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExamState, TimerState, AnswerSubmitRequest, ItemPublic, ExamStartResponse } from '@/lib/types'

interface ExamStore extends ExamState {
  // Actions
  setAttemptId: (attemptId: number) => void
  setCurrentItem: (item: ItemPublic | null) => void
  setPosition: (position: number) => void
  addResponse: (response: AnswerSubmitRequest) => void
  setComplete: (isComplete: boolean) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  resetExam: () => void
  
      // Timer actions
      setTimer: (timeRemaining: number) => void
      startTimer: () => void
      stopTimer: () => void
      tickTimer: () => void
  
  // Timer state
  timer: TimerState
}

const initialExamState: ExamState = {
  attemptId: null,
  currentItem: null,
  position: null,
  responses: [],
  isComplete: false,
  isLoading: false,
  error: null,
}

const initialTimerState: TimerState = {
  timeRemaining: 0,
  isRunning: false,
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      ...initialExamState,
      timer: initialTimerState,

      // Exam actions
      setAttemptId: (attemptId) => set({ attemptId }),
      
      setCurrentItem: (currentItem) => set({ currentItem }),
      
      setPosition: (position) => set({ position }),
      
      addResponse: (response) => set((state) => ({
        responses: [...state.responses, response]
      })),
      
      setComplete: (isComplete) => set({ isComplete }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      resetExam: () => set({
        ...initialExamState,
        timer: initialTimerState
      }),

      // Timer actions
      setTimer: (timeRemaining) => set((state) => ({
        timer: { ...state.timer, timeRemaining }
      })),

      startTimer: () => set((state) => ({
        timer: { ...state.timer, isRunning: true }
      })),

      stopTimer: () => set((state) => ({
        timer: { ...state.timer, isRunning: false, timeRemaining: 0 }
      })),

      tickTimer: () => set((state) => {
        if (state.timer.isRunning && state.timer.timeRemaining > 0) {
          return {
            timer: { ...state.timer, timeRemaining: state.timer.timeRemaining - 1 }
          }
        }
        return state
      }),
    }),
    {
      name: 'exam-store',
      // Only persist essential data, not UI state
      partialize: (state) => ({
        attemptId: state.attemptId,
        responses: state.responses,
        isComplete: state.isComplete,
        timer: {
          timeRemaining: state.timer.timeRemaining,
          isRunning: false, // Don't persist running state
          isPaused: false,  // Don't persist paused state
        }
      }),
    }
  )
)

// Utility selectors - cleaned up unused ones
export const useCurrentItem = () => useExamStore((state) => state.currentItem)
export const useExamResponses = () => useExamStore((state) => state.responses)
export const useExamTimer = () => useExamStore((state) => state.timer)
export const useExamLoading = () => useExamStore((state) => state.isLoading)
export const useExamError = () => useExamStore((state) => state.error)
export const useExamComplete = () => useExamStore((state) => state.isComplete)
