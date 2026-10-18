/**
 * Eligibility checker: evaluates every current and recurring profile against the
 * visitor's details (lib/eligibility.js). Uses and updates the same My Profile data,
 * so changes here appear everywhere. Results are indicative; notifications decide.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AlertTriangle, CheckCircle2, CircleHelp, XCircle, UserRound } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader } from '../components/Common.jsx'
import { CandidateForm } from '../components/CandidateForm.jsx'
import { examIndex, labelFor } from '../lib/data.js'
import { evaluateExam } from '../lib/eligibility.js'
import { useSaved } from '../lib/saved.jsx'
import { emptyCandidate } from '../lib/candidate.js'
import { todayIso } from '../lib/format.js'

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
  const candidate = { ...emptyCandidate, ...(savedCandidate ?? {}) }
  const [verdictFilter, setVerdictFilter] = useState('eligible')

  const results = useMemo(() => {
    const today = todayIso()
    return examIndex.filter((exam) => exam.status !== 'historical').map((exam) => ({ exam, result: evaluateExam(exam, candidate, today) }))
    // candidate is rebuilt each render from savedCandidate, which is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCandidate])

  const counts = { eligible: 0, check: 0, 'not-eligible': 0 }
  for (const { result } of results) counts[result.verdict] += 1
  const visible = results.filter(({ result }) => result.verdict === verdictFilter)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Eligibility checker' }]} />
      <PageHeader eyebrow="Tool" title="Eligibility checker" lead="Your details here are the same as in My profile, so any change is saved and used across the site. Nothing leaves your browser." />

      <div className="callout callout-brick">
        <AlertTriangle size={18} aria-hidden="true" />
        <div>
          <strong>Indicative only. </strong>
          The checker uses the broadest age and qualification envelope of each exam and common category relaxations. Individual posts can be stricter. Ex-servicemen, widow, departmental and many state-specific relaxations are not modelled. The official notification is authoritative.
        </div>
      </div>

      <CandidateForm candidate={candidate} onChange={saveCandidate} />
      <p className="spaced small muted">
        <UserRound size={14} aria-hidden="true" /> Add your preferred governments and sectors in{' '}
        <Link to="/profile" className="text-link">
          My profile
        </Link>
        .
      </p>

      <div className="verdict-tabs spaced" role="group" aria-label="Show results">
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
