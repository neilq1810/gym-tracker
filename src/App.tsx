import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { DumbbellIcon } from '@/components/ui/Icons'
import { DashboardPage } from '@/pages/DashboardPage'
import { ActiveWorkoutPage } from '@/pages/ActiveWorkoutPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { WorkoutDetailPage } from '@/pages/WorkoutDetailPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useAppStore } from '@/store/useAppStore'

// Chart-heavy pages pull in recharts; split them out of the main bundle.
const ExerciseDetailPage = lazy(() =>
  import('@/pages/ExerciseDetailPage').then((m) => ({ default: m.ExerciseDetailPage })),
)
const AnalyticsPage = lazy(() =>
  import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)

function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg">
      <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <DumbbellIcon className="h-7 w-7" />
      </div>
      <p className="text-sm text-text-faint">Loading your training data...</p>
    </div>
  )
}

function App() {
  const init = useAppStore((s) => s.init)
  const loaded = useAppStore((s) => s.loaded)

  useEffect(() => {
    void init()
  }, [init])

  if (!loaded) return <SplashScreen />

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        <SideNav />
        <div className="sm:pl-60">
          <Suspense fallback={<SplashScreen />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/workout" element={<ActiveWorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:id" element={<WorkoutDetailPage />} />
              <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
