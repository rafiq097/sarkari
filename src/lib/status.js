/**
 * Date-aware recruitment status. The data records a declared status, but dates move on
 * while the site is not being updated, so the status shown is derived in the browser:
 * an upcoming official date makes a route active; an "active" route whose last official
 * date is long past is shown as recurring. Historical routes never change.
 * Used by lib/data.js for the index and by the exam profile page.
 */
import { todayIso } from './format.js'

// An active cycle usually has a new official date within this window (results, interviews).
const staleAfterDays = 180

/** Days between two ISO dates (YYYY, YYYY-MM or YYYY-MM-DD). */
function daysBetween(fromIso, toIso) {
  const padded = (iso) => `${iso}-01-01`.slice(0, 10)
  return (new Date(padded(toIso)) - new Date(padded(fromIso))) / 86400000
}

/** All dated events across cycles, sorted oldest first. */
export function datedEvents(cycles) {
  return (cycles ?? [])
    .flatMap((cycle) => (cycle.events ?? []).filter((event) => event.date).map((event) => ({ ...event, cycle: cycle.cycle })))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** The next upcoming event, or else the most recent past one, flagged with `upcoming`. */
export function keyEventOf(cycles, today = todayIso()) {
  const events = datedEvents(cycles)
  const upcoming = events.find((event) => event.date >= today)
  if (upcoming) return { ...upcoming, upcoming: true }
  const latest = events.at(-1)
  return latest ? { ...latest, upcoming: false } : null
}

/** Status to display for a declared status and its key event. */
export function effectiveStatus(declaredStatus, keyEvent, today = todayIso()) {
  if (declaredStatus === 'historical') return 'historical'
  if (keyEvent?.upcoming) return 'active'
  if (declaredStatus === 'active' && (!keyEvent || daysBetween(keyEvent.date, today) > staleAfterDays)) return 'recurring'
  return declaredStatus
}
