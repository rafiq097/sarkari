/**
 * Your plan: personal suggestions built from My Profile by lib/recommend.js. Shows top
 * picks with transparent reasons, last-chance alerts, upcoming dates, exams to prepare
 * together with the top pick, and the subjects to focus on.
 */
import { Link } from 'react-router'
import { Target, Hourglass, CalendarClock, Layers, BookOpen, Info, UserRound } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading } from '../components/Common.jsx'
import { StatusBadge, EstimateTag } from '../components/Badges.jsx'
import { useSaved } from '../lib/saved.jsx'
import { isProfileUsable } from '../lib/candidate.js'
import { buildPlan } from '../lib/recommend.js'
import { labelFor } from '../lib/data.js'
import { formatDate, formatRupees } from '../lib/format.js'

/** One suggested exam with its reasons. */
function PickCard({ entry, rank }) {
  const { exam } = entry
  return (
    <article className="pick-card">
      <div className="pick-rank numeric">{rank}</div>
      <div className="pick-body">
        <div className="pick-head">
          <Link to={`/exams/${exam.id}`} className="result-name">
            {exam.abbreviation && <strong>{exam.abbreviation} </strong>}
            {exam.name}
          </Link>
          <StatusBadge status={exam.status} />
        </div>
        <p className="faint small">
          {labelFor('jurisdictions', exam.jurisdiction)} / {labelFor('sectors', exam.sector)}
          {exam.salary?.startingBasic ? ` / starting basic ${formatRupees(exam.salary.startingBasic)}` : ''}
          {entry.result.verdict === 'check' ? ' / some conditions to check' : ''}
        </p>
        <ul className="reason-list">
          {entry.reasons
            .filter((reason) => reason.points !== 0)
            .map((reason) => (
              <li key={reason.text} className={reason.points < 0 ? 'is-minus' : 'is-plus'}>
                <span className="numeric">{reason.points > 0 ? `+${reason.points}` : reason.points}</span> {reason.text}
              </li>
            ))}
        </ul>
      </div>
      <div className="pick-score">
        <span className="numeric">{entry.score}</span>
        <span className="faint small">points</span>
      </div>
    </article>
  )
}

/** Compact list of exams with one line of detail each. */
function MiniList({ entries, detail }) {
  return (
    <ul className="mini-list">
      {entries.map((entry) => (
        <li key={entry.exam.id}>
          <Link to={`/exams/${entry.exam.id}`} className="result-name">
            {entry.exam.abbreviation || entry.exam.name}
          </Link>
          <span className="muted small"> {detail(entry)}</span>
        </li>
      ))}
    </ul>
  )
}

/** Plan page. */
export default function PlanPage() {
  const { candidate } = useSaved()
  if (!isProfileUsable(candidate)) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Your plan' }]} />
        <PageHeader eyebrow="Personal" title="Your plan" lead="Suggestions on what to aim for and what to prepare, built from your profile." />
        <EmptyState
          icon={UserRound}
          title="Set up your profile first"
          action={
            <Link to="/profile" className="button button-primary">
              Go to My profile
            </Link>
          }
        >
          Add at least your date of birth and highest qualification. Preferred governments, sectors and your branch make the suggestions much better.
        </EmptyState>
      </>
    )
  }

  const plan = buildPlan(candidate)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Your plan' }]} />
      <PageHeader eyebrow="Personal" title={candidate.name ? `${candidate.name}'s plan` : 'Your plan'} lead={`From ${plan.eligibleCount} exams you are not ruled out of, these suit your profile best. Update your profile any time and the plan changes with it.`} />

      <div className="callout callout-plum">
        <Info size={18} aria-hidden="true" />
        <div>
          <strong>Our suggestion, not official advice. </strong>
          Points are transparent (shown on each pick): preferences, how well the exam uses your degree, home-state fit, pay, career growth, regular recruitment, competition and upcoming dates. Always confirm eligibility in the official notification.{' '}
          <Link to="/profile" className="text-link">
            Edit profile
          </Link>
        </div>
      </div>

      <SectionHeading number="01" title="Aim for these" description="Ranked by points. Your first pick decides the prepare-together list below." />
      {plan.picks.length ? (
        <div className="pick-list">
          {plan.picks.map((entry, position) => (
            <PickCard key={entry.exam.id} entry={entry} rank={position + 1} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Target} title="No suitable exams found">Widen your preferences or check your date of birth and qualification.</EmptyState>
      )}

      {plan.focusSubjects.length > 0 && (
        <>
          <SectionHeading number="02" title="Focus subjects" description="Subjects shared by several of your top picks. Preparing these once helps in many exams." />
          <ul className="focus-list">
            {plan.focusSubjects.map((subject) => (
              <li key={subject.tag}>
                <BookOpen size={14} aria-hidden="true" /> {labelFor('syllabusTags', subject.tag)}
                <span className="faint small"> in {subject.count} of your top 5</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {plan.anchor && plan.prepareTogether.length > 0 && (
        <>
          <SectionHeading number="03" title={`Prepare together with ${plan.anchor.exam.abbreviation || plan.anchor.exam.name}`} description="Exams whose syllabus overlaps most with your first pick." />
          <div className="panel">
            <Layers size={18} aria-hidden="true" className="panel-icon" />
            <MiniList entries={plan.prepareTogether} detail={(entry) => `${Math.round(entry.overlap * 100)}% subject overlap`} />
            <Link to="/syllabus" className="text-link small">
              Open the syllabus overlap tool
            </Link>
          </div>
        </>
      )}

      {plan.lastChance.length > 0 && (
        <>
          <SectionHeading number="04" title="Last chance by age" description="You are within about a year of the upper age limit (after your category relaxation)." />
          <div className="callout callout-brick">
            <Hourglass size={18} aria-hidden="true" />
            <MiniList entries={plan.lastChance} detail={(entry) => (entry.yearsLeft <= 0 ? 'this is likely your final eligible year' : 'about 1 year left')} />
          </div>
        </>
      )}

      {plan.comingUp.length > 0 && (
        <>
          <SectionHeading number="05" title="Coming up soon" description="Your suggested exams with an official date in the next four months." />
          <div className="panel">
            <CalendarClock size={18} aria-hidden="true" className="panel-icon" />
            <MiniList entries={plan.comingUp} detail={(entry) => `${entry.exam.keyEvent.event}: ${formatDate(entry.exam.keyEvent.date)}${entry.exam.keyEvent.dateType === 'official-tentative' ? ' (tentative)' : ''}`} />
          </div>
        </>
      )}

      <p className="faint small spaced">
        <EstimateTag>Analytical</EstimateTag> Ratings used in points are our judgments; see the <Link to="/methodology" className="text-link">methodology</Link>.
      </p>
    </>
  )
}
