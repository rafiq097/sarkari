/**
 * Syllabus overlap explorer. Pick one exam to see which other exams share the most
 * subject areas (Jaccard similarity over syllabusTags), and which subjects carry over.
 * Subject areas are our tagging of the official syllabus, not official categories.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Layers, Info } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SegmentedFilter } from '../components/Common.jsx'
import { examIndex, labelFor, governmentFilterOptions } from '../lib/data.js'
import { Select } from '../components/Select.jsx'

const shownCompanions = 15

/** Shared tags and similarity between two tag lists. */
function overlap(baseTags, otherTags) {
  const base = new Set(baseTags)
  const shared = otherTags.filter((tag) => base.has(tag))
  const union = new Set([...baseTags, ...otherTags]).size
  return { shared, similarity: union ? shared.length / union : 0, coverage: base.size ? shared.length / base.size : 0 }
}

/** Syllabus overlap page. */
export default function SyllabusPage() {
  const taggedExams = examIndex.filter((exam) => exam.syllabusTags.length > 0)
  const [baseId, setBaseId] = useState(taggedExams.find((exam) => exam.id === 'upsc-cse')?.id ?? taggedExams[0]?.id ?? '')
  const [regionFilter, setRegionFilter] = useState('')
  const base = taggedExams.find((exam) => exam.id === baseId)

  const companions = useMemo(() => {
    if (!base) return []
    return taggedExams
      .filter((exam) => exam.id !== base.id && exam.status !== 'historical' && (!regionFilter || exam.jurisdiction === regionFilter))
      .map((exam) => ({ exam, ...overlap(base.syllabusTags, exam.syllabusTags) }))
      .filter((entry) => entry.shared.length > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, shownCompanions)
  }, [base, regionFilter, taggedExams])

  if (!taggedExams.length) return <EmptyState title="No syllabus data yet">Profiles with tagged syllabuses will appear here.</EmptyState>

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Syllabus overlap' }]} />
      <PageHeader eyebrow="Tool" title="Syllabus overlap" lead="Choose the exam you are preparing for. See which other exams share the most subject areas, so one preparation can serve several attempts." />

      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>Subject areas are our grouping of each official syllabus, so overlap is approximate. Depth differs a lot: General Studies in a civil services mains is far deeper than general awareness in a clerical exam. Always read both official syllabuses.</div>
      </div>

      <div className="tool-controls">
        <Select label="I am preparing for" className="select-wide" value={baseId} onChange={setBaseId} options={taggedExams.map((exam) => ({ value: exam.id, label: exam.abbreviation || exam.name, hint: exam.abbreviation ? exam.name : null, group: labelFor('jurisdictions', exam.jurisdiction) }))} />
        <div className="field">
          <span className="field-label">Show companions from</span>
          <SegmentedFilter label="Show companions from" options={governmentFilterOptions('All governments')} value={regionFilter} onChange={setRegionFilter} />
        </div>
      </div>

      {base && (
        <div className="panel spaced">
          <h3>
            <Layers size={16} aria-hidden="true" /> {base.abbreviation || base.name} covers
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
          {companions.map(({ exam, shared, similarity, coverage }) => (
            <li key={exam.id} className="overlap-item">
              <div className="overlap-score" aria-label={`${Math.round(similarity * 100)} percent similar`}>
                <span className="numeric">{Math.round(similarity * 100)}</span>
                <span className="faint small">% similar</span>
              </div>
              <div>
                <Link to={`/exams/${exam.id}?tab=syllabus`} className="result-name">
                  {exam.abbreviation && <strong>{exam.abbreviation} </strong>}
                  {exam.name}
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
