import clsx from 'clsx'
import { WEEKLY_SCHEDULE } from '@/data/schedule'
import { CheckIcon } from '@/components/ui/Icons'
import type { WorkoutDay, WorkoutSession } from '@/types'

const SHORT_LABEL: Record<WorkoutDay, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
}

/** Dates (yyyy-mm-dd) for the Mon-Sun week containing `reference`. */
function currentWeekDates(reference: Date): Record<WorkoutDay, string> {
  const jsDay = reference.getDay() // 0=Sun
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay
  const monday = new Date(reference)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() + mondayOffset)

  const order: WorkoutDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const result = {} as Record<WorkoutDay, string>
  order.forEach((day, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    result[day] = d.toISOString().slice(0, 10)
  })
  return result
}

interface WeekScheduleStripProps {
  today: WorkoutDay
  sessions: WorkoutSession[]
}

export function WeekScheduleStrip({ today, sessions }: WeekScheduleStripProps) {
  const dates = currentWeekDates(new Date())
  const completedDates = new Set(sessions.filter((s) => s.status === 'completed').map((s) => s.date))

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {WEEKLY_SCHEDULE.map((program) => {
        const isToday = program.day === today
        const isDone = completedDates.has(dates[program.day])
        const isRest = program.category === 'rest'
        return (
          <div
            key={program.day}
            className={clsx(
              'flex min-w-[52px] flex-1 flex-col items-center gap-1.5 rounded-2xl border py-3 transition-colors',
              isToday ? 'border-accent bg-accent-soft' : 'border-border bg-surface',
            )}
          >
            <span className={clsx('text-[11px] font-semibold uppercase', isToday ? 'text-accent' : 'text-text-faint')}>
              {SHORT_LABEL[program.day]}
            </span>
            <div
              className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold',
                isDone
                  ? 'bg-success text-bg'
                  : isRest
                    ? 'bg-transparent text-text-faint'
                    : 'bg-surface-raised text-text-muted',
              )}
            >
              {isDone ? <CheckIcon className="h-4 w-4" strokeWidth={3} /> : isRest ? '-' : program.workoutName?.slice(-1)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
