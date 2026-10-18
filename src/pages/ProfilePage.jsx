/**
 * My Profile: the visitor enters their details once (no login); they are saved in this
 * browser as they type and reused across the site (exam pages, cards, home, directory,
 * calendar, eligibility checker). Editable or clearable at any time.
 */
import { Link } from 'react-router'
import { ShieldCheck, Trash2, CheckCircle2, CircleHelp, XCircle } from 'lucide-react'
import { Breadcrumbs, PageHeader, SectionHeading, EmptyState } from '../components/Common.jsx'
import { CandidateForm } from '../components/CandidateForm.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { useSaved } from '../lib/saved.jsx'
import { emptyCandidate, isProfileUsable, summariseMatches } from '../lib/candidate.js'

/** Profile page. */
export default function ProfilePage() {
  const { candidate, saveCandidate } = useSaved()
  const profile = { ...emptyCandidate, ...(candidate ?? {}) }
  const usable = isProfileUsable(profile)
  const matches = usable ? summariseMatches(profile) : null
  const preferredEligible = matches ? matches.eligible.filter((entry) => entry.preferred).map((entry) => entry.exam) : []

  return (
    <>
      <Breadcrumbs items={[{ label: 'My profile' }]} />
      <PageHeader eyebrow="Personal" title={profile.name ? `${profile.name}'s profile` : 'My profile'} lead="Enter your details once. Every exam page, card and tool then shows what fits you. Changes save automatically, and you can edit or clear them any time." />

      <div className="callout callout-sage">
        <ShieldCheck size={18} aria-hidden="true" />
        <div>No login and no server: your details are stored only in this browser on this device. Clearing browser data or using another device starts fresh.</div>
      </div>

      <CandidateForm candidate={profile} onChange={saveCandidate} showPreferences />

      <div className="form-actions spaced">
        <span className="muted small" role="status">
          {candidate ? 'Saved in this browser.' : 'Start typing to save your profile.'}
        </span>
        {candidate && (
          <button type="button" className="button button-ghost" onClick={() => saveCandidate(null)}>
            <Trash2 size={15} aria-hidden="true" /> Clear my profile
          </button>
        )}
      </div>

      {!usable && <EmptyState title="Add your date of birth and qualification">With those two, the site can check age and education limits for every exam.</EmptyState>}

      {matches && (
        <>
          <SectionHeading number="01" title="What fits you" description="Indicative only; the official notification decides. Historical routes are excluded." />
          <div className="status-strip">
            <Link to="/eligibility" className="status-tile">
              <span className="badge badge-sage">
                <CheckCircle2 size={13} aria-hidden="true" /> Likely eligible
              </span>
              <span className="status-count numeric">{matches.eligible.length}</span>
            </Link>
            <Link to="/eligibility" className="status-tile">
              <span className="badge badge-accent">
                <CircleHelp size={13} aria-hidden="true" /> Check details
              </span>
              <span className="status-count numeric">{matches.check.length}</span>
            </Link>
            <Link to="/eligibility" className="status-tile">
              <span className="badge badge-brick">
                <XCircle size={13} aria-hidden="true" /> Not eligible
              </span>
              <span className="status-count numeric">{matches.notEligible.length}</span>
            </Link>
          </div>

          <SectionHeading number="02" title="Likely eligible, in your preferred governments and sectors" description={(profile.governments.length || profile.sectors.length) ? 'Filtered by the preferences you chose above.' : 'Choose preferred governments or sectors above to narrow this list.'} />
          {preferredEligible.length ? (
            <div className="card-grid">
              {preferredEligible.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <EmptyState title="No clear matches yet">Try widening your preferences, or see the exams marked "check details" in the eligibility checker.</EmptyState>
          )}
        </>
      )}
    </>
  )
}
