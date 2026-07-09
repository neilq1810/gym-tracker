import type {
  DayProgram,
  SetEntry,
  WorkoutDay,
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

/** Builds a fresh in-progress session from today's scheduled program. */
export function createSessionFromProgram(program: DayProgram, date: string): WorkoutSession {
  if (!program.workoutName) {
    throw new Error('Cannot start a workout on a rest day')
  }
  return {
    id: generateId(),
    day: program.day,
    workoutName: program.workoutName,
    date,
    startedAt: Date.now(),
    finishedAt: null,
    status: 'in-progress',
    notes: '',
    exercises: program.exercises.map((ex, i) =>
      createLogFromProgramExercise(ex.exerciseId, i, ex.targetSets, ex.repRangeMin, ex.repRangeMax),
    ),
  }
}

/**
 * Builds a new in-progress session that mirrors the exercises/sets of a
 * previous session (used by "Duplicate previous workout"). Weights/reps
 * are carried over as a starting point; completion state is reset.
 */
export function createSessionFromPrevious(
  previous: WorkoutSession,
  day: WorkoutDay,
  date: string,
): WorkoutSession {
  return {
    id: generateId(),
    day,
    workoutName: previous.workoutName,
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
