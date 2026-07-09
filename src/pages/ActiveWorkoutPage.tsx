import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ArrowLeftIcon, TimerIcon, CheckIcon } from '@/components/ui/Icons'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { RestTimerBar } from '@/components/workout/RestTimerBar'
import { FinishWorkoutModal } from '@/components/workout/FinishWorkoutModal'
import { useAppStore } from '@/store/useAppStore'
import { useElapsedTime } from '@/hooks/useElapsedTime'
import { formatDuration } from '@/utils/format'

export function ActiveWorkoutPage() {
  const navigate = useNavigate()
  const activeSession = useAppStore((s) => s.activeSession)
  const settings = useAppStore((s) => s.settings)
  const finishActiveSession = useAppStore((s) => s.finishActiveSession)
  const cancelActiveSession = useAppStore((s) => s.cancelActiveSession)

  const [finishOpen, setFinishOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  const elapsed = useElapsedTime(activeSession?.startedAt ?? null)

  useEffect(() => {
    if (!activeSession) navigate('/', { replace: true })
  }, [activeSession, navigate])

  if (!activeSession) return null

  const sortedExercises = [...activeSession.exercises].sort((a, b) => a.orderIndex - b.orderIndex)

  async function handleFinish(notes: string) {
    await finishActiveSession(notes)
    setFinishOpen(false)
    navigate('/history')
  }

  async function handleCancel() {
    await cancelActiveSession()
    setCancelOpen(false)
    navigate('/')
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur sm:-mx-0 sm:rounded-2xl sm:border sm:bg-surface">
        <button
          onClick={() => setCancelOpen(true)}
          aria-label="Cancel workout"
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-bold text-text">{activeSession.workoutName}</h1>
          <p className="flex items-center gap-1 text-xs text-text-faint">
            <TimerIcon className="h-3.5 w-3.5" /> {formatDuration(elapsed)}
          </p>
        </div>
        <Button size="sm" variant="success" onClick={() => setFinishOpen(true)}>
          <CheckIcon className="h-4 w-4" /> Finish
        </Button>
      </header>

      <div className="flex flex-col gap-4 pb-56 sm:pb-32">
        {sortedExercises.map((log, i) => (
          <ExerciseCard
            key={log.id}
            log={log}
            sessionDate={activeSession.date}
            sessionId={activeSession.id}
            index={i}
            count={sortedExercises.length}
          />
        ))}
      </div>

      <RestTimerBar />

      <FinishWorkoutModal
        open={finishOpen}
        onClose={() => setFinishOpen(false)}
        onConfirm={handleFinish}
        session={activeSession}
        unit={settings.unit}
      />

      <ConfirmDialog
        open={cancelOpen}
        title="Discard this workout?"
        description="All sets logged in this session will be deleted. This can't be undone."
        confirmLabel="Discard"
        danger
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />
    </PageContainer>
  )
}
