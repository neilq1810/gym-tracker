export function formatWeight(weight: number, unit: string): string {
  const trimmed = Number.isInteger(weight) ? weight.toString() : weight.toFixed(1)
  return `${trimmed} ${unit}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatVolume(volume: number, unit: string): string {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k ${unit}`
  }
  return `${Math.round(volume)} ${unit}`
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
