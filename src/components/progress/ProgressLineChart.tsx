import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatDate } from '@/utils/format'

/** Compact tick label so 4+ digit values (e.g. session volume) don't get clipped by the axis width. */
function compactTick(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  return String(value)
}

interface ProgressLineChartProps<T> {
  data: T[]
  dataKey: keyof T & string
  color: string
  unit: string
  title: string
}

interface TooltipPayloadItem {
  value: number
  payload: { date: string }
}

function ChartTooltip({ active, payload, unit }: { active?: boolean; payload?: TooltipPayloadItem[]; unit: string }) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-xl">
      <p className="text-text-faint">{formatDate(point.payload.date)}</p>
      <p className="font-semibold text-text">
        {point.value} {unit}
      </p>
    </div>
  )
}

export function ProgressLineChart<T extends { date: string }>({
  data,
  dataKey,
  color,
  unit,
  title,
}: ProgressLineChartProps<T>) {
  if (data.length < 2) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <p className="mt-1 text-xs text-text-faint">Log a couple more workouts to see a trend.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-text-muted">{title}</p>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => formatDate(d).split(' ').slice(1).join(' ')}
              stroke="var(--color-text-faint)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              stroke="var(--color-text-faint)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={46}
              tickFormatter={compactTick}
            />
            <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: 'var(--color-border-strong)' }} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-surface)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
