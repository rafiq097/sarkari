/**
 * Exam directory: every profile with search, sort and filters (components/ExamBrowser.jsx).
 * Filter state lives in the URL so results can be shared and bookmarked.
 */
import { Breadcrumbs, EmptyState, PageHeader } from '../components/Common.jsx'
import { ExamBrowser } from '../components/ExamBrowser.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { examIndex } from '../lib/data.js'

/** Directory page. */
export default function DirectoryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'All exams' }]} />
      <PageHeader eyebrow="Directory" title="All exams and recruitment routes" lead="Search by exam, post, organization or keyword. Combine filters to narrow down. Your filters stay in the address bar, so you can share or bookmark them." />
      <ExamBrowser exams={examIndex}>
        {(results, resetAll) =>
          results.length > 0 ? (
            <div className="card-grid">
              {results.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nothing matches"
              action={
                <button type="button" className="button" onClick={resetAll}>
                  Reset search and filters
                </button>
              }
            >
              Try fewer filters, a shorter keyword, or a post name such as "constable" or "assistant". If an exam is missing, check the coverage report.
            </EmptyState>
          )
        }
      </ExamBrowser>
    </>
  )
}
