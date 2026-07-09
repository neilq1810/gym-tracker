import clsx from 'clsx'
import { CheckIcon } from './Icons'

interface SetCompleteToggleProps {
  completed: boolean
  onToggle: () => void
  disabled?: boolean
}

/** Large tap target used to mark a set complete — the core "in-gym" interaction. */
export function SetCompleteToggle({ completed, onToggle, disabled }: SetCompleteToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={completed}
      aria-label={completed ? 'Mark set incomplete' : 'Mark set complete'}
      disabled={disabled}
      onClick={onToggle}
      className={clsx(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-150 active:scale-90',
        completed
          ? 'border-success bg-success text-bg shadow-lg shadow-success/25'
          : 'border-border-strong bg-surface-raised text-transparent hover:border-text-faint',
        disabled && 'opacity-40',
      )}
    >
      <CheckIcon className="h-6 w-6" strokeWidth={3} />
    </button>
  )
}
