/**
 * Candidate details form shared by the My Profile page and the eligibility checker.
 * Split into short numbered steps (about you, education, preferences) so it never shows
 * as one long wall of fields; long chip lists show popular options first.
 * Controlled by the parent through `candidate` and `onChange`; nothing is stored here.
 * The empty profile lives in lib/candidate.js.
 */
import { useState } from 'react'
import { Check } from 'lucide-react'
import { vocabulary } from '../lib/data.js'
import { ShowAllToggle } from './Common.jsx'
import { Select } from './Select.jsx'

// Long chip lists start with this many options (selected ones always stay visible).
const collapsedChipCount = 12

// Most-chosen subjects and sectors go first so the short list covers most visitors.
const popularFields = ['science', 'arts', 'commerce', 'mathematics', 'engineering-any', 'engineering-civil', 'engineering-mechanical', 'engineering-electrical', 'engineering-electronics', 'engineering-computer', 'education', 'nursing']
const popularSectors = ['civil-services', 'ssc', 'railways', 'banking', 'teaching', 'capf-police', 'defence', 'engineering-psu', 'health', 'power-utilities', 'revenue-clerical', 'insurance']

/** Options with the popular keys first, the rest in vocabulary order. */
function popularFirst(options, popularKeys) {
  const rank = (key) => (popularKeys.includes(key) ? popularKeys.indexOf(key) : popularKeys.length)
  return [...options].sort((a, b) => rank(a[0]) - rank(b[0]))
}

/** Multi-select chip group bound to one array field; long groups collapse. */
function ChipGroup({ legend, options, values, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = options.length > collapsedChipCount + 2
  const visible = isLong && !isExpanded ? options.filter(([key], position) => position < collapsedChipCount || values.includes(key)) : options
  return (
    <fieldset className="chip-filter">
      <legend>
        {legend}
        {values.length > 0 && <span className="chip-chosen">{values.length} chosen</span>}
      </legend>
      <div className="chip-row">
        {visible.map(([key, label]) => (
          <label key={key} className={`chip ${values.includes(key) ? 'is-on' : ''}`}>
            <input type="checkbox" checked={values.includes(key)} onChange={() => onToggle(key)} />
            {label}
          </label>
        ))}
        {isLong && <ShowAllToggle isExpanded={isExpanded} total={options.length} noun="options" onToggle={() => setIsExpanded(!isExpanded)} />}
      </div>
    </fieldset>
  )
}

/** One numbered step of the form with a tick once its key details are filled. */
function FormStep({ number, title, hint, isDone, isOptional = false, children }) {
  return (
    <section className={`form-step ${isDone ? 'is-done' : ''}`}>
      <header className="form-step-head">
        <span className="form-step-number numeric" aria-hidden="true">
          {isDone ? <Check size={14} /> : number}
        </span>
        <div>
          <h2>
            {title} {isOptional && <span className="form-step-optional">Optional</span>}
          </h2>
          <p>{hint}</p>
        </div>
      </header>
      {children}
    </section>
  )
}

/** Labelled dropdown bound to one candidate field; options are [value, label] pairs. */
function SelectField({ label, value, onChange, options }) {
  return <Select label={label} value={value} onChange={onChange} options={options.map(([optionValue, optionLabel]) => ({ value: optionValue, label: optionLabel }))} />
}

const categoryOptions = [['GEN', 'General / Unreserved'], ['EWS', 'EWS'], ['OBC', 'OBC (non-creamy layer) / State BC'], ['SC', 'SC'], ['ST', 'ST']]
const genderOptions = [['', 'Prefer not to say'], ['female', 'Female'], ['male', 'Male']]
const homeStateOptions = [['', 'Other / not set'], ...Object.entries(vocabulary.jurisdictions).filter(([key]) => key !== 'central')]
const educationOptions = vocabulary.educationLevelOrder.map((level) => [level, vocabulary.educationLevels[level]])
const fieldOptions = popularFirst(Object.entries(vocabulary.educationFields).filter(([key]) => key !== 'any'), popularFields)
const sectorOptions = popularFirst(Object.entries(vocabulary.sectors), popularSectors)

/** The form; `showPreferences` adds the name field and the preferences step (profile page). */
export function CandidateForm({ candidate, onChange, showPreferences = false }) {
  const update = (changes) => onChange({ ...candidate, ...changes })
  const toggleIn = (field, key) => {
    const current = candidate[field] ?? []
    update({ [field]: current.includes(key) ? current.filter((value) => value !== key) : [...current, key] })
  }
  const hasPreferences = Boolean(candidate.governments?.length || candidate.sectors?.length)

  return (
    <div className="candidate-form">
      <FormStep number={1} title="About you" hint="Age and category decide the age limits and relaxations." isDone={Boolean(candidate.birthDate)}>
        <div className="form-fields">
          {showPreferences && (
            <label className="field">
              <span>Name (optional, only shown to you)</span>
              <input type="text" value={candidate.name ?? ''} maxLength={60} onChange={(event) => update({ name: event.target.value })} />
            </label>
          )}
          <label className="field">
            <span>Date of birth</span>
            <input type="date" value={candidate.birthDate} onChange={(event) => update({ birthDate: event.target.value })} />
          </label>
          <SelectField label="Category" value={candidate.category} onChange={(category) => update({ category })} options={categoryOptions} />
          <SelectField label="Gender" value={candidate.gender} onChange={(gender) => update({ gender })} options={genderOptions} />
          <SelectField label="Home state (for local rules)" value={candidate.homeState} onChange={(homeState) => update({ homeState })} options={homeStateOptions} />
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={candidate.isPwbd} onChange={(event) => update({ isPwbd: event.target.checked })} />
          <span>Person with benchmark disability (40% or more)</span>
        </label>
      </FormStep>

      <FormStep number={2} title="Your education" hint="Pick your highest qualification, then the subjects or branch you studied." isDone={Boolean(candidate.education && candidate.fields?.length)}>
        <div className="form-fields">
          <SelectField label="Highest qualification" value={candidate.education} onChange={(education) => update({ education })} options={educationOptions} />
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={candidate.isFinalYear} onChange={(event) => update({ isFinalYear: event.target.checked })} />
          <span>I am in the final year of the next qualification</span>
        </label>
        <ChipGroup legend="Subjects / branch" options={fieldOptions} values={candidate.fields ?? []} onToggle={(key) => toggleIn('fields', key)} />
      </FormStep>

      {showPreferences && (
        <FormStep number={3} title="What you are looking for" hint="Narrows your suggestions. Leave empty to see everything." isDone={hasPreferences} isOptional>
          <ChipGroup legend="Governments" options={Object.entries(vocabulary.jurisdictions)} values={candidate.governments ?? []} onToggle={(key) => toggleIn('governments', key)} />
          <ChipGroup legend="Sectors" options={sectorOptions} values={candidate.sectors ?? []} onToggle={(key) => toggleIn('sectors', key)} />
        </FormStep>
      )}
    </div>
  )
}
