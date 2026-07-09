import { useEffect, useState } from 'react'

/** Re-renders once a second and returns elapsed ms since `startedAt`. */
export function useElapsedTime(startedAt: number | null): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (startedAt === null) return
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [startedAt])

  if (startedAt === null) return 0
  return Math.max(0, now - startedAt)
}
