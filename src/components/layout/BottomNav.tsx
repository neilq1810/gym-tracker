import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { HomeIcon, HistoryIcon, BarChartIcon, SettingsIcon } from '@/components/ui/Icons'

const TABS = [
  { to: '/', label: 'Today', icon: HomeIcon, end: true },
  { to: '/history', label: 'History', icon: HistoryIcon, end: false },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon, end: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur safe-bottom sm:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-accent' : 'text-text-faint',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('h-6 w-6', isActive && 'drop-shadow-[0_0_8px_rgba(255,90,31,0.5)]')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
