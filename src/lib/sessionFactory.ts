import type {
  SetEntry,
  SplitProgram,
  WorkoutExerciseLog,
  WorkoutSession,
} from '@/types'
import { generateId } from './id'
import { workingSets } from './calculations'

export function createEmptySet(isWarmup = false): SetEntry {
  return {
    id: generateId(),
    weight: 0,
    reps: 0,
    completed: false,
    notes: '',
    isWarmup,
  }
}

/**
 * Adds a new set to a log's set list. Warm-ups are inserted right before the
 * first working set (so they always sit above working sets, matching how
 * a lifter actually orders a set in the gym); working sets are appended.
 */
export function insertSet(
  sets: SetEntry[],
  isWarmup: boolean,
  overrides?: Partial<SetEntry>,
): SetEntry[] {
  const newSet = { ...createEmptySet(isWarmup), ...overrides }
  if (!isWarmup) return [...sets, newSet]
  const firstWorkingIndex = sets.findIndex((s) => !s.isWarmup)
  const insertAt = firstWorkingIndex === -1 ? sets.length : firstWorkingIndex
  return [...sets.slice(0, insertAt), newSet, ...sets.slice(insertAt)]
}

function createLogFromProgramExercise(
  exerciseId: string,
  orderIndex: number,
  targetSets: number,
  repRangeMin: number,
  repRangeMax: number,
): WorkoutExerciseLog {
  return {
    id: generateId(),
    exerciseId,
    orderIndex,
    targetSets,
    repRangeMin,
    repRangeMax,
    sets: Array.from({ length: targetSets }, () => createEmptySet()),
  }
}

/** Builds a fresh in-progress session for the given split, on the given date. */
export function createSessionFromSplit(split: SplitProgram, date: string): WorkoutSession {
  return {
    id: generateId(),
    splitId: split.id,
    workoutName: split.name,
    category: split.category,
    date,
    startedAt: Date.now(),
    finishedAt: null,
    status: 'in-progress',
    notes: '',
    exercises: split.exercises.map((ex, i) =>
      createLogFromProgramExercise(ex.exerciseId, i, ex.targetSets, ex.repRangeMin, ex.repRangeMax),
    ),
  }
}

/**
 * Builds a new in-progress session that mirrors the exercises/sets of a
 * previous session (used by "Duplicate previous workout"). Weights/reps
 * are carried over as a starting point; completion state is reset.
 */
export function createSessionFromPrevious(previous: WorkoutSession, date: string): WorkoutSession {
  return {
    id: generateId(),
    splitId: previous.splitId,
    workoutName: previous.workoutName,
    category: previous.category,
    date,
    startedAt: Date.now(),
    finishedAt: null,
    status: 'in-progress',
    notes: '',
    exercises: previous.exercises.map((log) => ({
      id: generateId(),
      exerciseId: log.exerciseId,
      orderIndex: log.orderIndex,
      targetSets: log.targetSets,
      repRangeMin: log.repRangeMin,
      repRangeMax: log.repRangeMax,
      sets: log.sets.map((s) => ({
        ...createEmptySet(s.isWarmup),
        weight: s.weight,
        reps: s.reps,
      })),
    })),
  }
}

/**
 * Returns a copy of `log` with weight/reps pre-filled from the previous
 * session's corresponding sets (completion state stays untouched by this
 * — it only seeds numbers so the lifter can start from where they left off).
 */
export function copyPreviousIntoLog(
  log: WorkoutExerciseLog,
  previousLog: WorkoutExerciseLog,
): WorkoutExerciseLog {
  const previousWorking = workingSets(previousLog.sets)
  return {
    ...log,
    sets: log.sets.map((set, i) => {
      const source = previousWorking[i]
      if (!source) return set
      return { ...set, weight: source.weight, reps: source.reps }
    }),
  }
}
