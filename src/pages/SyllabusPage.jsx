/**
 * Syllabus overlap explorer. Pick one exam to see which other exams share the most
 * subject areas (Jaccard similarity over syllabusTags), and which subjects carry over.
 * Subject areas are our tagging of the official syllabus, not official categories.
 * Exams with stream variants are listed once per stream.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { Layers, Info } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SegmentedFilter } from '../components/Common.jsx'
import { labelFor, governmentFilterOptions } from '../lib/data.js'
import { Select } from '../components/Select.jsx'
import { companionsFor, overlapEntries } from '../lib/syllabus.js'

const shownCompanions = 15

/** Syllabus overlap page. */
export default function SyllabusPage() {
  const [baseKey, setBaseKey] = useState(overlapEntries.find((entry) => entry.key === 'upsc-cse')?.key ?? overlapEntries[0]?.key ?? '')
  const [regionFilter, setRegionFilter] = useState('')
  const base = overlapEntries.find((entry) => entry.key === baseKey)

  const companions = base ? companionsFor(base, { region: regionFilter, limit: shownCompanions }) : []

  if (!overlapEntries.length) return <EmptyState title="No syllabus data yet">Profiles with tagged syllabuses will appear here.</EmptyState>

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Syllabus overlap' }]} />
      <PageHeader eyebrow="Tool" title="Syllabus overlap" lead="Choose the exam you are preparing for. See which other exams share the most subject areas, so one preparation can serve several attempts." />

      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>Subject areas are our grouping of each official syllabus, so overlap is approximate. Depth differs a lot: General Studies in a civil services mains is far deeper than general awareness in a clerical exam. Always read both official syllabuses.</div>
      </div>

      <div className="tool-controls">
        <Select label="I am preparing for" className="select-wide" value={baseKey} onChange={setBaseKey} options={overlapEntries.map((entry) => ({ value: entry.key, label: entry.label, hint: entry.exam.abbreviation ? entry.exam.name : null, group: labelFor('jurisdictions', entry.exam.jurisdiction) }))} />
        <div className="field">
          <span className="field-label">Show companions from</span>
          <SegmentedFilter label="Show companions from" options={governmentFilterOptions('All governments')} value={regionFilter} onChange={setRegionFilter} />
        </div>
      </div>

      {base && (
        <div className="panel spaced">
          <h3>
            <Layers size={16} aria-hidden="true" /> {base.label} covers
          </h3>
          <ul className="pill-list">
            {base.syllabusTags.map((tag) => (
              <li key={tag}>{labelFor('syllabusTags', tag)}</li>
            ))}
          </ul>
        </div>
      )}

      {companions.length ? (
        <ol className="overlap-list">
          {companions.map(({ key, exam, variant, shared, similarity, coverage }) => (
            <li key={key} className="overlap-item">
              <div className="overlap-score" aria-label={`${Math.round(similarity * 100)} percent similar`}>
                <span className="numeric">{Math.round(similarity * 100)}</span>
                <span className="faint small">% similar</span>
              </div>
              <div>
                <Link to={`/exams/${exam.id}?tab=exam&section=syllabus${variant ? `&variant=${variant.id}` : ''}`} className="result-name">
                  {exam.abbreviation && <strong>{exam.abbreviation} </strong>}
                  {exam.name}
                  {variant && ` (${variant.name} stream)`}
                </Link>
                <p className="faint small">
                  {labelFor('jurisdictions', exam.jurisdiction)} / shares {shared.length} of your {base.syllabusTags.length} subject areas ({Math.round(coverage * 100)}%)
                </p>
                <div className="overlap-bar" aria-hidden="true">
                  <span style={{ width: `${Math.round(similarity * 100)}%` }} />
                </div>
                <ul className="pill-list compact">
                  {shared.map((tag) => (
                    <li key={tag}>{labelFor('syllabusTags', tag)}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState title="No overlapping exams">Try another government or exam.</EmptyState>
      )}
      <p className="faint small spaced">Similarity = shared subject areas divided by all subject areas in either exam (Jaccard index).</p>
    </>
  )
}
