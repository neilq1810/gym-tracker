import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { NumberField } from '@/components/ui/NumberField'
import { useAppStore } from '@/store/useAppStore'
import { calculatePlates } from '@/lib/calculations'

interface PlateCalculatorModalProps {
  open: boolean
  onClose: () => void
  initialWeight?: number
}

export function PlateCalculatorModal({ open, onClose, initialWeight = 0 }: PlateCalculatorModalProps) {
  const settings = useAppStore((s) => s.settings)
  const [weight, setWeight] = useState(initialWeight)

  useEffect(() => {
    if (open) setWeight(initialWeight)
  }, [open, initialWeight])

  const result = calculatePlates(weight, settings.barWeight, settings.availablePlates)

  return (
    <Modal open={open} onClose={onClose} title="Plate Calculator">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-text-faint">TARGET WEIGHT ({settings.unit})</label>
          <NumberField value={weight} onChange={setWeight} step={2.5} />
        </div>

        <div className="rounded-2xl bg-surface-raised p-4">
          <p className="text-xs text-text-faint">
            Bar: {settings.barWeight} {settings.unit} &middot; per side
          </p>
          {result.perSide.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {result.perSide.map((plate, i) => (
                <div
                  key={i}
                  className="flex h-12 min-w-[3rem] items-center justify-center rounded-lg border-2 border-accent/40 bg-accent-soft px-2 font-display text-sm font-bold text-accent"
                >
                  {plate}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-muted">Just the bar.</p>
          )}
          {result.remainder > 0 && (
            <p className="mt-3 text-xs text-warning">
              {result.remainder} {settings.unit} per side can't be made with your available plates.
            </p>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-text-faint">AVAILABLE PLATES ({settings.unit})</p>
          <p className="text-sm text-text-muted">{settings.availablePlates.join(', ')}</p>
          <p className="mt-1 text-xs text-text-faint">Edit these in Settings.</p>
        </div>
      </div>
    </Modal>
  )
}
