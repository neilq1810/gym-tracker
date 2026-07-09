import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EditableExerciseBlock } from '@/components/history/EditableExerciseBlock'
import { ArrowLeftIcon, CopyIcon, EditIcon, TrashIcon, CheckIcon } from '@/components/ui/Icons'
import { useAppStore } from '@/store/useAppStore'
import { computePersonalRecord, sessionVolume } from '@/lib/calculations'
import { getDayProgram } from '@/data/schedule'
import { formatDateLong, formatDuration, formatVolume } from '@/utils/format'
import type { MuscleCategory, WorkoutExerciseLog, WorkoutSession } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const settings = useAppStore((s) => s.settings)
  const editSession = useAppStore((s) => s.editSession)
  const deleteSession = useAppStore((s) => s.deleteSession)
  const duplicateWorkout = useAppStore((s) => s.duplicateWorkout)
  const activeSession = useAppStore((s) => s.activeSession)

  const session = sessions.find((s) => s.id === id)
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<WorkoutSession | null>(session ?? null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    setDraft(session ?? null)
  }, [session])

  const prByExercise = useMemo(() => {
    if (!session) return new Map()
    const map = new Map()
    for (const log of session.exercises) {
      map.set(log.exerciseId, computePersonalRecord(sessions, log.exerciseId))
    }
    return map
  }, [sessions, session])

  if (!session || !draft) {
    return (
      <PageContainer>
        <p className="text-text-muted">Workout not found.</p>
      </PageContainer>
    )
  }

  const category = getDayProgram(session.day).category
  const duration = session.finishedAt ? session.finishedAt - session.startedAt : 0

  function updateLog(updated: WorkoutExerciseLog) {
    setDraft((d) => (d ? { ...d, exercises: d.exercises.map((l) => (l.id === updated.id ? updated : l)) } : d))
  }

  async function handleSave() {
    if (!draft) return
    await editSession(draft)
    setEditMode(false)
  }

  function handleCancelEdit() {
    setDraft(session ?? null)
    setEditMode(false)
  }

  async function handleDelete() {
    if (!session) return
    await deleteSession(session.id)
    navigate('/history', { replace: true })
  }

  function handleDuplicate() {
    if (!session || activeSession) return
    duplicateWorkout(session)
    navigate('/workout')
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/history')}
          aria-label="Back to history"
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <Badge tone={CATEGORY_TONE[category]}>{category.toUpperCase()}</Badge>
        </div>
        {editMode ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button variant="success" size="sm" onClick={handleSave}>
              <CheckIcon className="h-4 w-4" /> Save
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
            <EditIcon className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-text">{session.workoutName}</h1>
        <p className="text-sm text-text-muted">{formatDateLong(session.date)}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface p-4 text-center">
        <div>
          <p className="font-display text-lg font-bold text-text">{formatDuration(duration)}</p>
          <p className="text-[11px] text-text-faint">Duration</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-text">
            {session.exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0)}
          </p>
          <p className="text-[11px] text-text-faint">Sets</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-text">{formatVolume(sessionVolume(session), settings.unit)}</p>
          <p className="text-[11px] text-text-faint">Volume</p>
        </div>
      </div>

      {session.notes && !editMode && (
        <div className="rounded-2xl bg-surface-raised p-3 text-sm text-text-muted">"{session.notes}"</div>
      )}

      <div className="flex flex-col gap-3">
        {draft.exercises
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((log) => (
            <EditableExerciseBlock
              key={log.id}
              log={log}
              editable={editMode}
              pr={prByExercise.get(log.exerciseId)}
              unit={settings.unit}
              onChange={updateLog}
            />
          ))}
      </div>

      {!editMode && (
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={handleDuplicate} disabled={!!activeSession}>
            <CopyIcon className="h-4 w-4" /> Duplicate Workout
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this workout?"
        description="This will permanently remove the workout and its logged sets."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </PageContainer>
  )
}
