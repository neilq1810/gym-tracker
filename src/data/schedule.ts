import type { SplitId, SplitProgram, WorkoutDay } from '@/types'

/** The 6 fixed PPL splits. Each is a standalone routine — pick any of them on any day. */
export const SPLITS: SplitProgram[] = [
  {
    id: 'push-a',
    name: 'Push A',
    category: 'push',
    exercises: [
      { exerciseId: 'barbell-bench-press', targetSets: 4, repRangeMin: 4, repRangeMax: 6 },
      { exerciseId: 'seated-db-shoulder-press', targetSets: 3, repRangeMin: 6, repRangeMax: 8 },
      { exerciseId: 'incline-db-press', targetSets: 3, repRangeMin: 8, repRangeMax: 10 },
      { exerciseId: 'cable-lateral-raise', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'weighted-dips', targetSets: 3, repRangeMin: 8, repRangeMax: 12 },
      { exerciseId: 'cable-triceps-pushdown', targetSets: 2, repRangeMin: 10, repRangeMax: 15 },
    ],
  },
  {
    id: 'pull-a',
    name: 'Pull A',
    category: 'pull',
    exercises: [
      { exerciseId: 'conventional-deadlift', targetSets: 3, repRangeMin: 3, repRangeMax: 5 },
      { exerciseId: 'weighted-pull-up', targetSets: 4, repRangeMin: 5, repRangeMax: 8 },
      { exerciseId: 'chest-supported-row', targetSets: 3, repRangeMin: 8, repRangeMax: 10 },
      { exerciseId: 'face-pull', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'incline-db-curl', targetSets: 3, repRangeMin: 10, repRangeMax: 12 },
      { exerciseId: 'hammer-curl', targetSets: 2, repRangeMin: 10, repRangeMax: 12 },
    ],
  },
  {
    id: 'legs-a',
    name: 'Legs A',
    category: 'legs',
    exercises: [
      { exerciseId: 'back-squat', targetSets: 4, repRangeMin: 4, repRangeMax: 6 },
      { exerciseId: 'romanian-deadlift', targetSets: 3, repRangeMin: 6, repRangeMax: 8 },
      { exerciseId: 'leg-press', targetSets: 3, repRangeMin: 10, repRangeMax: 10 },
      { exerciseId: 'leg-curl', targetSets: 3, repRangeMin: 10, repRangeMax: 12 },
      { exerciseId: 'standing-calf-raise', targetSets: 4, repRangeMin: 10, repRangeMax: 15 },
      { exerciseId: 'hanging-leg-raise', targetSets: 3, repRangeMin: 10, repRangeMax: 15 },
    ],
  },
  {
    id: 'push-b',
    name: 'Push B',
    category: 'push',
    exercises: [
      { exerciseId: 'incline-barbell-bench-press', targetSets: 4, repRangeMin: 6, repRangeMax: 8 },
      { exerciseId: 'seated-db-shoulder-press', targetSets: 3, repRangeMin: 8, repRangeMax: 10 },
      { exerciseId: 'machine-chest-press', targetSets: 3, repRangeMin: 10, repRangeMax: 12 },
      { exerciseId: 'cable-fly', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'db-lateral-raise', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'skull-crushers', targetSets: 3, repRangeMin: 10, repRangeMax: 12 },
    ],
  },
  {
    id: 'pull-b',
    name: 'Pull B',
    category: 'pull',
    exercises: [
      { exerciseId: 'barbell-row', targetSets: 4, repRangeMin: 6, repRangeMax: 8 },
      { exerciseId: 'lat-pulldown', targetSets: 3, repRangeMin: 8, repRangeMax: 12 },
      { exerciseId: 'seated-cable-row', targetSets: 3, repRangeMin: 10, repRangeMax: 12 },
      { exerciseId: 'reverse-pec-deck', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'ez-bar-curl', targetSets: 3, repRangeMin: 8, repRangeMax: 10 },
      { exerciseId: 'cable-curl', targetSets: 2, repRangeMin: 12, repRangeMax: 15 },
    ],
  },
  {
    id: 'legs-b',
    name: 'Legs B',
    category: 'legs',
    exercises: [
      { exerciseId: 'hack-squat', targetSets: 3, repRangeMin: 6, repRangeMax: 8 },
      { exerciseId: 'bulgarian-split-squat', targetSets: 3, repRangeMin: 8, repRangeMax: 10 },
      { exerciseId: 'hip-thrust', targetSets: 3, repRangeMin: 8, repRangeMax: 12 },
      { exerciseId: 'leg-extension', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'seated-calf-raise', targetSets: 4, repRangeMin: 12, repRangeMax: 15 },
      { exerciseId: 'cable-crunch', targetSets: 3, repRangeMin: 12, repRangeMax: 15 },
    ],
  },
]

const splitIndex = new Map(SPLITS.map((s) => [s.id, s]))

export function getSplitById(id: SplitId): SplitProgram {
  const split = splitIndex.get(id)
  if (!split) throw new Error(`No split found with id: ${id}`)
  return split
}

/**
 * The suggested Mon-Sat rotation, shown as the default on the dashboard.
 * Purely a starting point — any split can be logged on any day.
 */
export const DEFAULT_SCHEDULE: Record<WorkoutDay, SplitId | null> = {
  monday: 'push-a',
  tuesday: 'pull-a',
  wednesday: 'legs-a',
  thursday: 'push-b',
  friday: 'pull-b',
  saturday: 'legs-b',
  sunday: null,
}

export function getSuggestedSplit(day: WorkoutDay): SplitProgram | null {
  const splitId = DEFAULT_SCHEDULE[day]
  return splitId ? getSplitById(splitId) : null
}

const DAY_ORDER: WorkoutDay[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export function jsDayIndexToWorkoutDay(jsDay: number): WorkoutDay {
  return DAY_ORDER[jsDay]
}

export function getTodaysSuggestedSplit(date: Date = new Date()): SplitProgram | null {
  return getSuggestedSplit(jsDayIndexToWorkoutDay(date.getDay()))
}

export const DAY_LABELS: Record<WorkoutDay, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}
