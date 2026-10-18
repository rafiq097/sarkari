/**
 * Candidate details form shared by the My Profile page and the eligibility checker.
 * Controlled by the parent through `candidate` and `onChange`; nothing is stored here.
 * The empty profile lives in lib/candidate.js.
 */
import { vocabulary } from '../lib/data.js'

/** Multi-select chip group bound to one array field of the candidate. */
function ChipGroup({ legend, options, values, onToggle }) {
  return (
    <fieldset className="chip-filter form-wide">
      <legend>{legend}</legend>
      <div className="chip-row">
        {options.map(([key, label]) => (
          <label key={key} className={`chip ${values.includes(key) ? 'is-on' : ''}`}>
            <input type="checkbox" checked={values.includes(key)} onChange={() => onToggle(key)} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** The form; `showPreferences` adds government and sector preferences (profile page). */
export function CandidateForm({ candidate, onChange, showPreferences = false }) {
  const update = (changes) => onChange({ ...candidate, ...changes })
  const toggleIn = (field, key) => {
    const current = candidate[field] ?? []
    update({ [field]: current.includes(key) ? current.filter((value) => value !== key) : [...current, key] })
  }

  return (
    <div className="eligibility-form panel">
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
      <label className="field">
        <span>Category</span>
        <select value={candidate.category} onChange={(event) => update({ category: event.target.value })}>
          <option value="GEN">General / Unreserved</option>
          <option value="EWS">EWS</option>
          <option value="OBC">OBC (non-creamy layer) / State BC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
      </label>
      <label className="field">
        <span>Gender</span>
        <select value={candidate.gender} onChange={(event) => update({ gender: event.target.value })}>
          <option value="">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </label>
      <label className="field">
        <span>Home state (for local rules)</span>
        <select value={candidate.homeState} onChange={(event) => update({ homeState: event.target.value })}>
          <option value="">Other / not set</option>
          <option value="andhra-pradesh">Andhra Pradesh</option>
          <option value="telangana">Telangana</option>
          <option value="karnataka">Karnataka</option>
        </select>
      </label>
      <label className="field">
        <span>Highest qualification</span>
        <select value={candidate.education} onChange={(event) => update({ education: event.target.value })}>
          {vocabulary.educationLevelOrder.map((level) => (
            <option key={level} value={level}>
              {vocabulary.educationLevels[level]}
            </option>
          ))}
        </select>
      </label>
      <div className="field form-checks">
        <label className="check-row">
          <input type="checkbox" checked={candidate.isPwbd} onChange={(event) => update({ isPwbd: event.target.checked })} /> Person with benchmark disability (40% or more)
        </label>
        <label className="check-row">
          <input type="checkbox" checked={candidate.isFinalYear} onChange={(event) => update({ isFinalYear: event.target.checked })} /> Final year of the next qualification
        </label>
      </div>
      <ChipGroup legend="Subjects / branch of your qualification" options={Object.entries(vocabulary.educationFields).filter(([key]) => key !== 'any')} values={candidate.fields ?? []} onToggle={(key) => toggleIn('fields', key)} />
      {showPreferences && (
        <>
          <ChipGroup legend="Governments you want to work for" options={Object.entries(vocabulary.jurisdictions)} values={candidate.governments ?? []} onToggle={(key) => toggleIn('governments', key)} />
          <ChipGroup legend="Sectors you are interested in" options={Object.entries(vocabulary.sectors)} values={candidate.sectors ?? []} onToggle={(key) => toggleIn('sectors', key)} />
        </>
      )}
    </div>
  )
}
