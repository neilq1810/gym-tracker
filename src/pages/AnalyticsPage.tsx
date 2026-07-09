import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VolumeBarChart } from '@/components/analytics/VolumeBarChart'
import { ExerciseSearch } from '@/components/analytics/ExerciseSearch'
import { EmptyState } from '@/components/ui/EmptyState'
import { FlameIcon, BarChartIcon, TrophyIcon, DumbbellIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { useAppStore } from '@/store/useAppStore'
import { getExerciseById } from '@/data/exercises'
import { SPLITS } from '@/data/schedule'
import {
  currentStreak,
  monthlyVolume,
  totalWeightLifted,
  totalWorkoutsCompleted,
  volumeByWeek,
  weeklyVolume,
} from '@/lib/analytics'
import { computePersonalRecord } from '@/lib/calculations'
import { formatDate, formatVolume, formatWeight } from '@/utils/format'
import type { MuscleCategory } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

export function AnalyticsPage() {
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const settings = useAppStore((s) => s.settings)

  const stats = useMemo(
    () => ({
      streak: currentStreak(sessions),
      totalWorkouts: totalWorkoutsCompleted(sessions),
      weekVolume: weeklyVolume(sessions),
      monthVolume: monthlyVolume(sessions),
      totalWeight: totalWeightLifted(sessions),
    }),
    [sessions],
  )

  const weeklySeries = useMemo(() => volumeByWeek(sessions, 8), [sessions])

  const splitStats = useMemo(
    () =>
      SPLITS.map((split) => {
        const splitSessions = sessions.filter((s) => s.status === 'completed' && s.splitId === split.id)
        const lastDate = splitSessions.reduce<string | null>(
          (latest, s) => (!latest || s.date > latest ? s.date : latest),
          null,
        )
        return { split, count: splitSessions.length, lastDate }
      }),
    [sessions],
  )

  const prList = useMemo(() => {
    const exerciseIds = new Set<string>()
    for (const s of sessions) {
      if (s.status !== 'completed') continue
      for (const log of s.exercises) exerciseIds.add(log.exerciseId)
    }
    return Array.from(exerciseIds)
      .map((id) => ({ exercise: getExerciseById(id), pr: computePersonalRecord(sessions, id) }))
      .filter((r) => r.exercise && r.pr.bestEstOneRm)
      .sort((a, b) => (b.pr.bestEstOneRm?.value ?? 0) - (a.pr.bestEstOneRm?.value ?? 0))
  }, [sessions])

  return (
    <PageContainer className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text">Analytics</h1>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Card className="flex flex-col items-center gap-1 py-4">
          <FlameIcon className="h-5 w-5 text-accent" />
          <span className="font-display text-xl font-bold text-text">{stats.streak}d</span>
          <span className="text-[11px] text-text-faint">Current Streak</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <TrophyIcon className="h-5 w-5 text-legs" />
          <span className="font-display text-xl font-bold text-text">{stats.totalWorkouts}</span>
          <span className="text-[11px] text-text-faint">Total Workouts</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <BarChartIcon className="h-5 w-5 text-pull" />
          <span className="font-display text-xl font-bold text-text">{formatVolume(stats.weekVolume, settings.unit)}</span>
          <span className="text-[11px] text-text-faint">Weekly Volume</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <BarChartIcon className="h-5 w-5 text-pull" />
          <span className="font-display text-xl font-bold text-text">{formatVolume(stats.monthVolume, settings.unit)}</span>
          <span className="text-[11px] text-text-faint">Monthly Volume</span>
        </Card>
      </div>

      <Card className="p-4 text-center">
        <p className="text-xs font-semibold text-text-faint">TOTAL WEIGHT LIFTED (ALL TIME)</p>
        <p className="mt-1 font-display text-3xl font-bold text-accent">{formatVolume(stats.totalWeight, settings.unit)}</p>
      </Card>

      {sessions.some((s) => s.status === 'completed') ? (
        <Card className="p-4">
          <p className="mb-2 text-sm font-semibold text-text-muted">Weekly Volume (last 8 weeks)</p>
          <VolumeBarChart data={weeklySeries} unit={settings.unit} />
        </Card>
      ) : (
        <EmptyState
          icon={<DumbbellIcon className="h-10 w-10" />}
          title="No data yet"
          description="Complete a few workouts to unlock trends."
        />
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-text-faint">PROGRESS BY SPLIT</p>
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
          {splitStats.map(({ split, count, lastDate }, i) => (
            <button
              key={split.id}
              onClick={() => navigate(`/split/${split.id}`)}
              className={`flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-surface-raised ${
                i !== 0 ? 'border-t border-border' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge tone={CATEGORY_TONE[split.category]}>{split.category.toUpperCase()}</Badge>
                <span className="text-sm font-medium text-text">{split.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-faint">
                <span>
                  {count} {count === 1 ? 'session' : 'sessions'}
                  {lastDate && ` · last ${formatDate(lastDate)}`}
                </span>
                <ChevronRightIcon className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {prList.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-text-faint">PERSONAL RECORDS</p>
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
            {prList.map(({ exercise, pr }, i) => (
              <button
                key={exercise!.id}
                onClick={() => navigate(`/exercise/${exercise!.id}`)}
                className={`flex items-center justify-between px-4 py-3 text-left hover:bg-surface-raised ${
                  i !== 0 ? 'border-t border-border' : ''
                }`}
              >
                <span className="text-sm font-medium text-text">{exercise!.name}</span>
                <span className="flex items-center gap-1 text-sm text-accent">
                  <TrophyIcon className="h-3.5 w-3.5" />
                  {formatWeight(Math.round((pr.bestEstOneRm?.value ?? 0) * 10) / 10, settings.unit)} 1RM
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-text-faint">EXERCISE LIBRARY</p>
        <ExerciseSearch />
      </div>
    </PageContainer>
  )
}
