/**
 * iCalendar (RFC 5545) writer for exam dates, in plain JavaScript with no libraries.
 * Turns exam profiles into calendar events and events into .ics text with CRLF line
 * ends, 75-octet line folding, escaped text, stable UIDs and two reminders per event.
 * Used in the browser by the "Add to calendar" button (components/CalendarButton.jsx)
 * and at build time by scripts/calendar-feeds.mjs, so it must stay free of browser
 * and Vite features.
 */
import { usualOpening } from './pattern.js'
import { formatDate } from './format.js'

// RFC 5545 section 3.1: lines longer than 75 octets must be folded.
const maximumLineOctets = 75
// UIDs end with this so they are globally unique to this site.
const uidDomain = 'sarkari-shiksha'
// Reminders before each event, as RFC 5545 durations (7 days and 1 day before the start).
const reminderTriggers = ['-P7D', '-P1D']
// A yearly pattern repeats this many times, matching how long the data is meant to stay valid.
const patternRepeatCount = 3
const millisecondsPerDay = 86400000

/** Lower-case id fragment for a UID: letters and digits kept, everything else a dash. */
function slug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Escapes a TEXT value (RFC 5545 section 3.3.11): backslash, semicolon, comma, newline. */
function escapeText(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/**
 * Folds one content line to 75 octets. Counts UTF-8 bytes, not characters, and never
 * splits a multi-byte character. Continuation lines start with one space.
 */
export function foldLine(line) {
  const encoder = new TextEncoder()
  const pieces = []
  let current = ''
  let currentOctets = 0
  for (const character of line) {
    const characterOctets = encoder.encode(character).length
    // Continuation lines lose one octet to the leading space.
    const limit = pieces.length === 0 ? maximumLineOctets : maximumLineOctets - 1
    if (currentOctets + characterOctets > limit) {
      pieces.push(current)
      current = ''
      currentOctets = 0
    }
    current += character
    currentOctets += characterOctets
  }
  pieces.push(current)
  return pieces.join('\r\n ')
}

/** YYYY-MM-DD to the basic DATE form YYYYMMDD. */
function toBasicDate(isoDate) {
  return isoDate.replaceAll('-', '')
}

/** The day after an ISO date; all-day events end on the (exclusive) next day. */
function nextDay(isoDate) {
  return new Date(Date.parse(`${isoDate}T00:00:00Z`) + millisecondsPerDay).toISOString().slice(0, 10)
}

/** First day of the month after a YYYY-MM month. */
function firstDayOfNextMonth(isoMonth) {
  const [year, month] = isoMonth.split('-').map(Number)
  // Date.UTC months are zero-based, so passing the one-based month means "next month".
  return new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10)
}

/** "Source: title (publisher) url" line, flagging secondary sources. */
function sourceLine(source) {
  if (!source) return 'Source: see the official website.'
  const kind = source.type === 'secondary' ? 'Secondary source' : 'Official source'
  return `${kind}: ${source.title}${source.publisher ? ` (${source.publisher})` : ''} ${source.url}`
}

/** Calendar event for one dated event of a recruitment cycle. */
function datedEvent(exam, examLabel, cycle, event, source) {
  const isTentative = event.dateType === 'official-tentative'
  // A date with only a month (YYYY-MM) becomes an all-day window covering that month.
  const isMonthOnly = event.date.length === 7
  const startDate = isMonthOnly ? `${event.date}-01` : event.date
  const exactSummary = `${examLabel}: ${event.event}${isTentative ? ' (tentative)' : ''}`
  const lines = [
    `${cycle.cycle}: ${event.event}.`,
    isTentative ? 'Tentative date from the official annual calendar. It can change.' : source?.type === 'secondary' ? 'Official date, as reported by a secondary source.' : 'Date from an official notice.',
    sourceLine(source),
    'Confirm on the official website before acting.',
  ]
  return {
    uid: `${exam.id}-${slug(cycle.cycle)}-${slug(event.event)}@${uidDomain}`,
    summary: isMonthOnly ? `Expected window (tentative): ${examLabel} ${event.event}` : exactSummary,
    description: lines.join('\n'),
    startDate,
    endDate: isMonthOnly ? firstDayOfNextMonth(event.date) : nextDay(startDate),
    url: source?.url ?? null,
    repeatYearlyCount: null,
  }
}

/**
 * Yearly-pattern event: an all-day window over the month the exam usually opens,
 * starting the year after the last official opening date. Null without a pattern.
 */
function patternEvent(exam, examLabel, sourcesById) {
  const opening = usualOpening(exam.status?.cycles)
  if (!opening || exam.status?.type === 'historical') return null
  const startMonth = `${Number(opening.basedOn.date.slice(0, 4)) + 1}-${opening.basedOn.date.slice(5, 7)}`
  const lines = [
    `Yearly pattern, not an announced date. ${examLabel} usually opens around ${opening.monthName}.`,
    `Based on the last official date: ${opening.basedOn.event}, ${formatDate(opening.basedOn.date)}.`,
    sourceLine(sourcesById.get(opening.basedOn.source)),
    'Confirm on the official website before acting.',
  ]
  return {
    uid: `${exam.id}-expected-window@${uidDomain}`,
    summary: `Expected window (tentative): ${examLabel}`,
    description: lines.join('\n'),
    startDate: `${startMonth}-01`,
    endDate: firstDayOfNextMonth(startMonth),
    url: exam.officialLinks?.[0]?.url ?? null,
    repeatYearlyCount: patternRepeatCount,
  }
}

/**
 * All calendar events of one exam profile: one per dated official event, plus the
 * yearly "Expected window" pattern. Events with no date in the data are left out.
 */
export function examCalendarEvents(exam) {
  const examLabel = exam.abbreviation || exam.name
  const sourcesById = new Map((exam.sources ?? []).map((source) => [source.id, source]))
  const dated = (exam.status?.cycles ?? []).flatMap((cycle) =>
    (cycle.events ?? []).filter((event) => event.date?.length >= 7).map((event) => datedEvent(exam, examLabel, cycle, event, sourcesById.get(event.source))),
  )
  // Two events in one cycle can share a name; keep the first so every UID stays unique.
  const uniqueDated = [...new Map(dated.reverse().map((calendarEvent) => [calendarEvent.uid, calendarEvent])).values()].reverse()
  const pattern = patternEvent(exam, examLabel, sourcesById)
  return pattern ? [...uniqueDated, pattern] : uniqueDated
}

/** Content lines of one VEVENT, including its two display reminders. */
function eventLines(calendarEvent, stamp) {
  const alarmLines = reminderTriggers.flatMap((trigger) => ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapeText(calendarEvent.summary)}`, `TRIGGER:${trigger}`, 'END:VALARM'])
  return [
    'BEGIN:VEVENT',
    `UID:${calendarEvent.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${toBasicDate(calendarEvent.startDate)}`,
    `DTEND;VALUE=DATE:${toBasicDate(calendarEvent.endDate)}`,
    calendarEvent.repeatYearlyCount && `RRULE:FREQ=YEARLY;COUNT=${calendarEvent.repeatYearlyCount}`,
    `SUMMARY:${escapeText(calendarEvent.summary)}`,
    `DESCRIPTION:${escapeText(calendarEvent.description)}`,
    calendarEvent.url && `URL:${calendarEvent.url}`,
    // All-day entries should not block the day as busy.
    'TRANSP:TRANSPARENT',
    ...alarmLines,
    'END:VEVENT',
  ].filter(Boolean)
}

/**
 * Builds the full .ics text for a named calendar. `generatedAt` is a Date; it becomes
 * the DTSTAMP of every event. Lines are folded and joined with CRLF as the RFC requires.
 */
export function buildCalendar({ name, description, events, generatedAt }) {
  // UTC timestamp in the basic form YYYYMMDDTHHMMSSZ.
  const stamp = `${generatedAt.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sarkari Shiksha//Exam dates//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-CALDESC:${escapeText(description)}`,
    // Ask subscribed calendars to refresh once a day.
    'REFRESH-INTERVAL;VALUE=DURATION:P1D',
    'X-PUBLISHED-TTL:P1D',
    ...events.flatMap((calendarEvent) => eventLines(calendarEvent, stamp)),
    'END:VCALENDAR',
  ]
  return `${lines.map(foldLine).join('\r\n')}\r\n`
}

/** Calendar text for a single exam profile. */
export function buildExamCalendar(exam, generatedAt) {
  const examLabel = exam.abbreviation || exam.name
  return buildCalendar({
    name: `${examLabel} dates`,
    description: `Official dates and the expected yearly window for ${exam.name}. Confirm every date on the official website.`,
    events: examCalendarEvents(exam),
    generatedAt,
  })
}
