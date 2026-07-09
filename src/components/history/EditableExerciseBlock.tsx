import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SetRow } from '@/components/workout/SetRow'
import { PlusIcon, TrophyIcon } from '@/components/ui/Icons'
import { getExerciseById } from '@/data/exercises'
import { formatWeight } from '@/utils/format'
import type { PersonalRecord, SetEntry, WorkoutExerciseLog } from '@/types'

interface EditableExerciseBlockProps {
  log: WorkoutExerciseLog
  editable: boolean
  pr: PersonalRecord
  unit: string
  onChange: (log: WorkoutExerciseLog) => void
}

export function EditableExerciseBlock({ log, editable, pr, unit, onChange }: EditableExerciseBlockProps) {
  const exercise = getExerciseById(log.exerciseId)

  function updateSet(setId: string, patch: Partial<SetEntry>) {
    onChange({ ...log, sets: log.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) })
  }

  function removeSet(setId: string) {
    onChange({ ...log, sets: log.sets.filter((s) => s.id !== setId) })
  }

  function addSet(isWarmup = false) {
    onChange({
      ...log,
      sets: [
        ...log.sets,
        { id: crypto.randomUUID(), weight: 0, reps: 0, completed: true, notes: '', isWarmup },
      ],
    })
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-text">{exercise?.name ?? log.exerciseId}</h3>
          <p className="text-xs text-text-faint">
            Target {log.targetSets} &times; {log.repRangeMin}-{log.repRangeMax} reps
          </p>
        </div>
        {pr.bestWeight && (
          <Badge tone="warning">
            <TrophyIcon className="h-3 w-3" /> {formatWeight(pr.bestWeight.weight, unit)}
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {log.sets.map((set, i) => {
          const workingIndex = log.sets.slice(0, i + 1).filter((s) => !s.isWarmup).length
          return editable ? (
            <SetRow
              key={set.id}
              set={set}
              setNumber={set.isWarmup ? 0 : workingIndex}
              repRangeMin={log.repRangeMin}
              repRangeMax={log.repRangeMax}
              onChange={(patch) => updateSet(set.id, patch)}
              onRemove={() => removeSet(set.id)}
            />
          ) : (
            <div key={set.id} className="flex items-center gap-3 rounded-lg px-1 py-1.5 text-sm">
              <span className={`w-7 font-bold ${set.isWarmup ? 'text-warning' : 'text-text-muted'}`}>
                {set.isWarmup ? 'W' : workingIndex}
              </span>
              <span className={set.completed ? 'text-text' : 'text-text-faint line-through'}>
                {set.weight} {unit} &times; {set.reps} reps
              </span>
              {set.notes && <span className="truncate text-xs text-text-faint">"{set.notes}"</span>}
            </div>
          )
        })}
      </div>

      {editable && (
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => addSet(false)}>
            <PlusIcon className="h-3.5 w-3.5" /> Add set
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addSet(true)}>
            <PlusIcon className="h-3.5 w-3.5" /> Add warm-up
          </Button>
        </div>
      )}
    </Card>
  )
}
