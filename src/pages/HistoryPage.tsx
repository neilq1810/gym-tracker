import { useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { WorkoutHistoryCard } from '@/components/history/WorkoutHistoryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { HistoryIcon } from '@/components/ui/Icons'
import { useAppStore } from '@/store/useAppStore'
import { getDayProgram } from '@/data/schedule'
import type { MuscleCategory } from '@/types'

const FILTERS: { key: MuscleCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'push', label: 'Push' },
  { key: 'pull', label: 'Pull' },
  { key: 'legs', label: 'Legs' },
]

export function HistoryPage() {
  const sessions = useAppStore((s) => s.sessions)
  const settings = useAppStore((s) => s.settings)
  const [filter, setFilter] = useState<MuscleCategory | 'all'>('all')

  const completed = useMemo(
    () =>
      sessions
        .filter((s) => s.status === 'completed')
        .sort((a, b) => b.date.localeCompare(a.date) || b.startedAt - a.startedAt),
    [sessions],
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return completed
    return completed.filter((s) => getDayProgram(s.day).category === filter)
  }, [completed, filter])

  return (
    <PageContainer className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold text-text">History</h1>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-accent text-white' : 'bg-surface-raised text-text-muted hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-10 w-10" />}
          title="No workouts yet"
          description="Finish a workout and it will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((session) => (
            <WorkoutHistoryCard key={session.id} session={session} unit={settings.unit} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
