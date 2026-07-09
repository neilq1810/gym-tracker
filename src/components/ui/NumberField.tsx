import type { ChangeEvent } from 'react'
import clsx from 'clsx'

interface NumberFieldProps {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  placeholder?: string
  className?: string
  disabled?: boolean
}

/** Numeric input tuned for fast thumb entry — big hit area, selects all on focus. */
export function NumberField({
  value,
  onChange,
  step = 1,
  min = 0,
  placeholder,
  className,
  disabled,
}: NumberFieldProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') {
      onChange(0)
      return
    }
    const parsed = Number(raw)
    if (!Number.isNaN(parsed)) onChange(parsed)
  }

  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      disabled={disabled}
      placeholder={placeholder}
      value={value === 0 ? '' : value}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
      className={clsx(
        'h-11 w-full rounded-xl border border-border bg-surface-raised text-center text-base font-semibold text-text',
        'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
        'placeholder:text-text-faint placeholder:font-normal',
        'disabled:opacity-50',
        className,
      )}
    />
  )
}
