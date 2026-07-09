import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { sessionVolume } from '@/lib/calculations'
import { formatVolume, formatDuration } from '@/utils/format'
import type { WorkoutSession } from '@/types'

interface FinishWorkoutModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (notes: string) => void
  session: WorkoutSession
  unit: string
}

export function FinishWorkoutModal({ open, onClose, onConfirm, session, unit }: FinishWorkoutModalProps) {
  const [notes, setNotes] = useState(session.notes)

  const totalSets = session.exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0)
  const volume = sessionVolume(session)
  const duration = Date.now() - session.startedAt

  return (
    <Modal open={open} onClose={onClose} title="Finish Workout">
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-raised p-4 text-center">
        <div>
          <p className="font-display text-lg font-bold text-text">{formatDuration(duration)}</p>
          <p className="text-[11px] text-text-faint">Duration</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-text">{totalSets}</p>
          <p className="text-[11px] text-text-faint">Sets</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-text">{formatVolume(volume, unit)}</p>
          <p className="text-[11px] text-text-faint">Volume</p>
        </div>
      </div>

      <label className="mb-1 mt-4 block text-xs font-semibold text-text-faint">WORKOUT NOTES</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="How did it feel? Anything to remember for next time..."
        rows={3}
        className="w-full rounded-xl border border-border bg-surface-raised p-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/50"
      />

      <div className="mt-5 flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose}>
          Keep Going
        </Button>
        <Button variant="success" fullWidth onClick={() => onConfirm(notes)}>
          Finish
        </Button>
      </div>
    </Modal>
  )
}
