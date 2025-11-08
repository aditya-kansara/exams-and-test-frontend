'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ExamState,
  TimerState,
  ItemPublic,
  ExamStartBatchResponse,
  AnswerBatchResponse,
  BatchAnswerItem,
} from '@/lib/types'

interface ExamStore extends ExamState {
  initializeFromBatch: (payload: ExamStartBatchResponse) => void
  recordAnswer: (answer: BatchAnswerItem) => void
  clearAnsweredQueue: () => void
  applyBatchResult: (payload: AnswerBatchResponse) => void
  enqueueInventory: (items: ItemPublic[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setStop: (stop: boolean) => void
  markComplete: () => void
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
  pilotStart: null,
  theta: null,
  se: null,
  learningRate: 0.5,
  position: 0,
  questionQueue: [],
  answeredQueue: [],
  currentQuestion: null,
  isComplete: false,
  isLoading: false,
  stop: false,
  error: null,
}

const initialTimerState: TimerState = {
  timeRemaining: 0,
  isRunning: false,
}

const splitInventory = (items: ItemPublic[]): { current: ItemPublic | null; queue: ItemPublic[] } => {
  if (!items.length) {
    return { current: null, queue: [] }
  }
  const [first, ...rest] = items
  return { current: first, queue: rest }
}

export const useExamStore = create<ExamStore>()((set, get) => ({
  ...initialExamState,
  timer: initialTimerState,

  initializeFromBatch: (payload) =>
    set(() => {
      const { current, queue } = splitInventory(payload.question_inventory)
      return {
        attemptId: payload.exam_attempt_id,
        pilotStart: payload.pilot_start_pos,
        theta: payload.theta,
        se: payload.se_theta,
        learningRate: payload.learning_rate,
        position: 0,
        questionQueue: queue,
        answeredQueue: [],
        currentQuestion: current,
        isComplete: false,
        isLoading: false,
        stop: current === null && queue.length === 0,
        error: null,
      }
    }),

  recordAnswer: (answer) =>
    set((state) => {
      if (!state.currentQuestion) {
        return state
      }

      const updatedAnswer: BatchAnswerItem = {
        ...answer,
        item_id: answer.item_id ?? state.currentQuestion.id,
      }

      const nextQueue = [...state.questionQueue]
      const nextCurrent = nextQueue.shift() ?? null

      return {
        answeredQueue: [...state.answeredQueue, updatedAnswer],
        questionQueue: nextQueue,
        currentQuestion: nextCurrent,
        position: state.position + 1,
      }
    }),

  clearAnsweredQueue: () => set({ answeredQueue: [] }),

  enqueueInventory: (items) =>
    set((state) => {
      if (!items.length) {
        return state
      }

      if (!state.currentQuestion) {
        const { current, queue } = splitInventory(items)
        return {
          currentQuestion: current,
          questionQueue: [...state.questionQueue, ...queue],
        }
      }

      return {
        questionQueue: [...state.questionQueue, ...items],
      }
    }),

  applyBatchResult: (payload) =>
    set((state) => {
      let currentQuestion = state.currentQuestion
      let questionQueue = state.questionQueue

      if (payload.question_inventory?.length) {
        if (!currentQuestion) {
          const { current, queue } = splitInventory(payload.question_inventory)
          currentQuestion = current
          questionQueue = [...questionQueue, ...queue]
        } else {
          questionQueue = [...questionQueue, ...payload.question_inventory]
        }
      }

      if (!currentQuestion && questionQueue.length) {
        const [next, ...rest] = questionQueue
        currentQuestion = next
        questionQueue = rest
      }

      return {
        theta: payload.theta,
        se: payload.se,
        learningRate: payload.learning_rate,
        position: payload.position,
        stop: payload.stop,
        answeredQueue: [],
        currentQuestion,
        questionQueue,
      }
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setStop: (stop) => set({ stop }),

  markComplete: () => set({ isComplete: true, stop: true }),

  resetExam: () =>
    set({
      ...initialExamState,
      timer: initialTimerState,
    }),

  setTimer: (timeRemaining) =>
    set((state) => ({
      timer: { ...state.timer, timeRemaining },
    })),

  startTimer: () =>
    set((state) => ({
      timer: { ...state.timer, isRunning: true },
    })),

  stopTimer: () =>
    set((state) => ({
      timer: { ...state.timer, isRunning: false, timeRemaining: 0 },
    })),

  tickTimer: () =>
    set((state) => {
      if (state.timer.isRunning && state.timer.timeRemaining > 0) {
        return {
          timer: { ...state.timer, timeRemaining: state.timer.timeRemaining - 1 },
        }
      }
      return state
    }),
}))

export const useCurrentQuestion = () => useExamStore((state) => state.currentQuestion)
export const useQuestionQueue = () => useExamStore((state) => state.questionQueue)
export const useAnsweredQueue = () => useExamStore((state) => state.answeredQueue)
export const useExamTimer = () => useExamStore((state) => state.timer)
export const useExamLoading = () => useExamStore((state) => state.isLoading)
export const useExamError = () => useExamStore((state) => state.error)
export const useExamComplete = () => useExamStore((state) => state.isComplete)
export const useExamStopFlag = () => useExamStore((state) => state.stop)
