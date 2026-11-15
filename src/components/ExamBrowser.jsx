/**
 * Search, sort and filter controls for any list of exams: a search box, sort dropdown,
 * Filters button (opens a modal on laptops, a bottom sheet on phones), quick filter chips,
 * removable active-filter chips and a result count. State lives in the page's own URL,
 * so every page keeps its own filters. Used by the directory, region pages and Saved.
 */
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SlidersHorizontal, X, UserCheck } from 'lucide-react'
import { ChipFilter, SegmentedFilter } from './Common.jsx'
import { Select } from './Select.jsx'
import { Sheet } from './Sheet.jsx'
import { vocabulary, governmentFilterOptions } from '../lib/data.js'
import { searchExams } from '../lib/search.js'
import { evaluateExam } from '../lib/eligibility.js'
import { useSaved } from '../lib/saved.jsx'
import { levelWeight, todayIso } from '../lib/format.js'

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
  'difficulty-low': { label: 'Difficulty, easiest first', compare: (a, b) => a.difficultyScore - b.difficultyScore },
  'difficulty-high': { label: 'Difficulty, hardest first', compare: (a, b) => b.difficultyScore - a.difficultyScore },
  'competition-low': { label: 'Competition, lowest first', compare: (a, b) => (levelWeight[a.difficulty.competition] ?? 9) - (levelWeight[b.difficulty.competition] ?? 9) },
  'next-date': { label: 'Next official date', compare: (a, b) => (a.keyEvent?.upcoming ? a.keyEvent.date : '9999').localeCompare(b.keyEvent?.upcoming ? b.keyEvent.date : '9999') },
}
const sortSelectOptions = Object.entries(sortOptions).map(([key, option]) => ({ value: key, label: option.label }))

/** Reads a comma-separated list from the URL. */
function readList(searchParams, key) {
  return (searchParams.get(key) ?? '').split(',').filter(Boolean)
}

/** Option list with result counts within this page's exams, hiding options none of them use. */
function optionsWithCounts(definition, exams) {
  return Object.entries(definition.options)
    .map(([key, label]) => ({ key, label, count: exams.filter((exam) => definition.matches(exam, [key])).length }))
    .filter((option) => option.count > 0)
}

/** True when a BE/BTech graduate fits the route: a technical route, or one listing engineering degrees. */
function suitsEngineers(exam) {
  return exam.technical || (exam.eligibilityRules?.educationFields ?? []).some((field) => field.startsWith('engineering'))
}

/** A quick yes/no chip that sets or clears one URL parameter. */
function QuickChip({ isOn, onChange, children }) {
  return (
    <label className={`chip ${isOn ? 'is-on' : ''}`}>
      <input type="checkbox" checked={isOn} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  )
}

/** Reads every filter from the URL and returns the filtered, sorted results plus setters. */
function useExamFilterState(exams) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { candidate } = useSaved()
  const query = searchParams.get('q') ?? ''
  const state = {
    query,
    sortKey: sortOptions[searchParams.get('sort')] ? searchParams.get('sort') : query ? 'relevance' : 'name',
    minimumBasic: Number(searchParams.get('minPay') ?? 0),
    onlyEligible: searchParams.get('eligible') === '1' && Boolean(candidate),
    onlyEngineers: searchParams.get('btech') === '1',
    activeFilters: filterDefinitions.map((definition) => ({ definition, values: readList(searchParams, definition.key) })).filter((entry) => entry.values.length),
    // Chosen values per filter group, keyed by URL key.
    selected: Object.fromEntries(filterDefinitions.map((definition) => [definition.key, readList(searchParams, definition.key)])),
    regions: readList(searchParams, 'region'),
    statuses: readList(searchParams, 'status'),
    candidate,
  }
  state.activeCount = state.activeFilters.length + (state.minimumBasic ? 1 : 0) + (state.onlyEligible ? 1 : 0) + (state.onlyEngineers ? 1 : 0)

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) next.delete(key)
    else next.set(key, Array.isArray(value) ? value.join(',') : value)
    setSearchParams(next, { replace: true })
  }
  // Clearing filters keeps the search words; resetting also clears them.
  const clearAll = () => setSearchParams(query ? { q: query } : {}, { replace: true })
  const resetAll = () => setSearchParams({}, { replace: true })

  const results = useMemo(() => {
    let records = searchExams(state.query, exams)
    for (const { definition, values } of state.activeFilters) records = records.filter((exam) => definition.matches(exam, values))
    if (state.minimumBasic) records = records.filter((exam) => (exam.salary.startingBasic ?? 0) >= state.minimumBasic)
    if (state.onlyEngineers) records = records.filter(suitsEngineers)
    if (state.onlyEligible) records = records.filter((exam) => evaluateExam(exam, candidate, todayIso()).verdict !== 'not-eligible')
    const compare = sortOptions[state.sortKey].compare
    return compare ? [...records].sort(compare) : records
    // Every value above is derived from searchParams, exams and candidate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, exams, candidate])

  return { state, results, setParam, clearAll, resetAll }
}

/** Removable chips for every active filter, with a "Clear all" button. */
function ActiveFilterChips({ state, setParam, clearAll }) {
  if (state.activeCount === 0) return null
  const removable = [
    ...state.activeFilters.flatMap(({ definition, values }) => values.map((value) => ({ id: `${definition.key}-${value}`, label: definition.options[value] ?? value, remove: () => setParam(definition.key, values.filter((item) => item !== value)) }))),
    ...(state.minimumBasic ? [{ id: 'minPay', label: `Basic from Rs ${state.minimumBasic.toLocaleString('en-IN')}`, remove: () => setParam('minPay', '') }] : []),
    ...(state.onlyEngineers ? [{ id: 'btech', label: 'For BTech grads', remove: () => setParam('btech', '') }] : []),
    ...(state.onlyEligible ? [{ id: 'eligible', label: 'Eligible for me', remove: () => setParam('eligible', '') }] : []),
  ]
  return (
    <div className="active-filters">
      {removable.map((chip) => (
        <button key={chip.id} type="button" className="chip is-on" onClick={chip.remove}>
          {chip.label} <X size={13} aria-hidden="true" />
          <span className="visually-hidden">Remove filter</span>
        </button>
      ))}
      <button type="button" className="button-ghost button" onClick={clearAll}>
        Clear all
      </button>
    </div>
  )
}

/** The Filters sheet: every multi-select group, minimum pay and the eligibility switch. */
function FilterSheet({ isOpen, onClose, exams, definitions, state, setParam, clearAll, resultCount }) {
  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      className="filter-sheet"
      footer={
        <>
          <button type="button" className="button button-ghost" onClick={clearAll}>
            Clear all
          </button>
          <button type="button" className="button button-primary" onClick={onClose}>
            Show {resultCount} result{resultCount === 1 ? '' : 's'}
          </button>
        </>
      }
    >
      <div className="filter-groups">
        {definitions.map((definition) => (
          <ChipFilter key={definition.key} legend={definition.legend} options={optionsWithCounts(definition, exams)} selected={state.selected[definition.key]} onChange={(values) => setParam(definition.key, values)} />
        ))}
      </div>
      <div className="filter-row">
        <label className="field">
          <span>Minimum starting basic pay (Rs per month)</span>
          <input type="number" inputMode="numeric" min="0" step="1000" value={state.minimumBasic || ''} placeholder="Any" onChange={(event) => setParam('minPay', event.target.value)} />
        </label>
        <div className="field">
          <span className="field-label">Eligibility</span>
          {state.candidate ? (
            <label className="check-row">
              <input type="checkbox" checked={state.onlyEligible} onChange={(event) => setParam('eligible', event.target.checked ? '1' : '')} />
              <UserCheck size={15} aria-hidden="true" /> Hide exams my saved profile clearly fails
            </label>
          ) : (
            <p className="muted">
              <Link to="/profile" className="text-link">
                Save your profile
              </Link>{' '}
              to filter by age, category and qualification.
            </p>
          )}
        </div>
      </div>
    </Sheet>
  )
}

/**
 * Filter bar plus results for `exams`. `children(results, resetAll)` renders the results
 * (resetAll clears search and filters, for an empty state); `hideRegion`
 * drops the government filters (a region page already shows one government).
 */
export function ExamBrowser({ exams, hideRegion = false, placeholder = 'Search exams or posts', children }) {
  const [areFiltersOpen, setAreFiltersOpen] = useState(false)
  const { state, results, setParam, clearAll, resetAll } = useExamFilterState(exams)
  const regionOptions = governmentFilterOptions('All', exams)
  // Government pills only help when the list spans more than one government.
  const showRegionPills = !hideRegion && regionOptions.length > 2
  const definitions = hideRegion ? filterDefinitions.filter((definition) => definition.key !== 'region') : filterDefinitions
  // The pill row shows a single government; a multi-government choice from the sheet highlights none.
  const quickRegion = state.regions.length <= 1 ? (state.regions[0] ?? '') : null
  const isActiveOnly = state.statuses.length === 1 && state.statuses[0] === 'active'

  return (
    <>
      <div className="directory-bar">
        <div className="field directory-query">
          <input type="search" aria-label="Search these exams" enterKeyHint="search" placeholder={placeholder} value={state.query} onChange={(event) => setParam('q', event.target.value)} />
        </div>
        <Select label="Sort by" hideLabel className="directory-sort" value={state.sortKey} onChange={(key) => setParam('sort', key)} options={sortSelectOptions} />
        <button type="button" className={`button directory-filter-button ${state.activeCount > 0 ? 'is-on' : ''}`} aria-haspopup="dialog" onClick={() => setAreFiltersOpen(true)}>
          <SlidersHorizontal size={16} aria-hidden="true" /> Filters {state.activeCount > 0 && <span className="pip-inline">{state.activeCount}</span>}
        </button>
      </div>

      <div className="quick-filters">
        {showRegionPills && <SegmentedFilter label="Government" options={regionOptions} value={quickRegion} onChange={(key) => setParam('region', key ? [key] : [])} />}
        <div className={showRegionPills ? 'quick-toggles' : 'quick-toggles quick-toggles-alone'}>
          <QuickChip isOn={isActiveOnly} onChange={(isOn) => setParam('status', isOn ? ['active'] : [])}>
            Active now
          </QuickChip>
          <QuickChip isOn={state.onlyEngineers} onChange={(isOn) => setParam('btech', isOn ? '1' : '')}>
            For BTech grads
          </QuickChip>
          {state.candidate && (
            <QuickChip isOn={state.onlyEligible} onChange={(isOn) => setParam('eligible', isOn ? '1' : '')}>
              <UserCheck size={14} aria-hidden="true" /> Eligible for me
            </QuickChip>
          )}
        </div>
      </div>

      <FilterSheet isOpen={areFiltersOpen} onClose={() => setAreFiltersOpen(false)} exams={exams} definitions={definitions} state={state} setParam={setParam} clearAll={clearAll} resultCount={results.length} />
      <ActiveFilterChips state={state} setParam={setParam} clearAll={clearAll} />

      <p className="result-count" role="status">
        <span className="numeric">{results.length}</span> of {exams.length} profiles
      </p>
      {children(results, resetAll)}
    </>
  )
}
