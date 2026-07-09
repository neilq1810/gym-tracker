import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

/** Compact tick label so 4+ digit values don't get clipped by the axis width. */
function compactTick(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  return String(value)
}

interface VolumeBarChartProps {
  data: { label: string; volume: number }[]
  unit: string
}

interface BarTooltipItem {
  value: number
  payload: { label: string }
}

function BarTooltipContent({ active, payload, unit }: { active?: boolean; payload?: BarTooltipItem[]; unit: string }) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-xl">
      <p className="text-text-faint">Week of {point.payload.label}</p>
      <p className="font-semibold text-text">
        {Math.round(point.value)} {unit}
      </p>
    </div>
  )
}

export function VolumeBarChart({ data, unit }: VolumeBarChartProps) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="label" stroke="var(--color-text-faint)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            stroke="var(--color-text-faint)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={46}
            tickFormatter={compactTick}
          />
          <Tooltip content={<BarTooltipContent unit={unit} />} cursor={{ fill: 'var(--color-surface-raised)' }} />
          <Bar dataKey="volume" fill="var(--color-accent)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
