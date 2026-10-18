/**
 * Exam card for directories and lists, plus the bookmark, compare and share buttons
 * reused on profiles. Reads the compact index record only. The card shows a hook and three
 * headline numbers; everything else lives on the exam page.
 */
import { Link } from 'react-router'
import { Bookmark, BookmarkCheck, GitCompareArrows, Check, MapPin, CalendarClock, Share2 } from 'lucide-react'
import { StatusBadge, LevelMeter } from './Badges.jsx'
import { VerdictBadge } from './MyVerdict.jsx'
import { useSaved } from '../lib/saved.jsx'
import { labelFor } from '../lib/data.js'
import { formatDate, formatCount, daysFromToday, firstSentence, payHeadline, countdownText, urgentWithinDays } from '../lib/format.js'

/** Bookmark toggle button. */
export function BookmarkButton({ examId, compact = false }) {
  const { bookmarks, toggleBookmark } = useSaved()
  const isSaved = bookmarks.includes(examId)
  const Icon = isSaved ? BookmarkCheck : Bookmark
  return (
    <button type="button" className={`icon-button ${isSaved ? 'is-on' : ''}`} onClick={() => toggleBookmark(examId)} aria-pressed={isSaved} title={isSaved ? 'Remove bookmark' : 'Bookmark'}>
      <Icon size={16} aria-hidden="true" />
      {!compact && <span>{isSaved ? 'Saved' : 'Save'}</span>}
      {compact && <span className="visually-hidden">{isSaved ? 'Remove bookmark' : 'Bookmark'}</span>}
    </button>
  )
}

/** Add-to-comparison toggle; disabled when the comparison list is full. */
export function CompareButton({ examId, compact = false }) {
  const { compare, toggleCompare, maximumCompared } = useSaved()
  const isOn = compare.includes(examId)
  const isFull = !isOn && compare.length >= maximumCompared
  const Icon = isOn ? Check : GitCompareArrows
  const title = isFull ? `Comparison holds ${maximumCompared} exams` : isOn ? 'Remove from comparison' : 'Add to comparison'
  return (
    <button type="button" className={`icon-button ${isOn ? 'is-on' : ''}`} onClick={() => toggleCompare(examId)} aria-pressed={isOn} disabled={isFull} title={title}>
      <Icon size={16} aria-hidden="true" />
      {!compact && <span>{isOn ? 'Comparing' : 'Compare'}</span>}
      {compact && <span className="visually-hidden">{title}</span>}
    </button>
  )
}

/**
 * Share button: opens the device share sheet where supported (most phones), otherwise
 * WhatsApp with the exam name and link, since that is how most aspirants pass exam news.
 */
export function ShareButton({ title }) {
  const share = () => {
    const url = window.location.href.split('?')[0]
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
      return
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`, '_blank', 'noopener')
  }
  return (
    <button type="button" className="icon-button" onClick={share} title="Share this exam">
      <Share2 size={16} aria-hidden="true" />
      <span>Share</span>
    </button>
  )
}

/** Short line describing the key official date. */
export function KeyEventLine({ keyEvent }) {
  if (!keyEvent) return <span className="muted">No dated official event recorded</span>
  return (
    <span>
      {keyEvent.upcoming ? 'Next: ' : 'Last: '}
      {keyEvent.event} {formatDate(keyEvent.date)}
      {keyEvent.dateType === 'official-tentative' && ' (tentative)'}
    </span>
  )
}

/** Next-step chip: a bright countdown when an official date is close, a quiet line otherwise. */
export function NextStepChip({ keyEvent }) {
  const days = keyEvent?.upcoming ? daysFromToday(keyEvent.date) : null
  if (days != null && days <= urgentWithinDays) {
    return (
      <p className="next-step is-urgent">
        <CalendarClock size={14} aria-hidden="true" />
        <span>
          {keyEvent.event} <strong>{countdownText(days)}</strong>
        </span>
      </p>
    )
  }
  return (
    <p className="next-step">
      <CalendarClock size={14} aria-hidden="true" />
      <KeyEventLine keyEvent={keyEvent} />
    </p>
  )
}

/** One headline figure; a quiet note (such as "Varies") when the data has no single number. */
function HeadlineNumber({ value, className = '', fallback = 'Varies' }) {
  if (value == null) return <dd className="numeric is-unknown">{fallback}</dd>
  return <dd className={`numeric ${className}`}>{value}</dd>
}

/** Card summarising one exam: a short name, a one-line hook and three headline numbers. */
export function ExamCard({ exam }) {
  const rules = exam.eligibilityRules ?? {}
  const pay = payHeadline(exam)
  const ageText = rules.ageMax != null ? `Age ${rules.ageMin ?? 18} to ${rules.ageMax}` : rules.ageMin != null ? `Age ${rules.ageMin}+` : 'No age limit'
  return (
    <article className="exam-card">
      <div className="exam-card-top">
        <StatusBadge status={exam.status} />
        <VerdictBadge exam={exam} />
        <div className="exam-card-actions">
          <BookmarkButton examId={exam.id} compact />
          <CompareButton examId={exam.id} compact />
        </div>
      </div>
      <h3>
        <Link to={`/exams/${exam.id}`} className="exam-card-link">
          {exam.abbreviation || exam.name}
        </Link>
      </h3>
      <p className="exam-card-meta">
        {exam.abbreviation && <span className="exam-card-fullname">{exam.name}</span>}
        <span className="exam-card-where">
          <MapPin size={13} aria-hidden="true" /> {labelFor('jurisdictions', exam.jurisdiction)} / {labelFor('sectors', exam.sector)}
        </span>
      </p>
      <p className="exam-card-summary">{firstSentence(exam.summary)}</p>
      <dl className="exam-card-facts">
        <div>
          <dt>{pay.label}</dt>
          <HeadlineNumber value={pay.value} className="is-pay" fallback={pay.note} />
        </div>
        <div>
          <dt>{exam.vacancies ? `Posts ${exam.vacancies.year}` : 'Posts'}</dt>
          <HeadlineNumber value={formatCount(exam.vacancies?.count)} fallback={exam.employmentType === 'eligibility-only' ? '-' : 'Varies'} />
        </div>
        <div>
          <dt>Who can apply</dt>
          <dd>
            {labelFor('educationLevels', rules.minEducation)}
            <span className="exam-card-age">{ageText}</span>
          </dd>
        </div>
      </dl>
      <div className="exam-card-foot">
        <NextStepChip keyEvent={exam.keyEvent} />
        <span className="exam-card-competition" title="Competition">
          <LevelMeter level={exam.difficulty.competition} label="Competition" />
        </span>
      </div>
    </article>
  )
}
