import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  colorClassName?: string
  trackClassName?: string
}

export function ProgressBar({ value, max, className, colorClassName, trackClassName }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-surface-raised', trackClassName, className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500 ease-out', colorClassName ?? 'bg-accent')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
