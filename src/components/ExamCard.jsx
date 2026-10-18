/**
 * Exam card for directories and lists, plus the bookmark / compare action buttons
 * reused on profiles. Reads the compact index record only.
 */
import { Link } from 'react-router'
import { Bookmark, BookmarkCheck, GitCompareArrows, Check, Landmark, MapPin, CalendarClock } from 'lucide-react'
import { StatusBadge, LevelMeter } from './Badges.jsx'
import { useSaved } from '../lib/saved.jsx'
import { labelFor } from '../lib/data.js'
import { formatDate, formatRupees } from '../lib/format.js'

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

/** Short line describing the key official date. */
export function KeyEventLine({ keyEvent }) {
  if (!keyEvent) return <span className="muted">No dated official event recorded</span>
  return (
    <span>
      {keyEvent.upcoming ? 'Next: ' : 'Last: '}
      {keyEvent.event} {formatDate(keyEvent.date)}
      {keyEvent.dateType === 'official-tentative' && ' (tentative, official calendar)'}
    </span>
  )
}

/** Card summarising one exam. */
export function ExamCard({ exam }) {
  return (
    <article className="exam-card">
      <div className="exam-card-top">
        <StatusBadge status={exam.status} />
        <span className="exam-card-sector">{labelFor('sectors', exam.sector)}</span>
        <div className="exam-card-actions">
          <BookmarkButton examId={exam.id} compact />
          <CompareButton examId={exam.id} compact />
        </div>
      </div>
      <h3>
        <Link to={`/exams/${exam.id}`} className="exam-card-link">
          {exam.abbreviation && <span className="exam-abbreviation">{exam.abbreviation}</span>}
          {exam.name}
        </Link>
      </h3>
      <p className="exam-card-meta">
        <Landmark size={14} aria-hidden="true" /> {exam.organization?.abbreviation || exam.organization?.name}
        <span className="dot" aria-hidden="true" />
        <MapPin size={14} aria-hidden="true" /> {labelFor('jurisdictions', exam.jurisdiction)}
      </p>
      <p className="exam-card-summary">{exam.summary}</p>
      <dl className="exam-card-facts">
        <div>
          <dt>Starting basic</dt>
          <dd className="numeric">{formatRupees(exam.salary.startingBasic) ?? 'Varies'}</dd>
        </div>
        <div>
          <dt>Competition</dt>
          <dd>
            <LevelMeter level={exam.difficulty.competition} />
          </dd>
        </div>
      </dl>
      <p className="exam-card-event">
        <CalendarClock size={14} aria-hidden="true" />
        <KeyEventLine keyEvent={exam.keyEvent} />
      </p>
    </article>
  )
}
