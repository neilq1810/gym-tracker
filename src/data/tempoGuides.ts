import type { TempoGuideKey } from '@/types'

export interface TempoGuide {
  title: string
  cues: string[]
}

export const TEMPO_GUIDES: Record<TempoGuideKey, TempoGuide> = {
  compound: {
    title: 'Compound lifts',
    cues: [
      'Lower under control (2-3 seconds)',
      'Brief pause in the stretched position',
      'Lift explosively while maintaining form',
    ],
  },
  rowsPulldowns: {
    title: 'Rows & pulldowns',
    cues: ['Pull powerfully', 'Squeeze for 1 second', 'Lower slowly'],
  },
  lateralRaises: {
    title: 'Lateral raises',
    cues: ['Raise in 1-2 seconds', 'Hold for 1 second', 'Lower over 2-3 seconds'],
  },
  curls: {
    title: 'Curls',
    cues: ['Controlled curl', '1 second squeeze', 'Slow negative'],
  },
  triceps: {
    title: 'Triceps',
    cues: ['Smooth lockout', '1 second squeeze', 'Controlled return'],
  },
  legExtCurl: {
    title: 'Leg extensions & leg curls',
    cues: ['Hold contraction for 1-2 seconds', 'Slow eccentric'],
  },
  calves: {
    title: 'Calf raises',
    cues: ['Stretch at bottom', 'Hold at top', 'Never bounce'],
  },
}
