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

/**
 * Formats a Date as a local-calendar yyyy-mm-dd string. Deliberately not
 * `date.toISOString().slice(0, 10)` — that converts to UTC first, which
 * silently rolls the date forward or back a day for anyone not on UTC
 * (e.g. a Friday-night workout logged after ~7pm US Eastern becomes
 * "Saturday" in UTC). Always build date-only strings from local
 * year/month/day components instead.
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Parses a yyyy-mm-dd string as local midnight (not UTC midnight). */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function todayIso(): string {
  return toLocalDateString(new Date())
}
