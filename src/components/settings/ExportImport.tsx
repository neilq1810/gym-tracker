import { useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DownloadIcon, UploadIcon } from '@/components/ui/Icons'
import { useAppStore } from '@/store/useAppStore'
import type { DataBackup } from '@/types'

export function ExportImport() {
  const exportBackup = useAppStore((s) => s.exportBackup)
  const importBackup = useAppStore((s) => s.importBackup)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<DataBackup | null>(null)
  const [error, setError] = useState('')

  async function handleExport() {
    const backup = await exportBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ppl-tracker-backup-${backup.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as DataBackup
        if (!parsed.sessions || !parsed.settings) throw new Error('Invalid backup file')
        setError('')
        setPendingImport(parsed)
      } catch {
        setError('That file doesn\'t look like a valid PPL Tracker backup.')
      }
    }
    reader.readAsText(file)
  }

  async function confirmImport() {
    if (!pendingImport) return
    await importBackup(pendingImport)
    setPendingImport(null)
  }

  return (
    <Card className="p-4">
      <p className="mb-3 text-xs font-semibold text-text-faint">BACKUP &amp; RESTORE</p>
      <div className="flex gap-2">
        <Button variant="secondary" fullWidth onClick={handleExport}>
          <DownloadIcon className="h-4 w-4" /> Export JSON
        </Button>
        <Button variant="secondary" fullWidth onClick={() => inputRef.current?.click()}>
          <UploadIcon className="h-4 w-4" /> Import JSON
        </Button>
        <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChosen} />
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <p className="mt-2 text-xs text-text-faint">
        All data lives on this device. Export regularly to keep a backup, or move it to another device.
      </p>

      <ConfirmDialog
        open={!!pendingImport}
        title="Replace all data?"
        description="Importing will overwrite every workout, bodyweight log, and photo currently stored on this device."
        confirmLabel="Import & Replace"
        danger
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </Card>
  )
}
