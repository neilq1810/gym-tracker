import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PlayIcon, TimerIcon } from '@/components/ui/Icons'
import { useElapsedTime } from '@/hooks/useElapsedTime'
import { formatDuration } from '@/utils/format'
import type { WorkoutSession } from '@/types'

export function ActiveWorkoutBanner({ session }: { session: WorkoutSession }) {
  const navigate = useNavigate()
  const elapsed = useElapsedTime(session.startedAt)
  const setsLogged = session.exercises.reduce(
    (sum, log) => sum + log.sets.filter((s) => s.completed).length,
    0,
  )

  return (
    <Card
      interactive
      onClick={() => navigate('/workout')}
      className="relative overflow-hidden border-accent/40 bg-gradient-to-br from-accent-soft to-surface p-5 animate-slide-up"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Workout in progress
          </div>
          <h3 className="mt-1 font-display text-xl font-bold text-text">{session.workoutName}</h3>
          <div className="mt-2 flex items-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <TimerIcon className="h-4 w-4" /> {formatDuration(elapsed)}
            </span>
            <span>{setsLogged} sets logged</span>
          </div>
        </div>
        <Button size="lg" className="!h-16 !w-16 !rounded-full !p-0">
          <PlayIcon className="h-6 w-6" />
        </Button>
      </div>
    </Card>
  )
}
