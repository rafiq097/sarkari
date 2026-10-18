/**
 * Eligibility checker: the visitor enters date of birth, category, qualification and
 * subjects; every profile is evaluated by lib/eligibility.js. The profile is saved only
 * in this browser. Results are indicative; the official notification is authoritative.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AlertTriangle, CheckCircle2, CircleHelp, XCircle, Save } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader } from '../components/Common.jsx'
import { examIndex, labelFor, vocabulary } from '../lib/data.js'
import { evaluateExam } from '../lib/eligibility.js'
import { useSaved } from '../lib/saved.jsx'
import { todayIso } from '../lib/format.js'

const emptyCandidate = { birthDate: '', category: 'GEN', isPwbd: false, gender: '', education: 'graduate', fields: [], isFinalYear: false, homeState: '' }

const verdictDetails = {
  eligible: { label: 'Likely eligible', icon: CheckCircle2, tone: 'sage' },
  check: { label: 'Check details', icon: CircleHelp, tone: 'accent' },
  'not-eligible': { label: 'Not eligible', icon: XCircle, tone: 'brick' },
}

/** One result row with its findings. */
function ResultItem({ exam, result }) {
  const details = verdictDetails[result.verdict]
  const Icon = details.icon
  return (
    <li className={`result-item tone-${details.tone}`}>
      <Icon size={18} aria-hidden="true" />
      <div>
        <Link to={`/exams/${exam.id}?tab=eligibility`} className="result-name">
          {exam.abbreviation && <strong>{exam.abbreviation} </strong>}
          {exam.name}
        </Link>
        <span className="faint small"> {labelFor('jurisdictions', exam.jurisdiction)}</span>
        <ul className="finding-list">
          {result.findings.map((finding) => (
            <li key={finding.text} className={`finding-${finding.level}`}>
              {finding.text}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

/** Eligibility checker page. */
export default function EligibilityPage() {
  const { candidate: savedCandidate, saveCandidate } = useSaved()
  const [candidate, setCandidate] = useState(savedCandidate ?? emptyCandidate)
  const [verdictFilter, setVerdictFilter] = useState('eligible')
  const [wasSaved, setWasSaved] = useState(false)
  const update = (changes) => {
    setCandidate((previous) => ({ ...previous, ...changes }))
    setWasSaved(false)
  }

  const results = useMemo(() => {
    const today = todayIso()
    return examIndex.filter((exam) => exam.status !== 'historical').map((exam) => ({ exam, result: evaluateExam(exam, candidate, today) }))
  }, [candidate])

  const counts = { eligible: 0, check: 0, 'not-eligible': 0 }
  for (const { result } of results) counts[result.verdict] += 1
  const visible = results.filter(({ result }) => result.verdict === verdictFilter)
  const toggleField = (field) => update({ fields: candidate.fields.includes(field) ? candidate.fields.filter((value) => value !== field) : [...candidate.fields, field] })

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Eligibility checker' }]} />
      <PageHeader eyebrow="Tool" title="Eligibility checker" lead="Enter your details to see which current and recurring exams you may be eligible for. Nothing leaves your browser." />

      <div className="callout callout-brick">
        <AlertTriangle size={18} aria-hidden="true" />
        <div>
          <strong>Indicative only. </strong>
          The checker uses the broadest age and qualification envelope of each exam and common category relaxations. Individual posts can be stricter. Ex-servicemen, widow, departmental and state-specific relaxations are not modelled. The official notification is authoritative.
        </div>
      </div>

      <form className="eligibility-form panel" onSubmit={(event) => event.preventDefault()}>
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
        <fieldset className="chip-filter form-wide">
          <legend>Subjects / branch of your qualification</legend>
          <div className="chip-row">
            {Object.entries(vocabulary.educationFields)
              .filter(([key]) => key !== 'any')
              .map(([key, label]) => (
                <label key={key} className={`chip ${candidate.fields.includes(key) ? 'is-on' : ''}`}>
                  <input type="checkbox" checked={candidate.fields.includes(key)} onChange={() => toggleField(key)} />
                  {label}
                </label>
              ))}
          </div>
        </fieldset>
        <div className="form-actions form-wide">
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              saveCandidate(candidate)
              setWasSaved(true)
            }}
          >
            <Save size={16} aria-hidden="true" /> {wasSaved ? 'Saved in this browser' : 'Save profile for the directory filter'}
          </button>
          <button type="button" className="button button-ghost" onClick={() => update(emptyCandidate)}>
            Reset
          </button>
        </div>
      </form>

      <div className="verdict-tabs" role="group" aria-label="Show results">
        {Object.entries(verdictDetails).map(([verdict, details]) => (
          <button key={verdict} type="button" className={`verdict-tab tone-${details.tone} ${verdictFilter === verdict ? 'is-selected' : ''}`} aria-pressed={verdictFilter === verdict} onClick={() => setVerdictFilter(verdict)}>
            <details.icon size={16} aria-hidden="true" /> {details.label} <span className="numeric">{counts[verdict]}</span>
          </button>
        ))}
      </div>

      {visible.length ? (
        <ul className="result-list">
          {visible.map(({ exam, result }) => (
            <ResultItem key={exam.id} exam={exam} result={result} />
          ))}
        </ul>
      ) : (
        <EmptyState title="No exams in this group">Change your details or pick another result group.</EmptyState>
      )}
    </>
  )
}
