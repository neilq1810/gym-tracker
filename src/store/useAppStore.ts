import { create } from 'zustand'
import type {
  AppSettings,
  BodyweightEntry,
  DataBackup,
  DayProgram,
  ProgressPhoto,
  SetEntry,
  WorkoutSession,
} from '@/types'
import { repository, DEFAULT_SETTINGS } from '@/lib/repository'
import { generateId } from '@/lib/id'
import {
  copyPreviousIntoLog,
  createEmptySet,
  createSessionFromPrevious,
  createSessionFromProgram,
} from '@/lib/sessionFactory'
import { findPreviousLog } from '@/lib/calculations'
import { todayIso } from '@/utils/format'

interface AppState {
  loaded: boolean
  sessions: WorkoutSession[]
  activeSession: WorkoutSession | null
  settings: AppSettings
  bodyweightLogs: BodyweightEntry[]
  progressPhotos: ProgressPhoto[]

  init: () => Promise<void>

  // Workout lifecycle
  startWorkout: (program: DayProgram) => void
  duplicateWorkout: (previous: WorkoutSession) => void
  resumeActiveSession: () => void
  finishActiveSession: (notes?: string) => Promise<void>
  cancelActiveSession: () => Promise<void>

  // Editing the in-progress (or a historical, via editSession) workout
  updateSet: (exerciseLogId: string, setId: string, patch: Partial<SetEntry>) => void
  addSet: (exerciseLogId: string, isWarmup?: boolean) => void
  removeSet: (exerciseLogId: string, setId: string) => void
  copyPreviousIntoExercise: (exerciseLogId: string) => void
  reorderExercises: (fromIndex: number, toIndex: number) => void
  setActiveSessionNotes: (notes: string) => void

  // History management
  editSession: (session: WorkoutSession) => Promise<void>
  deleteSession: (id: string) => Promise<void>

  // Settings
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>

  // Bodyweight
  addBodyweightEntry: (weight: number, date?: string) => Promise<void>
  deleteBodyweightEntry: (id: string) => Promise<void>

  // Progress photos
  addProgressPhoto: (dataUrl: string, note?: string) => Promise<void>
  deleteProgressPhoto: (id: string) => Promise<void>

  // Backup
  exportBackup: () => Promise<DataBackup>
  importBackup: (backup: DataBackup) => Promise<void>
}

/** Persists the active session to the repository without blocking the UI. */
function persistSession(session: WorkoutSession) {
  void repository.saveSession(session)
}

function upsertLocal(sessions: WorkoutSession[], session: WorkoutSession): WorkoutSession[] {
  const index = sessions.findIndex((s) => s.id === session.id)
  if (index === -1) return [...sessions, session]
  const next = [...sessions]
  next[index] = session
  return next
}

export const useAppStore = create<AppState>((set, get) => ({
  loaded: false,
  sessions: [],
  activeSession: null,
  settings: DEFAULT_SETTINGS,
  bodyweightLogs: [],
  progressPhotos: [],

  init: async () => {
    const [sessions, settings, bodyweightLogs, progressPhotos] = await Promise.all([
      repository.getSessions(),
      repository.getSettings(),
      repository.getBodyweightLogs(),
      repository.getProgressPhotos(),
    ])
    const activeSession = sessions.find((s) => s.status === 'in-progress') ?? null
    set({ sessions, settings, bodyweightLogs, progressPhotos, activeSession, loaded: true })
  },

  startWorkout: (program) => {
    const session = createSessionFromProgram(program, todayIso())
    set((state) => ({ activeSession: session, sessions: upsertLocal(state.sessions, session) }))
    persistSession(session)
  },

  duplicateWorkout: (previous) => {
    const session = createSessionFromPrevious(previous, previous.day, todayIso())
    set((state) => ({ activeSession: session, sessions: upsertLocal(state.sessions, session) }))
    persistSession(session)
  },

  resumeActiveSession: () => {
    // No-op placeholder: activeSession is already restored by init().
    // Kept as an explicit action so UI intent (e.g. "Resume workout" button) is clear.
  },

  finishActiveSession: async (notes) => {
    const { activeSession } = get()
    if (!activeSession) return
    const finished: WorkoutSession = {
      ...activeSession,
      status: 'completed',
      finishedAt: Date.now(),
      notes: notes ?? activeSession.notes,
    }
    set((state) => ({
      activeSession: null,
      sessions: upsertLocal(state.sessions, finished),
    }))
    await repository.saveSession(finished)
  },

  cancelActiveSession: async () => {
    const { activeSession } = get()
    if (!activeSession) return
    set((state) => ({
      activeSession: null,
      sessions: state.sessions.filter((s) => s.id !== activeSession.id),
    }))
    await repository.deleteSession(activeSession.id)
  },

  updateSet: (exerciseLogId, setId, patch) => {
    const { activeSession } = get()
    if (!activeSession) return
    const updated: WorkoutSession = {
      ...activeSession,
      exercises: activeSession.exercises.map((log) =>
        log.id !== exerciseLogId
          ? log
          : { ...log, sets: log.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) },
      ),
    }
    set((state) => ({ activeSession: updated, sessions: upsertLocal(state.sessions, updated) }))
    persistSession(updated)
  },

  addSet: (exerciseLogId, isWarmup = false) => {
    const { activeSession } = get()
    if (!activeSession) return
    const updated: WorkoutSession = {
      ...activeSession,
      exercises: activeSession.exercises.map((log) =>
        log.id !== exerciseLogId ? log : { ...log, sets: [...log.sets, createEmptySet(isWarmup)] },
      ),
    }
    set((state) => ({ activeSession: updated, sessions: upsertLocal(state.sessions, updated) }))
    persistSession(updated)
  },

  removeSet: (exerciseLogId, setId) => {
    const { activeSession } = get()
    if (!activeSession) return
    const updated: WorkoutSession = {
      ...activeSession,
      exercises: activeSession.exercises.map((log) =>
        log.id !== exerciseLogId
          ? log
          : { ...log, sets: log.sets.filter((s) => s.id !== setId) },
      ),
    }
    set((state) => ({ activeSession: updated, sessions: upsertLocal(state.sessions, updated) }))
    persistSession(updated)
  },

  copyPreviousIntoExercise: (exerciseLogId) => {
    const { activeSession, sessions } = get()
    if (!activeSession) return
    const log = activeSession.exercises.find((e) => e.id === exerciseLogId)
    if (!log) return
    const previous = findPreviousLog(sessions, log.exerciseId, activeSession.date, activeSession.id)
    if (!previous) return

    const updated: WorkoutSession = {
      ...activeSession,
      exercises: activeSession.exercises.map((l) =>
        l.id !== exerciseLogId ? l : copyPreviousIntoLog(l, previous.log),
      ),
    }
    set((state) => ({ activeSession: updated, sessions: upsertLocal(state.sessions, updated) }))
    persistSession(updated)
  },

  reorderExercises: (fromIndex, toIndex) => {
    const { activeSession } = get()
    if (!activeSession) return
    const list = [...activeSession.exercises]
    const [moved] = list.splice(fromIndex, 1)
    list.splice(toIndex, 0, moved)
    const reindexed = list.map((log, i) => ({ ...log, orderIndex: i }))
    const updated: WorkoutSession = { ...activeSession, exercises: reindexed }
    set((state) => ({ activeSession: updated, sessions: upsertLocal(state.sessions, updated) }))
    persistSession(updated)
  },

  setActiveSessionNotes: (notes) => {
    const { activeSession } = get()
    if (!activeSession) return
    const updated: WorkoutSession = { ...activeSession, notes }
    set((state) => ({ activeSession: updated, sessions: upsertLocal(state.sessions, updated) }))
    persistSession(updated)
  },

  editSession: async (session) => {
    set((state) => ({ sessions: upsertLocal(state.sessions, session) }))
    await repository.saveSession(session)
  },

  deleteSession: async (id) => {
    set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) }))
    await repository.deleteSession(id)
  },

  updateSettings: async (patch) => {
    const settings = { ...get().settings, ...patch }
    set({ settings })
    await repository.saveSettings(settings)
  },

  addBodyweightEntry: async (weight, date) => {
    const entry: BodyweightEntry = { id: generateId(), weight, date: date ?? todayIso() }
    await repository.saveBodyweightEntry(entry)
    set((state) => ({
      bodyweightLogs: [...state.bodyweightLogs.filter((e) => e.date !== entry.date), entry].sort(
        (a, b) => a.date.localeCompare(b.date),
      ),
    }))
  },

  deleteBodyweightEntry: async (id) => {
    await repository.deleteBodyweightEntry(id)
    set((state) => ({ bodyweightLogs: state.bodyweightLogs.filter((e) => e.id !== id) }))
  },

  addProgressPhoto: async (dataUrl, note = '') => {
    const photo: ProgressPhoto = { id: generateId(), date: todayIso(), dataUrl, note }
    await repository.savePhoto(photo)
    set((state) => ({ progressPhotos: [photo, ...state.progressPhotos] }))
  },

  deleteProgressPhoto: async (id) => {
    await repository.deletePhoto(id)
    set((state) => ({ progressPhotos: state.progressPhotos.filter((p) => p.id !== id) }))
  },

  exportBackup: () => repository.exportBackup(),

  importBackup: async (backup) => {
    await repository.importBackup(backup)
    await get().init()
  },
}))
