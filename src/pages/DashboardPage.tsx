import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard'
import { WeekScheduleStrip } from '@/components/dashboard/WeekScheduleStrip'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { ActiveWorkoutBanner } from '@/components/dashboard/ActiveWorkoutBanner'
import { Button } from '@/components/ui/Button'
import { CopyIcon } from '@/components/ui/Icons'
import { getTodayProgram, jsDayIndexToWorkoutDay } from '@/data/schedule'
import { useAppStore } from '@/store/useAppStore'
import { currentStreak, totalWorkoutsCompleted, weeklyVolume } from '@/lib/analytics'

export function DashboardPage() {
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const activeSession = useAppStore((s) => s.activeSession)
  const settings = useAppStore((s) => s.settings)
  const startWorkout = useAppStore((s) => s.startWorkout)
  const duplicateWorkout = useAppStore((s) => s.duplicateWorkout)

  const today = useMemo(() => new Date(), [])
  const program = useMemo(() => getTodayProgram(today), [today])
  const todayWorkoutDay = jsDayIndexToWorkoutDay(today.getDay())

  const streak = useMemo(() => currentStreak(sessions, today), [sessions, today])
  const weekVolume = useMemo(() => weeklyVolume(sessions, today), [sessions, today])
  const totalWorkouts = useMemo(() => totalWorkoutsCompleted(sessions), [sessions])

  const lastMatchingSession = useMemo(() => {
    if (!program.workoutName) return null
    return sessions
      .filter((s) => s.status === 'completed' && s.workoutName === program.workoutName)
      .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
  }, [sessions, program.workoutName])

  function handleStart() {
    startWorkout(program)
    navigate('/workout')
  }

  function handleRepeat() {
    if (!lastMatchingSession) return
    duplicateWorkout(lastMatchingSession)
    navigate('/workout')
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

      <TodayWorkoutCard program={program} onStart={handleStart} disabled={!!activeSession} />

      {!activeSession && lastMatchingSession && program.category !== 'rest' && (
        <Button variant="secondary" onClick={handleRepeat}>
          <CopyIcon className="h-4 w-4" />
          Repeat last {program.workoutName}
        </Button>
      )}
    </PageContainer>
  )
}
