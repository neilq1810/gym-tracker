import { create } from 'zustand'

interface RestTimerState {
  /** Timestamp (ms) the timer finishes at, or null when idle. */
  endAt: number | null
  totalSeconds: number
  start: (seconds: number) => void
  addSeconds: (delta: number) => void
  stop: () => void
}

/**
 * Rest timer state lives outside the main app store since it ticks
 * independently of workout data and needs to survive navigating between
 * exercise cards. Storing an absolute end timestamp (rather than a
 * countdown that decrements on an interval) keeps it accurate even if the
 * tab is backgrounded and timers get throttled.
 */
export const useRestTimerStore = create<RestTimerState>((set, get) => ({
  endAt: null,
  totalSeconds: 0,

  start: (seconds) => {
    set({ endAt: Date.now() + seconds * 1000, totalSeconds: seconds })
  },

  addSeconds: (delta) => {
    const { endAt, totalSeconds } = get()
    if (endAt === null) {
      set({ endAt: Date.now() + delta * 1000, totalSeconds: delta })
      return
    }
    set({ endAt: endAt + delta * 1000, totalSeconds: totalSeconds + delta })
  },

  stop: () => set({ endAt: null, totalSeconds: 0 }),
}))
