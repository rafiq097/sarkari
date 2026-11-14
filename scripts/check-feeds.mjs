/**
 * Format checks for the calendar feeds, run with `npm run check:feeds`. Builds every
 * feed in memory and checks the rules Google Calendar and Apple Calendar depend on
 * (RFC 5545): CRLF line ends, lines of at most 75 octets, balanced BEGIN/END blocks,
 * required properties, valid dates, end after start, unique UIDs and two reminders
 * per event. Exits with code 1 and a list of problems when a check fails.
 */
import { buildAllFeeds } from './calendar-feeds.mjs'

// RFC 5545 section 3.1 line limit, in octets, not counting the CRLF.
const maximumLineOctets = 75
const requiredCalendarProperties = ['VERSION', 'PRODID']
const requiredEventProperties = ['UID', 'DTSTAMP', 'DTSTART', 'DTEND', 'SUMMARY']
const basicDatePattern = /^\d{8}$/
const utcStampPattern = /^\d{8}T\d{6}Z$/
const remindersPerEvent = 2

/** Joins folded lines back together and splits "NAME;PARAMS:value" into parts. */
function unfoldedProperties(feedText) {
  return feedText
    .replace(/\r\n[ \t]/g, '')
    .split('\r\n')
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(':')
      return { name: line.slice(0, separator).split(';')[0], value: line.slice(separator + 1) }
    })
}

/** Problems with the raw text: line ends and line length. */
function rawTextProblems(feedText) {
  const found = []
  if (/[^\r]\n/.test(feedText) || !feedText.endsWith('\r\n')) found.push('has a line that does not end with CRLF')
  const tooLong = feedText.split('\r\n').filter((line) => Buffer.byteLength(line, 'utf8') > maximumLineOctets)
  if (tooLong.length) found.push(`${tooLong.length} line(s) longer than ${maximumLineOctets} octets`)
  return found
}

/** Problems with one event's properties. */
function eventProblems(eventProperties) {
  const valueOf = (name) => eventProperties.find((property) => property.name === name)?.value
  const found = requiredEventProperties.filter((name) => !valueOf(name)).map((name) => `event is missing ${name}`)
  const label = valueOf('UID') ?? 'event without UID'
  if (!basicDatePattern.test(valueOf('DTSTART') ?? '') || !basicDatePattern.test(valueOf('DTEND') ?? '')) found.push(`${label}: DTSTART or DTEND is not a YYYYMMDD date`)
  else if (valueOf('DTEND') <= valueOf('DTSTART')) found.push(`${label}: DTEND is not after DTSTART`)
  if (!utcStampPattern.test(valueOf('DTSTAMP') ?? '')) found.push(`${label}: DTSTAMP is not a UTC timestamp`)
  const reminderCount = eventProperties.filter((property) => property.name === 'TRIGGER').length
  if (reminderCount !== remindersPerEvent) found.push(`${label}: has ${reminderCount} reminders, expected ${remindersPerEvent}`)
  return found
}

/** Problems with the block structure and the events of one feed. */
function structureProblems(properties) {
  const found = []
  if (properties[0]?.value !== 'VCALENDAR' || properties.at(-1)?.value !== 'VCALENDAR') found.push('does not start and end with VCALENDAR')
  const openBlocks = []
  const seenUids = new Set()
  let eventProperties = null
  for (const property of properties) {
    if (property.name === 'BEGIN') {
      openBlocks.push(property.value)
      if (property.value === 'VEVENT') eventProperties = []
    } else if (property.name === 'END') {
      if (openBlocks.pop() !== property.value) found.push(`END:${property.value} does not match its BEGIN`)
      if (property.value === 'VEVENT') {
        found.push(...eventProblems(eventProperties))
        const uid = eventProperties.find((eventProperty) => eventProperty.name === 'UID')?.value
        if (seenUids.has(uid)) found.push(`duplicate UID ${uid}`)
        seenUids.add(uid)
        eventProperties = null
      }
    } else if (eventProperties) {
      eventProperties.push(property)
    }
  }
  if (openBlocks.length) found.push(`unclosed block(s): ${openBlocks.join(', ')}`)
  for (const name of requiredCalendarProperties) {
    if (!properties.some((property) => property.name === name)) found.push(`calendar is missing ${name}`)
  }
  return found
}

const feeds = buildAllFeeds()
const problems = feeds.flatMap((feed) => [...rawTextProblems(feed.text), ...structureProblems(unfoldedProperties(feed.text))].map((problem) => `${feed.path}: ${problem}`))
const eventCount = feeds.reduce((total, feed) => total + feed.text.split('BEGIN:VEVENT').length - 1, 0)

if (problems.length) {
  for (const problem of problems) console.error(`error ${problem}`)
  console.error(`\n${problems.length} problem(s) in ${feeds.length} feeds`)
  process.exit(1)
}
console.log(`ok    ${feeds.length} feeds, ${eventCount} events, all format checks passed`)
