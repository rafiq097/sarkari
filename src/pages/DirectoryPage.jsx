/**
 * Exam directory: keyword search, multi-select filters, sorting and an optional
 * "eligible for me" filter driven by the saved eligibility profile.
 * Filter state lives in the URL so results can be shared and bookmarked.
 */
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SlidersHorizontal, X, UserCheck } from 'lucide-react'
import { Breadcrumbs, ChipFilter, EmptyState, PageHeader, SegmentedFilter } from '../components/Common.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { examIndex, vocabulary, governmentFilterOptions } from '../lib/data.js'
import { searchExams } from '../lib/search.js'
import { evaluateExam } from '../lib/eligibility.js'
import { useSaved } from '../lib/saved.jsx'
import { levelWeight, todayIso } from '../lib/format.js'
import { Select } from '../components/Select.jsx'

/** Position of an education level in the vocabulary order (unknown levels sort last). */
function educationRank(level) {
  const position = vocabulary.educationLevelOrder.indexOf(level)
  return position === -1 ? Infinity : position
}

// Each multi-select filter: URL key, legend, option source and record matcher.
const filterDefinitions = [
  { key: 'region', legend: 'Government', options: vocabulary.jurisdictions, matches: (exam, values) => values.includes(exam.jurisdiction) },
  { key: 'status', legend: 'Status', options: vocabulary.statusTypes, matches: (exam, values) => values.includes(exam.status) },
  { key: 'sector', legend: 'Sector', options: vocabulary.sectors, matches: (exam, values) => values.includes(exam.sector) },
  { key: 'nature', legend: 'Nature', options: { technical: 'Technical', 'non-technical': 'Non-technical' }, matches: (exam, values) => values.includes(exam.technical ? 'technical' : 'non-technical') },
  // "I have this qualification": an exam matches when its minimum is at or below the chosen level.
  { key: 'education', legend: 'Your qualification', options: vocabulary.educationLevels, matches: (exam, values) => values.some((value) => educationRank(exam.eligibilityRules?.minEducation) <= educationRank(value)) },
  { key: 'field', legend: 'Degree or branch accepted', options: vocabulary.educationFields, matches: (exam, values) => values.some((value) => (exam.eligibilityRules?.educationFields ?? ['any']).includes(value)) },
  { key: 'method', legend: 'Selection includes', options: vocabulary.recruitmentMethods, matches: (exam, values) => values.every((value) => exam.recruitmentMethods.includes(value)) },
  { key: 'employment', legend: 'Job type', options: vocabulary.employmentTypes, matches: (exam, values) => values.includes(exam.employmentType) },
  { key: 'type', legend: 'Profile type', options: vocabulary.profileTypes, matches: (exam, values) => values.includes(exam.profileType) },
]

const sortOptions = {
  relevance: { label: 'Relevance', compare: null },
  name: { label: 'Name A to Z', compare: (a, b) => a.name.localeCompare(b.name) },
  'pay-high': { label: 'Starting basic, high to low', compare: (a, b) => (b.salary.startingBasic ?? -1) - (a.salary.startingBasic ?? -1) },
  'competition-low': { label: 'Competition, lowest first', compare: (a, b) => (levelWeight[a.difficulty.competition] ?? 9) - (levelWeight[b.difficulty.competition] ?? 9) },
  'next-date': { label: 'Next official date', compare: (a, b) => (a.keyEvent?.upcoming ? a.keyEvent.date : '9999').localeCompare(b.keyEvent?.upcoming ? b.keyEvent.date : '9999') },
}

/** Reads a comma-separated list from the URL. */
function readList(searchParams, key) {
  return (searchParams.get(key) ?? '').split(',').filter(Boolean)
}

/** Option list with result counts for a filter, hiding options no exam uses. */
function optionsWithCounts(definition) {
  return Object.entries(definition.options)
    .map(([key, label]) => ({ key, label, count: examIndex.filter((exam) => definition.matches(exam, [key])).length }))
    .filter((option) => option.count > 0)
}

const regionOptions = governmentFilterOptions()

/** True when a BE/BTech graduate fits the route: a technical route, or one listing engineering degrees. */
function suitsEngineers(exam) {
  return exam.technical || (exam.eligibilityRules?.educationFields ?? []).some((field) => field.startsWith('engineering'))
}

/** Directory page. */
export default function DirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [areFiltersOpen, setAreFiltersOpen] = useState(false)
  const { candidate } = useSaved()
  const query = searchParams.get('q') ?? ''
  const sortKey = sortOptions[searchParams.get('sort')] ? searchParams.get('sort') : query ? 'relevance' : 'name'
  const minimumBasic = Number(searchParams.get('minPay') ?? 0)
  const onlyEligible = searchParams.get('eligible') === '1' && Boolean(candidate)
  const onlyEngineers = searchParams.get('btech') === '1'

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) next.delete(key)
    else next.set(key, Array.isArray(value) ? value.join(',') : value)
    setSearchParams(next, { replace: true })
  }

  const activeFilters = filterDefinitions.map((definition) => ({ definition, values: readList(searchParams, definition.key) })).filter((entry) => entry.values.length)
  const activeCount = activeFilters.length + (minimumBasic ? 1 : 0) + (onlyEligible ? 1 : 0) + (onlyEngineers ? 1 : 0)
  const selectedRegions = readList(searchParams, 'region')
  // The pill row shows a single government; a multi-government choice from the panel highlights none.
  const quickRegion = selectedRegions.length <= 1 ? (selectedRegions[0] ?? '') : null
  const statusValues = readList(searchParams, 'status')
  const isActiveOnly = statusValues.length === 1 && statusValues[0] === 'active'

  const results = useMemo(() => {
    let records = searchExams(query)
    for (const { definition, values } of activeFilters) records = records.filter((exam) => definition.matches(exam, values))
    if (minimumBasic) records = records.filter((exam) => (exam.salary.startingBasic ?? 0) >= minimumBasic)
    if (onlyEngineers) records = records.filter(suitsEngineers)
    if (onlyEligible) records = records.filter((exam) => evaluateExam(exam, candidate, todayIso()).verdict !== 'not-eligible')
    const compare = sortOptions[sortKey].compare
    return compare ? [...records].sort(compare) : records
    // activeFilters is derived from searchParams, which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchParams, minimumBasic, onlyEligible, onlyEngineers, candidate, sortKey])

  return (
    <>
      <Breadcrumbs items={[{ label: 'All exams' }]} />
      <PageHeader eyebrow="Directory" title="All exams and recruitment routes" lead="Search by exam, post, organization or keyword. Combine filters to narrow down. Your filters stay in the address bar, so you can share or bookmark them." />

      <div className="directory-bar">
        <div className="field directory-query">
          <label className="visually-hidden" htmlFor="directory-query">
            Search
          </label>
          <input id="directory-query" type="search" placeholder="Search exams, posts, organizations" value={query} onChange={(event) => setParam('q', event.target.value)} />
        </div>
        <Select label="Sort by" hideLabel className="directory-sort" value={sortKey} onChange={(key) => setParam('sort', key)} options={Object.entries(sortOptions).map(([key, option]) => ({ value: key, label: option.label }))} />
        <button type="button" className={`button ${areFiltersOpen ? 'is-on' : ''}`} aria-expanded={areFiltersOpen} aria-controls="filter-panel" onClick={() => setAreFiltersOpen((open) => !open)}>
          <SlidersHorizontal size={16} aria-hidden="true" /> Filters {activeCount > 0 && <span className="pip-inline">{activeCount}</span>}
        </button>
      </div>

      <div className="quick-filters">
        <SegmentedFilter label="Government" options={regionOptions} value={quickRegion} onChange={(key) => setParam('region', key ? [key] : [])} />
        <span className="quick-filters-divider" aria-hidden="true" />
        <label className={`chip ${isActiveOnly ? 'is-on' : ''}`}>
          <input type="checkbox" checked={isActiveOnly} onChange={(event) => setParam('status', event.target.checked ? ['active'] : [])} />
          Active now
        </label>
        <label className={`chip ${onlyEngineers ? 'is-on' : ''}`}>
          <input type="checkbox" checked={onlyEngineers} onChange={(event) => setParam('btech', event.target.checked ? '1' : '')} />
          For BTech grads
        </label>
        {candidate && (
          <label className={`chip ${onlyEligible ? 'is-on' : ''}`}>
            <input type="checkbox" checked={onlyEligible} onChange={(event) => setParam('eligible', event.target.checked ? '1' : '')} />
            <UserCheck size={14} aria-hidden="true" /> Eligible for me
          </label>
        )}
      </div>

      {areFiltersOpen && (
        <div id="filter-panel" className="filter-panel">
          <div className="filter-groups">
            {filterDefinitions.map((definition) => (
              <ChipFilter key={definition.key} legend={definition.legend} options={optionsWithCounts(definition)} selected={readList(searchParams, definition.key)} onChange={(values) => setParam(definition.key, values)} />
            ))}
          </div>
          <div className="filter-row">
            <label className="field">
              <span>Minimum starting basic pay (Rs per month)</span>
              <input type="number" min="0" step="1000" value={minimumBasic || ''} placeholder="Any" onChange={(event) => setParam('minPay', event.target.value)} />
            </label>
            <div className="field">
              <span className="field-label">Eligibility</span>
              {candidate ? (
                <label className="check-row">
                  <input type="checkbox" checked={onlyEligible} onChange={(event) => setParam('eligible', event.target.checked ? '1' : '')} />
                  <UserCheck size={15} aria-hidden="true" /> Hide exams my saved profile clearly fails
                </label>
              ) : (
                <p className="muted">
                  <Link to="/eligibility" className="text-link">
                    Save your profile
                  </Link>{' '}
                  to filter by age, category and qualification.
                </p>
              )}
            </div>
          </div>
          <div className="filter-panel-foot">
            <button type="button" className="button button-ghost" onClick={() => setSearchParams(query ? { q: query } : {}, { replace: true })}>
              Clear all
            </button>
            <button type="button" className="button button-primary" onClick={() => setAreFiltersOpen(false)}>
              Show {results.length} result{results.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <div className="active-filters">
          {activeFilters.flatMap(({ definition, values }) =>
            values.map((value) => (
              <button key={`${definition.key}-${value}`} type="button" className="chip is-on" onClick={() => setParam(definition.key, values.filter((item) => item !== value))}>
                {definition.options[value] ?? value} <X size={13} aria-hidden="true" />
                <span className="visually-hidden">Remove filter</span>
              </button>
            )),
          )}
          {minimumBasic > 0 && (
            <button type="button" className="chip is-on" onClick={() => setParam('minPay', '')}>
              Basic from Rs {minimumBasic.toLocaleString('en-IN')} <X size={13} aria-hidden="true" />
            </button>
          )}
          {onlyEngineers && (
            <button type="button" className="chip is-on" onClick={() => setParam('btech', '')}>
              For BTech grads <X size={13} aria-hidden="true" />
            </button>
          )}
          {onlyEligible && (
            <button type="button" className="chip is-on" onClick={() => setParam('eligible', '')}>
              Eligible for me <X size={13} aria-hidden="true" />
            </button>
          )}
          <button type="button" className="button-ghost button" onClick={() => setSearchParams(query ? { q: query } : {}, { replace: true })}>
            Clear all
          </button>
        </div>
      )}

      <p className="result-count" role="status">
        <span className="numeric">{results.length}</span> of {examIndex.length} profiles
      </p>

      {results.length > 0 ? (
        <div className="card-grid">
          {results.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing matches"
          action={
            <button type="button" className="button" onClick={() => setSearchParams({}, { replace: true })}>
              Reset search and filters
            </button>
          }
        >
          Try fewer filters, a shorter keyword, or a post name such as "constable" or "assistant". If an exam is missing, check the coverage report.
        </EmptyState>
      )}
    </>
  )
}
