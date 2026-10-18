/**
 * My Profile: the visitor enters their details once (no login); they are saved in this
 * browser as they type and reused across the site (exam pages, cards, home, directory,
 * calendar, eligibility checker). Editable or clearable at any time. The form sits
 * beside a sticky panel that shows live match counts as details are filled.
 */
import { Link } from 'react-router'
import { ShieldCheck, Trash2, CheckCircle2, CircleHelp, XCircle, Target, Circle } from 'lucide-react'
import { Breadcrumbs, PageHeader, SectionHeading, EmptyState } from '../components/Common.jsx'
import { CandidateForm } from '../components/CandidateForm.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { useSaved } from '../lib/saved.jsx'
import { emptyCandidate, isProfileUsable, summariseMatches } from '../lib/candidate.js'

/** Live summary beside the form: what is missing, or how many exams fit, plus save state. */
function MatchPanel({ profile, matches, isSaved, onClear }) {
  const checklist = [
    { label: 'Date of birth', isDone: Boolean(profile.birthDate) },
    { label: 'Highest qualification', isDone: Boolean(profile.education) },
    { label: 'Subjects or branch', isDone: profile.fields.length > 0 },
  ]
  return (
    <aside className="match-panel" aria-live="polite">
      <h2>Your matches</h2>
      {matches ? (
        <>
          <Link to="/eligibility" className="match-row tone-sage">
            <CheckCircle2 size={16} aria-hidden="true" /> Likely eligible <span className="numeric">{matches.eligible.length}</span>
          </Link>
          <Link to="/eligibility" className="match-row tone-accent">
            <CircleHelp size={16} aria-hidden="true" /> Check details <span className="numeric">{matches.check.length}</span>
          </Link>
          <Link to="/eligibility" className="match-row tone-brick">
            <XCircle size={16} aria-hidden="true" /> Not eligible <span className="numeric">{matches.notEligible.length}</span>
          </Link>
          <Link to="/plan" className="button button-primary match-plan">
            <Target size={16} aria-hidden="true" /> See your plan
          </Link>
        </>
      ) : (
        <>
          <p className="muted small">Add your date of birth to see which exams fit you.</p>
          <ul className="match-checklist">
            {checklist.map((item) => (
              <li key={item.label} className={item.isDone ? 'is-done' : ''}>
                {item.isDone ? <CheckCircle2 size={15} aria-hidden="true" /> : <Circle size={15} aria-hidden="true" />} {item.label}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="match-save">
        <span className="muted small" role="status">
          {isSaved ? 'Saved in this browser.' : 'Saves as you type.'}
        </span>
        {isSaved && (
          <button type="button" className="button button-ghost button-small" onClick={onClear}>
            <Trash2 size={14} aria-hidden="true" /> Clear
          </button>
        )}
      </div>
    </aside>
  )
}

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

      <div className="profile-layout">
        <CandidateForm candidate={profile} onChange={saveCandidate} showPreferences />
        <MatchPanel profile={profile} matches={matches} isSaved={Boolean(candidate)} onClear={() => saveCandidate(null)} />
      </div>

      {matches && (
        <>
          <SectionHeading number="01" title="Likely eligible for you" description={(profile.governments.length || profile.sectors.length) ? 'Filtered by the preferences you chose above.' : 'Choose preferred governments or sectors above to narrow this list.'} />
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
