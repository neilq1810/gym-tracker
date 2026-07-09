import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { EXERCISES } from '@/data/exercises'

export function ExerciseSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return EXERCISES
    return EXERCISES.filter(
      (e) => e.name.toLowerCase().includes(q) || e.muscleGroups.some((m) => m.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises or muscle groups"
          className="h-11 w-full rounded-xl border border-border bg-surface-raised pl-10 pr-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border">
        {results.length === 0 ? (
          <p className="p-4 text-center text-sm text-text-faint">No exercises match "{query}"</p>
        ) : (
          results.map((exercise, i) => (
            <button
              key={exercise.id}
              onClick={() => navigate(`/exercise/${exercise.id}`)}
              className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-surface-raised ${
                i !== 0 ? 'border-t border-border' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-text">{exercise.name}</p>
                <p className="text-xs text-text-faint">{exercise.muscleGroups.join(', ')}</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-text-faint" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
