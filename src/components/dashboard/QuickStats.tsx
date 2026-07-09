import { Card } from '@/components/ui/Card'
import { FlameIcon, BarChartIcon, TrophyIcon } from '@/components/ui/Icons'
import { formatVolume } from '@/utils/format'

interface QuickStatsProps {
  streak: number
  weekVolume: number
  totalWorkouts: number
  unit: string
}

export function QuickStats({ streak, weekVolume, totalWorkouts, unit }: QuickStatsProps) {
  const stats = [
    { label: 'Streak', value: `${streak}d`, icon: FlameIcon, tint: 'text-accent' },
    { label: 'This Week', value: formatVolume(weekVolume, unit), icon: BarChartIcon, tint: 'text-pull' },
    { label: 'Workouts', value: String(totalWorkouts), icon: TrophyIcon, tint: 'text-legs' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map(({ label, value, icon: Icon, tint }) => (
        <Card key={label} className="flex flex-col items-center gap-1 py-4">
          <Icon className={`h-5 w-5 ${tint}`} />
          <span className="font-display text-lg font-bold text-text">{value}</span>
          <span className="text-[11px] text-text-faint">{label}</span>
        </Card>
      ))}
    </div>
  )
}
