/**
 * Exam profile page: short header with actions, then four tabs (Overview, Eligibility,
 * Exam and syllabus, Pay and career). The selected tab and any opened collapsed section
 * are kept in the URL (?tab= and ?section=) so a section can be linked directly. Links
 * that use the ten older tab ids are redirected through lib/examTabs.js.
 */
import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Zap, UserCheck, Route, IndianRupee, AlertTriangle } from 'lucide-react'
import { Breadcrumbs, EmptyState, Tabs } from '../components/Common.jsx'
import { StatusBadge, ConfidenceBadge, DifficultyScore, FreshnessBadge } from '../components/Badges.jsx'
import { BookmarkButton, CompareButton, ShareButton } from '../components/ExamCard.jsx'
import { CalendarButton } from '../components/CalendarButton.jsx'
import { OverviewTab } from '../components/profile/ProfileOverview.jsx'
import { EligibilityTab } from '../components/profile/ProfileBasics.jsx'
import { ExamSyllabusTab, PayCareerTab } from '../components/profile/ProfileTabs.jsx'
import { useProfile, labelFor, jurisdictionRoutes, getIndexRecord } from '../lib/data.js'
import { resolveExamTab } from '../lib/examTabs.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

// Ids match examTabIds in lib/examTabs.js. render gets (exam, openTab, requestedSection).
const tabs = [
  { id: 'overview', label: 'Overview', icon: Zap, render: (exam, openTab, section) => <OverviewTab exam={exam} onOpenTab={openTab} requestedSection={section} /> },
  { id: 'eligibility', label: 'Eligibility', icon: UserCheck, render: (exam) => <EligibilityTab exam={exam} /> },
  { id: 'exam', label: 'Exam and syllabus', icon: Route, render: (exam, openTab, section) => <ExamSyllabusTab exam={exam} requestedSection={section} /> },
  { id: 'pay', label: 'Pay and career', icon: IndianRupee, render: (exam, openTab, section) => <PayCareerTab exam={exam} requestedSection={section} /> },
]

// Height of the sticky site header; the tab bar pins just below it.
const siteHeaderHeight = 64

/**
 * Scrolls the tab bar to the top of the screen unless the start of the tab is already
 * comfortably in view (below the header and in the upper half of the screen). Without
 * this, a new tab opens mid-way down when the reader had scrolled, or below the fold on phones.
 */
function scrollTabStartIntoView() {
  const anchor = document.getElementById('profile-tabs')
  if (!anchor) return
  const anchorTop = anchor.getBoundingClientRect().top
  const isComfortablyVisible = anchorTop >= siteHeaderHeight && anchorTop <= window.innerHeight / 2
  if (!isComfortablyVisible) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Profile page. */
export default function ExamPage() {
  const { examId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile: exam, isLoading, notFound } = useProfile(examId)
  const resolved = resolveExamTab(searchParams.get('tab'), searchParams.get('section'))

  // Rewrite an older tab id in the address bar to the tab and section that now hold it.
  useEffect(() => {
    if (!resolved.isLegacy) return
    const updated = new URLSearchParams(searchParams)
    updated.set('tab', resolved.tab)
    if (resolved.section) updated.set('section', resolved.section)
    else updated.delete('section')
    setSearchParams(updated, { replace: true })
  }, [resolved.isLegacy, resolved.tab, resolved.section, searchParams, setSearchParams])
  useDocumentTitle(exam ? exam.abbreviation || exam.name : notFound ? 'Profile not found' : null)

  if (isLoading) return <div className="page-fallback" aria-busy="true" />
  if (notFound) {
    return (
      <EmptyState
        title="Profile not found"
        action={
          <Link to="/exams" className="button">
            Browse all exams
          </Link>
        }
      >
        There is no profile at this address. It may have been renamed or removed.
      </EmptyState>
    )
  }

  const selectedTab = tabs.find((tab) => tab.id === resolved.tab)
  // Switching tabs (from the tab bar or an Overview link) shows the new tab from its start.
  // Extra parameters let a link open one collapsed section (?section=).
  const selectTab = (tabId, extraParams = {}) => {
    setSearchParams({ tab: tabId, ...extraParams }, { replace: true })
    scrollTabStartIntoView()
  }
  const regionName = labelFor('jurisdictions', exam.jurisdiction)
  const isHistorical = exam.status.type === 'historical'

  return (
    <article className="profile">
      <Breadcrumbs items={[{ label: regionName, to: jurisdictionRoutes[exam.jurisdiction] }, { label: exam.abbreviation || exam.name }]} />
      <header className="profile-header">
        <div className="profile-badges">
          <StatusBadge status={exam.status.type} />
          <span className="badge badge-stone badge-quiet">{labelFor('sectors', exam.sector)}</span>
          <ConfidenceBadge confidence={exam.dataQuality?.confidence} />
          <DifficultyScore score={getIndexRecord(exam.id)?.difficultyScore} />
          <FreshnessBadge lastVerified={exam.lastVerified} officialUrl={getIndexRecord(exam.id)?.officialUrl} />
        </div>
        {exam.abbreviation && <p className="profile-abbreviation">{exam.abbreviation}</p>}
        <h1>{exam.name}</h1>
        <p className="profile-org">
          {exam.organization.name} / {regionName}
        </p>
        <div className="profile-actions">
          <BookmarkButton examId={exam.id} />
          <CompareButton examId={exam.id} />
          <ShareButton title={exam.abbreviation || exam.name} />
          {!isHistorical && <CalendarButton exam={exam} />}
        </div>
        {isHistorical && (
          <div className="callout callout-brick">
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <strong>Historical route. </strong>
              This is not a current opportunity. {exam.status.note}
            </div>
          </div>
        )}
      </header>

      <div id="profile-tabs" />
      <Tabs tabs={tabs} selected={selectedTab.id} onSelect={selectTab} label="Profile sections" />
      <div role="tabpanel" id={`panel-${selectedTab.id}`} aria-labelledby={`tab-${selectedTab.id}`} tabIndex={0} className="tab-panel" key={selectedTab.id}>
        {selectedTab.render(exam, selectTab, resolved.section)}
      </div>
    </article>
  )
}
