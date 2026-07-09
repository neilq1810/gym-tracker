import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NumberField } from '@/components/ui/NumberField'
import { TrashIcon, ScaleIcon } from '@/components/ui/Icons'
import { ProgressLineChart } from '@/components/progress/ProgressLineChart'
import { useAppStore } from '@/store/useAppStore'
import { formatDate } from '@/utils/format'

export function BodyweightTracker() {
  const logs = useAppStore((s) => s.bodyweightLogs)
  const settings = useAppStore((s) => s.settings)
  const addEntry = useAppStore((s) => s.addBodyweightEntry)
  const deleteEntry = useAppStore((s) => s.deleteBodyweightEntry)
  const [weight, setWeight] = useState(0)

  function handleAdd() {
    if (weight <= 0) return
    addEntry(weight)
    setWeight(0)
  }

  return (
    <Card className="p-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-text-faint">
        <ScaleIcon className="h-3.5 w-3.5" /> BODYWEIGHT TRACKER
      </p>

      <div className="flex gap-2">
        <NumberField value={weight} onChange={setWeight} step={0.1} placeholder={`Weight (${settings.unit})`} />
        <Button onClick={handleAdd}>Log</Button>
      </div>

      {logs.length >= 2 && (
        <div className="mt-4">
          <ProgressLineChart data={logs} dataKey="weight" color="var(--color-accent)" unit={settings.unit} title="Bodyweight Trend" />
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 flex flex-col gap-1">
          {logs
            .slice()
            .reverse()
            .slice(0, 6)
            .map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface-raised">
                <span className="text-text-muted">{formatDate(entry.date)}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-text">
                    {entry.weight} {settings.unit}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    aria-label="Delete entry"
                    className="text-text-faint hover:text-danger"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  )
}
