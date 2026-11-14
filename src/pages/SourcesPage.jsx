/**
 * Source directory: every reference cited by any profile, merged by URL, with
 * publisher, year, type and the profiles that use it. Searchable and filterable.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SegmentedFilter } from '../components/Common.jsx'
import { sourceIndex } from '../lib/data.js'

const sourceTypeOptions = [
  { key: '', label: 'All' },
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
]

/** Source directory page. */
export default function SourcesPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const primaryCount = sourceIndex.filter((source) => source.type === 'primary').length

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return sourceIndex.filter((source) => (!type || source.type === type) && (!needle || `${source.title} ${source.publisher} ${source.url}`.toLowerCase().includes(needle)))
  }, [query, type])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Sources' }]} />
      <PageHeader eyebrow="Research" title="Source directory" lead={`${sourceIndex.length} references: ${primaryCount} primary (official notifications, rules, portals and reports) and ${sourceIndex.length - primaryCount} secondary (used only where official text was unavailable).`} />
      <div className="tool-controls">
        <label className="field">
          <span>Search sources</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Publisher, title or address" />
        </label>
        <SegmentedFilter label="Source type" options={sourceTypeOptions} value={type} onChange={setType} />
      </div>
      <p className="result-count" role="status">
        <span className="numeric">{visible.length}</span> sources
      </p>
      {visible.length ? (
        <ol className="source-list">
          {visible.map((source) => (
            <li key={source.url}>
              <span className={`badge ${source.type === 'primary' ? 'badge-sage' : 'badge-stone'} badge-quiet`}>{source.type}</span>
              <div>
                <a href={source.url} target="_blank" rel="noreferrer" className="text-link">
                  {source.title} <ExternalLink size={12} aria-hidden="true" />
                </a>
                <p className="faint small">
                  {source.publisher}
                  {source.year && `, ${source.year}`}
                </p>
                <p className="small">
                  Used by:{' '}
                  {source.usedBy.map((user, position) => (
                    <span key={user.id}>
                      {position > 0 && ', '}
                      <Link to={`/exams/${user.id}?tab=overview&section=sources`} className="text-link">
                        {user.name}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState title="No sources match">Try a shorter search.</EmptyState>
      )}
    </>
  )
}
