import type { ReactNode } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDownIcon } from './Icons'

interface CollapsibleProps {
  header: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

export function Collapsible({ header, children, defaultOpen = true }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0 flex-1">{header}</div>
        <ChevronDownIcon
          className={clsx('h-5 w-5 shrink-0 text-text-faint transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div
        className={clsx(
          'grid transition-all duration-200 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
