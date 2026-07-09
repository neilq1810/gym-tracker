import type {
  PersonalRecord,
  ProgressiveOverloadSuggestion,
  SetEntry,
  WorkoutExerciseLog,
  WorkoutSession,
} from '@/types'

/** Sets that count toward volume/PR/progression math (logged, non-warmup, completed). */
export function workingSets(sets: SetEntry[]): SetEntry[] {
  return sets.filter((s) => s.completed && !s.isWarmup && s.weight > 0 && s.reps > 0)
}

/** Estimated 1RM via the Epley formula. A single-rep set is its own max. */
export function estimateOneRm(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

export function setVolume(set: SetEntry): number {
  return set.weight * set.reps
}

export function exerciseVolume(log: WorkoutExerciseLog): number {
  return workingSets(log.sets).reduce((sum, s) => sum + setVolume(s), 0)
}

export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((sum, log) => sum + exerciseVolume(log), 0)
}

/** The single set with the highest estimated 1RM in a log, or null if none logged. */
export function bestSetOfLog(log: WorkoutExerciseLog): SetEntry | null {
  const sets = workingSets(log.sets)
  if (sets.length === 0) return null
  return sets.reduce((best, s) =>
    estimateOneRm(s.weight, s.reps) > estimateOneRm(best.weight, best.reps) ? s : best,
  )
}

/**
 * Finds the most recent completed session (before `beforeDate`, if given)
 * that logged the given exercise — used to show "previous workout" numbers.
 */
export function findPreviousLog(
  sessions: WorkoutSession[],
  exerciseId: string,
  beforeDate?: string,
  excludeSessionId?: string,
): { session: WorkoutSession; log: WorkoutExerciseLog } | null {
  const candidates = sessions
    .filter((s) => s.status === 'completed' && s.id !== excludeSessionId)
    .filter((s) => (beforeDate ? s.date < beforeDate : true))
    .sort((a, b) => b.date.localeCompare(a.date) || b.startedAt - a.startedAt)

  for (const session of candidates) {
    const log = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (log && workingSets(log.sets).length > 0) {
      return { session, log }
    }
  }
  return null
}

/** Computes all-time personal records for one exercise across every completed session. */
export function computePersonalRecord(
  sessions: WorkoutSession[],
  exerciseId: string,
): PersonalRecord {
  const record: PersonalRecord = {
    exerciseId,
    bestWeight: null,
    bestEstOneRm: null,
    bestVolume: null,
  }

  for (const session of sessions) {
    if (session.status !== 'completed') continue
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue

      const vol = exerciseVolume(log)
      if (vol > 0 && (record.bestVolume === null || vol > record.bestVolume.value)) {
        record.bestVolume = { value: vol, date: session.date, sessionId: session.id }
      }

      for (const set of workingSets(log.sets)) {
        if (record.bestWeight === null || set.weight > record.bestWeight.weight) {
          record.bestWeight = {
            weight: set.weight,
            reps: set.reps,
            date: session.date,
            sessionId: session.id,
          }
        }
        const oneRm = estimateOneRm(set.weight, set.reps)
        if (record.bestEstOneRm === null || oneRm > record.bestEstOneRm.value) {
          record.bestEstOneRm = { value: oneRm, date: session.date, sessionId: session.id }
        }
      }
    }
  }

  return record
}

/**
 * Progressive Overload Assistant.
 *
 * Rule of thumb: if every working set reached the top of the target rep
 * range, the weight was too light for that stimulus — bump it next time.
 * If any set fell short, keep the same weight and try to beat it.
 */
export function suggestProgressiveOverload(
  log: WorkoutExerciseLog,
): ProgressiveOverloadSuggestion {
  const sets = workingSets(log.sets)

  if (sets.length === 0) {
    return { verdict: 'insufficient-data', message: 'Log sets to get a suggestion.' }
  }

  const allHitTop = sets.every((s) => s.reps >= log.repRangeMax)
  if (allHitTop) {
    return {
      verdict: 'increase',
      message: `All sets hit ${log.repRangeMax}+ reps — increase weight next session.`,
    }
  }

  const allBelowRange = sets.every((s) => s.reps < log.repRangeMin)
  if (allBelowRange) {
    return {
      verdict: 'maintain',
      message: `Reps fell below the target range — keep this weight and aim for ${log.repRangeMin}+ reps.`,
    }
  }

  return {
    verdict: 'maintain',
    message: 'Keep current weight next session and try to add a rep.',
  }
}

export interface ExerciseHistoryPoint {
  date: string
  sessionId: string
  bestWeight: number
  bestReps: number
  estOneRm: number
  volume: number
}

/** Chronological per-session data points for one exercise, for progress charts. */
export function getExerciseHistory(
  sessions: WorkoutSession[],
  exerciseId: string,
): ExerciseHistoryPoint[] {
  const points: ExerciseHistoryPoint[] = []

  for (const session of sessions) {
    if (session.status !== 'completed') continue
    const log = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (!log) continue
    const best = bestSetOfLog(log)
    if (!best) continue

    points.push({
      date: session.date,
      sessionId: session.id,
      bestWeight: best.weight,
      bestReps: best.reps,
      estOneRm: Math.round(estimateOneRm(best.weight, best.reps) * 10) / 10,
      volume: exerciseVolume(log),
    })
  }

  return points.sort((a, b) => a.date.localeCompare(b.date))
}

export interface PlateBreakdown {
  /** Plates needed per side, largest first. */
  perSide: number[]
  /** Weight that couldn't be matched exactly with the available plates. */
  remainder: number
  totalWeight: number
}

/** Greedy plate calculator: largest plates first, per side, given a barbell weight. */
export function calculatePlates(
  targetWeight: number,
  barWeight: number,
  availablePlates: number[],
): PlateBreakdown {
  let perSideWeight = (targetWeight - barWeight) / 2
  if (perSideWeight <= 0) {
    return { perSide: [], remainder: 0, totalWeight: barWeight }
  }

  const sortedPlates = [...availablePlates].sort((a, b) => b - a)
  const perSide: number[] = []
  const EPSILON = 0.001

  for (const plate of sortedPlates) {
    while (perSideWeight + EPSILON >= plate) {
      perSide.push(plate)
      perSideWeight -= plate
    }
  }

  return {
    perSide,
    remainder: Math.max(0, Math.round(perSideWeight * 100) / 100),
    totalWeight: targetWeight - perSideWeight * 2 > 0 ? targetWeight - perSideWeight * 2 : barWeight,
  }
}
