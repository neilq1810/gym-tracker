import type { ReactNode } from 'react'
import clsx from 'clsx'

type BadgeTone = 'push' | 'pull' | 'legs' | 'neutral' | 'success' | 'warning'

const toneClasses: Record<BadgeTone, string> = {
  push: 'bg-push/15 text-push border-push/30',
  pull: 'bg-pull/15 text-pull border-pull/30',
  legs: 'bg-legs/15 text-legs border-legs/30',
  neutral: 'bg-surface-raised text-text-muted border-border',
  success: 'bg-success-soft text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  )
}
