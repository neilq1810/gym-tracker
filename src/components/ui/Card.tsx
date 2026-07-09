import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  interactive?: boolean
}

export function Card({ children, className, interactive, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-surface',
        interactive && 'transition-colors active:bg-surface-hover cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
