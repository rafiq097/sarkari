/**
 * Yearly pattern helpers: when an exam usually opens, worked out from the official
 * notification dates already in the data. Plain JavaScript with no browser or Vite
 * features, so the build scripts (calendar feeds) can import it as well as the pages.
 */

// Event names that mark the start of a cycle (notification or applications opening).
const openingEventPattern = /notif|advert|notice published|applications? open|registration opens/i

const monthLongNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** True when an event marks the opening of a recruitment cycle. */
export function isOpeningEvent(event) {
  return openingEventPattern.test(event.event)
}

/**
 * The latest official opening event with at least a month in its date, or null.
 * Tentative calendar dates count too: they are still published by the recruiter.
 */
export function latestOpeningEvent(cycles) {
  const openingEvents = (cycles ?? [])
    .flatMap((cycle) => (cycle.events ?? []).map((event) => ({ ...event, cycle: cycle.cycle })))
    // A date needs YYYY-MM (7 characters) or more to say anything about the month.
    .filter((event) => event.date?.length >= 7 && isOpeningEvent(event))
    .sort((a, b) => a.date.localeCompare(b.date))
  return openingEvents.at(-1) ?? null
}

/**
 * The month an exam usually opens: { monthIndex (0 to 11), monthName, basedOn } where
 * basedOn is the official event the pattern was read from; null when no opening date is known.
 */
export function usualOpening(cycles) {
  const basedOn = latestOpeningEvent(cycles)
  if (!basedOn) return null
  const monthIndex = Number(basedOn.date.slice(5, 7)) - 1
  return { monthIndex, monthName: monthLongNames[monthIndex], basedOn }
}
