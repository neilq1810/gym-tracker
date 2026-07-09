import { useState } from 'react'
import clsx from 'clsx'
import { NumberField } from '@/components/ui/NumberField'
import { SetCompleteToggle } from '@/components/ui/SetCompleteToggle'
import { NotesIcon, TrashIcon } from '@/components/ui/Icons'
import type { SetEntry } from '@/types'

interface SetRowProps {
  set: SetEntry
  setNumber: number
  repRangeMin: number
  repRangeMax: number
  previous?: { weight: number; reps: number } | null
  onChange: (patch: Partial<SetEntry>) => void
  onRemove: () => void
}

/** One editable row for a single working (or warm-up) set. The core repeated unit of the app. */
export function SetRow({ set, setNumber, repRangeMin, repRangeMax, previous, onChange, onRemove }: SetRowProps) {
  const [notesOpen, setNotesOpen] = useState(set.notes.length > 0)
  const repsInRange = set.reps >= repRangeMin && set.reps <= repRangeMax

  return (
    <div
      className={clsx(
        'rounded-xl px-1 py-1.5 transition-colors',
        set.completed && 'bg-success-soft/50',
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex w-7 shrink-0 flex-col items-center">
          <span className={clsx('text-sm font-bold', set.isWarmup ? 'text-warning' : 'text-text-muted')}>
            {set.isWarmup ? 'W' : setNumber}
          </span>
        </div>

        <div className="flex w-20 shrink-0 flex-col items-center text-xs text-text-faint">
          {previous ? (
            <span>
              {previous.weight}&times;{previous.reps}
            </span>
          ) : (
            <span>&mdash;</span>
          )}
        </div>

        <NumberField value={set.weight} onChange={(weight) => onChange({ weight })} step={2.5} className="flex-1" />
        <NumberField
          value={set.reps}
          onChange={(reps) => onChange({ reps })}
          className={clsx('flex-1', set.reps > 0 && !repsInRange && !set.isWarmup && 'text-warning')}
        />

        <button
          type="button"
          onClick={() => setNotesOpen((v) => !v)}
          aria-label="Toggle set notes"
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-faint hover:bg-surface-raised',
            (notesOpen || set.notes) && 'text-accent',
          )}
        >
          <NotesIcon className="h-4 w-4" />
        </button>

        <SetCompleteToggle completed={set.completed} onToggle={() => onChange({ completed: !set.completed })} />
      </div>

      {notesOpen && (
        <div className="mt-1.5 flex items-center gap-2 pl-9">
          <input
            type="text"
            value={set.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Set notes (e.g. felt heavy, form cue)"
            className="h-9 flex-1 rounded-lg border border-border bg-surface-raised px-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove set"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-danger/70 hover:bg-danger-soft hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
