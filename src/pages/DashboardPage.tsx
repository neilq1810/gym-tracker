import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard'
import { WeekScheduleStrip } from '@/components/dashboard/WeekScheduleStrip'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { ActiveWorkoutBanner } from '@/components/dashboard/ActiveWorkoutBanner'
import { SplitPickerModal } from '@/components/dashboard/SplitPickerModal'
import { Button } from '@/components/ui/Button'
import { CopyIcon } from '@/components/ui/Icons'
import { DEFAULT_SCHEDULE, getSplitById, getTodaysSuggestedSplit, jsDayIndexToWorkoutDay } from '@/data/schedule'
import { useAppStore } from '@/store/useAppStore'
import { currentStreak, totalWorkoutsCompleted, weeklyVolume } from '@/lib/analytics'
import type { SplitId } from '@/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const activeSession = useAppStore((s) => s.activeSession)
  const settings = useAppStore((s) => s.settings)
  const startWorkout = useAppStore((s) => s.startWorkout)
  const duplicateWorkout = useAppStore((s) => s.duplicateWorkout)

  const today = useMemo(() => new Date(), [])
  const todayWorkoutDay = jsDayIndexToWorkoutDay(today.getDay())
  const isRestDay = DEFAULT_SCHEDULE[todayWorkoutDay] === null
  const suggestedSplit = useMemo(() => getTodaysSuggestedSplit(today), [today])

  const [selectedSplitId, setSelectedSplitId] = useState<SplitId | null>(suggestedSplit?.id ?? null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const selectedSplit = selectedSplitId ? getSplitById(selectedSplitId) : null

  const streak = useMemo(() => currentStreak(sessions, today), [sessions, today])
  const weekVolume = useMemo(() => weeklyVolume(sessions, today), [sessions, today])
  const totalWorkouts = useMemo(() => totalWorkoutsCompleted(sessions), [sessions])

  const lastMatchingSession = useMemo(() => {
    if (!selectedSplit) return null
    return (
      sessions
        .filter((s) => s.status === 'completed' && s.splitId === selectedSplit.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
    )
  }, [sessions, selectedSplit])

  function handleStart() {
    if (!selectedSplit) return
    startWorkout(selectedSplit)
    navigate('/workout')
  }

  function handleRepeat() {
    if (!lastMatchingSession) return
    duplicateWorkout(lastMatchingSession)
    navigate('/workout')
  }

  function handlePickSplit(splitId: SplitId) {
    setSelectedSplitId(splitId)
    setPickerOpen(false)
  }

  return (
    <PageContainer className="flex flex-col gap-5">
      <header className="flex items-center justify-between pt-1">
        <div>
          <p className="text-sm text-text-muted">
            {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display text-2xl font-bold text-text">
            {activeSession ? 'Keep going 💪' : 'Ready to train?'}
          </h1>
        </div>
      </header>

      {activeSession && <ActiveWorkoutBanner session={activeSession} />}

      <WeekScheduleStrip today={todayWorkoutDay} sessions={sessions} />

      <QuickStats streak={streak} weekVolume={weekVolume} totalWorkouts={totalWorkouts} unit={settings.unit} />

      <TodayWorkoutCard
        split={selectedSplit}
        isRestDay={isRestDay}
        onStart={handleStart}
        onChooseDifferent={() => setPickerOpen(true)}
        disabled={!!activeSession}
      />

      {!activeSession && lastMatchingSession && selectedSplit && (
        <Button variant="secondary" onClick={handleRepeat}>
          <CopyIcon className="h-4 w-4" />
          Repeat last {selectedSplit.name}
        </Button>
      )}

      <SplitPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePickSplit}
        suggestedSplitId={suggestedSplit?.id}
      />
    </PageContainer>
  )
}
