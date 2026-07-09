import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { SPLITS } from '@/data/schedule'
import type { MuscleCategory, SplitId } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

interface SplitPickerModalProps {
  open: boolean
  onClose: () => void
  onPick: (splitId: SplitId) => void
  suggestedSplitId?: SplitId | null
}

/** Lets the lifter override the suggested split and log any of the 6 routines instead. */
export function SplitPickerModal({ open, onClose, onPick, suggestedSplitId }: SplitPickerModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a workout">
      <div className="flex flex-col gap-2">
        {SPLITS.map((split) => (
          <button
            key={split.id}
            onClick={() => onPick(split.id)}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-left hover:bg-surface-hover active:scale-[0.99]"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text">{split.name}</span>
                {split.id === suggestedSplitId && <Badge tone="neutral">Suggested</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-text-faint">{split.exercises.length} exercises</p>
            </div>
            <Badge tone={CATEGORY_TONE[split.category]}>{split.category.toUpperCase()}</Badge>
          </button>
        ))}
      </div>
    </Modal>
  )
}
