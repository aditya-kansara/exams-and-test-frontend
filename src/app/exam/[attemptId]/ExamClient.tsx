'use client'

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { ExamStartBatchResponse, BatchAnswerItem, AnswerBatchResponse, ItemPublic } from '@/lib/types'
import { EXAM_CONFIG } from '@/config/exam'
import { apiClient, handleApiError } from '@/lib/api'
import { QuestionCard } from './components/QuestionCard'
import { ExamHeaderTimer } from './components/ExamHeaderTimer'
import { Button } from '@/components/ui/Button'

interface ExamClientProps {
  attemptId: string
  initialData: ExamStartBatchResponse
}

const BATCH_SIZE = 6

type ExamSessionState = {
  attemptId: number | null
  pilotStart: number | null
  theta: number | null
  se: number | null
  learningRate: number
  position: number
  questionQueue: ItemPublic[]
  answeredQueue: BatchAnswerItem[]
  currentQuestion: ItemPublic | null
  stop: boolean
  isComplete: boolean
}

type ExamAction =
  | { type: 'initialize'; payload: ExamStartBatchResponse }
  | { type: 'record_answer'; payload: BatchAnswerItem }
  | { type: 'apply_batch_result'; payload: AnswerBatchResponse }
  | { type: 'mark_complete' }
  | { type: 'clear_flushed_answers'; payload: BatchAnswerItem[] }

const initialExamState: ExamSessionState = {
  attemptId: null,
  pilotStart: null,
  theta: null,
  se: null,
  learningRate: 0.5,
  position: 0,
  questionQueue: [],
  answeredQueue: [],
  currentQuestion: null,
  stop: false,
  isComplete: false,
}

const splitInventory = (items: ItemPublic[]): { current: ItemPublic | null; queue: ItemPublic[] } => {
  if (!items.length) {
    return { current: null, queue: [] }
  }
  const [first, ...rest] = items
  return { current: first, queue: rest }
}

const examReducer = (state: ExamSessionState, action: ExamAction): ExamSessionState => {
  switch (action.type) {
    case 'initialize': {
      const { current, queue } = splitInventory(action.payload.question_inventory)
      return {
        attemptId: action.payload.exam_attempt_id,
        pilotStart: action.payload.pilot_start_pos,
        theta: action.payload.theta,
        se: action.payload.se_theta,
        learningRate: action.payload.learning_rate,
        position: 0,
        questionQueue: queue,
        answeredQueue: [],
        currentQuestion: current,
        stop: current === null && queue.length === 0,
        isComplete: false,
      }
    }
    case 'record_answer': {
      if (!state.currentQuestion) {
        return state
      }

      const updatedAnswer: BatchAnswerItem = {
        ...action.payload,
        item_id: action.payload.item_id ?? state.currentQuestion.id,
      }

      const nextQueue = [...state.questionQueue]
      const nextCurrent = nextQueue.shift() ?? null

      return {
        ...state,
        answeredQueue: [...state.answeredQueue, updatedAnswer],
        questionQueue: nextQueue,
        currentQuestion: nextCurrent,
        position: state.position + 1,
      }
    }
    case 'apply_batch_result': {
      let currentQuestion = state.currentQuestion
      let questionQueue = state.questionQueue

      if (action.payload.question_inventory?.length) {
        if (!currentQuestion) {
          const { current, queue } = splitInventory(action.payload.question_inventory)
          currentQuestion = current
          questionQueue = [...questionQueue, ...queue]
        } else {
          questionQueue = [...questionQueue, ...action.payload.question_inventory]
        }
      }

      if (!currentQuestion && questionQueue.length) {
        const [next, ...rest] = questionQueue
        currentQuestion = next
        questionQueue = rest
      }

      return {
        ...state,
        attemptId: action.payload.exam_attempt_id ?? state.attemptId,
        theta: action.payload.theta,
        se: action.payload.se,
        learningRate: action.payload.learning_rate,
        position: action.payload.position,
        stop: action.payload.stop,
        currentQuestion,
        questionQueue,
      }
    }
    case 'mark_complete':
      return {
        ...state,
        isComplete: true,
        stop: true,
      }
    case 'clear_flushed_answers': {
      if (!state.answeredQueue.length || !action.payload.length) {
        return state
      }
      const flushedKeys = new Set(
        action.payload.map((answer) => `${answer.item_id}-${answer.answered_at ?? ''}-${answer.selected_option}`)
      )
      return {
        ...state,
        answeredQueue: state.answeredQueue.filter(
          (answer) =>
            !flushedKeys.has(`${answer.item_id}-${answer.answered_at ?? ''}-${answer.selected_option}`)
        ),
      }
    }
    default:
      return state
  }
}
type TimerState = {
  timeRemaining: number
  isRunning: boolean
}

const initialTimerState: TimerState = {
  timeRemaining: EXAM_CONFIG.DURATION_SECONDS,
  isRunning: false,
}

export function ExamClient({ attemptId: _attemptId, initialData }: ExamClientProps) {
  const router = useRouter()

  const [examState, dispatch] = useReducer(examReducer, initialExamState)
  const examStateRef = useRef(examState)
  useEffect(() => {
    examStateRef.current = examState
  }, [examState])

  const [timer, setTimerState] = useState<TimerState>(initialTimerState)
  const [error, setError] = useState<string | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isFlushing, setIsFlushing] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

  const isInteractionLocked = isAnswering || isFinishing
  const { currentQuestion, questionQueue, answeredQueue, stop: stopFlag, position, isComplete } =
    examState
  const questionQueueLength = questionQueue.length
  const answeredQueueLength = answeredQueue.length

  const initializedAttemptRef = useRef<number | null>(null)
  const autoFinishTriggeredRef = useRef(false)
  const pendingFlushRef = useRef<{ force: boolean }>({ force: false })

  useEffect(() => {
    if (initializedAttemptRef.current === initialData.exam_attempt_id) {
      return
    }
    initializedAttemptRef.current = initialData.exam_attempt_id
    dispatch({ type: 'initialize', payload: initialData })
    setTimerState({ timeRemaining: EXAM_CONFIG.DURATION_SECONDS, isRunning: true })
    autoFinishTriggeredRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  useEffect(() => {
    if (!timer.isRunning) {
      return
    }
    const interval = setInterval(() => {
      setTimerState((prev) => {
        if (!prev.isRunning || prev.timeRemaining <= 0) {
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timer.isRunning])

  const flushAnswers = useCallback(
    async (
      force = false,
      override?: {
        answers: BatchAnswerItem[]
        remainingInventory: number
        currentPosition?: number
      }
    ) => {
      if (isFlushing) {
        const pendingForce = pendingFlushRef.current?.force ?? false
        pendingFlushRef.current = { force: pendingForce || force }
        return
      }
      pendingFlushRef.current = { force: false }
      const state = examStateRef.current
      const answers = override?.answers ?? state.answeredQueue
      if (!state.attemptId || answers.length === 0) {
        return
      }

      const buffered = answers.length
      const remainingInventory =
        override?.remainingInventory ??
        ((state.currentQuestion ? 1 : 0) + state.questionQueue.length)
      const queueMaxPosition =
        state.questionQueue.length > 0
          ? Math.max(...state.questionQueue.map((item) => item.position ?? 0))
          : 0
      const currentQuestionPosition = state.currentQuestion?.position ?? 0
      const computedPosition = Math.max(
        state.position,
        currentQuestionPosition,
        queueMaxPosition
      )
      const currentPosition = override?.currentPosition ?? computedPosition

      if (
        !force &&
        !(buffered >= 3 && buffered % 3 === 0 && (remainingInventory <= 3 || buffered >= 6))
      ) {
        return
      }

      try {
        setIsFlushing(true)
        setError(null)

        const payload = {
          exam_attempt_id: state.attemptId,
          answers,
          batch_size: BATCH_SIZE,
          learning_rate: state.learningRate,
          current_position: currentPosition,
        }

        const answersToFlush = answers.map((answer) => ({ ...answer }))
        const response = await apiClient.submitAnswerBatch(payload)
        dispatch({ type: 'apply_batch_result', payload: response })
        dispatch({ type: 'clear_flushed_answers', payload: answersToFlush })
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsFlushing(false)
      }
    },
    [dispatch, isFlushing]
  )

  useEffect(() => {
    if (isFlushing) {
      return
    }
    const pendingForce = pendingFlushRef.current?.force ?? false
    const hasPendingAnswers = examStateRef.current.answeredQueue.length > 0
    if (pendingForce || hasPendingAnswers) {
      pendingFlushRef.current = { force: false }
      void flushAnswers(pendingForce)
    }
  }, [isFlushing, flushAnswers])

  const finishExamFlow = useCallback(async () => {
    const latestState = examStateRef.current
    if (!latestState.attemptId || isFinishing) {
      return
    }

    try {
      setIsFinishing(true)
      const finishResult = await apiClient.finishExam({
        exam_attempt_id: latestState.attemptId,
      })
      dispatch({ type: 'mark_complete' })
      setTimerState((prev) => ({ ...prev, isRunning: false }))

      const finishData = {
        score: finishResult.theta_hat?.toString() ?? '0',
        theta: finishResult.theta_hat?.toString() ?? '0',
        se: finishResult.se_theta?.toString() ?? '1',
        completed: finishResult.completed_at,
      }

      const queryParams = new URLSearchParams(finishData).toString()
      router.push(`/results/${latestState.attemptId}/simple?${queryParams}`)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsFinishing(false)
    }
  }, [dispatch, isFinishing, router])

  useEffect(() => {
    if (!timer.isRunning || timer.timeRemaining > 0) {
      return
    }

    const handleTimeUp = async () => {
      setTimerState((prev) => ({ ...prev, isRunning: false }))
      const state = examStateRef.current
      if (state.answeredQueue.length > 0) {
        const remainingInventory =
          (state.currentQuestion ? 1 : 0) + state.questionQueue.length
        await flushAnswers(true, {
          answers: state.answeredQueue,
          remainingInventory,
        })
      }
      await finishExamFlow()
    }

    void handleTimeUp()
  }, [timer.isRunning, timer.timeRemaining, flushAnswers, finishExamFlow])

  useEffect(() => {
    if (isComplete || isFinishing || isFlushing || autoFinishTriggeredRef.current) {
      return
    }

    if (
      stopFlag &&
      !currentQuestion &&
      questionQueueLength === 0 &&
      answeredQueueLength === 0
    ) {
      autoFinishTriggeredRef.current = true
      void finishExamFlow()
    }
  }, [
    answeredQueueLength,
    currentQuestion,
    finishExamFlow,
    isComplete,
    isFinishing,
    isFlushing,
    questionQueueLength,
    stopFlag,
  ])

  const handleAnswerSubmit = async (selectedOption: number, responseTimeMs: number) => {
    const state = examStateRef.current
    const activeQuestion = state.currentQuestion
    if (!activeQuestion || isAnswering || isFinishing) {
      return
    }

    setIsAnswering(true)
    setError(null)

    try {
      const servedAt = new Date(Date.now() - responseTimeMs).toISOString()
      const answeredAt = new Date().toISOString()

      const answer: BatchAnswerItem = {
        item_id: activeQuestion.id,
        selected_option: selectedOption,
        response_time_ms: responseTimeMs,
        served_at: servedAt,
        answered_at: answeredAt,
      }

      const updatedAnsweredQueue = [...state.answeredQueue, answer]
      const nextQueue = [...state.questionQueue]
      const nextCurrent = nextQueue.shift() ?? null
      const remainingInventory = (nextCurrent ? 1 : 0) + nextQueue.length

      dispatch({ type: 'record_answer', payload: answer })

      const needsForcedFlush =
        state.stop || nextQueue.length === 0 || remainingInventory <= 3

      const answersCountAfter = state.position + 1
      const nextCurrentPosition = nextCurrent?.position ?? 0
      const queueMaxPosition =
        nextQueue.length > 0
          ? Math.max(...nextQueue.map((item) => item.position ?? 0))
          : 0
      const currentPosition = Math.max(
        answersCountAfter,
        nextCurrentPosition,
        queueMaxPosition
      )
      const flushContext = {
        answers: updatedAnsweredQueue,
        remainingInventory,
        currentPosition,
      }

      if (isFlushing) {
        const pendingForce = pendingFlushRef.current?.force ?? false
        pendingFlushRef.current = { force: pendingForce || needsForcedFlush }
      } else if (needsForcedFlush) {
        void flushAnswers(true, flushContext)
      } else {
        void flushAnswers(false, flushContext)
      }
    } finally {
      setIsAnswering(false)
    }
  }

  const isLastQuestion = useMemo(() => {
    return Boolean(currentQuestion && stopFlag && questionQueueLength === 0)
  }, [currentQuestion, stopFlag, questionQueueLength])

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1c90a6] mb-4">Exam Complete!</h1>
          <Button onClick={() => router.push('/dashboard')} className="px-8 py-3 text-lg">
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="sticky top-4 z-40 flex justify-end">
        <ExamHeaderTimer
          timeRemaining={timer.timeRemaining}
          totalSeconds={EXAM_CONFIG.DURATION_SECONDS}
        />
      </div>

      {error && (
        <div className="fixed top-4 left-4 right-4 z-10 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <div className="w-full h-screen px-8 py-8">
        {currentQuestion ? (
          <QuestionCard
            item={currentQuestion}
            onSubmit={handleAnswerSubmit}
            isLoading={isInteractionLocked}
            questionNumber={currentQuestion.position ?? position + 1}
            isLastQuestion={isLastQuestion}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-600 text-lg">
              {isFlushing ? 'Loading next set of questions...' : 'Processing responses...'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
