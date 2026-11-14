/**
 * Cutoff and selection analytics: lists every profile with official cutoffs or
 * selection statistics, with a trend chart per exam and computed selection rates.
 * Comparisons are kept within one exam to avoid mixing scales and methods.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { Info } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading } from '../components/Common.jsx'
import { CutoffChart } from '../components/CutoffChart.jsx'
import { Select } from '../components/Select.jsx'
import { SourceChips } from '../components/Badges.jsx'
import { selectionRates } from '../lib/stats.js'
import { examIndex, labelFor, useProfile } from '../lib/data.js'
import { formatCount, formatPercent } from '../lib/format.js'

/** Detail block for the chosen exam. */
function ExamAnalytics({ examId }) {
  const { profile: exam, isLoading } = useProfile(examId)
  if (isLoading || !exam) return <div className="page-fallback" aria-busy="true" />
  const statistics = exam.statistics ?? []
  return (
    <div>
      <h3 className="block-title">
        <Link to={`/exams/${exam.id}?tab=exam&section=cutoffs`} className="text-link">
          {exam.abbreviation || exam.name}
        </Link>{' '}
        <span className="faint small">{exam.name}</span>
      </h3>
      {exam.cutoffs?.length > 0 && <CutoffChart cutoffs={exam.cutoffs} />}
      {statistics.length > 0 && (
        <div className="table-wrap spaced">
          <table className="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th className="numeric">Vacancies</th>
                <th className="numeric">Applied</th>
                <th className="numeric">Appeared</th>
                <th className="numeric">Selected</th>
                <th className="numeric">Selected per applicant</th>
                <th className="numeric">Selected per appeared</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((row) => {
                const rates = selectionRates(row)
                return (
                  <tr key={row.year}>
                    <td className="numeric">{row.year}</td>
                    <td className="numeric">{formatCount(row.vacancies) ?? '-'}</td>
                    <td className="numeric">{formatCount(row.applicants) ?? '-'}</td>
                    <td className="numeric">{formatCount(row.appeared) ?? '-'}</td>
                    <td className="numeric">{formatCount(row.selected) ?? '-'}</td>
                    <td className="numeric">{formatPercent(rates.perApplicant) ?? '-'}</td>
                    <td className="numeric">{formatPercent(rates.perAppeared) ?? '-'}</td>
                    <td>
                      <SourceChips sourceIds={[row.source]} sources={exam.sources} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/** Analytics page. */
export default function AnalyticsPage() {
  const withData = examIndex.filter((exam) => exam.cutoffCount > 0 || exam.statisticCount > 0)
  const [selectedId, setSelectedId] = useState(withData[0]?.id ?? '')

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Cutoffs and selection' }]} />
      <PageHeader eyebrow="Tool" title="Cutoffs and selection analytics" lead="Official cutoffs, vacancies and selection counts, with selection rates calculated from the same official report. Only exams with published figures appear here." />
      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>Rates describe the whole candidate field in one year. They are not a personal probability. Different exams use different scales, vacancies and stages, so we show one exam at a time.</div>
      </div>

      {withData.length === 0 ? (
        <EmptyState title="No published figures yet">Profiles with official cutoffs or selection counts will appear here.</EmptyState>
      ) : (
        <>
          <SectionHeading number="01" title="Exams with official figures" description={`${withData.length} profiles have cutoffs or selection statistics.`} />
          <div className="analytics-layout">
            {/* Phones get a searchable picker so the chosen exam's figures sit right below it, not under a 60-item list. */}
            <div className="analytics-picker">
              <Select label="Exam" value={selectedId} onChange={setSelectedId} options={withData.map((exam) => ({ value: exam.id, label: exam.abbreviation || exam.name, group: labelFor('jurisdictions', exam.jurisdiction) }))} />
            </div>
            <ul className="analytics-list" role="listbox" aria-label="Exams with data">
              {withData.map((exam) => (
                <li key={exam.id}>
                  <button type="button" className={selectedId === exam.id ? 'is-selected' : ''} aria-pressed={selectedId === exam.id} onClick={() => setSelectedId(exam.id)}>
                    <strong>{exam.abbreviation || exam.name}</strong>
                    <span className="faint small">
                      {labelFor('jurisdictions', exam.jurisdiction)} / {exam.cutoffCount} cutoff rows / {exam.statisticCount} stat rows
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="analytics-detail">{selectedId && <ExamAnalytics examId={selectedId} />}</div>
          </div>
        </>
      )}
    </>
  )
}
