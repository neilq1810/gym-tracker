import type { Exercise } from '@/types'

/**
 * The full exercise library referenced by the weekly PPL schedule.
 * `id` is a stable slug used as the foreign key from program/session data,
 * so renaming `name` later won't break historical logs.
 */
export const EXERCISES: Exercise[] = [
  // ---- Push ----
  { id: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'push', muscleGroups: ['Chest', 'Triceps', 'Shoulders'], equipment: 'Barbell', tempoGuide: 'compound' },
  { id: 'seated-db-shoulder-press', name: 'Seated Dumbbell Shoulder Press', category: 'push', muscleGroups: ['Shoulders', 'Triceps'], equipment: 'Dumbbell', tempoGuide: 'compound' },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', category: 'push', muscleGroups: ['Chest', 'Shoulders'], equipment: 'Dumbbell', tempoGuide: 'compound' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'push', muscleGroups: ['Shoulders'], equipment: 'Cable', tempoGuide: 'lateralRaises' },
  { id: 'weighted-dips', name: 'Weighted Dips', category: 'push', muscleGroups: ['Chest', 'Triceps'], equipment: 'Dip Bar', tempoGuide: 'compound' },
  { id: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', category: 'push', muscleGroups: ['Triceps'], equipment: 'Cable', tempoGuide: 'triceps' },
  { id: 'incline-barbell-bench-press', name: 'Incline Barbell Bench Press', category: 'push', muscleGroups: ['Chest', 'Shoulders'], equipment: 'Barbell', tempoGuide: 'compound' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', category: 'push', muscleGroups: ['Chest', 'Triceps'], equipment: 'Machine', tempoGuide: 'compound' },
  { id: 'cable-fly', name: 'Cable Fly', category: 'push', muscleGroups: ['Chest'], equipment: 'Cable', tempoGuide: 'compound' },
  { id: 'db-lateral-raise', name: 'Dumbbell Lateral Raise', category: 'push', muscleGroups: ['Shoulders'], equipment: 'Dumbbell', tempoGuide: 'lateralRaises' },
  { id: 'skull-crushers', name: 'Skull Crushers', category: 'push', muscleGroups: ['Triceps'], equipment: 'EZ-Bar', tempoGuide: 'triceps' },

  // ---- Pull ----
  { id: 'conventional-deadlift', name: 'Conventional Deadlift', category: 'pull', muscleGroups: ['Back', 'Hamstrings', 'Glutes'], equipment: 'Barbell', tempoGuide: 'compound' },
  { id: 'weighted-pull-up', name: 'Weighted Pull-Up', category: 'pull', muscleGroups: ['Back', 'Biceps'], equipment: 'Bodyweight', tempoGuide: 'rowsPulldowns' },
  { id: 'chest-supported-row', name: 'Chest-Supported Row', category: 'pull', muscleGroups: ['Back'], equipment: 'Machine', tempoGuide: 'rowsPulldowns' },
  { id: 'face-pull', name: 'Face Pull', category: 'pull', muscleGroups: ['Rear Delts', 'Upper Back'], equipment: 'Cable', tempoGuide: 'rowsPulldowns' },
  { id: 'incline-db-curl', name: 'Incline Dumbbell Curl', category: 'pull', muscleGroups: ['Biceps'], equipment: 'Dumbbell', tempoGuide: 'curls' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'pull', muscleGroups: ['Biceps', 'Forearms'], equipment: 'Dumbbell', tempoGuide: 'curls' },
  { id: 'barbell-row', name: 'Barbell Row', category: 'pull', muscleGroups: ['Back'], equipment: 'Barbell', tempoGuide: 'rowsPulldowns' },
  { id: 'lat-pulldown', name: 'Close-Grip / Neutral-Grip Lat Pulldown', category: 'pull', muscleGroups: ['Back', 'Biceps'], equipment: 'Cable', tempoGuide: 'rowsPulldowns' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'pull', muscleGroups: ['Back'], equipment: 'Cable', tempoGuide: 'rowsPulldowns' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck', category: 'pull', muscleGroups: ['Rear Delts'], equipment: 'Machine', tempoGuide: 'rowsPulldowns' },
  { id: 'ez-bar-curl', name: 'EZ-Bar Curl', category: 'pull', muscleGroups: ['Biceps'], equipment: 'EZ-Bar', tempoGuide: 'curls' },
  { id: 'cable-curl', name: 'Cable Curl', category: 'pull', muscleGroups: ['Biceps'], equipment: 'Cable', tempoGuide: 'curls' },

  // ---- Legs ----
  { id: 'back-squat', name: 'Back Squat', category: 'legs', muscleGroups: ['Quads', 'Glutes'], equipment: 'Barbell', tempoGuide: 'compound' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'legs', muscleGroups: ['Hamstrings', 'Glutes'], equipment: 'Barbell', tempoGuide: 'compound' },
  { id: 'leg-press', name: 'Leg Press', category: 'legs', muscleGroups: ['Quads', 'Glutes'], equipment: 'Machine', tempoGuide: 'compound' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'legs', muscleGroups: ['Hamstrings'], equipment: 'Machine', tempoGuide: 'legExtCurl' },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', category: 'legs', muscleGroups: ['Calves'], equipment: 'Machine', tempoGuide: 'calves' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'legs', muscleGroups: ['Core'], equipment: 'Bodyweight', tempoGuide: 'compound' },
  { id: 'hack-squat', name: 'Hack Squat', category: 'legs', muscleGroups: ['Quads'], equipment: 'Machine', tempoGuide: 'compound' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'legs', muscleGroups: ['Quads', 'Glutes'], equipment: 'Dumbbell', tempoGuide: 'compound', perSide: true },
  { id: 'hip-thrust', name: 'Hip Thrust', category: 'legs', muscleGroups: ['Glutes'], equipment: 'Barbell', tempoGuide: 'compound' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'legs', muscleGroups: ['Quads'], equipment: 'Machine', tempoGuide: 'legExtCurl' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'legs', muscleGroups: ['Calves'], equipment: 'Machine', tempoGuide: 'calves' },
  { id: 'cable-crunch', name: 'Cable Crunch', category: 'legs', muscleGroups: ['Core'], equipment: 'Cable', tempoGuide: 'compound' },
]

const exerciseIndex = new Map(EXERCISES.map((e) => [e.id, e]))

export function getExerciseById(id: string): Exercise | undefined {
  return exerciseIndex.get(id)
}
