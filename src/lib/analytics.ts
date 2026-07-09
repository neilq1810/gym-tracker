import type { WorkoutSession } from '@/types'
import { getDayProgram, jsDayIndexToWorkoutDay } from '@/data/schedule'
import { sessionVolume } from './calculations'

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function isScheduledRestDay(date: Date): boolean {
  return getDayProgram(jsDayIndexToWorkoutDay(date.getDay())).category === 'rest'
}

function hasCompletedSessionOn(sessions: WorkoutSession[], dateStr: string): boolean {
  return sessions.some((s) => s.status === 'completed' && s.date === dateStr)
}

/**
 * Current adherence streak in days. Rest days don't break the streak;
 * a scheduled training day only extends it if it has a completed session.
 * Today is only counted once it has a completed workout, but an unfinished
 * "today" never breaks a streak built on prior days.
 */
export function currentStreak(sessions: WorkoutSession[], today: Date = new Date()): number {
  const completed = sessions.filter((s) => s.status === 'completed')
  let streak = 0
  const cursor = new Date(today)
  cursor.setHours(0, 0, 0, 0)

  const todayStr = toDateOnly(cursor)
  if (!isScheduledRestDay(cursor) && hasCompletedSessionOn(completed, todayStr)) {
    streak += 1
  }
  cursor.setDate(cursor.getDate() - 1)

  // Walk backwards indefinitely (bounded by a sane cap) until a missed training day.
  for (let i = 0; i < 3650; i++) {
    if (isScheduledRestDay(cursor)) {
      cursor.setDate(cursor.getDate() - 1)
      continue
    }
    const dateStr = toDateOnly(cursor)
    if (hasCompletedSessionOn(completed, dateStr)) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function totalWorkoutsCompleted(sessions: WorkoutSession[]): number {
  return sessions.filter((s) => s.status === 'completed').length
}

export function totalWeightLifted(sessions: WorkoutSession[]): number {
  return sessions
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + sessionVolume(s), 0)
}

export function weeklyVolume(sessions: WorkoutSession[], reference: Date = new Date()): number {
  const start = new Date(reference)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - 6)
  const startStr = toDateOnly(start)
  const endStr = toDateOnly(reference)

  return sessions
    .filter((s) => s.status === 'completed' && s.date >= startStr && s.date <= endStr)
    .reduce((sum, s) => sum + sessionVolume(s), 0)
}

export function monthlyVolume(sessions: WorkoutSession[], reference: Date = new Date()): number {
  const month = reference.getMonth()
  const year = reference.getFullYear()
  return sessions
    .filter((s) => {
      if (s.status !== 'completed') return false
      const d = new Date(s.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .reduce((sum, s) => sum + sessionVolume(s), 0)
}

/** Volume per calendar week for the last N weeks, oldest first — for charting. */
export function volumeByWeek(
  sessions: WorkoutSession[],
  weeks: number,
  reference: Date = new Date(),
): { label: string; volume: number }[] {
  const result: { label: string; volume: number }[] = []
  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date(reference)
    end.setHours(0, 0, 0, 0)
    end.setDate(end.getDate() - w * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    const startStr = toDateOnly(start)
    const endStr = toDateOnly(end)
    const volume = sessions
      .filter((s) => s.status === 'completed' && s.date >= startStr && s.date <= endStr)
      .reduce((sum, s) => sum + sessionVolume(s), 0)
    result.push({ label: `${start.getMonth() + 1}/${start.getDate()}`, volume })
  }
  return result
}
