/**
 * Side-by-side comparison of up to four exams. The selection is saved in the
 * browser and mirrored in the URL (?ids=a,b) so a comparison can be shared.
 */
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { X, Plus, GitCompareArrows } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader } from '../components/Common.jsx'
import { LevelMeter, StatusBadge, Unknown, EstimateTag } from '../components/Badges.jsx'
import { useSaved } from '../lib/saved.jsx'
import { examIndex, getIndexRecord, labelFor, useProfiles, vocabulary } from '../lib/data.js'
import { estimateSalary } from '../lib/salary.js'
import { formatRupees } from '../lib/format.js'

/** One row definition: label and how to render a profile's cell. */
const rows = [
  { group: 'Basics', label: 'Status', cell: (exam) => <StatusBadge status={exam.status.type} /> },
  { group: 'Basics', label: 'Government', cell: (exam) => labelFor('jurisdictions', exam.jurisdiction) },
  { group: 'Basics', label: 'Recruiting body', cell: (exam) => exam.organization.abbreviation || exam.organization.name },
  { group: 'Basics', label: 'Job type', cell: (exam) => labelFor('employmentTypes', exam.employmentType) },
  { group: 'Basics', label: 'Frequency', cell: (exam) => exam.frequency ?? <Unknown /> },
  { group: 'Eligibility', label: 'Age band', cell: (exam) => (exam.eligibilityRules.ageMin != null || exam.eligibilityRules.ageMax != null ? `${exam.eligibilityRules.ageMin ?? '-'} to ${exam.eligibilityRules.ageMax ?? '-'}` : <Unknown />) },
  { group: 'Eligibility', label: 'Minimum qualification', cell: (exam) => labelFor('educationLevels', exam.eligibilityRules.minEducation) },
  { group: 'Eligibility', label: 'Subjects accepted', cell: (exam) => (exam.eligibilityRules.educationFields ?? ['any']).map((field) => labelFor('educationFields', field)).join(', ') },
  { group: 'Eligibility', label: 'Attempts', cell: (exam) => exam.eligibility?.attempts?.map((row) => `${row.category}: ${row.limit}`).join('; ') || 'No limit stated' },
  { group: 'Selection', label: 'Stages', cell: (exam) => exam.selection?.stages?.map((stage) => stage.name).join(' then ') ?? <Unknown /> },
  { group: 'Selection', label: 'Interview', cell: (exam) => (exam.selection?.stages?.some((stage) => stage.type === 'interview' || stage.type === 'ssb') ? 'Yes' : 'No') },
  { group: 'Selection', label: 'Physical test', cell: (exam) => (exam.selection?.stages?.some((stage) => stage.type === 'physical') ? 'Yes' : 'No') },
  { group: 'Pay', label: 'Pay level', cell: (exam) => exam.salary?.payLevel ?? <Unknown /> },
  { group: 'Pay', label: 'Starting basic', cell: (exam) => formatRupees(exam.salary?.startingBasic) ?? <Unknown>Varies</Unknown> },
  {
    group: 'Pay',
    label: 'Indicative gross (first slab)',
    cell: (exam) => {
      const estimate = estimateSalary({ ruleSetKey: exam.salary?.payRuleSet, basicPay: exam.salary?.startingBasic, payLevel: exam.salary?.payLevel, fixedAdditions: exam.salary?.fixedAdditions })
      return estimate ? (
        <>
          {formatRupees(estimate.gross)} <EstimateTag />
        </>
      ) : (
        <Unknown>Not modelled</Unknown>
      )
    },
  },
  { group: 'Career', label: 'Top of ladder recorded', cell: (exam) => exam.career?.progression?.at(-1)?.post ?? <Unknown /> },
  ...Object.entries(vocabulary.difficultyKeys).map(([key, label]) => ({ group: 'Difficulty (analytical)', label, cell: (exam) => <LevelMeter level={exam.difficulty?.[key]} /> })),
  ...Object.entries(vocabulary.ratingKeys).map(([key, label]) => ({ group: 'Career and recruitment (analytical)', label, cell: (exam) => <LevelMeter level={exam.ratings?.[key]} /> })),
  { group: 'Risk (analytical)', label: 'Overall risk', cell: (exam) => <LevelMeter level={exam.risk?.overall} /> },
  { group: 'Evidence', label: 'Sources', cell: (exam) => exam.sources.length },
]

/** Compare page. */
export default function ComparePage() {
  const { compare, setCompare, toggleCompare, maximumCompared } = useSaved()
  const [searchParams, setSearchParams] = useSearchParams()

  // A shared link (?ids=) replaces the saved selection once on arrival.
  useEffect(() => {
    const sharedIds = (searchParams.get('ids') ?? '').split(',').filter((id) => getIndexRecord(id))
    if (sharedIds.length) setCompare(sharedIds)
    // Run once per shared link only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSearchParams(compare.length ? { ids: compare.join(',') } : {}, { replace: true })
  }, [compare, setSearchParams])

  const { profiles, isLoading } = useProfiles(compare)
  const available = examIndex.filter((exam) => !compare.includes(exam.id))
  const groups = [...new Set(rows.map((row) => row.group))]

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Compare' }]} />
      <PageHeader eyebrow="Tool" title="Compare exams" lead={`Pick up to ${maximumCompared} exams. Facts come from each profile; rows marked analytical are our judgments. Cutoffs from different exams are not shown side by side because their scales and selection methods differ.`} />

      <div className="compare-picker">
        <label className="field">
          <span>Add an exam</span>
          <select
            className="select-control"
            value=""
            disabled={compare.length >= maximumCompared}
            onChange={(event) => {
              if (event.target.value) toggleCompare(event.target.value)
            }}
          >
            <option value="">{compare.length >= maximumCompared ? 'Comparison is full' : 'Choose an exam'}</option>
            {Object.keys(vocabulary.jurisdictions).map((jurisdiction) => (
              <optgroup key={jurisdiction} label={labelFor('jurisdictions', jurisdiction)}>
                {available
                  .filter((exam) => exam.jurisdiction === jurisdiction)
                  .map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.abbreviation ? `${exam.abbreviation}: ` : ''}
                      {exam.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        {compare.length > 0 && (
          <button type="button" className="button button-ghost" onClick={() => setCompare([])}>
            Clear comparison
          </button>
        )}
      </div>

      {compare.length === 0 && (
        <EmptyState
          icon={GitCompareArrows}
          title="Nothing to compare yet"
          action={
            <Link to="/exams" className="button">
              <Plus size={16} aria-hidden="true" /> Browse exams
            </Link>
          }
        >
          Use the compare button on any exam card or profile, or pick from the list above.
        </EmptyState>
      )}

      {compare.length > 0 && !isLoading && (
        <div className="table-wrap compare-wrap">
          <table className="data-table compare-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden">Field</span>
                </th>
                {profiles.map((exam) => (
                  <th key={exam.id} scope="col" className="compare-head">
                    <Link to={`/exams/${exam.id}`} className="text-link">
                      {exam.abbreviation || exam.name}
                    </Link>
                    <span className="faint small">{exam.name}</span>
                    <button type="button" className="icon-button" onClick={() => toggleCompare(exam.id)}>
                      <X size={14} aria-hidden="true" />
                      <span className="visually-hidden">Remove {exam.name}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group}>
                <tr className="group-row">
                  <th colSpan={profiles.length + 1}>{group}</th>
                </tr>
                {rows
                  .filter((row) => row.group === group)
                  .map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {profiles.map((exam) => (
                        <td key={exam.id}>{row.cell(exam)}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>
        </div>
      )}
    </>
  )
}
