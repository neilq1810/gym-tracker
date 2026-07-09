import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'md' | 'lg' | 'sm' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children?: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover active:scale-[0.98] shadow-lg shadow-accent/20',
  secondary: 'bg-surface-raised text-text border border-border hover:bg-surface-hover active:scale-[0.98]',
  ghost: 'bg-transparent text-text-muted hover:bg-surface-raised hover:text-text active:scale-[0.98]',
  danger: 'bg-danger-soft text-danger border border-danger/30 hover:bg-danger/20 active:scale-[0.98]',
  success: 'bg-success text-bg hover:brightness-110 active:scale-[0.98] shadow-lg shadow-success/20',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-14 px-6 text-base gap-2 rounded-2xl font-semibold',
  icon: 'h-11 w-11 rounded-xl',
}

/** Primary interactive control. Large touch targets by default for in-gym use. */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150 select-none',
        'disabled:opacity-40 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
