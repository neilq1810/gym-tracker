import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressLineChart } from '@/components/progress/ProgressLineChart'
import { ArrowLeftIcon, TrendingUpIcon, TrophyIcon } from '@/components/ui/Icons'
import { getExerciseById } from '@/data/exercises'
import { TEMPO_GUIDES } from '@/data/tempoGuides'
import { useAppStore } from '@/store/useAppStore'
import {
  computePersonalRecord,
  getExerciseHistory,
  suggestProgressiveOverload,
} from '@/lib/calculations'
import { formatDate, formatVolume, formatWeight } from '@/utils/format'
import type { MuscleCategory } from '@/types'

const CATEGORY_TONE: Record<MuscleCategory, 'push' | 'pull' | 'legs' | 'neutral'> = {
  push: 'push',
  pull: 'pull',
  legs: 'legs',
  rest: 'neutral',
}

export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const settings = useAppStore((s) => s.settings)

  const exercise = id ? getExerciseById(id) : undefined
  const history = useMemo(() => (id ? getExerciseHistory(sessions, id) : []), [sessions, id])
  const pr = useMemo(() => (id ? computePersonalRecord(sessions, id) : null), [sessions, id])

  const lastLog = useMemo(() => {
    if (!id) return null
    const completed = sessions
      .filter((s) => s.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date) || b.startedAt - a.startedAt)
    for (const session of completed) {
      const log = session.exercises.find((e) => e.exerciseId === id)
      if (log) return log
    }
    return null
  }, [sessions, id])

  if (!exercise) {
    return (
      <PageContainer>
        <p className="text-text-muted">Exercise not found.</p>
      </PageContainer>
    )
  }

  const tempo = TEMPO_GUIDES[exercise.tempoGuide]
  const suggestion = lastLog ? suggestProgressiveOverload(lastLog) : null
  const latest = history[history.length - 1]

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
        <Badge tone={CATEGORY_TONE[exercise.category]}>{exercise.category.toUpperCase()}</Badge>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-text">{exercise.name}</h1>
        <p className="text-sm text-text-muted">{exercise.muscleGroups.join(' · ')} &middot; {exercise.equipment}</p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<TrendingUpIcon className="h-10 w-10" />}
          title="No history yet"
          description="Log this exercise in a workout to start tracking progress."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{formatWeight(latest.bestWeight, settings.unit)}</p>
              <p className="text-[11px] text-text-faint">Last weight</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{formatWeight(latest.estOneRm, settings.unit)}</p>
              <p className="text-[11px] text-text-faint">Est. 1RM</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="font-display text-lg font-bold text-text">{formatVolume(latest.volume, settings.unit)}</p>
              <p className="text-[11px] text-text-faint">Last volume</p>
            </Card>
          </div>

          {suggestion && suggestion.verdict !== 'insufficient-data' && (
            <div
              className={`rounded-2xl p-3 text-sm font-medium ${
                suggestion.verdict === 'increase' ? 'bg-success-soft text-success' : 'bg-surface-raised text-text-muted'
              }`}
            >
              {suggestion.message}
            </div>
          )}

          <Card className="p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-text-faint">
              <TrophyIcon className="h-3.5 w-3.5" /> PERSONAL RECORDS
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-base font-bold text-text">
                  {pr?.bestWeight ? formatWeight(pr.bestWeight.weight, settings.unit) : '—'}
                </p>
                <p className="text-[10px] text-text-faint">Best weight</p>
              </div>
              <div>
                <p className="font-display text-base font-bold text-text">
                  {pr?.bestEstOneRm ? formatWeight(Math.round(pr.bestEstOneRm.value * 10) / 10, settings.unit) : '—'}
                </p>
                <p className="text-[10px] text-text-faint">Best 1RM</p>
              </div>
              <div>
                <p className="font-display text-base font-bold text-text">
                  {pr?.bestVolume ? formatVolume(pr.bestVolume.value, settings.unit) : '—'}
                </p>
                <p className="text-[10px] text-text-faint">Best volume</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <ProgressLineChart data={history} dataKey="bestWeight" color="var(--color-accent)" unit={settings.unit} title="Weight Progression" />
          </Card>
          <Card className="p-4">
            <ProgressLineChart data={history} dataKey="estOneRm" color="var(--color-pull)" unit={settings.unit} title="Estimated 1RM Progression" />
          </Card>
          <Card className="p-4">
            <ProgressLineChart data={history} dataKey="volume" color="var(--color-legs)" unit={settings.unit} title="Volume Progression" />
          </Card>

          <div>
            <p className="mb-2 text-xs font-semibold text-text-faint">SESSION LOG</p>
            <div className="flex flex-col gap-1.5">
              {history
                .slice()
                .reverse()
                .map((h) => (
                  <button
                    key={h.sessionId}
                    onClick={() => navigate(`/history/${h.sessionId}`)}
                    className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-sm hover:bg-surface-hover"
                  >
                    <span className="text-text-muted">{formatDate(h.date)}</span>
                    <span className="text-text">
                      {h.bestWeight} {settings.unit} &times; {h.bestReps}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      <Card className="p-4">
        <p className="mb-2 text-xs font-semibold text-text-faint">TEMPO &middot; {tempo.title}</p>
        <ul className="space-y-1 text-sm text-text-muted">
          {tempo.cues.map((cue) => (
            <li key={cue}>&bull; {cue}</li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  )
}
