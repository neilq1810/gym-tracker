import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PlayIcon, DumbbellIcon } from '@/components/ui/Icons'
import { getExerciseById } from '@/data/exercises'
import type { DayProgram, MuscleCategory } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

interface TodayWorkoutCardProps {
  program: DayProgram
  onStart: () => void
  disabled?: boolean
}

export function TodayWorkoutCard({ program, onStart, disabled }: TodayWorkoutCardProps) {
  if (program.category === 'rest') {
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-text-faint">
          <DumbbellIcon className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-text">Rest Day</h2>
        <p className="mt-1 text-sm text-text-muted">Recover up — your next session is waiting tomorrow.</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <Badge tone={CATEGORY_TONE[program.category]}>{program.category.toUpperCase()}</Badge>
        <span className="text-xs text-text-faint">{program.exercises.length} exercises</span>
      </div>
      <h2 className="mt-2 font-display text-2xl font-bold text-text">{program.workoutName}</h2>

      <ul className="mt-4 space-y-2">
        {program.exercises.map((ex) => {
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
