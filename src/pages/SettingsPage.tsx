import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NumberField } from '@/components/ui/NumberField'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { BodyweightTracker } from '@/components/settings/BodyweightTracker'
import { ProgressPhotos } from '@/components/settings/ProgressPhotos'
import { ExportImport } from '@/components/settings/ExportImport'
import { TrashIcon } from '@/components/ui/Icons'
import { useAppStore } from '@/store/useAppStore'
import type { WeightUnit } from '@/types'

const REST_PRESETS = [60, 90, 120, 180]

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const sessions = useAppStore((s) => s.sessions)
  const deleteSession = useAppStore((s) => s.deleteSession)
  const [clearOpen, setClearOpen] = useState(false)

  function updatePlates(raw: string) {
    const plates = raw
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0)
      .sort((a, b) => b - a)
    updateSettings({ availablePlates: plates })
  }

  async function handleClearAll() {
    await Promise.all(sessions.map((s) => deleteSession(s.id)))
    setClearOpen(false)
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold text-text">Settings</h1>

      <Card className="p-4">
        <p className="mb-3 text-xs font-semibold text-text-faint">UNITS</p>
        <div className="flex gap-2">
          {(['kg', 'lb'] as WeightUnit[]).map((unit) => (
            <button
              key={unit}
              onClick={() => updateSettings({ unit })}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                settings.unit === unit ? 'bg-accent text-white' : 'bg-surface-raised text-text-muted'
              }`}
            >
              {unit.toUpperCase()}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="mb-3 text-xs font-semibold text-text-faint">DEFAULT REST TIMER</p>
        <div className="flex gap-2">
          {REST_PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => updateSettings({ defaultRestSeconds: s })}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                settings.defaultRestSeconds === s ? 'bg-accent text-white' : 'bg-surface-raised text-text-muted'
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="mb-3 text-xs font-semibold text-text-faint">PLATE CALCULATOR</p>
        <label className="mb-1 block text-xs text-text-muted">Bar weight ({settings.unit})</label>
        <NumberField value={settings.barWeight} onChange={(barWeight) => updateSettings({ barWeight })} step={0.5} />
        <label className="mb-1 mt-3 block text-xs text-text-muted">Available plates (comma separated)</label>
        <input
          type="text"
          defaultValue={settings.availablePlates.join(', ')}
          onBlur={(e) => updatePlates(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-surface-raised px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </Card>

      <BodyweightTracker />
      <ProgressPhotos />
      <ExportImport />

      <Card className="border-danger/30 p-4">
        <p className="mb-3 text-xs font-semibold text-danger">DANGER ZONE</p>
        <Button variant="danger" fullWidth onClick={() => setClearOpen(true)}>
          <TrashIcon className="h-4 w-4" /> Clear All Workout History
        </Button>
      </Card>

      <ConfirmDialog
        open={clearOpen}
        title="Clear all workout history?"
        description="This permanently deletes every logged workout on this device. Bodyweight logs and photos are kept."
        confirmLabel="Clear Everything"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setClearOpen(false)}
      />
    </PageContainer>
  )
}
