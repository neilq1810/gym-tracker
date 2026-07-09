import clsx from 'clsx'
import { useRestTimerStore } from '@/store/useRestTimerStore'
import { useRestTimerTick } from '@/hooks/useRestTimerTick'
import { TimerIcon, PlusIcon, XIcon } from '@/components/ui/Icons'

const PRESETS = [60, 90, 120, 180]

/**
 * Floating rest timer, docked above the bottom nav. Always present during a
 * workout so lifters can start/adjust rest without leaving the exercise list.
 */
export function RestTimerBar() {
  const { remainingSeconds, isRunning, progress } = useRestTimerTick()
  const start = useRestTimerStore((s) => s.start)
  const addSeconds = useRestTimerStore((s) => s.addSeconds)
  const stop = useRestTimerStore((s) => s.stop)

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+64px)] z-30 mx-auto w-full max-w-lg px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 sm:px-0">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur">
        {isRunning && (
          <div className="h-1 w-full bg-surface-raised">
            <div
              className="h-full bg-accent transition-all duration-300 ease-linear"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        )}
        <div className="flex items-center gap-3 p-3">
          <div className="flex items-center gap-2">
            <TimerIcon className={clsx('h-5 w-5', isRunning ? 'text-accent' : 'text-text-faint')} />
            {isRunning ? (
              <span className="font-display text-xl font-bold tabular-nums text-text">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            ) : (
              <span className="text-sm font-medium text-text-faint">Rest timer</span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {isRunning ? (
              <>
                <button
                  onClick={() => addSeconds(30)}
                  className="flex h-9 items-center gap-1 rounded-lg bg-surface-raised px-2.5 text-xs font-semibold text-text hover:bg-surface-hover"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  30s
                </button>
                <button
                  onClick={stop}
                  aria-label="Stop rest timer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-raised text-danger hover:bg-danger-soft"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => start(p)}
                  className="flex h-9 items-center rounded-lg bg-surface-raised px-3 text-xs font-semibold text-text hover:bg-accent hover:text-white"
                >
                  {p}s
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
