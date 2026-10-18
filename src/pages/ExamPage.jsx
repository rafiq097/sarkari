/**
 * Exam profile page: short header with actions, then tabbed sections starting with Quick look.
 * The selected tab is kept in the URL (?tab=) so a section can be linked directly.
 */
import { Link, useParams, useSearchParams } from 'react-router'
import { Zap, BookOpenText, LayoutList, UserCheck, ListChecks, BookOpen, ChartLine, IndianRupee, Scale, Library, AlertTriangle } from 'lucide-react'
import { Breadcrumbs, EmptyState, Tabs } from '../components/Common.jsx'
import { StatusBadge, ConfidenceBadge } from '../components/Badges.jsx'
import { BookmarkButton, CompareButton } from '../components/ExamCard.jsx'
import { QuickLookTab } from '../components/profile/ProfileQuickLook.jsx'
import { OverviewTab, EligibilityTab } from '../components/profile/ProfileBasics.jsx'
import { GuideTab, SelectionTab, SyllabusTab } from '../components/profile/ProfileExam.jsx'
import { StatsTab, SalaryTab } from '../components/profile/ProfileNumbers.jsx'
import { WorkTab, SourcesTab } from '../components/profile/ProfileJudgement.jsx'
import { useProfile, labelFor, jurisdictionRoutes, getIndexRecord } from '../lib/data.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { ForYouPanel } from '../components/MyVerdict.jsx'

const allTabs = [
  { id: 'quick', label: 'Quick look', icon: Zap, render: (exam, openTab) => <QuickLookTab exam={exam} onOpenTab={openTab} /> },
  { id: 'guide', label: 'Explainer', icon: BookOpenText, render: (exam) => <GuideTab exam={exam} /> },
  { id: 'overview', label: 'Overview', icon: LayoutList, render: (exam) => <OverviewTab exam={exam} /> },
  { id: 'eligibility', label: 'Eligibility', icon: UserCheck, render: (exam) => <EligibilityTab exam={exam} /> },
  { id: 'selection', label: 'Exam and selection', icon: ListChecks, render: (exam) => <SelectionTab exam={exam} /> },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen, render: (exam) => <SyllabusTab exam={exam} /> },
  { id: 'cutoffs', label: 'Cutoffs', icon: ChartLine, render: (exam) => <StatsTab exam={exam} /> },
  { id: 'salary', label: 'Salary and career', icon: IndianRupee, render: (exam) => <SalaryTab exam={exam} /> },
  { id: 'work', label: 'Work life and risk', icon: Scale, render: (exam) => <WorkTab exam={exam} /> },
  { id: 'sources', label: 'Sources', icon: Library, render: (exam) => <SourcesTab exam={exam} /> },
]

/** Profile page. */
export default function ExamPage() {
  const { examId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile: exam, isLoading, notFound } = useProfile(examId)
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

  const tabs = allTabs.filter((tab) => tab.id !== 'guide' || exam.guide?.sections?.length)
  const selectedTab = tabs.find((tab) => tab.id === searchParams.get('tab')) ?? tabs[0]
  const selectTab = (tabId) => setSearchParams({ tab: tabId }, { replace: true })
  // Links inside Quick look open a detailed tab and bring the tab bar into view.
  const openTab = (tabId) => {
    selectTab(tabId)
    document.getElementById('profile-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        </div>
        {exam.abbreviation && <p className="profile-abbreviation">{exam.abbreviation}</p>}
        <h1>{exam.name}</h1>
        <p className="profile-org">
          {exam.organization.name} / {regionName}
        </p>
        <div className="profile-actions">
          <BookmarkButton examId={exam.id} />
          <CompareButton examId={exam.id} />
        </div>
        {!isHistorical && <ForYouPanel exam={getIndexRecord(exam.id)} />}
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
        {selectedTab.render(exam, openTab)}
      </div>
    </article>
  )
}
