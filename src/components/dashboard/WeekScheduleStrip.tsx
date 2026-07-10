import clsx from 'clsx'
import { DEFAULT_SCHEDULE, getSplitById } from '@/data/schedule'
import { CheckIcon } from '@/components/ui/Icons'
import { toLocalDateString } from '@/utils/format'
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

const DAY_DISPLAY_ORDER: WorkoutDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

/** Dates (yyyy-mm-dd) for the Mon-Sun week containing `reference`. */
function currentWeekDates(reference: Date): Record<WorkoutDay, string> {
  const jsDay = reference.getDay() // 0=Sun
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay
  const monday = new Date(reference)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() + mondayOffset)

  const result = {} as Record<WorkoutDay, string>
  DAY_DISPLAY_ORDER.forEach((day, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    result[day] = toLocalDateString(d)
  })
  return result
}

interface WeekScheduleStripProps {
  today: WorkoutDay
  sessions: WorkoutSession[]
}

/**
 * Shows the actual split performed on each day this week when one was
 * logged (however it deviated from the default rotation), falling back to
 * the suggested split as a faint placeholder for days not yet trained.
 */
export function WeekScheduleStrip({ today, sessions }: WeekScheduleStripProps) {
  const dates = currentWeekDates(new Date())
  const completedByDate = new Map(
    sessions.filter((s) => s.status === 'completed').map((s) => [s.date, s]),
  )

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {DAY_DISPLAY_ORDER.map((day) => {
        const isToday = day === today
        const sessionOnDay = completedByDate.get(dates[day])
        const suggestedId = DEFAULT_SCHEDULE[day]
        const suggested = suggestedId ? getSplitById(suggestedId) : null
        const isDone = !!sessionOnDay
        const label = sessionOnDay?.workoutName ?? suggested?.name ?? null

        return (
          <div
            key={day}
            className={clsx(
              'flex min-w-[52px] flex-1 flex-col items-center gap-1.5 rounded-2xl border py-3 transition-colors',
              isToday ? 'border-accent bg-accent-soft' : 'border-border bg-surface',
            )}
            title={label ?? 'Rest day'}
          >
            <span className={clsx('text-[11px] font-semibold uppercase', isToday ? 'text-accent' : 'text-text-faint')}>
              {SHORT_LABEL[day]}
            </span>
            <div
              className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold',
                isDone
                  ? 'bg-success text-bg'
                  : label
                    ? 'bg-surface-raised text-text-muted'
                    : 'bg-transparent text-text-faint',
              )}
            >
              {isDone ? <CheckIcon className="h-4 w-4" strokeWidth={3} /> : (label?.slice(-1) ?? '-')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
