import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressLineChart } from '@/components/progress/ProgressLineChart'
import { ArrowLeftIcon, ChevronRightIcon, TrendingUpIcon } from '@/components/ui/Icons'
import { getSplitById } from '@/data/schedule'
import { getExerciseById } from '@/data/exercises'
import { useAppStore } from '@/store/useAppStore'
import { sessionVolume } from '@/lib/calculations'
import { formatDate, formatDuration, formatVolume } from '@/utils/format'
import type { MuscleCategory, SplitId } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

export function SplitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const settings = useAppStore((s) => s.settings)

  const split = id ? getSplitById(id as SplitId) : undefined

  const splitSessions = useMemo(
    () =>
      split
        ? sessions
            .filter((s) => s.status === 'completed' && s.splitId === split.id)
            .sort((a, b) => a.date.localeCompare(b.date) || a.startedAt - b.startedAt)
        : [],
    [sessions, split],
  )

  const chartData = useMemo(
    () => splitSessions.map((s) => ({ date: s.date, sessionId: s.id, volume: Math.round(sessionVolume(s)) })),
    [splitSessions],
  )

  const stats = useMemo(() => {
    if (splitSessions.length === 0) return null
    const volumes = splitSessions.map((s) => sessionVolume(s))
    const durations = splitSessions
      .filter((s) => s.finishedAt)
      .map((s) => (s.finishedAt as number) - s.startedAt)
    return {
      count: splitSessions.length,
      lastDate: splitSessions[splitSessions.length - 1].date,
      bestVolume: Math.max(...volumes),
      avgVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length,
      avgDuration: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
    }
  }, [splitSessions])

  if (!split) {
    return (
      <PageContainer>
        <p className="text-text-muted">Split not found.</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <Badge tone={CATEGORY_TONE[split.category]}>{split.category.toUpperCase()}</Badge>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-text">{split.name}</h1>
        <p className="text-sm text-text-muted">{split.exercises.length} exercises</p>
      </div>

      {!stats ? (
        <EmptyState
          icon={<TrendingUpIcon className="h-10 w-10" />}
          title="No history yet"
          description={`Log a ${split.name} workout to start tracking progress for this split.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{stats.count}</p>
              <p className="text-[11px] text-text-faint">Sessions</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{formatVolume(stats.avgVolume, settings.unit)}</p>
              <p className="text-[11px] text-text-faint">Avg volume</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{formatVolume(stats.bestVolume, settings.unit)}</p>
              <p className="text-[11px] text-text-faint">Best volume</p>
            </Card>
          </div>

          {stats.avgDuration > 0 && (
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{formatDuration(stats.avgDuration)}</p>
              <p className="text-[11px] text-text-faint">Average duration</p>
            </Card>
          )}

          <Card className="p-4">
            <ProgressLineChart
              data={chartData}
              dataKey="volume"
              color="var(--color-accent)"
              unit={settings.unit}
              title="Volume Progression"
            />
          </Card>

          <div>
            <p className="mb-2 text-xs font-semibold text-text-faint">SESSION LOG</p>
            <div className="flex flex-col gap-1.5">
              {splitSessions
                .slice()
                .reverse()
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/history/${s.id}`)}
                    className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-sm hover:bg-surface-hover"
                  >
                    <span className="text-text-muted">{formatDate(s.date)}</span>
                    <span className="text-text">{formatVolume(sessionVolume(s), settings.unit)}</span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-text-faint">EXERCISES IN THIS SPLIT</p>
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
          {split.exercises.map((ex, i) => {
            const exercise = getExerciseById(ex.exerciseId)
            return (
              <button
                key={ex.exerciseId}
                onClick={() => navigate(`/exercise/${ex.exerciseId}`)}
                className={`flex items-center justify-between px-4 py-3 text-left hover:bg-surface-raised ${
                  i !== 0 ? 'border-t border-border' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-text">{exercise?.name ?? ex.exerciseId}</p>
                  <p className="text-xs text-text-faint">
                    {ex.targetSets} &times; {ex.repRangeMin}-{ex.repRangeMax}
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-text-faint" />
              </button>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}
