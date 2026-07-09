import { useEffect, useState } from 'react'
import { useRestTimerStore } from '@/store/useRestTimerStore'

/** Re-renders every second while the rest timer is running and reports remaining seconds. */
export function useRestTimerTick() {
  const endAt = useRestTimerStore((s) => s.endAt)
  const totalSeconds = useRestTimerStore((s) => s.totalSeconds)
  const [, forceTick] = useState(0)

  useEffect(() => {
    if (endAt === null) return
    const interval = window.setInterval(() => forceTick((n) => n + 1), 250)
    return () => window.clearInterval(interval)
  }, [endAt])

  const remainingMs = endAt === null ? 0 : Math.max(0, endAt - Date.now())
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const isRunning = endAt !== null && remainingMs > 0
  const isDone = endAt !== null && remainingMs <= 0
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0

  return { remainingSeconds, totalSeconds, isRunning, isDone, progress }
}
