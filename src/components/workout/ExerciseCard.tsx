import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SetRow } from './SetRow'
import { PlateCalculatorModal } from './PlateCalculatorModal'
import {
  ChevronDownIcon,
  CopyIcon,
  PlusIcon,
  CalculatorIcon,
  TrophyIcon,
} from '@/components/ui/Icons'
import { getExerciseById } from '@/data/exercises'
import { TEMPO_GUIDES } from '@/data/tempoGuides'
import { useAppStore } from '@/store/useAppStore'
import { useRestTimerStore } from '@/store/useRestTimerStore'
import { findPreviousLog, computePersonalRecord, workingSets, estimateOneRm, suggestProgressiveOverload } from '@/lib/calculations'
import { formatWeight } from '@/utils/format'
import type { SetEntry, WorkoutExerciseLog } from '@/types'

interface ExerciseCardProps {
  log: WorkoutExerciseLog
  sessionDate: string
  sessionId: string
  index: number
  count: number
}

export function ExerciseCard({ log, sessionDate, sessionId, index, count }: ExerciseCardProps) {
  const [open, setOpen] = useState(true)
  const [plateCalcOpen, setPlateCalcOpen] = useState(false)

  const sessions = useAppStore((s) => s.sessions)
  const settings = useAppStore((s) => s.settings)
  const updateSet = useAppStore((s) => s.updateSet)
  const addSet = useAppStore((s) => s.addSet)
  const removeSet = useAppStore((s) => s.removeSet)
  const copyPrevious = useAppStore((s) => s.copyPreviousIntoExercise)
  const reorderExercises = useAppStore((s) => s.reorderExercises)
  const startRestTimer = useRestTimerStore((s) => s.start)

  function handleSetChange(set: SetEntry, patch: Partial<SetEntry>) {
    updateSet(log.id, set.id, patch)
    if (patch.completed === true && !set.completed) {
      startRestTimer(settings.defaultRestSeconds)
    }
  }

  const exercise = getExerciseById(log.exerciseId)
  const tempo = exercise ? TEMPO_GUIDES[exercise.tempoGuide] : null

  const previous = useMemo(
    () => findPreviousLog(sessions, log.exerciseId, sessionDate, sessionId),
    [sessions, log.exerciseId, sessionDate, sessionId],
  )
  const previousWorkingSets = previous ? workingSets(previous.log.sets) : []

  const pr = useMemo(() => computePersonalRecord(sessions, log.exerciseId), [sessions, log.exerciseId])

  const completedCount = log.sets.filter((s) => s.completed && !s.isWarmup).length
  const workingCount = log.sets.filter((s) => !s.isWarmup).length

  const suggestion = suggestProgressiveOverload(log)
  const currentBestSet = workingSets(log.sets).reduce<{ weight: number; reps: number } | null>((best, s) => {
    if (!best || estimateOneRm(s.weight, s.reps) > estimateOneRm(best.weight, best.reps)) return s
    return best
  }, null)

  const plateTargetWeight = currentBestSet?.weight || previousWorkingSets[0]?.weight || 0

  return (
    <Card className="p-4 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <button className="flex flex-1 items-start gap-3 text-left" onClick={() => setOpen((v) => !v)}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-text">{exercise?.name ?? log.exerciseId}</h3>
              {exercise?.perSide && (
                <Badge tone="neutral">each side</Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-text-faint">
              Target {log.targetSets} &times; {log.repRangeMin}-{log.repRangeMax} reps
            </p>
          </div>
          <ChevronDownIcon className={`mt-1 h-5 w-5 shrink-0 text-text-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <ProgressBar value={completedCount} max={Math.max(workingCount, 1)} colorClassName="bg-success" className="h-1.5" />
        <span className="shrink-0 text-xs font-medium text-text-faint">
          {completedCount}/{workingCount}
        </span>
      </div>

      {open && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex-1 min-w-[140px] rounded-xl bg-surface-raised p-2.5">
              <p className="mb-1 font-semibold text-text-faint">PREVIOUS</p>
              {previousWorkingSets.length > 0 ? (
                <p className="text-text">
                  {previousWorkingSets.map((s) => `${s.weight}×${s.reps}`).join(', ')}
                </p>
              ) : (
                <p className="text-text-faint">No data yet</p>
              )}
            </div>
            <div className="flex-1 min-w-[140px] rounded-xl bg-surface-raised p-2.5">
              <p className="mb-1 flex items-center gap-1 font-semibold text-text-faint">
                <TrophyIcon className="h-3 w-3" /> PERSONAL BEST
              </p>
              {pr.bestWeight ? (
                <p className="text-text">
                  {formatWeight(pr.bestWeight.weight, settings.unit)} &times; {pr.bestWeight.reps}
                </p>
              ) : (
                <p className="text-text-faint">No PR yet</p>
              )}
            </div>
          </div>

          {tempo && (
            <div className="rounded-xl border border-border/70 p-2.5 text-xs">
              <p className="mb-1 font-semibold text-text-faint">TEMPO &middot; {tempo.title}</p>
              <ul className="space-y-0.5 text-text-muted">
                {tempo.cues.map((cue) => (
                  <li key={cue}>&bull; {cue}</li>
                ))}
              </ul>
            </div>
          )}

          {suggestion.verdict !== 'insufficient-data' && (
            <div
              className={`rounded-xl p-2.5 text-xs font-medium ${
                suggestion.verdict === 'increase'
                  ? 'bg-success-soft text-success'
                  : 'bg-surface-raised text-text-muted'
              }`}
            >
              {suggestion.message}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => copyPrevious(log.id)} disabled={!previous}>
              <CopyIcon className="h-3.5 w-3.5" /> Copy previous
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPlateCalcOpen(true)}>
              <CalculatorIcon className="h-3.5 w-3.5" /> Plates
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => reorderExercises(index, index - 1)}
                aria-label="Move exercise up"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-faint hover:bg-surface-raised disabled:opacity-30"
              >
                <ChevronDownIcon className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                disabled={index === count - 1}
                onClick={() => reorderExercises(index, index + 1)}
                aria-label="Move exercise down"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-faint hover:bg-surface-raised disabled:opacity-30"
              >
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-text-faint">
              <span className="w-7">Set</span>
              <span className="w-20">Prev</span>
              <span className="flex-1 text-center">{settings.unit}</span>
              <span className="flex-1 text-center">Reps</span>
            </div>
            <div className="space-y-1">
              {log.sets.map((set, i) => {
                const workingIndex = log.sets.slice(0, i + 1).filter((s) => !s.isWarmup).length
                return (
                  <SetRow
                    key={set.id}
                    set={set}
                    setNumber={set.isWarmup ? 0 : workingIndex}
                    repRangeMin={log.repRangeMin}
                    repRangeMax={log.repRangeMax}
                    previous={previousWorkingSets[i] ? { weight: previousWorkingSets[i].weight, reps: previousWorkingSets[i].reps } : null}
                    onChange={(patch) => handleSetChange(set, patch)}
                    onRemove={() => removeSet(log.id, set.id)}
                  />
                )
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => addSet(log.id)}>
              <PlusIcon className="h-3.5 w-3.5" /> Add set
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addSet(log.id, true)}>
              <PlusIcon className="h-3.5 w-3.5" /> Add warm-up
            </Button>
          </div>
        </div>
      )}

      <PlateCalculatorModal
        open={plateCalcOpen}
        onClose={() => setPlateCalcOpen(false)}
        initialWeight={plateTargetWeight}
      />
    </Card>
  )
}
