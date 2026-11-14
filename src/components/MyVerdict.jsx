/**
 * Personal eligibility marker driven by the saved My Profile data: a compact badge
 * for exam cards. Renders nothing when no usable profile is saved. The exam page shows
 * the same verdict in its "Can I apply?" card (profile/ProfileOverview.jsx).
 */
import { CheckCircle2, CircleHelp, XCircle } from 'lucide-react'
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
