import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { HomeIcon, HistoryIcon, BarChartIcon, SettingsIcon, DumbbellIcon } from '@/components/ui/Icons'

const TABS = [
  { to: '/', label: 'Today', icon: HomeIcon, end: true },
  { to: '/history', label: 'History', icon: HistoryIcon, end: false },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon, end: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

/** Left rail navigation shown on wider viewports; BottomNav takes over on mobile. */
export function SideNav() {
  return (
    <nav className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-surface p-4 sm:flex">
      <div className="mb-8 flex items-center gap-2 px-2 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <DumbbellIcon className="h-5 w-5" />
        </div>
        <span className="font-display text-base font-bold tracking-tight text-text">PPL Tracker</span>
      </div>
      <div className="flex flex-col gap-1">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-accent/15 text-accent' : 'text-text-muted hover:bg-surface-raised hover:text-text',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
