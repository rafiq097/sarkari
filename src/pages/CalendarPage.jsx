/**
 * Calendar of official dates: every dated event across profiles, split into
 * upcoming and past, filterable by government. Only official or official-tentative
 * dates exist in the data; predictions are never shown.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Info } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading, SegmentedFilter } from '../components/Common.jsx'
import { useProfiles, examIndex, labelFor, getIndexRecord, governmentFilterOptions } from '../lib/data.js'
import { formatDate, todayIso, daysFromToday, countdownText, urgentWithinDays } from '../lib/format.js'
import { useSaved } from '../lib/saved.jsx'
import { verdictFor, isProfileUsable } from '../lib/candidate.js'

const allIds = examIndex.map((exam) => exam.id)

/** Groups events by "Month Year". */
function groupByMonth(events) {
  const groups = new Map()
  for (const event of events) {
    const key = event.date.slice(0, 7)
    groups.set(key, [...(groups.get(key) ?? []), event])
  }
  return [...groups.entries()]
}

/** Countdown chip for an upcoming day-precise date within the urgent window, else nothing. */
function Countdown({ date }) {
  const days = daysFromToday(date)
  if (days == null || days < 0 || days > urgentWithinDays) return null
  return <span className={`event-countdown ${days <= 7 ? 'is-urgent' : ''}`}>{countdownText(days)}</span>
}

/** Event list for one period; upcoming lists show countdowns for near dates. */
function EventGroups({ events, showCountdown = false }) {
  if (!events.length) return <EmptyState title="No dated events">Nothing in this period for the chosen government.</EmptyState>
  return groupByMonth(events).map(([month, monthEvents]) => (
    <section key={month} className="calendar-month">
      <h3>{formatDate(month)}</h3>
      <ol className="event-list">
        {monthEvents.map((event) => (
          <li key={`${event.examId}-${event.cycle}-${event.event}-${event.date}`}>
            <span className="event-date numeric">{formatDate(event.date)}</span>
            <span className="event-name">
              <Link to={`/exams/${event.examId}`}>{event.examLabel}</Link>
              <span className="muted">
                {' '}
                {event.cycle}: {event.event}
              </span>
              {event.dateType === 'official-tentative' && <span className="faint"> (tentative, official calendar)</span>}
            </span>
            <span className="event-meta">
              {showCountdown && <Countdown date={event.date} />}
              <span className="faint small">{labelFor('jurisdictions', event.jurisdiction)}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  ))
}

/** Calendar page. */
export default function CalendarPage() {
  const { profiles, isLoading } = useProfiles(allIds)
  const [region, setRegion] = useState('')
  const { candidate } = useSaved()
  const [onlyMine, setOnlyMine] = useState(false)
  const hasProfile = isProfileUsable(candidate)
  const today = todayIso()

  const events = useMemo(
    () =>
      profiles
        .filter((exam) => !region || exam.jurisdiction === region)
        .filter((exam) => !onlyMine || !hasProfile || verdictFor(getIndexRecord(exam.id), candidate)?.verdict !== 'not-eligible')
        .flatMap((exam) =>
          (exam.status.cycles ?? []).flatMap((cycle) =>
            cycle.events
              .filter((event) => event.date)
              .map((event) => ({ ...event, cycle: cycle.cycle, examId: exam.id, examLabel: exam.abbreviation || exam.name, jurisdiction: exam.jurisdiction })),
          ),
        ),
    [profiles, region, onlyMine, hasProfile, candidate],
  )
  const upcoming = events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter((event) => event.date < today).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Calendar' }]} />
      <PageHeader eyebrow="Tool" title="Official dates" lead="Notifications, application deadlines, exams and results taken from official notices and calendars." />
      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>Recruiters change dates often. Tentative dates come only from official annual calendars. Confirm every date on the official website before acting.</div>
      </div>
      <div className="tool-controls">
        <SegmentedFilter label="Government" options={governmentFilterOptions()} value={region} onChange={setRegion} />
        {hasProfile && (
          <label className={`chip ${onlyMine ? 'is-on' : ''}`}>
            <input type="checkbox" checked={onlyMine} onChange={(event) => setOnlyMine(event.target.checked)} /> Only exams that may fit me
          </label>
        )}
      </div>
      {isLoading ? (
        <div className="page-fallback" aria-busy="true" />
      ) : (
        <>
          <SectionHeading number="01" title="Upcoming" description={`${upcoming.length} dated events from ${formatDate(today)}`} />
          <EventGroups events={upcoming} showCountdown />
          <SectionHeading number="02" title="Recent and past" description="Most recent first." />
          <EventGroups events={past.slice(0, 120)} />
        </>
      )}
    </>
  )
}
