import type { ReactNode } from 'react'
import clsx from 'clsx'

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'mx-auto w-full max-w-lg px-4 pb-24 pt-[calc(env(safe-area-inset-top)+1.25rem)] sm:max-w-2xl sm:pb-12',
        className,
      )}
    >
      {children}
    </div>
  )
}
