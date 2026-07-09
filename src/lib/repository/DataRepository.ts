import type { StorageAdapter } from '../storage/StorageAdapter'
import type {
  AppSettings,
  BodyweightEntry,
  DataBackup,
  ProgressPhoto,
  WorkoutSession,
} from '@/types'

const KEYS = {
  sessions: 'ppl-tracker:sessions',
  settings: 'ppl-tracker:settings',
  bodyweight: 'ppl-tracker:bodyweight',
  photos: 'ppl-tracker:progress-photos',
} as const

export const DEFAULT_SETTINGS: AppSettings = {
  unit: 'kg',
  defaultRestSeconds: 90,
  barWeight: 20,
  availablePlates: [25, 20, 15, 10, 5, 2.5, 1.25],
}

/**
 * Single point of access for all persisted app data.
 *
 * This is the layer to extend when adding cloud sync: swap the
 * StorageAdapter for one backed by Firebase/Supabase, or add
 * push/pull sync methods here, without changing any component or store.
 */
export class DataRepository {
  private readonly adapter: StorageAdapter

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter
  }

  // ---- Workout sessions ----

  async getSessions(): Promise<WorkoutSession[]> {
    return (await this.adapter.getItem<WorkoutSession[]>(KEYS.sessions)) ?? []
  }

  async saveSession(session: WorkoutSession): Promise<void> {
    const sessions = await this.getSessions()
    const index = sessions.findIndex((s) => s.id === session.id)
    if (index === -1) {
      sessions.push(session)
    } else {
      sessions[index] = session
    }
    await this.adapter.setItem(KEYS.sessions, sessions)
  }

  async deleteSession(id: string): Promise<void> {
    const sessions = await this.getSessions()
    await this.adapter.setItem(
      KEYS.sessions,
      sessions.filter((s) => s.id !== id),
    )
  }

  // ---- Settings ----

  async getSettings(): Promise<AppSettings> {
    const stored = await this.adapter.getItem<AppSettings>(KEYS.settings)
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await this.adapter.setItem(KEYS.settings, settings)
  }

  // ---- Bodyweight log ----

  async getBodyweightLogs(): Promise<BodyweightEntry[]> {
    return (await this.adapter.getItem<BodyweightEntry[]>(KEYS.bodyweight)) ?? []
  }

  async saveBodyweightEntry(entry: BodyweightEntry): Promise<void> {
    const logs = await this.getBodyweightLogs()
    const index = logs.findIndex((l) => l.id === entry.id)
    if (index === -1) {
      logs.push(entry)
    } else {
      logs[index] = entry
    }
    logs.sort((a, b) => a.date.localeCompare(b.date))
    await this.adapter.setItem(KEYS.bodyweight, logs)
  }

  async deleteBodyweightEntry(id: string): Promise<void> {
    const logs = await this.getBodyweightLogs()
    await this.adapter.setItem(
      KEYS.bodyweight,
      logs.filter((l) => l.id !== id),
    )
  }

  // ---- Progress photos ----

  async getProgressPhotos(): Promise<ProgressPhoto[]> {
    return (await this.adapter.getItem<ProgressPhoto[]>(KEYS.photos)) ?? []
  }

  async savePhoto(photo: ProgressPhoto): Promise<void> {
    const photos = await this.getProgressPhotos()
    photos.push(photo)
    await this.adapter.setItem(KEYS.photos, photos)
  }

  async deletePhoto(id: string): Promise<void> {
    const photos = await this.getProgressPhotos()
    await this.adapter.setItem(
      KEYS.photos,
      photos.filter((p) => p.id !== id),
    )
  }

  // ---- Backup / restore ----

  async exportBackup(): Promise<DataBackup> {
    const [sessions, bodyweightLogs, progressPhotos, settings] = await Promise.all([
      this.getSessions(),
      this.getBodyweightLogs(),
      this.getProgressPhotos(),
      this.getSettings(),
    ])
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions,
      bodyweightLogs,
      progressPhotos,
      settings,
    }
  }

  async importBackup(backup: DataBackup): Promise<void> {
    await Promise.all([
      this.adapter.setItem(KEYS.sessions, backup.sessions),
      this.adapter.setItem(KEYS.bodyweight, backup.bodyweightLogs),
      this.adapter.setItem(KEYS.photos, backup.progressPhotos),
      this.adapter.setItem(KEYS.settings, backup.settings),
    ])
  }
}
