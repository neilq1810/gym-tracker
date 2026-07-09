import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PlayIcon, DumbbellIcon, EditIcon } from '@/components/ui/Icons'
import { getExerciseById } from '@/data/exercises'
import type { MuscleCategory, SplitProgram } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

interface TodayWorkoutCardProps {
  split: SplitProgram | null
  isRestDay: boolean
  onStart: () => void
  onChooseDifferent: () => void
  disabled?: boolean
}

export function TodayWorkoutCard({ split, isRestDay, onStart, onChooseDifferent, disabled }: TodayWorkoutCardProps) {
  if (!split) {
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-text-faint">
          <DumbbellIcon className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-text">{isRestDay ? 'Rest Day' : 'No workout picked'}</h2>
        <p className="mt-1 text-sm text-text-muted">
          {isRestDay ? 'Recover up, or train anyway if you\'re feeling it.' : 'Choose one of your 6 splits to get started.'}
        </p>
        <Button variant="secondary" className="mt-4" onClick={onChooseDifferent} disabled={disabled}>
          Choose a workout
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <Badge tone={CATEGORY_TONE[split.category]}>{split.category.toUpperCase()}</Badge>
        <span className="text-xs text-text-faint">{split.exercises.length} exercises</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl font-bold text-text">{split.name}</h2>
        <button
          onClick={onChooseDifferent}
          disabled={disabled}
          className="flex shrink-0 items-center gap-1 rounded-full bg-surface-raised px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text disabled:opacity-40"
        >
          <EditIcon className="h-3.5 w-3.5" /> Switch
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {split.exercises.map((ex) => {
          const exercise = getExerciseById(ex.exerciseId)
          return (
            <li key={ex.exerciseId} className="flex items-center justify-between text-sm">
              <span className="text-text">{exercise?.name ?? ex.exerciseId}</span>
              <span className="text-text-faint">
                {ex.targetSets} &times; {ex.repRangeMin}-{ex.repRangeMax}
              </span>
            </li>
          )
        })}
      </ul>

      <Button size="lg" fullWidth className="mt-5" onClick={onStart} disabled={disabled}>
        <PlayIcon className="h-5 w-5" />
        Start Workout
      </Button>
    </Card>
  )
}
