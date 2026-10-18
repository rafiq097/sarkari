/**
 * Route table for the portal. Every page renders inside Layout; pages are lazily
 * loaded so the first paint only ships the shell and the compact exam index.
 */
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout.jsx'
import { SavedProvider } from './lib/saved.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const DirectoryPage = lazy(() => import('./pages/DirectoryPage.jsx'))
const RegionPage = lazy(() => import('./pages/RegionPage.jsx'))
const ExamPage = lazy(() => import('./pages/ExamPage.jsx'))
const ComparePage = lazy(() => import('./pages/ComparePage.jsx'))
const EligibilityPage = lazy(() => import('./pages/EligibilityPage.jsx'))
const SyllabusPage = lazy(() => import('./pages/SyllabusPage.jsx'))
const SalaryPage = lazy(() => import('./pages/SalaryPage.jsx'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'))
const CalendarPage = lazy(() => import('./pages/CalendarPage.jsx'))
const SourcesPage = lazy(() => import('./pages/SourcesPage.jsx'))
const CoveragePage = lazy(() => import('./pages/CoveragePage.jsx'))
const SavedPage = lazy(() => import('./pages/SavedPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const PlanPage = lazy(() => import('./pages/PlanPage.jsx'))
const ToolsPage = lazy(() => import('./pages/ToolsPage.jsx'))
const MethodologyPage = lazy(() => import('./pages/MethodologyPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

/** Quiet placeholder while a page chunk loads (usually a few milliseconds). */
function PageFallback() {
  return <div className="page-fallback" aria-hidden="true" />
}

/** Root component: saved-state provider, router and routes. */
export default function App() {
  return (
    <SavedProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="exams" element={<DirectoryPage />} />
              <Route path="exams/:examId" element={<ExamPage />} />
              <Route path="central" element={<RegionPage jurisdiction="central" />} />
              <Route path="andhra-pradesh" element={<RegionPage jurisdiction="andhra-pradesh" />} />
              <Route path="telangana" element={<RegionPage jurisdiction="telangana" />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="eligibility" element={<EligibilityPage />} />
              <Route path="syllabus" element={<SyllabusPage />} />
              <Route path="salary" element={<SalaryPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="coverage" element={<CoveragePage />} />
              <Route path="saved" element={<SavedPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="plan" element={<PlanPage />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="methodology" element={<MethodologyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SavedProvider>
  )
}
