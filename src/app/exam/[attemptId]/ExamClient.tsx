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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

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
  isPaused: boolean
}

const initialTimerState: TimerState = {
  timeRemaining: EXAM_CONFIG.DURATION_SECONDS,
  isRunning: false,
  isPaused: false,
}

const MAX_VIOLATIONS = 3

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
  const [violationCount, setViolationCount] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningType, setWarningType] = useState<'tab' | 'fullscreen' | null>(null)
  const [isTabFocused, setIsTabFocused] = useState(true)
  const [showFullscreenDialog, setShowFullscreenDialog] = useState(false)
  const tabBlurTimeRef = useRef<number | null>(null)
  const isHandlingViolationRef = useRef(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const warningTypeRef = useRef<'tab' | 'fullscreen' | null>(null)
  const violationCountRef = useRef(0)
  const fullscreenEnteredOnceRef = useRef(false) // Track if fullscreen was successfully entered at least once

  const isInteractionLocked = isAnswering || isFinishing
  const { currentQuestion, questionQueue, answeredQueue, stop: stopFlag, position, isComplete } =
    examState
  const questionQueueLength = questionQueue.length
  const answeredQueueLength = answeredQueue.length

  const initializedAttemptRef = useRef<number | null>(null)
  const autoFinishTriggeredRef = useRef(false)
  const pendingFlushRef = useRef<{ force: boolean }>({ force: false })
  const finishExamFlowRef = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    if (initializedAttemptRef.current === initialData.exam_attempt_id) {
      return
    }
    initializedAttemptRef.current = initialData.exam_attempt_id
    dispatch({ type: 'initialize', payload: initialData })
    
    // Start timer immediately
    const durationSeconds = EXAM_CONFIG.DURATION_SECONDS
    console.log('Initializing exam timer:', { durationSeconds, durationHours: durationSeconds / 3600 })
    setTimerState({ timeRemaining: durationSeconds, isRunning: true, isPaused: false })
    
    autoFinishTriggeredRef.current = false
    setViolationCount(0)
    violationCountRef.current = 0
    setShowWarningModal(false)
    setWarningType(null)
    warningTypeRef.current = null
    setIsTabFocused(true)
    tabBlurTimeRef.current = null
    isHandlingViolationRef.current = false
    fullscreenEnteredOnceRef.current = false
    
    // Show fullscreen dialog first, then request fullscreen after user confirms
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      setShowFullscreenDialog(true)
    }, 100)
    
    // Also try to request fullscreen when window becomes visible/focused
    const handleWindowFocus = async () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
      
      // Only try to request fullscreen if exam is running and not already in fullscreen
      if (!isCurrentlyFullscreen && !document.hidden && document.hasFocus() && timer.isRunning) {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen()
            setIsFullscreen(true)
            fullscreenEnteredOnceRef.current = true
          } else if ((document.documentElement as any).webkitRequestFullscreen) {
            await (document.documentElement as any).webkitRequestFullscreen()
            setIsFullscreen(true)
            fullscreenEnteredOnceRef.current = true
          } else if ((document.documentElement as any).mozRequestFullScreen) {
            await (document.documentElement as any).mozRequestFullScreen()
            setIsFullscreen(true)
            fullscreenEnteredOnceRef.current = true
          } else if ((document.documentElement as any).msRequestFullscreen) {
            await (document.documentElement as any).msRequestFullscreen()
            setIsFullscreen(true)
            fullscreenEnteredOnceRef.current = true
          }
        } catch (error) {
          // Silently fail - don't show warning on focus if fullscreen wasn't entered yet
          // Only warn if user exits after successfully entering fullscreen
        }
      }
    }
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void handleWindowFocus()
      }
    }
    
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isFullscreen])

  // Security measures: prevent right-click, copy/paste, text selection, image interactions
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent copy, cut, paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'C' || e.key === 'V' || e.key === 'A')) {
        e.preventDefault()
        return false
      }
      // Also prevent Ctrl+X (cut), Ctrl+S (save), Ctrl+P (print)
      if (e.ctrlKey && (e.key === 'x' || e.key === 'X' || e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault()
        return false
      }
    }

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)

    // Add CSS to prevent text selection and image interactions
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      img {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.head.removeChild(style)
    }
  }, [])

  // Fullscreen detection - check periodically and on events
  useEffect(() => {
    if (isComplete || isFinishing) {
      return
    }

    const checkFullscreen = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )

      setIsFullscreen(isCurrentlyFullscreen)

      // Only show warning if fullscreen was successfully entered at least once, then user exited
      if (!isCurrentlyFullscreen && timer.isRunning && !isComplete && !isFinishing) {
        // Only trigger violation if:
        // 1. Fullscreen was entered at least once (user successfully entered, then exited)
        // 2. We're not already handling a violation
        if (fullscreenEnteredOnceRef.current && isHandlingViolationRef.current === false && timer.isRunning) {
          isHandlingViolationRef.current = true
          setViolationCount((prev) => {
            const newCount = prev + 1
            violationCountRef.current = newCount
            if (newCount >= MAX_VIOLATIONS) {
              // End exam immediately after 3 violations
              setTimerState((prev) => ({ ...prev, isRunning: false, isPaused: false }))
              const finishFn = finishExamFlowRef.current
              if (finishFn) {
                void finishFn()
              }
              isHandlingViolationRef.current = false
              return newCount
            }
            // Show warning modal
            setWarningType('fullscreen')
            warningTypeRef.current = 'fullscreen'
            setShowWarningModal(true)
            isHandlingViolationRef.current = false
            return newCount
          })
        }
      } else if (isCurrentlyFullscreen) {
        // User is in fullscreen - mark that fullscreen was successfully entered
        fullscreenEnteredOnceRef.current = true
        isHandlingViolationRef.current = false
        // Close warning modal if it was a fullscreen violation
        if (warningTypeRef.current === 'fullscreen' && violationCountRef.current < MAX_VIOLATIONS) {
          setShowWarningModal(false)
        }
      }
    }

    const handleFullscreenChange = () => {
      checkFullscreen()
    }

    // Check immediately
    checkFullscreen()

    // Check periodically (every 2 seconds) to catch cases where events don't fire
    const checkInterval = setInterval(() => {
      if (timer.isRunning && !isComplete && !isFinishing) {
        checkFullscreen()
      }
    }, 2000)

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      clearInterval(checkInterval)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [isComplete, isFinishing, timer.isRunning])

  // Tab focus detection
  useEffect(() => {
    if (isComplete || isFinishing) {
      return
    }

    const handleTabBlur = () => {
      // Prevent double-counting violations
      if (isHandlingViolationRef.current) {
        return
      }

      const currentTimer = timer

      // Only trigger if exam is running and not already paused
      if (currentTimer.isRunning && !currentTimer.isPaused) {
        isHandlingViolationRef.current = true
        setIsTabFocused(false)
        tabBlurTimeRef.current = Date.now()
        
        // Pause the timer
        setTimerState((prev) => ({ ...prev, isPaused: true }))
        
        // Increment violation count
        setViolationCount((prev) => {
          const newCount = prev + 1
          if (newCount >= MAX_VIOLATIONS) {
            // End exam immediately after 3 violations
            setTimerState((prev) => ({ ...prev, isRunning: false, isPaused: false }))
            const finishFn = finishExamFlowRef.current
            if (finishFn) {
              void finishFn()
            }
            isHandlingViolationRef.current = false
            return newCount
          }
          // Show warning modal
          setWarningType('tab')
          warningTypeRef.current = 'tab'
          setShowWarningModal(true)
          isHandlingViolationRef.current = false
          violationCountRef.current = newCount
          return newCount
        })
      }
    }

    const handleTabFocus = () => {
      if (!isTabFocused && timer.isPaused) {
        setIsTabFocused(true)
        tabBlurTimeRef.current = null
        isHandlingViolationRef.current = false
        
        if (violationCountRef.current < MAX_VIOLATIONS) {
          setTimerState((prev) => ({ ...prev, isPaused: false }))
          // Only close warning if it's a tab violation and user returned to tab
          if (warningTypeRef.current === 'tab') {
            setShowWarningModal(false)
          }
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab lost focus (switched tabs or minimized window)
        handleTabBlur()
      } else {
        // Tab regained focus
        handleTabFocus()
      }
    }

    const handleBlur = () => {
      // Window blur (switched to another app, but tab might still be visible)
      // Only trigger if document is not hidden (to avoid double-triggering with visibilitychange)
      if (!document.hidden) {
        handleTabBlur()
      }
    }

    const handleFocus = () => {
      // Window focus (returned to the app)
      if (!document.hidden) {
        handleTabFocus()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isTabFocused, timer.isRunning, timer.isPaused, violationCount, isComplete, isFinishing])

  useEffect(() => {
    if (!timer.isRunning || timer.isPaused) {
      console.log('Timer not running or paused:', { isRunning: timer.isRunning, isPaused: timer.isPaused, timeRemaining: timer.timeRemaining })
      return
    }
    
    console.log('Timer started:', { timeRemaining: timer.timeRemaining, isRunning: timer.isRunning, isPaused: timer.isPaused })
    
    const interval = setInterval(() => {
      setTimerState((prev) => {
        if (!prev.isRunning || prev.isPaused || prev.timeRemaining <= 0) {
          if (prev.timeRemaining <= 0) {
            console.log('Timer reached zero')
          }
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)
    
    return () => {
      console.log('Timer interval cleared')
      clearInterval(interval)
    }
  }, [timer.isRunning, timer.isPaused])

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

  // Keep ref updated with latest finishExamFlow
  useEffect(() => {
    finishExamFlowRef.current = finishExamFlow
  }, [finishExamFlow])

  // Keep refs in sync with state
  useEffect(() => {
    violationCountRef.current = violationCount
  }, [violationCount])

  useEffect(() => {
    warningTypeRef.current = warningType
  }, [warningType])

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

      {/* Fullscreen Consent Dialog */}
      <Dialog 
        open={showFullscreenDialog} 
        onOpenChange={() => {}} // Prevent closing without user action
      >
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#1c90a6]">
              Fullscreen Required
            </DialogTitle>
            <DialogDescription className="pt-2">
              This exam must be taken in fullscreen mode. Please enter fullscreen to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowFullscreenDialog(false)
                // Redirect back to exam page if user declines
                router.push('/exam')
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setShowFullscreenDialog(false)
                // Request fullscreen after user confirms
                try {
                  let fullscreenPromise: Promise<void> | null = null
                  
                  if (document.documentElement.requestFullscreen) {
                    fullscreenPromise = document.documentElement.requestFullscreen() as Promise<void>
                  } else if ((document.documentElement as any).webkitRequestFullscreen) {
                    fullscreenPromise = (document.documentElement as any).webkitRequestFullscreen()
                  } else if ((document.documentElement as any).mozRequestFullScreen) {
                    fullscreenPromise = (document.documentElement as any).mozRequestFullScreen()
                  } else if ((document.documentElement as any).msRequestFullscreen) {
                    fullscreenPromise = (document.documentElement as any).msRequestFullscreen()
                  }
                  
                  if (fullscreenPromise) {
                    await fullscreenPromise
                    setIsFullscreen(true)
                    fullscreenEnteredOnceRef.current = true
                    console.log('Fullscreen entered successfully after user consent')
                  } else {
                    console.warn('Fullscreen API not available in this browser')
                    // Continue anyway - browser doesn't support fullscreen
                    fullscreenEnteredOnceRef.current = true
                  }
                } catch (error: any) {
                  console.error('Error requesting fullscreen:', error)
                  // If user denies, show warning but continue
                  if (error.name === 'NotAllowedError') {
                    setWarningType('fullscreen')
                    warningTypeRef.current = 'fullscreen'
                    setViolationCount((prev) => {
                      const newCount = prev + 1
                      violationCountRef.current = newCount
                      setShowWarningModal(true)
                      return newCount
                    })
                  }
                }
              }}
              className="flex-1"
            >
              Enter Fullscreen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified Warning Modal for All Violations */}
      <Dialog 
        open={showWarningModal} 
        onOpenChange={(open) => {
          // Only allow closing if user has fixed the violation
          if (!open) {
            if (warningType === 'tab' && isTabFocused && violationCount < MAX_VIOLATIONS) {
              setShowWarningModal(false)
            } else if (warningType === 'fullscreen' && isFullscreen && violationCount < MAX_VIOLATIONS) {
              setShowWarningModal(false)
            }
            // Otherwise, prevent closing
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-md" 
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {warningType === 'fullscreen' ? 'Fullscreen Required' : 'Warning: Exam Violation'}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {warningType === 'fullscreen'
                ? 'The exam must be taken in fullscreen mode. Please return to fullscreen to continue.'
                : 'You have switched away from the exam tab or window. This is a violation of exam rules.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 font-medium mb-2">
                Total Violations: {violationCount} / {MAX_VIOLATIONS}
              </p>
              <p className="text-sm text-amber-700">
                {violationCount >= MAX_VIOLATIONS - 1
                  ? '⚠️ This is your final warning. One more violation (tab switch or fullscreen exit) will result in the exam being terminated.'
                  : 'Please keep the exam tab focused and remain in fullscreen mode at all times. The exam will be automatically terminated after 3 total violations.'}
              </p>
            </div>
          </div>
          <DialogFooter>
            {warningType === 'fullscreen' ? (
              <Button
                onClick={async () => {
                  try {
                    if (document.documentElement.requestFullscreen) {
                      await document.documentElement.requestFullscreen()
                    } else if ((document.documentElement as any).webkitRequestFullscreen) {
                      await (document.documentElement as any).webkitRequestFullscreen()
                    } else if ((document.documentElement as any).mozRequestFullScreen) {
                      await (document.documentElement as any).mozRequestFullScreen()
                    } else if ((document.documentElement as any).msRequestFullscreen) {
                      await (document.documentElement as any).msRequestFullscreen()
                    }
                    if (violationCount < MAX_VIOLATIONS) {
                      setShowWarningModal(false)
                    }
                  } catch (error) {
                    console.error('Error requesting fullscreen:', error)
                    alert('Unable to enter fullscreen. Please press F11 or use your browser\'s fullscreen option.')
                  }
                }}
                className="w-full"
              >
                Return to Fullscreen
              </Button>
            ) : (
              <div className="w-full text-center text-sm text-slate-600">
                Please return to the exam tab to continue.
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exam Terminated Modal */}
      {violationCount >= MAX_VIOLATIONS && !isComplete && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Exam Terminated
              </DialogTitle>
              <DialogDescription className="pt-2">
                Your exam has been terminated due to multiple violations (tab switches or fullscreen exits).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Total Violations: {violationCount}
                </p>
                <p className="text-sm text-red-700">
                  You exceeded the maximum allowed violations ({MAX_VIOLATIONS}). The exam has been automatically ended.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (isFinishing || isComplete) {
                    router.push('/dashboard')
                  }
                }}
                className="w-full"
              >
                {isFinishing ? 'Processing...' : 'Return to Dashboard'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="w-full h-screen px-8 py-8">
        {currentQuestion ? (
          <QuestionCard
            item={currentQuestion}
            onSubmit={handleAnswerSubmit}
            isLoading={isInteractionLocked || timer.isPaused}
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
