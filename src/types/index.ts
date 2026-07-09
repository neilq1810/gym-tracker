/**
 * Core domain types for PPL Strength Tracker.
 *
 * Kept storage-agnostic on purpose: nothing here references localStorage,
 * so the same shapes can later be persisted to Firebase/Supabase without
 * touching UI or business-logic code.
 */

export type WeightUnit = 'kg' | 'lb'

export type WorkoutDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type MuscleCategory = 'push' | 'pull' | 'legs' | 'rest'

/** Which tempo cue set an exercise should show on its card. */
export type TempoGuideKey =
  | 'compound'
  | 'rowsPulldowns'
  | 'lateralRaises'
  | 'curls'
  | 'triceps'
  | 'legExtCurl'
  | 'calves'

export interface Exercise {
  id: string
  name: string
  category: MuscleCategory
  /** Primary muscles trained, for search/filter and display chips. */
  muscleGroups: string[]
  equipment: string
  tempoGuide: TempoGuideKey
  /** True for exercises logged per side (e.g. Bulgarian split squat). */
  perSide?: boolean
}

/** A single exercise's prescription within a day's program. */
export interface ProgramExercise {
  exerciseId: string
  targetSets: number
  repRangeMin: number
  repRangeMax: number
}

export interface DayProgram {
  day: WorkoutDay
  /** Human label, e.g. "Push A". Null on rest days. */
  workoutName: string | null
  category: MuscleCategory
  exercises: ProgramExercise[]
}

export interface SetEntry {
  id: string
  weight: number
  reps: number
  completed: boolean
  notes: string
  isWarmup: boolean
}

export interface WorkoutExerciseLog {
  id: string
  exerciseId: string
  orderIndex: number
  targetSets: number
  repRangeMin: number
  repRangeMax: number
  sets: SetEntry[]
}

export type WorkoutStatus = 'in-progress' | 'completed'

export interface WorkoutSession {
  id: string
  day: WorkoutDay
  workoutName: string
  /** ISO date (yyyy-mm-dd) the workout belongs to. */
  date: string
  startedAt: number
  finishedAt: number | null
  status: WorkoutStatus
  exercises: WorkoutExerciseLog[]
  notes: string
}

export interface BodyweightEntry {
  id: string
  date: string
  weight: number
}

export interface ProgressPhoto {
  id: string
  date: string
  dataUrl: string
  note: string
}

export interface AppSettings {
  unit: WeightUnit
  defaultRestSeconds: number
  /** Weight of an empty barbell, used by the plate calculator. */
  barWeight: number
  /** Available plate sizes for the plate calculator, in the current unit. */
  availablePlates: number[]
}

export interface PersonalRecord {
  exerciseId: string
  /** Heaviest weight ever logged for this exercise (any rep count). */
  bestWeight: { weight: number; reps: number; date: string; sessionId: string } | null
  /** Highest estimated 1RM ever achieved. */
  bestEstOneRm: { value: number; date: string; sessionId: string } | null
  /** Largest single-session volume for this exercise. */
  bestVolume: { value: number; date: string; sessionId: string } | null
}

export type ProgressiveOverloadVerdict = 'increase' | 'maintain' | 'insufficient-data'

export interface ProgressiveOverloadSuggestion {
  verdict: ProgressiveOverloadVerdict
  message: string
}

/** Full exportable snapshot of user data, used for backup/restore. */
export interface DataBackup {
  version: 1
  exportedAt: string
  sessions: WorkoutSession[]
  bodyweightLogs: BodyweightEntry[]
  progressPhotos: ProgressPhoto[]
  settings: AppSettings
}
