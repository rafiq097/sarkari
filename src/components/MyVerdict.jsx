/**
 * Personal eligibility markers driven by the saved My Profile data: a compact badge
 * for exam cards and a "Your eligibility" panel for exam pages. Render nothing (or a
 * prompt) when no usable profile is saved.
 */
import { Link } from 'react-router'
import { CheckCircle2, CircleHelp, XCircle, UserRound } from 'lucide-react'
import { useSaved } from '../lib/saved.jsx'
import { verdictFor } from '../lib/candidate.js'

const verdictLook = {
  eligible: { label: 'Fits you', tone: 'sage', icon: CheckCircle2, title: 'You are likely eligible' },
  check: { label: 'Check', tone: 'accent', icon: CircleHelp, title: 'Some conditions need checking' },
  'not-eligible': { label: 'Not for you', tone: 'brick', icon: XCircle, title: 'Your profile does not meet a requirement' },
}

/** Small badge on cards; hidden without a profile. */
export function VerdictBadge({ exam }) {
  const { candidate } = useSaved()
  const result = verdictFor(exam, candidate)
  if (!result) return null
  const look = verdictLook[result.verdict]
  const Icon = look.icon
  return (
    <span className={`badge badge-${look.tone} badge-quiet verdict-badge`} title={look.title}>
      <Icon size={12} aria-hidden="true" />
      {look.label}
    </span>
  )
}

/** Panel on the exam page with the reasons behind the verdict. */
export function ForYouPanel({ exam }) {
  const { candidate } = useSaved()
  const result = verdictFor(exam, candidate)
  if (!result) {
    return (
      <div className="for-you for-you-empty">
        <UserRound size={18} aria-hidden="true" />
        <p>
          <Link to="/profile" className="text-link">
            Add your details once
          </Link>{' '}
          to see whether you fit this exam, here and on every page.
        </p>
      </div>
    )
  }
  const look = verdictLook[result.verdict]
  const Icon = look.icon
  return (
    <div className={`for-you tone-${look.tone}`}>
      <Icon size={20} aria-hidden="true" />
      <div>
        <p className="for-you-title">
          {candidate?.name ? `${candidate.name}, ` : ''}
          {look.title.charAt(0).toLowerCase() + look.title.slice(1)}
        </p>
        <ul className="finding-list">
          {result.findings.map((finding) => (
            <li key={finding.text} className={`finding-${finding.level}`}>
              {finding.text}
            </li>
          ))}
        </ul>
        <p className="faint small">
          Indicative, based on{' '}
          <Link to="/profile" className="text-link">
            your profile
          </Link>
          . The official notification decides.
        </p>
      </div>
    </div>
  )
}
