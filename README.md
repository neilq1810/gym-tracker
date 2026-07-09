# PPL Strength Tracker

A modern, mobile-first Push/Pull/Legs workout tracker built with React, TypeScript, and Tailwind CSS. Dark by default, fast to log a set in, and designed to feel like a premium fitness app.

## Features

- **Dashboard** showing today's scheduled workout, weekly overview, and quick stats (streak, weekly volume, workouts).
- **Active workout flow**: start/finish a session, autosaved set-by-set, workout timer, and a rest timer with 60/90/120/180s presets.
- **Exercise logging**: weight, reps, completed checkbox, and optional notes per set; warm-up sets excluded from volume; "copy previous" to pull in last session's numbers.
- **Progress tracking**: previous vs. current workout, estimated 1RM (Epley formula), session/exercise volume, and personal records, with line charts for weight, 1RM, and volume progression.
- **Progressive Overload Assistant**: flags when every set hit the top of the target rep range ("increase weight next session") vs. when to hold steady.
- **History**: browse, edit, or duplicate any completed workout.
- **Analytics**: total workouts, weekly/monthly volume, current streak, total weight lifted, and a searchable exercise library.
- **Extras**: plate calculator, bodyweight tracker, progress photos, reorderable/collapsible exercise cards, and JSON export/import for backup.

## Weekly schedule

A fixed 6-day PPL split (Push A/B, Pull A/B, Legs A/B) Monday through Saturday, with Sunday as a rest day. See `src/data/schedule.ts` and `src/data/exercises.ts`.

## Tech stack

- **React 19 + TypeScript**, built with **Vite**
- **Tailwind CSS v4** for styling
- **Zustand** for app state
- **React Router** for navigation
- **Recharts** for progress charts

## Architecture notes

Data persistence is deliberately layered so it can move to a cloud backend later without touching UI code:

- `src/lib/storage/StorageAdapter.ts` — a small async key-value interface.
- `src/lib/storage/LocalStorageAdapter.ts` — the current implementation, backed by `window.localStorage`.
- `src/lib/repository/DataRepository.ts` — the single point of access for sessions, settings, bodyweight logs, photos, and backup/restore. Swapping in a Firebase/Supabase-backed `StorageAdapter` (or extending the repository with sync methods) is the only change needed to add cloud sync.
- `src/store/useAppStore.ts` — a Zustand store that drives the UI and calls into the repository.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint      # lint with oxlint
```

All data is stored locally in the browser (`localStorage`). Use Settings → Backup & Restore to export/import a JSON snapshot.
