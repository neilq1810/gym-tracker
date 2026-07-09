import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { sessionVolume } from '@/lib/calculations'
import { formatDate, formatDuration, formatVolume } from '@/utils/format'
import type { WorkoutSession, MuscleCategory } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

export function WorkoutHistoryCard({ session, unit }: { session: WorkoutSession; unit: string }) {
  const navigate = useNavigate()
  const totalSets = session.exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0)
  const duration = session.finishedAt ? session.finishedAt - session.startedAt : 0

  return (
    <Card interactive onClick={() => navigate(`/history/${session.id}`)} className="p-4">
      <div className="flex items-center justify-between">
        <Badge tone={CATEGORY_TONE[session.category]}>{session.category.toUpperCase()}</Badge>
        <span className="text-xs text-text-faint">{formatDate(session.date)}</span>
      </div>
      <h3 className="mt-2 font-display text-lg font-bold text-text">{session.workoutName}</h3>
      <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
        <span>{session.exercises.length} exercises</span>
        <span>{totalSets} sets</span>
        <span>{formatVolume(sessionVolume(session), unit)}</span>
        {duration > 0 && <span>{formatDuration(duration)}</span>}
      </div>
    </Card>
  )
}
